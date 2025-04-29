const db = require("../../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments
       WHERE article_id = $1
       ORDER BY created_at DESC`,
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.insertCommentForArticle = (article_id, username, body) => {
  return db
    .query(
      `INSERT INTO comments (body, article_id, author)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [body, article_id, username]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.selectCommentById = (comment_id) => {
  return db
    .query(
      `SELECT * FROM comments
       WHERE comment_id = $1`,
      [comment_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};
exports.deleteCommentById = (comment_id) => {
  return db
    .query(
      `DELETE FROM comments
       WHERE comment_id = $1`,
      [comment_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Comment Not Found" });
      }
    });
};
