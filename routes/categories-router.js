const { getCategories } = require("../controllers/categories.controllers");
const categoriesRouter = require("express").Router();

categoriesRouter.route("/").get(getCategories);

module.exports = categoriesRouter;
