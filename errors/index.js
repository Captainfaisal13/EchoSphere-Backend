const BadRequestError = require("./bad-request");
const CustomAPIError = require("./custom-api");
const NotFoundError = require("./not-found");
const UnauthorizedError = require("./unauthorized");

module.exports = {
  CustomAPIError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
};
