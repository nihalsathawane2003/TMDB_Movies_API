// controllers/authController.js
const jwt = require("jsonwebtoken");

const SECRET_KEY = "your_jwt_secret"; // store securely in env vars ideally

exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Dummy user login for testing
  if (username === "admin" && password === "password") {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid credentials" });
};

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ message: "Token missing" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Token not provided" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Token invalid" });
    req.user = user;
    next();
  });
};
