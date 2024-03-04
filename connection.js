const { default: mongoose } = require("mongoose");
 const connectDb = async () => {
  try {
    await mongoose.connect(
      "mongodb://admin:uYfdJ6QMNLMkexjv4y2n7QuuL3XQV@20.198.69.138:27018/"
    );
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
  }
};
module.exports=connectDb