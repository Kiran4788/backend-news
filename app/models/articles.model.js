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
