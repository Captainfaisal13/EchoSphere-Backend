// require("dotenv").config();
// // import mongoose from "mongoose";
// // import User from "./models/User.js"; // adjust path if needed
// const mongoose = require("mongoose");
// const User = require("./models/User.js");
// const run = async () => {
//   await mongoose.connect(process.env.MONGO_URI);

//   try {
//     await User.syncIndexes(); // optional: ensures indexes in schema match DB
//     await User.collection.createIndex(
//       { name: "text", username: "text" },
//       { name: "UserTextSearchIndex" }
//     );
//     console.log("✅ Text index created successfully.");
//   } catch (err) {
//     console.error("❌ Failed to create index:", err);
//   } finally {
//     mongoose.disconnect();
//   }
// };

// run();
