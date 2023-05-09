const db = require("../db/connection");

exports.fetchCategories = () => {
  //   const validQueries = ["slug", 'description'];

  return db.query(`SELECT * FROM categories`).then((result) => {
    return result.rows;
  });
};
