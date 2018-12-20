var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
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

/* GET users by name listing. */
router.get('/name/:name', function (req, res, next) {
    Users.findAll({
        where: {
            fullname: {
                [Op.like]: '%'+ req.params.name + '%' ,
            },
        }
    })
        .then(users => {
            console.log(users);
            res.status(200).send(users);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

/* GET users by name listing. */
router.get('/userId/:userId', function (req, res, next) {
    Users.findAll({
        where: {
            userId: req.params.userId,
        }
    })
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
        userId: req.body.userId,
        fullname: req.body.fullname,
        password: req.body.password,
        email: req.body.email,
        mailbox: req.body.mailbox,
        cellphone: req.body.cellphone,
        phone: req.body.phone,
        bornDate: new Date(req.body.bornDate),
    })
        .then((newUser) => {
            console.log('New user' + newUser.username + ', with id ' + newUser.userId + ' has been created.');
            res.status(200).send({"message": "User successfully added!", newUser});
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

module.exports = router;
