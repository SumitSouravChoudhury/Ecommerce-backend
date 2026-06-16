const jwt = require("jsonwebtoken");

const createToken = (user) => {
  const payload = { _id: user._id, role: user.role };

  const token = jwt.sign(payload, process.env.SECRET_KEY);

  return token;
};

const validateToken = (token) => {
  const payload = jwt.verify(token, process.env.SECRET_KEY);

  return payload;
};

module.exports = { createToken, validateToken };
