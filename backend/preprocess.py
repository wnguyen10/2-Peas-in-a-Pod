from db import Podcast, Publisher, Category
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
            category_name = row["category"]
            subcategory_name = row["subcategory"]
            timestamp = row["publish_time"]

            # If podcast has a category, add category to database if it does not exist already
            if category_name:
                category = Session.query(Category).filter_by(name=category_name).first() 
                if category is None:
                    category = Category(name=category_name)
                    Session.add(category)
                    Session.commit()

            # If podcast has a subcategory, add subcategory to database if it does not exist already
            if subcategory_name:
                subcategory = Session.query(Category).filter_by(name=subcategory_name).first()
                if subcategory is None:
                    subcategory = Category(name=subcategory_name)
                    Session.add(subcategory)
                    Session.commit()

            # Add publisher to database if it does not exist already
            publisher = Session.query(Publisher).filter_by(name=publisher_name).first()
            if publisher is None:
                publisher = Publisher(name=publisher_name)
                Session.add(publisher)
                Session.commit()

            # Add podcast to database
            publisher_id = publisher.serialize()["id"]
            podcast = Podcast(name=name, spotify_uri=uri, description=description, link=rss_link, duration=duration, publisher_id=publisher_id, timestamp=timestamp)
            Session.add(podcast)
            Session.commit()

            # Add categories to podcast
            if category_name:
                category = Session.query(Category).filter_by(name=category_name).first() 
                podcast.categories.append(category)
            if subcategory_name and subcategory_name != category_name:
                subcategory = Session.query(Category).filter_by(name=subcategory_name).first()
                podcast.categories.append(subcategory)
            Session.commit()
