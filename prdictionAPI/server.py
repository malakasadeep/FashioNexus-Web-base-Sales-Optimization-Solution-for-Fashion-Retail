from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

model = joblib.load('linear_regression_model.pkl')

EXPECTED_FEATURES = 12

@app.route('/predict', methods=['POST'])
def predict():
    try:

        print("Request data:", request.data)
        
        data = request.get_json()

        if not data or 'sales_data' not in data:
            return jsonify({'error': 'Missing or invalid JSON payload'}), 400

        features = data['sales_data']


        if len(features) != EXPECTED_FEATURES:
            return jsonify({'error': f'Expected {EXPECTED_FEATURES} features, but got {len(features)}'}), 400
        

        prediction = model.predict([features])
        

        return jsonify({'prediction': prediction.tolist()})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=2002, debug=True)
