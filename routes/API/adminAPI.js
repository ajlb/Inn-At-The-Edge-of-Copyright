const router = require("express").Router();
const db = require("../../models");
const mongoose = require("mongoose");


//Location routes

router.route("/locations")
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



//specific location routes
router.route("/locations/:name")
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




  //Player routes

router.route("/players")
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



//specific Player routes
router.route("/players/:name")
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
