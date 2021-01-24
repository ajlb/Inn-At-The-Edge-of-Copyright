const router = require('express').Router();
const db = require('../../../models');

router.route('/')
    .get(function (req, res) {
        db.Location.find({}).then(function (data) {
            res.json(data);
        }).catch(e => {
            console.log(e);
        });
    })
    .post(function ({ body }, res) {
        db.Location.create(body).then(data => {
            res.json(data)
        }).catch(e => {
            console.log(e);
        });
    })
    .put(function ({ body }, res) {
        const bodyObj = body;
        const action = body.action;
        delete bodyObj.action
        switch (action) {
            case "set":
                db.Location.updateMany({}, { $set: bodyObj }).then(data => {
                    res.json(data)
                })
                    .catch(e => {
                        console.log(e);
                    });
                break;
            case "push":
                db.Location.updateMany({}, { $push: bodyObj }).then(data => {
                    res.json(data)
                })
                    .catch(e => {
                        console.log(e);
                    });
                break;
            case "pull":
                db.Location.updateMany({}, { $pull: bodyObj }).then(data => {
                    res.json(data)
                })
                    .catch(e => {
                        console.log(e);
                    });
                break;
            case "unset":
                db.Location.updateMany({}, { $unset: bodyObj }).then(data => {
                    res.json(data)
                })
                    .catch(e => {
                        console.log(e);
                    });
                break;
            case "rename":
                db.Location.updateMany({}, { $rename: bodyObj }).then(data => {
                    res.json(data)
                })
                    .catch(e => {
                        console.log(e);
                    });
                break;
        }
    });


router.route(':name')
    .delete(function ({ params }, res) {
        db.Location.deleteOne({ locationName: params.name }).then(data => {
            res.json(data);
        }).catch(e => {
            console.log(e);
        });
    })
    .get(function ({ params }, res) {
        db.Location.findOne({ locationName: params.name }).then(data => {
            res.json(data);
        }).catch(e => {
            console.log(e);
        });
    })
    .put(function ({ body, params }, res) {
        console.log("In API, changing location");
        const bodyObj = body;
        const action = body.action;
        delete bodyObj.action
        switch (action) {
            case "set":
                console.log("We will use set");
                console.log("This is the body");
                console.log(bodyObj);
                db.Location.updateOne({ locationName: params.name }, { $set: bodyObj }).then(data => {
                    res.json(data)
                })
                    .catch(e => {
                        console.log(e);
                    });
                break;
            case "push":
                db.Location.updateOne({ locationName: params.name }, { $push: bodyObj }).then(data => {
                    res.json(data)
                })
                    .catch(e => {
                        console.log(e);
                    });
                break;
            case "pull":
                db.Location.updateOne({ locationName: params.name }, { $pull: bodyObj }).then(data => {
                    res.json(data)
                })
                    .catch(e => {
                        console.log(e);
                    });
                break;
            case "unset":
                db.Location.updateOne({ locationName: params.name }, { $unset: bodyObj }).then(data => {
                    res.json(data)
                })
                    .catch(e => {
                        console.log(e);
                    });
                break;
            case "rename":
                db.Location.updateOne({ locationName: params.name }, { $rename: bodyObj }).then(data => {
                    res.json(data)
                })
                    .catch(e => {
                        console.log(e);
                    });
                break;
        }
    })

module.exports = router;