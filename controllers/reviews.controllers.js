const {
  fetchReviewId,
  fetchReviews,
  fetchReviewidComments,
  createComment,
  updateVotesByReviewid,
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
  const { category, sort_by, order } = req.query;
  fetchReviews(category, sort_by, order)
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

exports.patchVotestsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  updateVotesByReviewid(review_id, inc_votes)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};
