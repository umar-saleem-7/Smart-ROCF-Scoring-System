import cv2
import numpy as np
from skimage.metrics import structural_similarity as ssim
from utils import preprocess, align_contour


def orb_similarity(img1, img2):
    orb = cv2.ORB_create(500)
    kp1, des1 = orb.detectAndCompute(img1, None)
    kp2, des2 = orb.detectAndCompute(img2, None)

    if des1 is None or des2 is None or len(kp1) == 0 or len(kp2) == 0:
        return 0.0

    matcher = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    matches = matcher.match(des1, des2)

    score = len(matches) / max(len(kp1), len(kp2))
    return np.clip(score, 0, 1)


def hu_moment_score(cnt1, cnt2):
    hu1 = cv2.HuMoments(cv2.moments(cnt1)).flatten()
    hu2 = cv2.HuMoments(cv2.moments(cnt2)).flatten()

    # Log scale and avoid division by zero
    log_hu1 = -np.sign(hu1) * np.log10(np.abs(hu1) + 1e-10)
    log_hu2 = -np.sign(hu2) * np.log10(np.abs(hu2) + 1e-10)

    diff = np.abs(log_hu1 - log_hu2)
    score = np.exp(-np.sum(diff))  # Closer → score ~ 1, Far → score ~ 0
    return np.clip(score, 0, 1)


def score_images(original_path, user_path):
    orig = preprocess(cv2.imread(original_path))
    user = preprocess(cv2.imread(user_path))

    try:
        orig_cnt = align_contour(orig)
        user_cnt = align_contour(user)
    except:
        return {'error': 'Contour extraction failed. Please check input drawings.'}

    # Create binary masks
    mask_size = 256
    orig_mask = np.zeros((mask_size, mask_size), dtype=np.uint8)
    user_mask = np.zeros((mask_size, mask_size), dtype=np.uint8)
    cv2.drawContours(orig_mask, [orig_cnt], -1, 255, -1)
    cv2.drawContours(user_mask, [user_cnt], -1, 255, -1)

    # --- Individual metrics (clamped) ---
    shape_raw = cv2.matchShapes(orig_cnt, user_cnt, cv2.CONTOURS_MATCH_I1, 0.0)
    shape_score = np.clip(1 - shape_raw, 0, 1)

    ssim_score, _ = ssim(orig_mask, user_mask, full=True)
    ssim_score = np.clip(ssim_score, 0, 1)

    orb_score = orb_similarity(orig_mask, user_mask)
    hu_score = hu_moment_score(orig_cnt, user_cnt)

    area1 = max(cv2.contourArea(orig_cnt), 1)
    area2 = max(cv2.contourArea(user_cnt), 1)
    area_diff = abs(area1 - area2) / area1
    area_similarity = np.clip(1 - area_diff, 0, 1)

    # Final score computation (weighted average)
    final_score = (
        0.25 * shape_score +
        0.25 * ssim_score +
        0.20 * orb_score +
        0.15 * hu_score +
        0.15 * area_similarity
    )
    final_score = np.clip(final_score, 0, 1)

    # --- Return all scores rounded ---
    return {
        'shape_score': round(shape_score, 3),
        'ssim_score': round(ssim_score, 3),
        'orb_score': round(orb_score, 3),
        'hu_score': round(hu_score, 3),
        'area_similarity': round(area_similarity, 3),
        'final_score': round(final_score * 100, 2)  # final score as percentage
    }
