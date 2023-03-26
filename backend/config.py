from helpers.MySQLDatabaseHandler import MySQLDatabaseHandler
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from os import environ

MYSQL_USER = "root"
MYSQL_USER_PASSWORD = environ.get("MYSQL_PASSWORD")
MYSQL_PORT = 3306
MYSQL_DATABASE = "podcasts"

mysql_engine = MySQLDatabaseHandler(
    MYSQL_USER, MYSQL_USER_PASSWORD, MYSQL_PORT, MYSQL_DATABASE)

Base = declarative_base()
Session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=mysql_engine.engine))