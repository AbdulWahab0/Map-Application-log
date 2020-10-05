const { Marker } = require('../models');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createMarker = async (markerBody) => {
  const marker = await Marker.create(markerBody);
  return marker;
};

const getMarkers = async () => {
  const markers = await Marker.find();
  return markers;
};

const getMarkerById = async id => Marker.findById(id);

const deleteMarkers = async (id) => {
  const marker = await getMarkerById(id);
  await marker.remove();
  return marker;
};

const updateMarker = async (id, updateBody) => {
  const user = await getMarkerById(id);
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

module.exports = {
  createMarker,
  getMarkers,
  deleteMarkers,
  updateMarker
};
