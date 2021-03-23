const router = require("express").Router();
const Transaction = require("../models/transaction.js");
// const path = require("path")

// res.sendFile(path.join(__dirname, '../public', 'index1.html'))
// router.get("/static", (req, res) => {
//   res.sendFile(path.join(__dirname + "/../public/index.html"))
// })

                              // destructuring req, grabbing body out of it
router.post("/api/transaction", ({body}, res) => {
  Transaction.create(body)
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

// Is this route necessary? 
router.post("/api/transaction/bulk", ({body}, res) => {
  Transaction.insertMany(body)
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});


router.get("/api/transaction", (req, res) => {
  Transaction.find({}).sort({date: -1})
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

module.exports = router;