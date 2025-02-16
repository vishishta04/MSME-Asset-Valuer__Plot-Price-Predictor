# File: backend/app.py
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pandas as pd
import pickle
import os
import numpy as np
import json
from statistics import mean, median

backend_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.dirname(backend_dir)

app = Flask(__name__,
            template_folder=os.path.join(project_dir, 'templates'),
            static_folder=os.path.join(project_dir, 'static'))
CORS(app)

model_path = os.path.join(backend_dir, 'model.pkl')
data_path = os.path.join(backend_dir, 'filtered_housing_data.csv')

class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (np.int_, np.intc, np.intp, np.int8,
                          np.int16, np.int32, np.int64, np.uint8,
                          np.uint16, np.uint32, np.uint64)):
            return int(obj)
        elif isinstance(obj, (np.float_, np.float16, np.float32, np.float64)):
            return float(obj)
        return super(NumpyEncoder, self).default(obj)

app.json_encoder = NumpyEncoder

with open(model_path, 'rb') as f:
    model = pickle.load(f)

df = pd.read_csv(data_path)
locations = sorted(df['location'].unique())

def get_location_stats(location):
    location_data = df[df['location'] == location]
    return {
        'avg_price': float(location_data['price'].mean()),
        'median_price': float(location_data['price'].median()),
        'avg_sqft': float(location_data['sqft'].mean()),
        'count': int(len(location_data)),
        'price_per_sqft': float(location_data['price'].sum() / location_data['sqft'].sum()),
        'bhk_distribution': location_data['bhk'].value_counts().to_dict(),
        'bath_distribution': location_data['bath'].value_counts().to_dict(),
        'price_range': {
            'min': float(location_data['price'].min()),
            'max': float(location_data['price'].max())
        }
    }

@app.route('/')
def home():
    try:
        overall_stats = {
            'total_properties': len(df),
            'avg_price': float(df['price'].mean()),
            'avg_sqft': float(df['sqft'].mean()),
            'popular_bhk': int(df['bhk'].mode()[0]),
            'price_range': {
                'min': float(df['price'].min()),
                'max': float(df['price'].max())
            }
        }
        return render_template('index.html', locations=locations, overall_stats=overall_stats)
    except Exception as e:
        print(f"Error rendering template: {str(e)}")
        return str(e), 500

@app.route('/location-stats/<location>')
def location_stats(location):
    try:
        stats = get_location_stats(location)
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        df_pred = pd.DataFrame(data, index=[0])
        
        required_columns = ['location', 'bath', 'bhk', 'sqft']
        for col in required_columns:
            if col not in df_pred.columns:
                return jsonify({'error': f'Missing required column: {col}'}), 400
        
        location_stats = get_location_stats(data['location'])
        
        df_pred = pd.get_dummies(df_pred, columns=['location'], drop_first=True)
        expected_columns = model.get_booster().feature_names
        
        for col in expected_columns:
            if col not in df_pred.columns:
                df_pred[col] = 0
        
        df_pred = df_pred[expected_columns]
        prediction = float(model.predict(df_pred)[0])
        
        analysis = {
            'prediction': prediction,
            'location_stats': location_stats,
            'comparison': {
                'vs_avg_price': (prediction - location_stats['avg_price']) / location_stats['avg_price'] * 100,
                'vs_price_per_sqft': (prediction / data['sqft']) - location_stats['price_per_sqft']
            }
        }
        
        return jsonify(analysis)
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)