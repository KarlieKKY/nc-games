const { fetchUsers, fetchUserNames } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserNames(username)
    .then((username) => {
      res.status(200).send({ username });
    })
    .catch(next);
};
