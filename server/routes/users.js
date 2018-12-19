var express = require('express');
var router = express.Router();
const {Users} = require('../DBorm/DBorm');

/* GET users listing. */
router.get('/', function (req, res, next) {
    Users.findAll()
        .then(users => {
            console.log(users);
            res.status(200).send(users);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

/* POST user . */
router.post('/add', function (req, res, next) {
    Users.create({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email,
        mailbox: req.body.mailbox,
        cellphone: req.body.cellphone,
        phone: req.body.phone
    })
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
