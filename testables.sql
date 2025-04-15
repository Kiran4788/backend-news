/* Topics
Each topic in the topics table should have:

slug field which is a unique string that acts as the table's primary key (a slug is a term used in publishing to identify an article)
description field which is a string giving a brief description of a given topic
img_url field which contains a string containing a link to an image representing the topic
Users
Each user should have:

username which is the primary key & unique
name
avatar_url
Articles
Each article should have:

article_id which is the primary key
title
topic field which references the slug in the topics table
author field that references a user's primary key (username)
body
created_at defaults to the current timestamp
votes defaults to 0
article_img_url
Comments
Each comment should have:

comment_id which is the primary key
article_id field that references an article's primary key
body
votes defaults to 0
author field that references a user's primary key (username)
created_at defaults to the current timestamp */
\c nc_news_test
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS articles;      
DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS users;

CREATE TABLE topics (
    slug VARCHAR(255) PRIMARY KEY,
    description TEXT NOT NULL,
    img_url VARCHAR(1000) NOT NULL
);
CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255) NOT NULL
);
CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    topic VARCHAR(255) REFERENCES topics(slug),
    author VARCHAR(255) REFERENCES users(username),
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000)
);
CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles(article_id),
    body TEXT NOT NULL,
    votes INT DEFAULT 0,
    author VARCHAR(255) REFERENCES users(username),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);