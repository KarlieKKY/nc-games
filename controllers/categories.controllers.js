const {
  fetchCategories,
  fetchEndpoints,
  fetchReviewId,
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

exports.getReviewId = (req, res, next) => {
  const { review_id } = req.params;

  fetchReviewId(review_id)
    .then((review) => {
      res.status(200).send({ review: review[0] });
    })
    .catch(next);
};
