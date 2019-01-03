var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {Users, ServiceProviders, AppointmentRequests, Appointments, Incidents, Events} = require('../DBorm/DBorm');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource serviceProviders');
});


/* POST user . */
router.post('/users/add', function (req, res, next) {
    Users.create({
        userId: req.body.userId,
        fullname: req.body.fullname,
        password: req.body.password,
        email: req.body.email,
        mailbox: req.body.mailbox,
        cellphone: req.body.cellphone,
        phone: req.body.phone,
        bornDate: new Date(req.body.bornDate),
        active: true,
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

/* POST user . */
router.post('/add', function (req, res, next) {
    ServiceProviders.create({
        serviceProviderId: req.body.serviceProviderId,
        userId: req.body.userId,
        role: req.body.role,
        operationTime: req.body.operationTime,
        phoneNumber: req.body.phoneNumber,
        appointmentWayType: req.body.appointmentWayType,
        active: true,
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
