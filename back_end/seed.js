const mongoose = require("mongoose");
const User = require("./models/user");
require("dotenv").config();

async function seedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.ATLAS_URI);
    console.log("Connected to MongoDB");

    // Clear existing users (optional, remove in production)
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Create demo users
    const users = [
      {
        username: "demo",
        email: "demo@example.com",
        password: "demo123",
        role: "user"
      },
      {
        username: "admin",
        email: "admin@example.com",
        password: "admin123",
        role: "admin"
      }
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${user.username}`);
    }

    console.log("Seeding completed successfully");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

// Run the seed function
seedUsers();