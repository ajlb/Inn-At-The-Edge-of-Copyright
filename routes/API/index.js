const router = require('express').Router();
const adminRoutes = require('./admin');

router.use('/admin', adminRoutes);

module.exports = router;