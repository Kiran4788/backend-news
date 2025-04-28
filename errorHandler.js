exports.handlePsqlErrors = (err, req, res, next) => {
  const psqlErrors = {
    "22P02": { status: 400, message: "Bad Request" },
    23503: { status: 404, message: "Not Found" },
    23505: { status: 409, message: "Conflict" },
  };
  if (psqlErrors[err.code]) {
    res.status(psqlErrors[err.code].status).send({
      msg: psqlErrors[err.code].message,
    });
  } else {
    next(err);
  }
};
exports.handleCustomErrors = (err, req, res, next) => {
  const customErrors = {
    "Not Found": { status: 404, message: "Not Found" },
    "Bad Request": { status: 400, message: "Bad Request" },
    "Internal Server Error": { status: 500, message: "Internal Server Error" },
  };
  if (customErrors[err.message]) {
    res.status(customErrors[err.message].status).send({
      msg: customErrors[err.message].message,
    });
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
