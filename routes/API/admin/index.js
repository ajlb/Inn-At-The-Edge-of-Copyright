const router = require('express').Router();
const dialogRoutes = require('./dialogs');
const locationRoutes = require('./locations');
const playerRoutes = require('./players');

router.use('/dialogs', dialogRoutes);
router.use('/locations', locationRoutes);
router.use('/players', playerRoutes);

module.exports = router;