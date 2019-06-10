var express = require('express');
var moment = require('moment');
var router = express.Router();
var jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {sequelize, Users, ServiceProviders, AppointmentRequests, AppointmentDetails, ScheduledAppointments, Incidents, UsersChoresTypes, Events} = require('../DBorm/DBorm');
var validations = require('./shared/validations');
var constants = require('./shared/constants');
var authentications = require('./shared/authentications');
var helpers = require('./shared/helpers');

/* POST login authenticate a user . */
router.post('/login/authenticate', function (req, res) {
    if (!req.body.userId || !req.body.password) {
        res.status(400).send({"message": constants.usersRoute.AUTHENTICATION_FAILED});
    } else {
        validations.checkIfUserExist(req.body.userId, res)
            .then(user => {
                if (user !== undefined && user.dataValues) {
                    var payload = {
                        userId: user.userId,
                        userFullname: user.fullname,
                    };
                    user.userId === req.body.userId &&
                    user.password === req.body.password ?
                        authentications.sendToken(payload, res)
                        :
                        res.status(400).send({
                            "success": false,
                            "message": constants.usersRoute.AUTHENTICATION_FAILED,
                            "token": 'null'
                        });

                }
            });
    }
});

router.put('/forgetPassword', function (req, res) {
    validations.checkIfUserExist(req.body.userId, res)
        .then(user => {
            Users.findOne(
                {
                    where: {
                        userId: req.body.userId
                    }
                })
                .then(user => {
                    let userExist = user.dataValues;

                    if (req.body.userId)
                        if (req.body.userId !== userExist.userId)
                            return res.status(400).send({
                                "message": constants.usersRoute.DETAILS_NOT_MATCH,
                            });
                    if (req.body.email)
                        if (req.body.email !== userExist.email)
                            return res.status(400).send({
                                "message": constants.usersRoute.DETAILS_NOT_MATCH,
                            });
                    if (req.body.mailbox)
                        if (parseInt(req.body.mailbox) !== userExist.mailbox)
                            return res.status(400).send({
                                "message": constants.usersRoute.DETAILS_NOT_MATCH,
                            });
                    if (req.body.cellphone)
                        if (req.body.cellphone !== userExist.cellphone)
                            return res.status(400).send({
                                "message": constants.usersRoute.DETAILS_NOT_MATCH,
                            });
                    if (req.body.phone)
                        if (req.body.phone !== userExist.phone)
                            return res.status(400).send({
                                "message": constants.usersRoute.DETAILS_NOT_MATCH,
                            });
                    if (req.body.bornDate)
                        if (moment(req.body.bornDate).format("YYYY-MM-DD") !== moment(userExist.bornDate).format("YYYY-MM-DD"))
                            return res.status(400).send({
                                "message": constants.usersRoute.DETAILS_NOT_MATCH,
                            });

                    res.status(200).send({
                        "message": constants.usersRoute.USER_UPDATE_SUCCESS,
                        "result": user.dataValues.password
                    });
                    helpers.sendMail(user.email, constants.mailMessages.REMINDER_SUBJECT,
                        "Hello " + user.fullname +
                        "\nYour username is: " + user.userId +
                        "\nYour password is: " + user.dataValues.password +
                        "\n" + constants.mailMessages.REMINDER_END +
                        "\n" + constants.mailMessages.MAIL_END);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                })
        });
});


router.use(function (req, res, next) {
    authentications.verifyToken(req, res, next);
});

router.post('/validToken', function (req, res) {
    res.status(200).send({
        message: constants.usersRoute.VALID_TOKEN,
        payload: req.decoded.payload
    });
});

/* GET users listing. */
router.get('/', function (req, res, next) {
    Users.findAll({
        include: [
            {
                model: ServiceProviders
            }
        ]
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
router.get('/name/:name', function (req, res, next) {
    Users.findAll({
        where: {
            fullname: {
                [Op.like]: '%' + req.params.name + '%',
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
        },
        include: [
            {
                model: ServiceProviders,
            }
        ]
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

// update user by userId.
router.put('/update/userId/:userId', function (req, res, next) {
    validations.checkIfUserExist(req.params.userId, res)
        .then(user => {
            let updateFields = {};
            req.body.fullname ? updateFields.fullname = req.body.fullname : null;
            req.body.password ? updateFields.password = req.body.password : null;
            req.body.email ? updateFields.email = req.body.email : null;
            req.body.mailbox ? updateFields.mailbox = req.body.mailbox : null;
            req.body.cellphone ? updateFields.cellphone = req.body.cellphone : null;
            req.body.phone ? updateFields.phone = req.body.phone : null;
            req.body.bornDate ? updateFields.bornDate = req.body.bornDate : null;
            req.body.image ? updateFields.image = req.body.image : null;
            typeof req.body.active === 'boolean' ? updateFields.active = req.body.active : null;

            Users.update(
                updateFields,
                {
                    where: {
                        userId: req.params.userId
                    }
                })
                .then(isUpdated => {
                    res.status(200).send({
                        "message": constants.usersRoute.USER_UPDATE_SUCCESS,
                        "result": isUpdated[0]
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                })
        });
});

/* GET events of user by userId listing. */
router.get('/events/userId/:userId', function (req, res, next) {
    validations.checkIfUserExist(req.params.userId, res)
        .then(user => {
            if (user && user.dataValues) {
                Events.findAll({
                    where: {
                        userId: req.params.userId,
                    },
                    include: [{all: true, nested: true}]
                })
                    .then(userEvents => {
                        console.log(userEvents);
                        res.status(200).send(userEvents);
                    })
                    .catch(err => {
                        res.status(500).send({
                            "message": constants.general.SOMETHING_WENT_WRONG,
                            err
                        });
                    })
            }
        })
});


module.exports = router;
