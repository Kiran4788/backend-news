const db = require("../../db/connection");

exports.selectUserByUsername = (username) => {
  return db
    .query(
      `SELECT * FROM users
         WHERE username = $1`,
      [username]
    )
    .then((result) => {
      return result.rows[0];
    });
};
