from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from scoring import score_images  # You must have a score_images(original_path, user_path) function

app = Flask(__name__)
CORS(app)

# Folder to store uploaded images
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Route: Upload original reference image
@app.route('/upload_original', methods=['POST'])
def upload_original():
    if 'original' not in request.files:
        return jsonify({'error': 'Missing original image'}), 400

    original = request.files['original']
    original_path = os.path.join(UPLOAD_FOLDER, 'original.png')
    original.save(original_path)

    return jsonify({'message': 'Original image uploaded successfully'}), 200

# Route: Upload user drawing for a given session (1, 2, 3)
@app.route('/upload_drawing/<int:session_id>', methods=['POST'])
def upload_user_drawing(session_id):
    if 'user_drawing' not in request.files:
        return jsonify({'error': 'Missing user drawing'}), 400

    user_drawing = request.files['user_drawing']
    original_path = os.path.join(UPLOAD_FOLDER, 'original.png')

    if not os.path.exists(original_path):
        return jsonify({'error': 'Original image not found. Please upload it first.'}), 400

    # Save with session ID (e.g. user_drawing_1.png)
    user_path = os.path.join(UPLOAD_FOLDER, f'user_drawing_{session_id}.png')
    user_drawing.save(user_path)

    try:
        score_result = score_images(original_path, user_path)
        return jsonify({
            'message': f'Session {session_id} drawing uploaded and scored',
            'score': score_result
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route: Fetch scores for all three sessions
@app.route('/get_all_scores', methods=['GET'])
def get_all_scores():
    original_path = os.path.join(UPLOAD_FOLDER, 'original.png')
    if not os.path.exists(original_path):
        return jsonify({'error': 'Original image not found. Please upload it first.'}), 400

    scores = {}
    for i in [1, 2, 3]:
        user_path = os.path.join(UPLOAD_FOLDER, f'user_drawing_{i}.png')
        if os.path.exists(user_path):
            try:
                scores[f'session_{i}'] = {
                    'status': 'Scored',
                    'score': score_images(original_path, user_path)
                }
            except Exception as e:
                scores[f'session_{i}'] = {
                    'status': 'Error during scoring',
                    'error': str(e)
                }
        else:
            scores[f'session_{i}'] = {
                'status': 'Not uploaded yet'
            }

    return jsonify(scores), 200

# Run the app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
