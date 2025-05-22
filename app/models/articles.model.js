const db = require("../../db/connection");

//should also include comment count
exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT a.author, 
      a.title, 
      a.article_id, 
      a.topic, 
      a.created_at,
      a.votes, 
      a.article_img_url,
      a.body,
      COUNT(c.article_id)::INT AS comment_count
       from articles AS a
      LEFT JOIN comments AS c ON a.article_id = c.article_id
         WHERE a.article_id = $1
         GROUP BY 1,2,3,4,5,6,7,8 `,
      [article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.selectAllArticles = (sort_by, order, topic) => {
  const validSortBy = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count"
  ];
  const validOrder = ["asc", "desc"];
  if (sort_by && !validSortBy.includes(sort_by.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }
  if (order && !validOrder.includes(order.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }
  const orderBy = sort_by ? ` ORDER BY ${sort_by} ` : ` ORDER BY created_at `;
  const orderDirection = order ? order : " DESC";
  const topicQuery = topic ? ` WHERE a.topic = '${topic}' ` : "";

  const query = `SELECT a.author, 
         a.title, 
         a.article_id, 
         a.topic, 
         a.created_at,
         a.votes, 
         a.article_img_url, 
         COUNT(c.article_id)::INT AS comment_count
         FROM articles AS a 
         LEFT JOIN comments AS c ON a.article_id = c.article_id
         ${topicQuery}
         GROUP BY 1,2,3,4,5,6,7        
         ${orderBy}${orderDirection}`;
  return db.query(query).then((result) => {
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
