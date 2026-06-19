const dns = require("dns");
const mongoose = require("mongoose");

const configureDns = () => {
  const dnsServers = (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers.length > 0) {
    dns.setServers(dnsServers);
  }
};

const connectDB = async () => {
  try {
    configureDns();

    const conn = await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      `MongoDB Connected: ${conn.connection.host}`
    );
  } catch (error) {
    console.error(
      "Database connection failed:",
      error.message
    );

    process.exit(1);
  }
};

module.exports = connectDB;
