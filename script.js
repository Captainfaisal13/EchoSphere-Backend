// require("dotenv").config();
// const mongoose = require("mongoose");
// const Tweet = require("./models/Tweet"); // Adjust the path as needed
// const User = require("./models/User");

// // script to add isOAuth field to the existing users, by default false.
// const addIsOAuthField = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);

//     // Update all documents to include the new fields with default values
//     await User.updateMany(
//       {},
//       {
//         $set: {
//           isOAuth: false,
//         },
//       }
//     );

//     console.log("New fields added to all the users successfully!");
//     mongoose.connection.close();
//   } catch (error) {
//     console.error("Error updating tweets:", error);
//     mongoose.connection.close();
//   }
// };

// addIsOAuthField();

// this script was run to add shareCount to all the tweets
// addNewFields();
// const addNewFields = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);

//     // Update all documents to include the new fields with default values
//     await Tweet.updateMany(
//       {},
//       {
//         $set: {
//           shareCount: 0,
//         },
//       }
//     );

//     console.log("New fields added to all tweets successfully!");
//     mongoose.connection.close();
//   } catch (error) {
//     console.error("Error updating tweets:", error);
//     mongoose.connection.close();
//   }
// };

// addNewFields();
