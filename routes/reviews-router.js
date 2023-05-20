const {
  getReviews,
  getReviewId,
  getReviewidComments,
  postReviewidComments,
} = require("../controllers/categories.controllers");

const reviewsRouter = require("express").Router();

reviewsRouter.route("/").get(getReviews);
reviewsRouter.route("/:review_id").get(getReviewId);
reviewsRouter
  .route("/:review_id/comments")
  .get(getReviewidComments)
  .post(postReviewidComments);

module.exports = reviewsRouter;
