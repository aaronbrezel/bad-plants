import os
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify, redirect
import json
import statistics
app = Flask(__name__)

##How to add a player to the json file permenantly
SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
json_url = os.path.join(SITE_ROOT, 'static', 'plants.json')
with open(json_url, encoding='utf8') as json_file:
    plants = json.load(json_file)
    json_file.close()





@app.route('/')
def hello_world():
    return redirect('/search')

@app.route('/search')
def search():
    return render_template("search_plants.html", plants=plants)

    
if __name__ == '__main__':
   app.run(debug = True)