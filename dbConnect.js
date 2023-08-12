const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config("./.env");

const password = process.env.PASSWORD;
module.exports = async () => {
  const mongoUri ="mongodb://varsha:" + password + "@ac-nckjxqe-shard-00-00.hkau38f.mongodb.net:27017,ac-nckjxqe-shard-00-01.hkau38f.mongodb.net:27017,ac-nckjxqe-shard-00-02.hkau38f.mongodb.net:27017/?ssl=true&replicaSet=atlas-pz61x6-shard-0&authSource=admin&retryWrites=true&w=majority";
  try {
    const connect = await mongoose.connect(
      mongoUri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
    console.log('MongoDB connected : ' + connect.connection.host);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
