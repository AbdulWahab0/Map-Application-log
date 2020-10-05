const httpStatus = require('http-status');
// const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { markerService } = require('../services');

const createMarker = catchAsync(async (req, res) => {
  const marker = await markerService.createMarker(req.body);
  res.status(httpStatus.CREATED).send(marker);
});

const getMarker = catchAsync(async (req, res) => {
  const markers = await markerService.getMarkers();
  res.send(markers);
});

const deleteMarker = catchAsync(async (req, res) => {
  await markerService.deleteMarkers(req.body.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const updateMarker = catchAsync(async (req, res) => {
  const marker = await markerService.updateMarker(req.params.id, req.body);
  res.send(marker);
});

// const getUsers = catchAsync(async (req, res) => {
//   const filter = pick(req.query, ['name', 'role']);
//   const options = pick(req.query, ['sortBy', 'limit', 'page']);
//   const result = await userService.queryUsers(filter, options);
//   res.send(result);
// });

module.exports = {
  createMarker,
  getMarker,
  deleteMarker,
  updateMarker
};
