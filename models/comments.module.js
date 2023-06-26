const db = require("../db/connection");

exports.updateCommentById = (id, votes) => {
  if (isNaN(id)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request! Comment Id should be a valid number.",
    });
  }
  const queryStr = `
  UPDATE comments
  SET 
    votes = votes + $1
  WHERE 
    comment_id = $2
  RETURNING *;  
  `;

  return db.query(queryStr, [votes, id]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Comment Id not found!" });
    } else {
      return result.rows[0];
    }
  });
};

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
