const jwt = require('jsonwebtoken');

const verifyTokenMiddleware = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    jwt.verify(token, process.env.JWT_SECRET, {}, (err, info) => {
        if (err) return res.status(401).json({ message: "Invalid token" });
        req.user = info;
        next();
    });
};

module.exports = verifyTokenMiddleware;
