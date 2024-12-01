// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token; // Assuming token is stored in cookies
    
    if (!token) {
        return res.status(401).json({ message: "No token provided", success: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // e.g., { userId: '...', iat: ..., exp: ... }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token", success: false });
    }
};

module.exports = authMiddleware;
