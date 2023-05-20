const { getEndpoints } = require("../controllers/categories.controllers");
const apiRouter = require("express").Router();

apiRouter.route("/").get(getEndpoints);

module.exports = apiRouter;
