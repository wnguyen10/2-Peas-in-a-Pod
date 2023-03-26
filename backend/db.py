from config import Base
from sqlalchemy import *
from sqlalchemy.orm import relationship

category_assoc = Table(
    "category_assoc",
    Base.metadata,
    Column("category_id", Integer, ForeignKey("category.id")),
    Column("podcast_id", Integer, ForeignKey("podcast.id")),
)

class Publisher(Base):
    __tablename__ = "publisher"
    name = Column(String(100), nullable=False)
    podcasts = relationship('Podcast')

    def __init__(self, **kwargs):
        self.name = kwargs.get("name")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "podcasts": [p.simple_serialize() for p in self.podcasts],
        }

    def simple_serialize(self):
        return {
            "id": self.id, 
            "name": self.name
        }

class Podcast(Base):
    __tablename__ = "podcast"
    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    spotify_uri = Column(String(50), nullable=True)
    image_url = Column(String(75), nullable=True)
    link = Column(String(75), nullable=True)
    duration = Column(Numeric, nullable=False)
    timestamp = Column(Date, nullable=False)
    publisher = Column(Integer, ForeignKey('publisher.id'))
    categories = relationship("Category", secondary="category_assoc", back_populates="podcasts")

    def __init__(self, **kwargs):
        self.name = kwargs.get("name")
        self.publisher = kwargs.get("publisher")
        self.description = kwargs.get("description")
        self.spotify_uri = kwargs.get("spotify_uri")
        self.image_url = kwargs.get("image_url")
        self.spotify_url = kwargs.get("spotify_url")
        self.duration = kwargs.get("duration")
        self.timestamp = kwargs.get("timestamp")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "publisher": self.publisher,
            "description": self.description,
            "duration": float(self.duration),
            "timestamp": str(self.timestamp),
            "categories": [c.simple_serialize() for c in self.categories],
        }

    def simple_serialize(self):
        return {
            "id": self.id, 
            "name": self.name, 
            "description": self.description
        }

class Category(Base):
    __tablename__ = "category"
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    podcasts = relationship("Podcast", secondary="category_assoc", back_populates="categories")

    def __init__(self, **kwargs):
        self.name = kwargs.get("name")

    def serialize(self):
        return {
            "id": self.id, 
            "name": self.name, 
            "podcasts": [p.simple_serialize() for p in self.podcasts]
        }

    def simple_serialize(self):
        return {
            "id": self.id, 
            "name": self.name
        }
