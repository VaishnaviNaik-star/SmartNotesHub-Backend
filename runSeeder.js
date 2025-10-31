const mongoose = require("mongoose");
const dotenv = require("dotenv");
const seedDemoNotes = require("./seedDemoNotes"); // path to your file

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");
    await seedDemoNotes(); // call the seeder
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });
