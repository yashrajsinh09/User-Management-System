const { giveResponse } = require("../helper/res_help");

const errorHandler = (err, req, res, next) => {
  let message;
  //Mongoose Bad Object
  if (err.name === "CastError") {
    message = `Resourse not found`;
  }

  //Mongoose Duplicate key
  if (err.code === 11000) {
    message = "Duplicate field Value entered";
  }

  //Mongoose validation Error
  if (err.name === "ValidationError") {
    message = Object.values(err.errors).map((val) => val.message);
  }

  //Mongoose reference Error
  if (err.name === "ReferenceError") {
    message = err.toString();
  }
  console.log(err);

  return giveResponse(res, 400, false, message);
};

module.exports = errorHandler;
