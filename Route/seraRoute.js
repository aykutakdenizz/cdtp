const express = require('express');
const router = express.Router();
const SeraController = require('../Controller/seraController');

router.get('/getTemperature',SeraController.getTemperature);

router.post('/setTemperature',SeraController.setTemperature);

module.exports = router;