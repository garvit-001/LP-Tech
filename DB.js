const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const mongoURI = process.env.mongoURI;

mongoose.set("strictQuery", false);

const connectToMongo = () => {
  mongoose.connect(mongoURI).then(() => console.log("connected"));
};

module.exports = connectToMongo;
