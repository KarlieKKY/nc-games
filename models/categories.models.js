const db = require("../db/connection");
const fs = require("fs/promises");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((result) => {
    return result.rows;
  });
};

exports.fetchEndpoints = () => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`, "utf-8")
    .then((result) => {
      const parsedEndpoints = JSON.parse(result);
      return parsedEndpoints;
    });
};

exports.fetchReviewId = (id) => {
  if (isNaN(id)) {
    return Promise.reject({ status: 400, msg: "Bad request!" });
  }

  const queryStr = `SELECT * FROM reviews WHERE review_id = $1`;

  return db.query(queryStr, [id]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Review Id not found!" });
    } else {
      return result.rows;
    }
  });
};
