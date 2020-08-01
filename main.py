from flask import Flask, request, jsonify, render_template, url_for
import jinja2
import pickle
import json
import numpy as np

app = Flask(__name__)

# Loading List of Locations
file_json = open('locations_list.json', 'r')
data = json.load(file_json)
file_json.close()
__data_columns = data['data_columns']
__locations = __data_columns[3:] 

# Loading ML model
file_model = open('model.pkl', 'rb')
__model = pickle.load(file_model)
file_model.close()

def get_estimated_price(location, sqft, bhk, bath):
  global __model
  global __data_columns
 
  try:
    loc_index = __data_columns.index(location.lower())
  except:
    loc_index = -1   
   
  if __data_columns is not None:
    x = np.zeros(len(__data_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk
    if loc_index >= 0:
      x[loc_index] = 1
  
  return round(__model.predict([x])[0], 2)


@app.route('/')
def home():
  return render_template("app.html")


@app.route('/get_location_names')
def get_location_names():
  response = jsonify({
      'locations': __locations
  })
  print(response)

  response.headers['Access-Control-Allow-Origin'] = '*'

  return response


@app.route('/predict_home_price', methods = ['POST'])
def predict_home_price():
  
  total_sqft = float(request.form['total_sqft'])
  location = request.form['location']
  bhk = int(request.form['bhk'])
  bath = int(request.form['bath'])
  print(total_sqft)
  print(location)

  response = jsonify({
      'estimated_price': get_estimated_price(location, total_sqft, bhk, bath)
  })
  response.headers['Access-Control-Allow-Origin'] = '*'

  return response
  

if __name__ == '__main__':

  app.run(debug=True)
