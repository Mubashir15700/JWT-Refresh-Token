const express = require("express");
const jwt = require("jsonwebtoken");
const books = require("./data");
const generateTokens = require("./generateTokens");
const authenticateToken = require("./middleware");

const app = express();

const refreshTokens = [];

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello");
});

app.post("/login", (req, res) => {
    const userData = req.body;
    const user = { username: userData.username };
    const token = generateTokens(user);
    refreshTokens.push({
        token: token.refreshToken,
        user: userData.username
    });
    res.json({ token: token });
});

app.post("/refresh-token", (req, res) => {
    const { refreshToken } = req.body;

    // Check if refreshToken is present
    if (!refreshToken) {
        return res.sendStatus(400); // Bad request
    }

    // if (!refreshTokens.includes(refreshToken)) {
    //     return res.sendStatus(403);
    // }

    // Verify refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        // Generate new access token
        const accessToken = jwt.sign(
            { user: decoded.user },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRARION }
        );

        res.json({ accessToken });
    });
});

app.get("/books", authenticateToken, (req, res) => {
    res.send(books);
});

app.get("/books/:bookName", authenticateToken, (req, res) => {
    const book = books.filter((book) => book.name === req.params.bookName);
    res.send(book);
});

app.listen(process.env.PORT, () => {
    console.log("Server up");
});
