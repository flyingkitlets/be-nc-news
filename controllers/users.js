const { fetchUserByUsername } = require("../models/users.js");

getUsersByUsername = (req, res, next) => {
  fetchUserByUsername(req.params)
    .then(user => {
      if (user.length === 0) {
        res.status(404).send({ msg: "not found" });
      } else {
        res.status(200).send({ user: user[0] });
      }
    })
    .catch(next);
};

module.exports = {
  getUsersByUsername
};
