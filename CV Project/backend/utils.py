import cv2
import numpy as np

def preprocess(img):
    """
    Convert to grayscale, apply thresholding, and clean using morphological operations.
    This simplifies the image to a binary mask of the drawing.
    """
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Threshold to binary (inverted so drawing is white)
    _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    # Optional: noise removal using morphological closing
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    closed = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)

    return closed


def align_contour(binary_img, output_size=256):
    """
    Extracts the largest contour from the binary image, centers it, scales it to fit
    in a fixed-size canvas, and returns the aligned contour.
    """
    contours, _ = cv2.findContours(binary_img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if not contours:
        raise ValueError("No contour found in image.")

    largest = max(contours, key=cv2.contourArea)

    M = cv2.moments(largest)
    if M["m00"] == 0:
        raise ValueError("Invalid contour moment: division by zero.")

    # Center of mass
    cx = int(M["m10"] / M["m00"])
    cy = int(M["m01"] / M["m00"])

    # Center and normalize the contour
    centered = largest - [cx, cy]

    # Scale factor so the shape fits nicely into the output size
    scale = output_size / (max(binary_img.shape) * 1.5)
    scaled = (centered * scale).astype(np.int32) + output_size // 2

    return scaled
