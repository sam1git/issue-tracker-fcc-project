const mongoose = require('mongoose');

async function main(callback) {
  try {
    await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log("Connected to issue tracker database.");
    callback();
  } catch(e) {
    console.error(e);
  }
}

module.exports = main;