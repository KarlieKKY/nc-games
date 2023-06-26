const {
  getReviews,
  getReviewId,
  getReviewidComments,
  postReviewidComments,
  patchVotestsByReviewId,
  postReview,
} = require("../controllers/reviews.controllers");

const reviewsRouter = require("express").Router();

reviewsRouter.route("/").get(getReviews).post(postReview);
reviewsRouter
  .route("/:review_id")
  .get(getReviewId)
  .patch(patchVotestsByReviewId);
reviewsRouter
  .route("/:review_id/comments")
  .get(getReviewidComments)
  .post(postReviewidComments);

module.exports = reviewsRouter;
