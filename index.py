from flask import Flask, request,render_template, jsonify
import numpy as np
from PIL import Image
import io
import base64
import tensorflow as tf


app = Flask(__name__)
global model
global figure
global points
figures=np.array([0,1,2,3,4,5,6,7]) 
points=0
fignames={0:"circulo",1:"cometa",2:"paralelogramo",3:"rectangulo",4:"rombo",5:"cuadrado",6:"trapezoide",7:"triangulo"}
def loadmodel():
    global model
    model = tf.keras.models.load_model("model.h5")

def get_array_from_image(image):
    image = image.convert('L')
    image = image.resize((50, 50))
    matrix=np.array(image)
    mask=matrix==255
    formated_image = mask.reshape(1, -1)
    return formated_image
def figurerand():
    global figure
    figure=np.random.choice(figures)
    return
@app.route("/")
def index():
    return render_template("index.html")
@app.route('/game')
def game():
    global figure
    global points
    points=0
    figurerand()
    figurename=fignames[figure]
    return render_template('game.html', name=figurename)
@app.route("/api/predict", methods=["POST"])
def predict():
    global figure
    global points
    imageBase64 = request.get_data().decode("utf-8")
    image = Image.open(io.BytesIO(base64.b64decode(imageBase64)))
    image1=get_array_from_image(image)
    prediction=model.predict(image1)
    prediction=np.argsort(-prediction)
    prediction=prediction[0]
    prediction=prediction[:3]
    print(prediction)
    if any(prediction==figure):
        points=points+1
    figurerand()
    figurename=fignames[figure]
    data=[points,figurename]

    return  jsonify(data)
@app.route("/endgame")
def endgame():
    puntaje=str(points)
    return render_template('endgame.html',puntaje=puntaje)
if __name__ == "__main__":
    loadmodel()
    app.run(host='0.0.0.0')
    