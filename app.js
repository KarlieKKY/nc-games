const express = require("express");
const { getCategories } = require("./controllers/categories.controllers");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Invalid endpoint!" });
});

module.exports = app;
