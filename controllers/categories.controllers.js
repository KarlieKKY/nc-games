const {
  fetchCategories,
  fetchEndpoints,
} = require("../models/categories.models");

exports.getCategories = (req, res, next) => {
  fetchCategories()
    .then((category) => {
      res.status(200).send({ category });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getEndpoints = (req, res, next) => {
  fetchEndpoints()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch(next);
};
