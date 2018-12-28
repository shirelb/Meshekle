var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {sequelize, Users, AppointmentRequests, AppointmentDetails, ScheduledAppointments, Incidents, UsersChoresTypes, Events} = require('../DBorm/DBorm');
var validations = require('./shared/validations');
var constants = require('./shared/constants');
var authentications = require('./shared/authentications');

/* POST login authenticate a user . */
router.post('/login/authenticate', function (req, res) {
    if (!req.body.userId || !req.body.password) {
        res.status(200).send({"message": constants.usersRoute.authenticationFailed});
    } else {
        validations.checkIfUserExist(req.body.userId,res)
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
                        res.status(200).send({
                            "success": false,
                            "message": constants.usersRoute.authenticationFailed,
                            "token": 'null'
                        });

                }
            });
    }
});


router.use(function (req, res, next) {
    console.log("in route middleware to verify a token");

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;

    token.startsWith("Bearer ") ? token = token.substring(7, token.length) : token;

    console.log("token: " + token);

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, constants.general.superSecret, function (err, decoded) {
            if (err) {
                return res.status(200).send({success: false, message: constants.usersRoute.failedToken,err});
            } else {
                // if everything is good, save to request for use in other routes
                // get the decoded payload and header
                var decoded = jwt.decode(token, {complete: true});
                req.decoded = decoded;
                console.log(decoded.header);
                console.log(decoded.payload);
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: constants.usersRoute.tokenNotProvided
        });
    }
});

router.post('/validToken', function (req, res) {
    res.status(200).send({success: constants.usersRoute.validToken, payload: req.decoded.payload});
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

/* POST appointment request of user . */
router.post('/appointments/request', function (req, res, next) {
    createAppointmentRequestId()
        .then(appointmentRequestId => {
            createAppointmentDetails(appointmentRequestId, req, res)
                .then(newAppointmentDetails => {
                    if (newAppointmentDetails) {
                        AppointmentRequests.create({
                            requestId: appointmentRequestId,
                            optionalTimes: JSON.stringify(req.body.availableTime),
                            notes: req.body.notes,
                            status: "requested",
                        })
                            .then((newAppointmentRequest) => {
                                res.status(200).send({
                                    "message": constants.usersRoute.successfulAppointmentRequest,
                                    newAppointmentDetails, newAppointmentRequest
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).send(err);
                            })
                    }
                })
        })
});

/* POST appointment set of user . */
router.post('/appointments/set', function (req, res, next) {
    createAppointmentSetId()
        .then(appointmentSetId => {
            createAppointmentDetails(appointmentSetId, req, res)
                .then(newAppointmentDetails => {
                    if (newAppointmentDetails) {
                        ScheduledAppointments.create({
                            appointmentId: appointmentSetId,
                            startDateAndTime: new Date(req.body.date + "T" + req.body.startHour),
                            endDateAndTime: new Date(req.body.date + "T" + req.body.endHour),
                            remarks: req.body.notes,
                            status: "set",
                        })
                            .then((newAppointment) => {
                                Events.create({
                                    userId: req.body.userId,
                                    eventType: "Appointments",
                                    eventId: newAppointment.appointmentId
                                })
                                    .then((newEvent) => {
                                        res.status(200).send({
                                            "message": constants.usersRoute.successfulAppointment,
                                            newAppointmentDetails,
                                            newAppointment,
                                            newEvent
                                        });
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.status(500).send(err);
                                    });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).send(err);
                            })
                    }
                })
        })
});

/* POST incident of user . */
router.post('/incidents/open', function (req, res, next) {
    Incidents.create({
        userId: req.body.userId,
        category: req.body.category,
        description: req.body.description,
        status: "opened",
    })
        .then((newIncident) => {
            console.log('New incident ' + newIncident.incidentId + ', of userId' + newIncident.userId + ' has been created.');
            Events.create({
                userId: newIncident.userId,
                eventType: "Incidents",
                eventId: newIncident.incidentId
            })
                .then((newEvent) => {
                    res.status(200).send({"message": constants.usersRoute.successfulIncident, newIncident, newEvent});
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                });
        })
        .catch(err => {
            res.status(200).send({
                "message": constants.usersRoute.userNotFound,
                err
            });
        })
});

/* POST appointment user approve . */
router.post('/appointments/approve', function (req, res, next) {
    AppointmentRequests.findOne({
        where: {
            requestId: req.body.appointmentRequestId,
        },
        include: [{
            model: AppointmentDetails,
            where: {
                clientId: req.body.userId,
                appointmentId: req.body.appointmentRequestId,
            },
            required: true,
        }]
    })
        .then(appointmentsRequest => {
            appointmentsRequest.update({
                status: "approved"
            });

            ScheduledAppointments.create({
                appointmentId: appointmentsRequest.requestId,
                startDateAndTime: new Date(req.body.date + "T" + req.body.startHour),
                endDateAndTime: new Date(req.body.date + "T" + req.body.endHour),
                remarks: appointmentsRequest.notes,
                status: "set",
            })
                .then((newAppointment) => {
                    Events.create({
                        userId: appointmentsRequest.AppointmentDetail.clientId,
                        eventType: "Appointments",
                        eventId: newAppointment.appointmentId
                    })
                        .then((neEvent) => {
                            res.status(200).send({
                                "message": constants.usersRoute.successfulAppointment,
                                appointmentsRequest,
                                newAppointment,
                                neEvent
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send(err);
                        });

                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                });
        })
        .catch(err => {
            console.log(err);
            res.status(200).send({
                "message":constants.usersRoute.appointmentRequestNotFound,
                err
            });
        });

});

/* POST appointment user reject . */
router.post('/appointments/reject', function (req, res, next) {
    AppointmentRequests.findOne({
        where: {
            requestId: req.body.appointmentRequestId,
        },
        include: [{
            model: AppointmentDetails,
            where: {
                clientId: req.body.userId,
                appointmentId: req.body.appointmentRequestId,
            },
            required: true
        }]
    })
        .then(appointmentsRequest => {
            console.log(appointmentsRequest);
            appointmentsRequest.update({
                status: "rejected"
            });
            res.status(200).send({"message": constants.usersRoute.successfulRejectAppointmentRequest, appointmentsRequest});
        })
        .catch(err => {
            console.log(err);
            res.status(200).send({
                "message": constants.usersRoute.appointmentRequestNotFound,
                err
            });
        });
});

/* GET appointments of user by userId listing. */
router.get('/appointments/userId/:userId', function (req, res, next) {
    validations.checkIfUserExist(req.params.userId, res)
        .then(user => {
            if (user.dataValues) {
                if (req.query.status !== undefined) {
                    ScheduledAppointments.findAll({
                        where: {
                            status: req.query.status,
                        },
                        include: [
                            {
                                model: AppointmentDetails,
                                where: {
                                    clientId: req.params.userId,
                                },
                                required: true
                            }
                        ]
                    })
                        .then(userAppointments => {
                            console.log(userAppointments);
                            res.status(200).send(userAppointments);
                        })
                        .catch(err => {
                            res.status(500).send(err);
                        })
                }
                else {
                    ScheduledAppointments.findAll({
                        include: [
                            {
                                model: AppointmentDetails,
                                where: {
                                    clientId: req.params.userId,
                                },
                                required: true
                            }
                        ]
                    })
                        .then(userAppointments => {
                            console.log(userAppointments);
                            res.status(200).send(userAppointments);
                        })
                        .catch(err => {
                            res.status(500).send(err);
                        })
                }
            }
        })
});

/* GET incidents of user by userId listing. */
router.get('/incidents/userId/:userId', function (req, res, next) {
    validations.checkIfUserExist(req.params.userId, res)
        .then(user => {
            if (user.dataValues) {
                if (req.query.status !== undefined) {
                    Incidents.findAll({
                        where: {
                            userId: req.params.userId,
                            status: req.query.status,
                        }
                    })
                        .then(userIncidents => {
                            console.log(userIncidents);
                            res.status(200).send(userIncidents);
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send(err);
                        })
                }
                else {
                    Incidents.findAll({
                        where: {
                            userId: req.params.userId,
                        }
                    })
                        .then(userIncidents => {
                            console.log(userIncidents);
                            res.status(200).send(userIncidents);
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send(err);
                        })
                }
            }
        });
});

function createAppointmentRequestId() {
    return AppointmentRequests.max('requestId')
        .then(max => {
            return isNaN(max) ?
                1
                :
                max + 2
        })
        .catch(err => {
            console.log(err);
        })
}

function createAppointmentSetId() {
    return sequelize.query("SELECT * FROM ScheduledAppointments WHERE ( appointmentId % 2 ) == 0")
        .then(appointmentsSet => {
            let max = Math.max.apply(Math, appointmentsSet[0].map(function (o) {
                return o.appointmentId;
            }));
            if (appointmentsSet[0].length === 0)
                return 2;
            else
                return max + 2;
        })
        .catch(err => {
            console.log(err);
        })
}

function createAppointmentDetails(id, req, res) {
    return AppointmentDetails.create({
        appointmentId: id,
        clientId: req.body.userId,
        role: req.body.role,
        serviceProviderId: req.body.serviceProviderId,
        subject: req.body.subject
    })
        .then(newAppointmentDetails => {
            return newAppointmentDetails;
        })
        .catch(err => {
            return res.status(200).send({
                "message": constants.usersRoute.userNotFound,
                err
            });
        })
}

/* PUT cancel appointment of user by userId listing. */
router.put('/appointments/cancel/userId/:userId/appointmentId/:appointmentId', function (req, res, next) {
    validations.checkIfUserExist(req.params.userId, res)
        .then(user => {
            if (user.dataValues) {
                ScheduledAppointments.findOne({
                    where: {
                        appointmentId: req.params.appointmentId,
                    },
                    include: {
                        model: AppointmentDetails,
                        where: {
                            clientId: req.params.userId,
                            appointmentId: req.params.appointmentId,
                        },
                        required: true
                    }
                })
                    .then(appointment => {
                        if (appointment) {
                            if (appointment.status === "set") {
                                appointment.update({
                                    status: "canceled"
                                });
                                Events.destroy({
                                    where: {
                                        userId: req.params.userId,
                                        eventType: "Appointments",
                                        eventId: appointment.appointmentId
                                    }
                                })
                                    .then((newEvent) => {
                                        res.status(200).send({
                                            "message": constants.usersRoute.successfulCancelAppointment,
                                            appointment
                                        });
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.status(500).send(err);
                                    });
                            }
                            else {
                                appointment.status === "canceled" ?
                                    res.status(200).send({"message": constants.usersRoute.alreadyCanceledAppointment, appointment})
                                    :
                                    res.status(200).send({"message": constants.usersRoute.passedAppointment, appointment});
                            }
                        }
                        else {
                            // if (user !== null)
                            res.status(200).send({
                                "message": constants.usersRoute.appointmentNotFound,
                            });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(200).send({
                            "message": constants.usersRoute.appointmentNotFound,
                            err
                        });
                    })
            }
        })
});

/* PUT cancel incident of user by userId listing. */
router.put('/incidents/cancel/userId/:userId/incidentId/:incidentId', function (req, res, next) {
    validations.checkIfUserExist(req.params.userId, res)
        .then(user => {
            if (user.dataValues) {
                Incidents.findOne({
                    where: {
                        userId: req.params.userId,
                        incidentId: req.params.incidentId,
                    }
                })
                    .then(incident => {
                        if (incident) {
                            if (incident.status === "opened") {
                                incident.update({
                                    status: "canceled"
                                });

                                Events.destroy({
                                    where: {
                                        userId: req.params.userId,
                                        eventType: "Incidents",
                                        eventId: incident.incidentId
                                    }
                                })
                                    .then((newEvent) => {
                                        res.status(200).send({
                                            "message": constants.usersRoute.successfulCancelIncident,
                                            incident
                                        });
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.status(500).send(err);
                                    });
                            }
                            else {
                                incident.status === "canceled" ?
                                    res.status(200).send({"message": constants.usersRoute.alreadyCanceledIncident, incident})
                                    :
                                    res.status(200).send({"message": constants.usersRoute.alreadyResolvedIncident, incident});
                            }
                        }
                        else {
                            // if (user !== null)
                            res.status(200).send({
                                "message": constants.usersRoute.incidentNotFound,
                            });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(200).send({
                            "message": constants.usersRoute.incidentNotFound,
                            err
                        });
                    })
            }
        })
})

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
                            "message": constants.general.somethingWentWrong,
                            err
                        });
                    })
            }
        })
});


module.exports = router;
