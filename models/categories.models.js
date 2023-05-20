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
