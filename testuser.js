console.log("Test started");

require("dotenv").config();

const connectDB = require("./src/config/db");
const User = require("./src/models/user");

const test = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await connectDB();

    console.log("MongoDB Connected");

    const user = await User.create({
      fullName: "Aditya Mohite",
      email: `mohiteaditya35@gmail.com`,
      password: "password123"
    });

    console.log("User Created:");
    console.log(user);

    process.exit(0);
  } catch (error) {
    console.error("ERROR:");
    console.error(error);

    process.exit(1);
  }
};

test();
