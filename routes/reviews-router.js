const {
  getReviews,
  getReviewId,
  getReviewidComments,
  postReviewidComments,
  patchVotestsByReviewId,
} = require("../controllers/reviews.controllers");

const reviewsRouter = require("express").Router();

reviewsRouter.route("/").get(getReviews);
reviewsRouter
  .route("/:review_id")
  .get(getReviewId)
  .patch(patchVotestsByReviewId);
reviewsRouter
  .route("/:review_id/comments")
  .get(getReviewidComments)
  .post(postReviewidComments);

module.exports = reviewsRouter;
