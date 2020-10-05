const express = require('express');
const markerRoute = require('./marker.route');


const router = express.Router();
router.use('/markers', markerRoute);

module.exports = router;
