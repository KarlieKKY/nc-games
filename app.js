const express = require("express");
const {
  getCategories,
  getEndpoints,
  getReviewId,
} = require("./controllers/categories.controllers");

const app = express();

app.get("/api/categories", getCategories);
app.get("/api", getEndpoints);
app.get("/api/reviews/:review_id", getReviewId);

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

// app.use((err, req, res, next) => {
//   res.status(500).send({ msg: "Server Error..." });
// });

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Invalid endpoint!" });
});

module.exports = app;