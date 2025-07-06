const express = require('express');
const router = express.Router();
const { contact } = require('../controllers/smartLandController');

router.post('/contact', contact);

module.exports = router;
