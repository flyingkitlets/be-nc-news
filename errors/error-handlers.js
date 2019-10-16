exports.customErrorHandling = (err, req, res, next) => {
  // console.log(err);
  if (err.code === "22P02")
    res.status(400).send({ msg: "bad request - invalid entry type" });
  else if (err.code === "42703")
    res.status(400).send({ msg: "bad request - column not found" });
  else if (err.code === "23503")
    res.status(400).send({ msg: "bad request - key not found" });
  else if (err.code === "23502")
    res.status(400).send({ msg: "bad request - missing rows" });
  else {
    next(err);
  }
};

exports.handle500Errors = (err, rew, res, next) => {
  console.log(err);
};

exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};
