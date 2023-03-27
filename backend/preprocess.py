from db import Podcast, Publisher
from config import Session
import csv

def add_data(file_name):
    with open(file_name, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            name = row["show_name"]
            uri = row["show_uri"]
            description = row["show_description"]
            publisher_name = row["publisher"]
            rss_link = row["rss_link"]
            duration = row["avg_duration"]

            publisher = Session.query(Publisher).filter_by(name=publisher_name).first()
            if publisher is None:
                publisher = Publisher(name=publisher_name)
                Session.add(publisher)
                Session.commit()

            publisher_id = publisher.serialize()["id"]
            podcast = Podcast(name=name, spotify_uri=uri, description=description, link=rss_link, duration=duration, publisher_id=publisher_id)
            Session.add(podcast)
    Session.commit()