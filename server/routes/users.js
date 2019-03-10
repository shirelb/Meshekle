var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {sequelize, Users, AppointmentRequests, AppointmentDetails, ScheduledAppointments, Incidents, UsersChoresTypes, Events} = require('../DBorm/DBorm');
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
                if (user.dataValues) {
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

// update user by userId.
router.put('/update/userId/:userId', function (req, res, next) {
    validations.checkIfUserExist(req.params.userId, res)
        .then(user => {
            let updateFields = {};
            req.body.fullname ? updateFields.fullname = req.body.fullname : null;
            req.body.email ? updateFields.email = req.body.email : null;
            req.body.mailbox ? updateFields.mailbox = req.body.mailbox : null;
            req.body.cellphone ? updateFields.cellphone = req.body.cellphone : null;
            req.body.phone ? updateFields.phone = req.body.phone : null;
            req.body.bornDate ? updateFields.bornDate = req.body.bornDate : null;
            req.body.active ? updateFields.active = req.body.active : null;

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

/*
/!* GET releases of user by userId and choreTypeId listing. *!/
router.get('/userId/:userId/chores/choreTypeId/:choreTypeId/releases', function (req, res, next) {
    UsersReleases.findAll({
        where: {
            userId: req.params.userId,
            choreTypeId: req.params.choreTypeId,
        }
    })
        .then(userReleases => {
            res.status(200).send(userReleases);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

/!* PUT releases of user by userId and choreTypeId listing. *!/
router.put('/userId/:userId/chores/choreTypeId/:choreTypeId/releases', function (req, res, next) {
    UsersReleases.findAll({
        where: {
            userId: req.params.userId,
            choreTypeId: req.params.choreTypeId,
        }
    })
        .then(userReleases => {
            userReleases ?
                userReleases.update({
                    startDate: req.body.startDate,
                    endDate: req.body.endDate
                })
                    .then(update => {
                        res.status(200).send({"message": "releases of user updated successfully!", update});
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send(err);
                    })
                :
                UsersReleases.create({
                    userId: req.params.userId,
                    choreTypeId: req.params.choreTypeId,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate
                })
                    .then(newUserRelease => {
                        res.status(200).send({"message": "releases of user added successfully!", newUserRelease});
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

/!* GET user chores by userId listing. *!/
router.get('/userId/:userId/chores', function (req, res, next) {
    UsersChores.findAll({
        where: {
            userId: req.params.userId,
        }
    })
        .then(userChores => {
            res.status(200).send(userChores);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

/!* GET user choresTypes by userId listing. *!/
router.get('/userId/:userId/choresTypes', function (req, res, next) {
    UsersChores.findAll({
        where: {
            userId: req.params.userId,
        }
    })
        .then(userChoresTypes => {
            while (i < req.body.questions.length) {
                arr.push(DButilsAzure.execQuery("" +
                    "INSERT INTO QaRestorePassword (userId,question,answer)" +
                    " VALUES (" + user_id + ",'" + req.body.questions[i] + "','" + req.body.answers[i] + "')"));
                i++;
            }
            for (choreTypeId in userChoresTypes) {
                ChoreTypes.findAll({
                    where: {
                        userId: req.params.userId,
                    }
                })
            }

            res.status(200).send(userChores);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

/!* PUT cancel incident of user by userId listing. *!/
router.put('/users/userId/:userId/update', function (req, res, next) {
    Users.findOne({
        where: {
            userId: req.params.userId,
        }
    }).then(user => {
        user.update({
            password: req.body.password ? req.body.password : user.password,
            email: req.body.email ? req.body.email : user.email,
            mailbox: req.body.mailbox ? req.body.mailbox : user.mailbox,
            cellphone: req.body.cellphone ? req.body.cellphone : user.cellphone,
            phone: req.body.phone ? req.body.phone : user.phone,
        });
        res.status(200).send({"message": "Incident canceled successfully!", appointment});
    })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});
*/

/* GET events of user by userId listing. */
router.get('/events/userId/:userId', function (req, res, next) {
    validations.checkIfUserExist(req.params.userId, res)
        .then(user => {
            if (user.dataValues) {
                Events.findAll({
                    where: {
                        userId: req.params.userId,
                    },
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
