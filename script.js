// require("dotenv").config();
// const mongoose = require("mongoose");
// const Tweet = require("./models/Tweet"); // Adjust the path as needed

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
