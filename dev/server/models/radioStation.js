const { Schema } = require('mongoose');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedStations` array in User.js
const stationSchema = new Schema({
location: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  // saved station id from GoogleStations
  stationId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
name: {
    type: String,
    required: true,
  },
});

module.exports = stationSchema;
