const db = require("../../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT slug, description FROM topics;").then((result) => {
    return result.rows;
  });
};

exports.selectTopicBySlug = (slug) => {
  return db
    .query("SELECT * FROM topics WHERE slug = $1;", [slug])
    .then((result) => {
      return result.rows[0];
    });
}
