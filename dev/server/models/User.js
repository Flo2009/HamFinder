const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// import schema from Station.js
const stationSchema = require('./RadioStation');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    donationAmount: {
      type: Number,
    },
    donated: {
      type: Boolean,
    },
    // set savedStations to be an array of data that adheres to the stationSchema
    savedStations: [stationSchema],
  },
  // set this to use virtual below
  {
    toJSON: {
      virtuals: true,
    },
  }
);



// // custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// when we query a user, we'll also get another field called `stationCount` with the number of saved stations we have
userSchema.virtual('stationCount').get(function () {
  return this.savedStations.length;
});

const User = model('User', userSchema);

module.exports = User;
