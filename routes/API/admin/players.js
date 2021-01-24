const router = require('express').Router();
const db = require('../../../models');

router.route('/')
    .get(function (req, res) {
        db.Player.find({}).then(function (data) {
            res.json(data);
        }).catch(e => {
            console.log(e);
        });
    })
    .post(function ({ body }, res) {
        db.Player.create(body).then(data => {
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
                db.Player.updateMany({}, { $set: bodyObj }).then(data => {
                    res.json(data)
                })
                    .catch(e => {
                        console.log(e);
                    });
                break;
            case "push":
                db.Player.updateMany({}, { $push: bodyObj }).then(data => {
                    res.json(data)
                })
                    .catch(e => {
                        console.log(e);
                    });
                break;
            case "pull":
                db.Player.updateMany({}, { $pull: bodyObj }).then(data => {
                    res.json(data)
                })
                    .catch(e => {
                        console.log(e);
                    });
                break;
            case "unset":
                db.Player.updateMany({}, { $unset: bodyObj }).then(data => {
                    res.json(data)
                })
                    .catch(e => {
                        console.log(e);
                    });
                break;
            case "rename":
                db.Player.updateMany({}, { $rename: bodyObj }).then(data => {
                    res.json(data)
                })
                    .catch(e => {
                        console.log(e);
                    });
                break;
        }
    });

router.route('/:name')
    .delete(function ({ params }, res) {
        db.Player.deleteOne({ characterName: params.name }).then(data => {
            res.json(data);
        }).catch(e => {
            console.log(e);
        });
    })
    .get(function ({ params }, res) {
        db.Player.findOne({ characterName: params.name }).then(data => {
            res.json(data);
        }).catch(e => {
            console.log(e);
        });
    })
    .put(function ({ body, params }, res) {
        console.log("In API, changing Player");
        const bodyObj = body;
        const action = body.action;
        delete bodyObj.action
        switch (action) {
            case "set":
                console.log("We will use set");
                console.log("This is the body");
                console.log(bodyObj);
                db.Player.updateOne({ characterName: params.name }, { $set: bodyObj }).then(data => {
                    res.json(data)
                })
                    .catch(e => {
                        console.log(e);
                    });
                break;
            case "push":
                db.Player.updateOne({ characterName: params.name }, { $push: bodyObj }).then(data => {
                    res.json(data)
                })
                    .catch(e => {
                        console.log(e);
                    });
                break;
            case "pull":
                db.Player.updateOne({ characterName: params.name }, { $pull: bodyObj }).then(data => {
                    res.json(data)
                })
                    .catch(e => {
                        console.log(e);
                    });
                break;
            case "unset":
                db.Player.updateOne({ characterName: params.name }, { $unset: bodyObj }).then(data => {
                    res.json(data)
                })
                    .catch(e => {
                        console.log(e);
                    });
                break;
            case "rename":
                db.Player.updateOne({ characterName: params.name }, { $rename: bodyObj }).then(data => {
                    res.json(data)
                })
                    .catch(e => {
                        console.log(e);
                    });
                break;
        }
    })

module.exports = router;