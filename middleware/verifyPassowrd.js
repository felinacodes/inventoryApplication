const verifyPassword = (req, res, next) => {
    const { password } = req.body;
    if (password === process.env.SECRET_CODE) {
        next(); // Password is correct, proceed to the next middleware/controller
    } else {
        res.status(401).send("Unauthorized: Incorrect password.");
    }
};

module.exports = verifyPassword;