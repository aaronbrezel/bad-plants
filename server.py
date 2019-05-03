import os
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify, redirect
import json
import statistics
app = Flask(__name__)

##How to add a player to the json file permenantly
SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
json_url = os.path.join(SITE_ROOT, 'static', 'plants2.json')
with open(json_url, encoding='utf8') as json_file:
    plants = json.load(json_file)
    json_file.close()

for plant in plants:
    result = [x.strip() for x in plant["Common Name"].split(',')]
    plant["Common Name"] = result


quizzes = {}


counter = 0

@app.route('/')
def hello_world():
    return redirect('/search')

@app.route('/search')
def search():
    return render_template("search_plants.html", plants=plants)

@app.route('/edit/<quiz_id>')
def edit_quiz(quiz_id):
    try:
        quiz = quizzes[quiz_id]
        return render_template("edit.html", plants=plants, quiz=quiz)
    except:
        return render_template("empty_quiz.html")
    
@app.route('/add_quiz', methods=['GET', 'POST'])
def add_quiz():
    global quizzes
    global counter

    counter = counter + 1

    json_data = request.get_json()
    quiz_name = json_data["quizName"]
    quiz_elements = json_data["thePlants"]

    new_quiz_entry = {
        "quiz_id": counter,
        "quiz_name": quiz_name,
        "quiz_plants": quiz_elements     
    }

    quizzes[str(counter)] = new_quiz_entry
    

   
    #print(quizzes)

    return jsonify(data = counter)

@app.route('/pre_fabs')
def pre_fab():

    return render_template("pre_built_quizzes.html", quizzes=quizzes)

@app.route('/delete_quiz', methods=['GET', 'POST'])
def delete_quiz():
    json_data = request.get_json()
    quiz_id = str(json_data["quiz_id"])
    print(quiz_id)
    print(quizzes[quiz_id])
    del quizzes[quiz_id]
    print("")
    print(quizzes)

    return jsonify(data = quizzes)

@app.route('/learn/<quiz_id>')
def learn(quiz_id):
    try:
        quiz = quizzes[str(quiz_id)]
        return render_template("learn.html", quiz = quiz)
    except:
        return render_template("empty_quiz.html")


@app.route('/quiz/<quiz_id>')
def build_quiz(quiz_id):
    try:
        quiz = quizzes[str(quiz_id)]
        return render_template("build_quiz.html", quiz = quiz)
    except:
        return render_template("empty_quiz.html")

    
if __name__ == '__main__':
   app.run(debug = True)