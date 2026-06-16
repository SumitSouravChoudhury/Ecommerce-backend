const { validateToken } = require("../services/auth");

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ error: "Authorization token is required" });

  const token = authHeader.split(" ")[1];

  try {
    const payload = validateToken(token);
    req.user = payload;
    next();
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = { authenticate };
