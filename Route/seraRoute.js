const express = require('express');
const router = express.Router();
const SeraController = require('../Controller/seraController');



router.get('/getTemperature',SeraController.getTemperature);

router.post('/setTemperature',SeraController.setTemperature);

router.get('/listen', SeraController.listen);

router.get('/check', SeraController.check);

router.get('/close', SeraController.close);

module.exports = router;