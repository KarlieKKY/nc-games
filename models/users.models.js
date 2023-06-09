const db = require("../db/connection");

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then((result) => {
    return result.rows;
  });
};

exports.fetchUserNames = (username) => {
  const queryStr = `SELECT * FROM users
  WHERE username = $1`;
  return db.query(queryStr, [username]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Username not found!" });
    } else {
      return result.rows[0];
    }
  });
};
