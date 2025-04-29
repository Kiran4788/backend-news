const db = require("../../db/connection");

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT * from articles
         WHERE article_id = $1`,
      [article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.selectAllArticles = () => {
  return db
    .query(
      `SELECT a.author, 
         a.title, 
         a.article_id, 
         a.topic, 
         a.created_at,
         a.votes, 
         a.article_img_url, 
         COUNT(c.article_id)::INT AS comment_count
         FROM articles AS a 
         LEFT JOIN comments AS c ON a.article_id = c.article_id
         GROUP BY 1,2,3,4,5,6,7
         ORDER BY created_at DESC`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles
         SET votes = votes + $1
         WHERE article_id = $2
         RETURNING *`,
      [inc_votes, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};
