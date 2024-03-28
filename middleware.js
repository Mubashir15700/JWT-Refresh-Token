const jwt = require("jsonwebtoken");

// Middleware to authenticate user using JWT token
function authenticateToken(req, res, next) {
    // Get the token from the request headers
    const token = req.headers["authorization"].split(" ")[1];

    if (token == null) {
        // If token is not provided, return 401 Unauthorized
        return res.sendStatus(401);
    }

    // Verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            // If token is invalid, return 403 Forbidden
            return res.sendStatus(403);
        }
        // If token is valid, set the user object in the request and call next middleware
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
