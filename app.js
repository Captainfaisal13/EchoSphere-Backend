require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

// custome middlewares
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
// const authenticationMiddleware = require("./middleware/authentication");

// routes exports
const authorizationRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const tweetRoutes = require("./routes/tweet");
const likeRoutes = require("./routes/like");
const retweetRoutes = require("./routes/retweet");
const shareTweeetRoutes = require("./routes/share");
const bookmarkTweetRoutes = require("./routes/bookmark");
const followerRoutes = require("./routes/follower");
const feedAPIRoutes = require("./routes/feedAPIs");

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const cookieParser = require("cookie-parser");

// app.set("trust proxy", 1);
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//   })
// );

const corsOptions = {
  origin: process.env.FRONTEND_URL, // Allow only this origin
  credentials: true, // Allow cookies to be sent and received
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Define allowed methods
  allowedHeaders: ["Content-Type"], // Define allowed headers
};

app.use(express.json());
app.use(helmet());
app.use(cors(corsOptions));
app.use(xss());
app.use(cookieParser(process.env.JWT_SECRET));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.get("/", (req, res) => {
  res.send("Welcome to EchoSphere");
});

app.use("/api/v1/auth", authorizationRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tweet", [
  bookmarkTweetRoutes,
  tweetRoutes,
  likeRoutes,
  retweetRoutes,
  shareTweeetRoutes,
]);
app.use("/api/v1/follow", followerRoutes);
app.use("/api/v1/feed", feedAPIRoutes);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
