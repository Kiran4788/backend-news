const {
  selectArticleById,
  selectAllArticles,
  updateArticleVotes,
} = require("../models/articles.model");
const { selectTopicBySlug } = require("../models/topics.model");

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

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  //promise to check if topic exists
  if (topic) {
    return selectTopicBySlug(topic)
      .then((topic) => {
        if (!topic) {
          return Promise.reject({ status: 404, msg: "Topic Not Found" });
        }
        return topic;
      }).then((topic) => {
        return selectAllArticles(sort_by, order, topic.slug);
      }).then((articles) => {
        res.status(200).send({ articles });
      })
      .catch(next);
  } else {
    selectAllArticles(sort_by, order, null)
      .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch(next);
  }
};

exports.updateArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (inc_votes === undefined) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  selectArticleById(article_id)
    .then((article) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
      return article;
    })
    .then((article) => {
      return updateArticleVotes(article_id, inc_votes);
    })
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};
