const express = require('express');
const { markerController } = require('../controller');

const router = express.Router();

router
  .route('/')
  .get(markerController.getMarker)
  .post(markerController.createMarker)
  .delete(markerController.deleteMarker)
  .put(markerController.updateMarker);

router
  .route('/:id')
  .patch(markerController.updateMarker);

module.exports = router;
