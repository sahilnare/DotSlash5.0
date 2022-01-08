import os
import flask
from flask import render_template, Flask, request, jsonify, redirect
import pickle
import numpy as np
import warnings
import cv2
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.models import load_model

warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings(action='ignore', category=FutureWarning)
warnings.filterwarnings(action='ignore', category=UserWarning)

app = Flask(__name__)

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
app.config['upload_folder'] = 'uploads'
app.config['height_folder'] = 'uploads/height'

model = pickle.load(open("crop_recommendation_svm.pkl", "rb"))
scaler = pickle.load(open("crop_recommendation_scaler.pkl", "rb"))

disease_model = load_model('plant_disease_detection.h5')



plant_list = ['apple', 'banana', 'blackgram', 'chickpea', 'coconut', 'coffee',
       'cotton', 'grapes', 'jute', 'kidneybeans', 'lentil', 'maize', 'mango',
       'mothbeans', 'mungbean', 'muskmelon', 'orange', 'papaya', 'pigeonpeas',
       'pomegranate', 'rice', 'watermelon']

plant_disease_class = ['Apple-scab :https://www2.ipm.ucanr.edu/agriculture/apple/Apple-scab/', 
    'Apple-Black-rot :https://extension.umn.edu/plant-diseases/black-rot-apple#prune-correctly-1767010', 
    'Apple-Cedar-Rust :https://www.planetnatural.com/pest-problem-solver/plant-disease/cedar-apple-rust/', 
    'Apple-healthy :None', 'Blueberry-healthy :None', 
    'Cherry-Powdery-mildew :https://www2.ipm.ucanr.edu/agriculture/cherry/Powdery-Mildew/ ', 
    'Cherry-healthy :None', 
    'Corn-Cercospora-leaf-spot :https://www.pioneer.com/us/agronomy/gray_leaf_spot_cropfocus.html ', 
    'Corn-Common-rust :http://ipm.ucanr.edu/PMG/r113100811.html', 
    'Corn-Northern-Leaf-Blight :https://www.extension.purdue.edu/extmedia/bp/bp-84-w.pdf', 
    'Corn-healthy :None',
    'Grape-Black-rot: https://www.missouribotanicalgarden.org/gardens-gardening/your-garden/help-for-the-home-gardener/advice-tips-resources/pests-and-problems/diseases/fruit-spots/black-rot-of-grapes.aspx', 
    'Grape-Black-Measles :https://www2.ipm.ucanr.edu/agriculture/grape/esca-black-measles/',
    'Grape-Leaf-blight_(Isariopsis_Leaf_Spot) :https://www.sciencedirect.com/science/article/abs/pii/S0261219414001598',
    'Grape-healthy:None', 
    'Orange-Haunglongbing-(Citrus_greening) :https://www.aphis.usda.gov/aphis/resources/pests-diseases/hungry-pests/the-threat/citrus-greening/citrus-greening-hp', 
    'Peach-Bacterial-spot ', 'Peach-healthy',
    'Pepper-bell-Bacterial-spot', 'Pepper-bell-healthy', 
    'Potato-Early-blight :https://www.ag.ndsu.edu/publications/crops/early-blight-in-potato', 
    'Potato-Late-blight :https://www.apsnet.org/edcenter/disandpath/oomycete/pdlessons/Pages/LateBlight.aspx', 
    'Potato-healthy :None', 'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew', 
    'Strawberry-Leaf-scorch : https://content.ces.ncsu.edu/leaf-scorch-of-strawberry', 
    'Strawberry-healthy :None', 'Tomato-Bacterial-spot :https://hort.extension.wisc.edu/articles/bacterial-spot-of-tomato/',
    'Tomato-Early-blight :https://extension.umn.edu/diseases/early-blight-tomato',
    'Tomato-Late-blight :https://content.ces.ncsu.edu/tomato-late-blight', 
    'Tomato-Leaf-Mold :https://www.canr.msu.edu/news/tomato-leaf-mold-in-hoophouse-tomatoes',
    'Tomato-Septoria-leaf-spot :https://www.missouribotanicalgarden.org/gardens-gardening/your-garden/help-for-the-home-gardener/advice-tips-resources/pests-and-problems/diseases/fungal-spots/septoria-leaf-spot-of-tomato.aspx', 
    'Tomato-Spider-mites(Two-spotted_spider_mite) :https://pnwhandbooks.org/insect/vegetable/vegetable-pests/hosts-pests/tomato-spider-mite',
    'Tomato-Target-Spot :https://apps.lucidcentral.org/pppw_v10/text/web_full/entities/tomato_target_spot_163.htm', 
    'Tomato-Yellow-Leaf-Curl-Virus :https://www2.ipm.ucanr.edu/agriculture/tomato/tomato-yellow-leaf-curl/', 
    'Tomato-mosaic-virus :https://extension.umn.edu/disease-management/tomato-viruses', 'Tomato-healthy :None']

def allowed_files(filename):
    allowed_extensions = ['jpg', 'jpeg', 'png']
    #abc.jpg --> ['abc', 'jpg']
    ext = filename.split('.')[-1]
    if ext.lower() in allowed_extensions:
        return True
    else:
        return False

'''
 API endpoint for recommending the crop based on 7 features
 model used is Support Vector Machine with RBF kernel
'''
@app.route('/recommend', methods=['POST'])
def recommend_crop():
    data = request.get_json()
    print(data)
    X = np.array(list(data.values())).reshape(1, -1)
    print(X.shape)
    X_scaled = scaler.transform(X)
    predictions = model.predict(X_scaled).tolist() 
    plant_pred = plant_list[predictions[0]]
    return jsonify(plant_pred)

'''
API endpoint for plant disease prediction for 38 different disease
The model used is MobileNetV2 and dataset link: https://www.kaggle.com/vipoooool/new-plant-diseases-dataset
'''
@app.route('/predict', methods = ['POST'])
def predict():
    if 'file' not in request.files:
        return redirect(request.url)
    
    file = request.files['file']

    if file.filename == "":
        return redirect(request.url)
    
    if file:
        if(allowed_files(file.filename)):
            print(os.path.join(app.config['upload_folder'], file.filename))
            file.save(os.path.join(app.config['upload_folder'], file.filename))
        else:
            return redirect(request.url)
        
        image = cv2.imread(os.path.join(app.config['upload_folder'], file.filename))
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        input_shape = (224, 224)
        image = cv2.resize(image, input_shape, interpolation = cv2.INTER_NEAREST)
        image = np.array(image)/255
        x = np.expand_dims(image, axis = 0)

        print(x.shape)
        arr = disease_model.predict(x)[0]
        print(arr)
        y = np.argmax(arr, axis = 0)
        print(y)

        class_val = plant_disease_class[y]
        confidence = arr[y]

        json_op = dict()
        json_op['disease'] = str(class_val)
        json_op['confidence'] = str(confidence)

        return jsonify(json_op)

'''
API endpoint to estimate height of plant from images using image processing
'''
@app.route('/height', methods = ['POST'])
def height():
    if 'file' not in request.files:
        return redirect(request.url)
    
    file = request.files['file']

    if file.filename == "":
        return redirect(request.url)
    
    if file:
        if(allowed_files(file.filename)):
            print(os.path.join(app.config['height_folder'], file.filename))
            file.save(os.path.join(app.config['height_folder'], file.filename))
        else:
            return redirect(request.url)
        
        image = cv2.imread(os.path.join(app.config['height_folder'], file.filename))
        BASE_HEIGHT = 38.5

        image_array = np.array(image)
        blurred_frame = cv2.blur(image_array, (5, 5), 0)
        hsv_frame = cv2.cvtColor(blurred_frame, cv2.COLOR_BGR2HSV)

        low_green = np.float32([30, 10, 50])
        high_green = np.float32([135, 255, 200])

        green_mask = cv2.inRange(hsv_frame, low_green, high_green)
        print("green mask shape = {}".format(green_mask.shape))


        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
        opening = cv2.morphologyEx(green_mask, cv2.MORPH_OPEN, kernel, iterations=1)
        close = cv2.morphologyEx(opening, cv2.MORPH_CLOSE, kernel, iterations=1)

        contours, _ = cv2.findContours(green_mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)

        biggest = sorted(contours, key=cv2.contourArea, reverse=True)[0]
        print("got biggest contour!")
        cv2.drawContours(image_array, biggest, -1, (0, 0, 0), 1)

        blank_mask = np.zeros(image_array.shape, dtype=np.uint8)
        cv2.fillPoly(blank_mask, [biggest], (255, 255, 255))
        blank_mask = cv2.cvtColor(blank_mask, cv2.COLOR_BGR2GRAY)
        print("shape of blank mask = {}".format(blank_mask.shape))
        result = cv2.bitwise_and(image_array, image_array, mask=blank_mask)
        result = np.array(result)

        positions = np.nonzero(result)

        top = positions[0].min()
        bottom = positions[0].max()
        left = positions[1].min()
        right = positions[1].max()

        # print(top, bottom, left, right)
        ratio = (bottom - top) / image.shape[0]
        height = ratio * BASE_HEIGHT

        json_op = dict()
        json_op['height'] = str(height)

        return jsonify(json_op)

'''
API endpoint to estimate price of 7 different plants from historical(2012-2019) data
the problem is of time series prediction and model used is RandomforestRegressor
'''
@app.route('/price', methods = ["POST"])
def price():
    base = {
        "coconut": 5100,
        "cotton": 3600,
        "black_gram": 2800,
        "maize": 1175,
        "moong": 3500,
        "jute": 1675,
        "wheat": 1350
    }

    data = request.get_json()
    print(data)
    if(data['crop'].lower() == 'maize'):
        price_model = pickle.load(open("maize_price_prediction.pkl", "rb"))
    elif(data['crop'].lower() == 'black_gram'):
        price_model = pickle.load(open("black_gram_price_prediction.pkl", "rb"))
    elif(data['crop'].lower() == 'coconut'):
        price_model = pickle.load(open("coconut_price_prediction.pkl", "rb"))
    elif(data['crop'].lower() == 'cotton'):
        price_model = pickle.load(open("cotton_price_prediction.pkl", "rb"))
    elif(data['crop'].lower() == 'jute'):
        price_model = pickle.load(open("jute_price_prediction.pkl", "rb"))
    elif(data['crop'].lower() == 'moong'):
        price_model = pickle.load(open("moong_price_prediction.pkl", "rb"))
    elif(data['crop'].lower() == 'wheat'):
        price_model = pickle.load(open("wheat_price_prediction.pkl", "rb"))
    

    X = np.array(list(data.values())[1:]).reshape(1, -1)
    print(X.shape)
    # X_scaled = scaler.transform(X)
    predictions = price_model.predict(X).tolist()
    print(predictions)
    price = round((predictions[0] * base[data['crop'].lower()]) / 100, 2 )
    return jsonify(str(price))

if __name__ == '__main__':
    app.run(port = 5000, debug=True)