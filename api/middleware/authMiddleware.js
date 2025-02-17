const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { username, id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { username, id };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
