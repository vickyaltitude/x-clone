const express = require('express');
const protectGetMeRoute = require('../middlewares/protectGetMeRoute');

const {getNotifications,deleteNotifications} = require('../controllers/notification.controller');

const router = express.Router();


router.get('/',protectGetMeRoute,getNotifications)

router.delete('/',protectGetMeRoute,deleteNotifications)


module.exports = router