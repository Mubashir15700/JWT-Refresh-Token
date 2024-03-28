const jwt = require("jsonwebtoken");

function generateTokens(user) {
    // Generate access token
    const accessToken = jwt.sign(
        { user },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRARION }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
        { user },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRARION }
    );

    return { accessToken, refreshToken };
}

module.exports = generateTokens;
