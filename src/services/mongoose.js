const mongoose = require("mongoose");
const Item = require("../models/item"); // Import Item model
const Category = require("../models/category"); // Import Category model

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log(`MongoDb is connected`))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// const migrateCategories = async () => {
//   try {
//     console.log("Starting migration...");

//     // Step 1: Find all unique category names from the existing items
//     const uniqueCategories = await Item.distinct("category");

//     // Step 2: Create a mapping of category names to their ObjectIDs
//     const categoryMap = {};

//     for (let categoryName of uniqueCategories) {
//       // Check if category already exists
//       let category = await Category.findOne({ name: categoryName });

//       if (!category) {
//         // If not found, create a new category
//         category = new Category({ name: categoryName });
//         await category.save();
//         console.log(`Created new category: ${categoryName}`);
//       }

//       // Store in categoryMap
//       categoryMap[categoryName] = category._id;
//     }

//     // Step 3: Update all items with the correct category ObjectID
//     const items = await Item.find({});
//     for (let item of items) {
//       if (typeof item.category === "string") {
//         item.category = categoryMap[item.category]; // Assign ObjectID
//         await item.save();
//         console.log(`Updated item: ${item.name}`);
//       }
//     }

//     console.log("Migration completed successfully.");
//   } catch (error) {
//     console.error("Error during migration:", error);
//   } finally {
//     mongoose.disconnect();
//   }
// };

// // Run migration
// migrateCategories();
