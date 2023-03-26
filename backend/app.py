import json
import os
from flask import Flask, render_template, request
from flask_cors import CORS
from config import Base, Session, mysql_engine
from db import Podcast, Publisher
from ir.recommendation import get_top_k_recommendations
 
# ROOT_PATH for linking with all your files.
# Feel free to use a config.py or settings.py with a global export variable
os.environ['ROOT_PATH'] = os.path.abspath(os.path.join("..", os.curdir))

# Path to init.sql file. This file can be replaced with your own file for testing on localhost, but do NOT move the init.sql file
mysql_engine.load_file_into_db()

# Base.metadata.drop_all(mysql_engine.engine)
# Base.metadata.create_all(mysql_engine.engine)
app = Flask(__name__)

CORS(app)

# Response Formats
def success_response(data, code=200):
    return json.dumps(data), code

def failure_response(message, code=404):
    return json.dumps({"error": message}), code

@app.route("/")
def home():
    return render_template('base.html', title="sample html")

## TEST ENDPOINTS 

@app.route("/api/podcasts/", methods=["POST"])
def create_podcast():
    body = json.loads(request.data)
    
    name = body.get("name")
    publisher = body.get("publisher")
    description = body.get("description")
    duration = body.get("duration")
    timestamp = body.get("timestamp")

    podcast = Podcast(name=name,publisher=publisher,description=description, duration=duration, timestamp=timestamp)
    Session.add(podcast)
    Session.commit()
    return success_response(podcast.serialize(), 201)

@app.route("/api/podcasts/<int:id>/", methods=["DELETE"])
def delete_podcast(id):
    podcast = Session.query(Podcast).filter_by(id=id).first()
    if podcast is not None:
        Session.delete(podcast)
        Session.commit()
        return success_response(podcast.serialize())
    return failure_response("Invalid Podcast ID")

## API ENDPOINTS

@app.route("/api/publishers/")
def get_publishers():
    publishers = [p.simple_serialize() for p in Session.query(Publisher).all()]
    return success_response({"publishers": publishers})

@app.route("/api/podcasts/")
def get_podcasts():
    podcasts = [p.serialize() for p in Session.query(Podcast).all()]

    res = {"podcasts": podcasts}
    return success_response(res)

@app.route("/api/recommendations/")
def recommend_podcasts():
    body = json.loads(request.data)
    pref1 = body.get("user1")
    pref2 = body.get("user2")

    res = get_top_k_recommendations(pref1, pref2)

    return success_response({"recommendations": res})

app.run(debug=True)
