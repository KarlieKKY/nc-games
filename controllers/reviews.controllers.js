const {
  fetchReviewId,
  fetchReviews,
  fetchReviewidComments,
  createComment,
} = require("../models/reviews.models");

exports.getReviewId = (req, res, next) => {
  const { review_id } = req.params;

  fetchReviewId(review_id)
    .then((review) => {
      res.status(200).send({ review: review[0] });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  fetchReviews()
    .then((review) => {
      res.status(200).send({ reviews: review });
    })
    .catch(next);
};

exports.getReviewidComments = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewidComments(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postReviewidComments = (req, res, next) => {
  const { username, body } = req.body;
  const { review_id } = req.params;
  createComment(username, body, review_id)
    .then((comment) => {
      res.status(201).send({ newComment: comment });
    })
    .catch(next);
};
