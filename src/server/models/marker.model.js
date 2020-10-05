const mongoose = require('mongoose');

const markerSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef Marker
 */
const Marker = mongoose.model('Marker', markerSchema);

module.exports = Marker;
