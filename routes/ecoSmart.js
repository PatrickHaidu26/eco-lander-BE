const express = require('express');
const router = express.Router();
const { submitQuestionnaire, reportIncident } = require('../controllers/ecoSmartController');
const { contact } = require('../controllers/smartLandController');

router.post('/questionnaire', submitQuestionnaire);
router.post('/report', reportIncident);
router.post('/contact', contact);

module.exports = router;
