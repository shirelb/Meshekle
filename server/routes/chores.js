var express = require('express');
var router = express.Router();
const {UsersChores, ChoreTypes} = require('../DBorm/DBorm');

/* GET users chores listing. */
router.get('/usersChores', function (req, res, next) {
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

/* GET choreTypes listing. */
router.get('/choreTypes', function (req, res, next) {
  ChoreTypes.findAll()
      .then(chores => {
          console.log(chores);
          res.status(200).send(chores);
      })
      .catch(err => {
          console.log(err);
          res.status(500).send(err);
      })
});

/* GET userChore by choreId . */
router.get('/userChores/userChoreId/:userChoreId', function (req, res, next) {
  UsersChores.findAll({
                  where: {
                    userChoreId: req.params.userChoreId
                  }
                })
      .then(chores => {
          console.log(chores);
          res.status(200).send(chores);
      })
      .catch(err => {
          console.log(err);
          res.status(500).send(err);
      })
});

/* GET userChore by userId . */
router.get('/userChores/userId/:userId', function (req, res, next) {
  UsersChores.findAll({
                  where: {
                    userId: req.params.userId
                  }
                })
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
  //if isChoreNameAllreadyExist(req.body.choreName)
  ChoreTypes.create({
    choreName: req.body.choreName,
    days: req.body.days,//JSON.stringify(req.body.days),
    frequency: req.body.frequency,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    color: req.body.color
  })
      .then(newChoreType => {
          console.log('New choreType'+ newChoreType.choreName+',  has been created.');
          res.status(200).send({"message": "choreType successfully added!",newChoreType});
      })
      .catch(err => {
          console.log(err);
          res.status(500).send(err);
      })
});

/* POST userChore . */
router.post('/add/userChore', function (req, res, next) {
  //if isUserExist(req.body.userId)
  //if isChoreTypeExist(req.body.choreTypeId)
  //if isLegalDate(pastORfuture) // will check if the pattern present an legal data + check the parameter: if is future so will chek if the date is in the future and same for past
  //if isUserNeedToDoThisChore(req.body.userId, req.body.choreTypeId) //will check if 1.this user register for this choreType. 2. no relesee for this user for this chorttype 3. check if no deviation according the his last userchore
  UsersChores.create({
    userId: req.body.userId,
    choreTypeId: req.body.choreTypeId,
    date: new Date( req.body.date),
    isMark: req.body.isMark,
  })
      .then(newUserChore => {
          console.log('New user chore created with Id:'+ newUserChore.choreId+',  has been created.');
          res.status(200).send({"message": "choreType successfully added!",newUserChore});
      })
      .catch(err => {
          console.log(err);
          res.status(500).send(err);
      })
});

module.exports = router;
