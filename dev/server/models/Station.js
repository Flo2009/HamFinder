const { Schema, model } = require('mongoose');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedStations` array in User.js
const stationSchema = new Schema({
  country: 
    {
      type: String,
    },
  // saved station id from API
  stationId: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  url: {
    type: String,
  },
  homepage: {
    type: String
  },
  name: {
    type: String,
    required: true,
  },
  clickcount: {
    type: Number,
  }
});

// module.exports = stationSchema;

const Station = model('Station', stationSchema);

module.exports = Station;
