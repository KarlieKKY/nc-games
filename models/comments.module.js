const db = require("../db/connection");

exports.removeCommentByCommentid = (id) => {
  if (isNaN(id)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request! Comment Id should be a valid number.",
    });
  }
  const queryStr = `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;
    `;

  return db.query(queryStr, [id]);
};
