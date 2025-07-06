const express = require('express');
const router = express.Router();
const {
    ecosmartRegisterUser,
    ecosmartLoginUser,
    smartlandRegisterUser,
    smartlandLoginUser,
    logoutUser
} = require('../controllers/authController');

router.post('/ecosmart/register', ecosmartRegisterUser);
router.post('/ecosmart/login', ecosmartLoginUser);
router.post('/smartland/register', smartlandRegisterUser);
router.post('/smartland/login', smartlandLoginUser);
router.post('/logout', logoutUser);

module.exports = router;