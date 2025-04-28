const endpoints = require("../../endpoints.json");

exports.getApiEndPoints = (req, res) => {
  // Send the endpoints.json file as a response
  res.status(200).send({ endpoints });
};
