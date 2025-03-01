const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function decryptToken(encryptedToken) {
    try {
        const algorithm = 'aes-256-ctr';
        const [ivHex, encryptedText] = encryptedToken.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const key = crypto.scryptSync(process.env.ENCRYPTION_SECRET, 'salt', 32);
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Token decryption error:', error);
        return null;
    }
}

const verifyTokenMiddleware = (req, res, next) => {
    const encryptedToken = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!encryptedToken) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    try {
        const token = decryptToken(encryptedToken);
        if (!token) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        jwt.verify(token, process.env.JWT_SECRET, {}, (err, info) => {
            if (err) {
                console.error('Token verification error:', err);
                return res.status(401).json({ message: "Invalid token" });
            }
            req.user = info;
            next();
        });
    } catch (error) {
        console.error('Token processing error:', error);
        return res.status(401).json({ message: "Token processing failed" });
    }
};

module.exports = verifyTokenMiddleware;
