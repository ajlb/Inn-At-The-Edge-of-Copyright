const router = require('express').Router();
const dialogRoutes = require('./dialogs');

router.use('/dialogs', dialogRoutes);

module.exports = router;