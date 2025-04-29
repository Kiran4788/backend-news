const express = require("express");
const app = express();
const { getApiEndPoints } = require("./app/controllers/api.controller");
const {
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
  handleInvalidPath,
} = require("./errorHandler");
const { getTopics } = require("./app/controllers/topics.controller");
const {
  getArticleById,
  getAllArticles,
} = require("./app/controllers/articles.controller");
const {
  getCommentsByArticleId,
} = require("./app/controllers/comments.controller");

//app.use(express.json());

//create GET/api which will act as documentation detailing all end points
// mentioned in endpoints.json
app.get("/api", getApiEndPoints);

//GET /api/topics would get an array of topic objects , each of which should have
// slug and description properties
app.get("/api/topics", getTopics);

// GET /api/articles/:article_id
app.get("/api/articles/:article_id", getArticleById);

//GET /api/articles get an articles array with comment_count , sorted by date
// in descening order with no body property
app.get("/api/articles", getAllArticles);

//GET /api/articles/:article_id/comments get an array of comments for
// the given article_id sorted by most recent first
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.all("/*splat", handleInvalidPath);
//error handling middleware
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
