const {
  selectCommentsByArticleId,
  insertCommentForArticle,
  selectCommentById,
  deleteCommentById,
} = require("../models/comments.model");
const { selectArticleById } = require("../models/articles.model");
const { selectUserByUsername } = require("../models/users.model");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  //check if article id exists before getting comments for that article_id
  Promise.all([
    selectArticleById(article_id),
    selectCommentsByArticleId(article_id),
  ])
    .then(([article, comments]) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (username === undefined || body === undefined) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (typeof username !== "string" || typeof body !== "string") {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  // Check if the article exists
  selectArticleById(article_id)
    .then((article) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
      // Check if the user exists
      return selectUserByUsername(username);
    })
    .then((user) => {
      if (!user) {
        return Promise.reject({ status: 404, msg: "User Not Found" });
      }
      // Insert the new comment into the database
      return insertCommentForArticle(article_id, username, body);
    })
    .then((newComment) => {
      res.status(201).send({ comment: newComment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  // Check if the comment exists
  selectCommentById(comment_id)
    .then((comment) => {
      if (!comment) {
        return Promise.reject({ status: 404, msg: "Comment Not Found" });
      }
      // Delete the comment from the database
      return deleteCommentById(comment_id);
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
