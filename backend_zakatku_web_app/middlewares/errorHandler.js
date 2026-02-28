const errorHandler = (err, req, res, next) => {
  console.log(err);

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      message: "Email already registered",
    });
  }

  if (err.name === "ErrorNotFound") {
    return res.status(404).json({
      message: "Data Not Found",
    });
  }

  if (err.name === "ErrorUpdate") {
    return res.status(400).json({
      message: "Data not found or no changes made",
    });
  }

  if (err.name === "InvalidCredential") {
    return res.status(401).json({
      message: "Invalid Email or Password",
    });
  }

  // default error
  res.status(500).json({
    message: "Internal Server Error",
  });
};

module.exports = errorHandler;
