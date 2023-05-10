const express = require("express");
const { getCategories } = require("./controllers/categories.controllers");

const app = express();

app.get("/api/categories", getCategories);

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Server Error..." });
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Invalid endpoint!" });
});

module.exports = app;
