const { getUsers, getUsername } = require("../controllers/users.controllers");
const usersRouter = require("express").Router();

usersRouter.route("/").get(getUsers);
usersRouter.route("/:username").get(getUsername);

module.exports = usersRouter;
