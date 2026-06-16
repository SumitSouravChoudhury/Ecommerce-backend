const errorHandler = (err, req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || "Internal server error";

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ error: `${field} already exists` });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  return res.status(status).json({ error: message });
};

module.exports = { errorHandler };
