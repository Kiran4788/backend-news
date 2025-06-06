exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
};
exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};
exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({
    msg: "Internal Server Error",
  });
};
exports.handleInvalidPath = (req, res, next) => {
  res.status(404).send({
    msg: "Path Not Found",
  });
};
