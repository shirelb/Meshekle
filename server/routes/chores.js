var express = require('express');
var router = express.Router();
const {UsersChores} = require('../DBorm/DBorm');

/* GET chores listing. */
router.get('/', function (req, res, next) {
  UsersChores.findAll()
      .then(chores => {
          console.log(chores);
          res.status(200).send(chores);
      })
      .catch(err => {
          console.log(err);
          res.status(500).send(err);
      })
});

/* POST choreType . */
router.post('/add/choreType', function (req, res, next) {
  ChoreType.create({
    choreName: req.body.choreName,
    days: JSON.stringify(req.body.days),
    frequency: req.body.frequency,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    color: req.body.color
  })
  /////////////////////here!!!!
      .then(newUser => {
          console.log('New user'+ newUser.username+', with id '+newUser.userId+' has been created.');
          res.status(200).send({"message": "User successfully added!",newUser});
      })
      .catch(err => {
          console.log(err);
          res.status(500).send(err);
      })
});

module.exports = router;
