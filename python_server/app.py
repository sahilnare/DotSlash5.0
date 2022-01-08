import flask
from flask import render_template, Flask, request, jsonify
import pickle
import numpy as np

app = Flask(__name__)

model = pickle.load(open("crop_recommendation_svm.pkl", "rb"))
scaler = pickle.load(open("crop_recommendation_scaler.pkl", "rb"))

plant_list = ['apple', 'banana', 'blackgram', 'chickpea', 'coconut', 'coffee',
       'cotton', 'grapes', 'jute', 'kidneybeans', 'lentil', 'maize', 'mango',
       'mothbeans', 'mungbean', 'muskmelon', 'orange', 'papaya', 'pigeonpeas',
       'pomegranate', 'rice', 'watermelon']

@app.route('/recommend', methods=['POST'])
def recommend_crop():
    data = request.get_json()
    print(data)
    X = np.array(list(data.values())).reshape(1, -1)
    print(X.shape)
    X_scaled = scaler.transform(X)
    predictions = model.predict(X_scaled).tolist() 
    plant_pred = plant_list[predictions[0]]
    print(plant_pred)
    return jsonify(plant_pred)

if __name__ == '__main__':
    app.run(port=5000,debug=True)