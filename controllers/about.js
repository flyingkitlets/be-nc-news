exports.aboutApi = (req, res, next) => {
  const aboutObj = require("../endpoints.json");
  res.status(200).send({ about: JSON.stringify(aboutObj) });
};
