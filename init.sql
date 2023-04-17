CREATE DATABASE IF NOT EXISTS podcasts;
USE podcasts;

DROP TABLE if exists category_assoc;
DROP TABLE if exists category;
DROP TABLE if exists podcast;
DROP TABLE if exists publisher;

CREATE TABLE IF NOT EXISTS publisher(
    id int not null auto_increment,
    name varchar(200) not null,
    primary key(id)
);

CREATE TABLE IF NOT EXISTS podcast(
    id int not null auto_increment,
    name varchar(200) not null,
    description text not null,
    spotify_uri varchar(75) not null,
    image_url varchar(75), 
    link varchar(75), 
    duration numeric not null,
    timestamp date,
    publisher_id integer not null,
    foreign key (publisher_id) references publisher(id),
    primary key(id)
);

CREATE TABLE IF NOT EXISTS category(
    id int not null auto_increment,
    name varchar(100) not null,
    primary key(id)
);

CREATE TABLE IF NOT EXISTS category_assoc(
    id int not null auto_increment,
    category_id int not null,
    podcast_id int not null,
    foreign key (category_id) references category(id),
    foreign key (podcast_id) references podcast(id),
    unique(podcast_id, category_id),
    primary key(id)
);