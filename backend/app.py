import json
import os
from flask import Flask, render_template, request
from flask_cors import CORS

from config import Session, mysql_engine
from db import Podcast, Publisher, Category
from ir.recommendation import get_top_k_recommendations
from ir.rocchio import rocchio, add_to_irrelevant, add_to_relevant
from preprocess import add_data

# ROOT_PATH for linking with all your files.
# Feel free to use a config.py or settings.py with a global export variable
os.environ['ROOT_PATH'] = os.path.abspath(os.path.join("..", os.curdir))

# Path to init.sql file. This file can be replaced with your own file for testing on localhost, but do NOT move the init.sql file
mysql_engine.load_file_into_db()

# If no data in tables, add columns to database
FILE_NAME = "data/trunc_metadata.csv"
if len(Session.query(Podcast).all()) == 0:
    add_data(FILE_NAME)
mysql_engine.query_executor("USE podcasts")

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

# API ENDPOINTS


@app.route("/api/publishers/")
def get_publishers():
    publishers = [p.simple_serialize() for p in Session.query(Publisher).all()]
    return success_response({"publishers": publishers})


@app.route("/api/podcasts/")
def get_podcasts():
    podcasts = [p.simple_serialize() for p in Session.query(Podcast).all()]

    res = {"podcasts": podcasts}
    return success_response(res)


@app.route("/api/genres/")
def get_genres():
    categories = [c.simple_serialize() for c in Session.query(Category).all()]

    res = {"categories": categories}
    return success_response(res)


@app.route("/api/recommendations/", methods=["POST"])
def recommend_podcasts():
    body = json.loads(request.data)
    pref1 = body.get("user1")
    pref2 = body.get("user2")

    results = get_top_k_recommendations(pref1, pref2)

    resp = []
    for r in results:
        podcast = Session.query(Podcast).filter_by(
            name=r[0]).first().serialize()
        podcast["score"] = r[1]
        resp.append(podcast)

    return success_response({"recommendations": resp})


@app.route("/api/feedback/", methods=["POST"])
def recommend_podcasts_feedback():
    body = json.loads(request.data)
    current_recs = body["recs"]
    pref1 = body["user1"]
    pref2 = body["user2"]

    current_recs_dict = {}
    res = []
    res_i = 0

    if body["relevant"]:
        add_to_relevant(body["podcast"])
    else:
        add_to_irrelevant(body["podcast"])

    for i in range(len(current_recs)):
        if current_recs[i]["name"] == body["podcast"] and not body["relevant"]:
            continue
        else:
            res.append(current_recs[i])
            current_recs_dict[current_recs[i]["name"]] = res_i
            res_i += 1

    results = rocchio(pref1, pref2)
    for r in results:
        # Update podcast score if it exists in existing recommendations
        if r[0] in current_recs_dict:
            i = current_recs_dict[r[0]] 
            res[i]["score"] = r[1]
        elif len(res) < 10:
            # Add new podcast to recommendations if less than 10 results
            podcast = Session.query(Podcast).filter_by(name=r[0]).first().serialize()
            podcast["score"] = r[1]
            res.append(podcast)
    
    return success_response(sorted(res, key=lambda p: p["score"], reverse=True))


@app.teardown_request
def remove_session(ex=None):
    Session.remove()


# app.run(debug=True)
