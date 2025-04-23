const db = require("../connection")
const { topicData, userData, articleData, commentData } = require("../data/test-data/index.js")
const format = require("pg-format")

const { convertTimestampToDate , createRefObject} = require("./utils.js")

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query("DROP TABLE IF EXISTS comments;").
  then(()=>{
    return db.query("DROP TABLE IF EXISTS articles;")
  }).then(()=>{
    return db.query("DROP TABLE IF EXISTS topics;")
  }).then(()=>{
    return db.query("DROP TABLE IF EXISTS users;")
  }).then(()=>{   
   return db.query("CREATE TABLE topics(slug VARCHAR(255) PRIMARY KEY,description VARCHAR(1000),img_url VARCHAR(1000));")
  }).then(()=>{
    return db.query("CREATE TABLE users(username VARCHAR(255) PRIMARY KEY,name VARCHAR(255),avatar_url VARCHAR(1000));")
  }).then(()=>{
    return db.query("CREATE TABLE articles(article_id SERIAL PRIMARY KEY,title VARCHAR(255) NOT NULL,topic VARCHAR(255) REFERENCES topics(slug),author VARCHAR(255) REFERENCES users(username),body TEXT NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,votes INT DEFAULT 0,article_img_url VARCHAR(1000))");
  }).then(()=>{
    return db.query("CREATE TABLE comments(comment_id SERIAL PRIMARY KEY,article_id INT REFERENCES articles(article_id),body TEXT NOT NULL,votes INT DEFAULT 0,author VARCHAR(255) REFERENCES users(username),created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
  }).then(()=>{
    //insert data into topics table using pg-format
    const formattedData = topicData.map((topic) => {
      return [topic.slug, topic.description, topic.img_url];
    });
    console.log(formattedData+"----->formattedData");
    const query = format(`INSERT INTO topics(slug, description, img_url) VALUES %L`,formattedData);
    console.log(query+"----->query");
    return db.query(query);
  }).then(()=>{
    //insert data into users table using pg-format
    const formattedData = userData.map((user) => {
      return [user.username, user.name, user.avatar_url];
    });
    const query = format(`INSERT INTO users(username, name, avatar_url) VALUES %L`,formattedData);
    return db.query(query);
  }
  ).then(()=>{
    //insert data into articles table using pg-format
    const formattedData = articleData.map((article) => {
      const newArticle = convertTimestampToDate(article);
      console.log(newArticle+"----->newArticle");     
      return [newArticle.title, newArticle.topic, newArticle.author, newArticle.body, newArticle.created_at, newArticle.votes, newArticle.article_img_url];
    });
    const query = format(`INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`,formattedData);
    console.log(query+"----->query");
    return db.query(query);
  }).then((result)=>{
    //insert data into comments table using pg-format
      const articleRefObject = createRefObject(result.rows);       
      const formattedData = commentData.map((comment) => {
        const newComment = convertTimestampToDate(comment);  
        return [newComment.body, articleRefObject[newComment.article_title], newComment.votes, newComment.author, newComment.created_at];
    });
    console.log(formattedData+"----->formattedData Comments");
    const query = format(`INSERT INTO comments(body, article_id, votes, author, created_at) VALUES %L`,formattedData);
    console.log(query+"----->query");
    return db.query(query);
  })
  .then(()=>{
    console.log("Data inserted successfully");
  })
  .catch((err) => {
    console.log(err);
  })
};
module.exports = seed;
