const Sequelize = require('sequelize');
var express = require('express');
var router = express.Router();
const {ServiceProviders,Users} = require('../DBorm/DBorm');
const Op = Sequelize.Op;

/* GET serviceProviders listing. */
router.get('/', function(req, res, next) {
    ServiceProviders.findAll()
        .then(serviceProviders => {
            console.log(serviceProviders);
            res.status(200).send(serviceProviders);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

/* GET serviceProviders by name listing. */
router.get('/name/:name', function(req, res, next) {
    Users.findAll({
        attributes:['userId'],
        where:{
            firstName: req.params.name
        }
    })
        .then(ids => {
            ServiceProviders.findAll({
                where: {
                    userId:{
                        [Op.in]: ids
                    }
                }
            })
                .then(serviceProviders => {
                    console.log(serviceProviders);
                    res.status(200).send(serviceProviders);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

/* GET serviceProviders by role. */
router.get('/role/:role', function(req, res, next) {
    ServiceProviders.findAll({
        where: {
            role: req.params.role
        }
    })
        .then(serviceProviders => {
            console.log(serviceProviders);
            res.status(200).send(serviceProviders);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

/* put service providers day user . */
router.put('/serviceProviderId/:serviceProviderId/days/set', function (req, res, next) {
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
