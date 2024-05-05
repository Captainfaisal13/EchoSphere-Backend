const { UnauthorizedError } = require("../errors");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("No token provided");
  }

  // console.log(authHeader);

  const token = authHeader.split(" ")[1];
  // console.log(token);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: payload.userId,
      name: payload.name,
      username: payload.username,
      avatar: payload.avatar,
    };
    next();
  } catch (error) {
    throw new UnauthorizedError("Not authorized to access this route");
  }
};

module.exports = auth;
