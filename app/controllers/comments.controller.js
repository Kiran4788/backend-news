const { selectCommentsByArticleId } = require("../models/comments.model");
const { selectArticleById } = require("../models/articles.model");

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
