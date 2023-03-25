from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

category_assoc = db.Table(
    "category_assoc",
    db.Model.metadata,
    db.Column("category_id", db.Integer, db.ForeignKey("category.id")),
    db.Column("podcast_id", db.Integer, db.ForeignKey("podcast.id")),
)


class Podcast(db.Model):
    __tablename__ = "course"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    spotify_uri = db.Column(db.String, nullable=False)
    image_url = db.Column(db.String, nullable=False)
    spotify_url = db.Column(db.String, nullable=False)
    duration = db.Column(db.Number, nullable=False)
    categories = db.relationship("Category", secondary="category_assoc", back_populates="podcasts")

    def __init__(self, **kwargs):
        self.name = kwargs.get("name")
        self.description = kwargs.get("description")
        self.spotify_uri = kwargs.get("spotify_uri")
        self.image_url = kwargs.get("image_url")
        self.spotify_url = kwargs.get("spotify_url")
        self.duration = kwargs.get("duration")

    def serialize(self):
        categories = []
        for c in self.categories:
            category = {"id": c.serialize()["id"], "name": c.serialize()["name"]}
            categories.append(category)

        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "duration": self.duration,
            "categories": categories,
        }

    def simple_serialize(self):
        return {
            "id": self.id, 
            "name": self.name, 
            "description": self.description
        }

class Category(db.Model):
    __tablename__ = "categories"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    podcasts = db.relationship("Podcast", secondary="podcast_assoc", back_populates="categories")

    def __init__(self, **kwargs):
        self.name = kwargs.get("name")

    def serialize(self):
        podcasts = []
        for p in self.podcasts:
            podcast = p.simple_serialize()
            podcasts.append(podcast)

        return {"id": self.id, "name": self.name, "podcasts": self.podcasts}
