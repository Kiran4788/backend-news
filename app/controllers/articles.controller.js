const { selectArticleById } = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  selectArticleById(article_id)
    .then((article) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
      res.status(200).send({ article });
    })
    .catch(next);
};
