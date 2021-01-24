const router = require('express').Router();
const db = require('../../../models');

router.route("/")
    .get((req, res) => {
        db.Dialog.find({})
            .then(data => {
                res.status(200).json(data);
            })
            .catch(e => res.status(500).json(e))
    });

module.exports = router;