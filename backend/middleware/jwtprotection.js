const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/.env" });

const protectRoutes = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "No authorization token provided" });
  }
  console.log(header.startsWith("Bearer"));
  if (!header.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ message: "Invalid token format. Token must be a Bearer token." });
  }

  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Bearer token not found" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Failed to authenticate token", error: err.message });
    }
    req.user = decoded;
    next();
  });
};

module.exports = protectRoutes;
