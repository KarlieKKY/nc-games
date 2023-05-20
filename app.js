const apiRouter = require("./routes/api-router");
const categoriesRouter = require("./routes/categories-router");
const reviewsRouter = require("./routes/reviews-router");
const express = require("express");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/reviews", reviewsRouter);

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    const isUserErr = /not present in table "users"/.test(err.detail);
    res.status(404).send({
      msg: `Sorry, the ${
        isUserErr ? "author" : "review id"
      } you entered is not found!`,
    });
  } else {
    res.status(err.status).send({ msg: err.msg });
  }
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Invalid endpoint!" });
});

module.exports = app;
