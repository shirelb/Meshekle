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


router.use(function (req, res, next) {
    authentications.verifyToken(req, res, next);
});


/* PUT cancel incident of user by userId listing. */
router.put('/user/cancel/userId/:userId/incidentId/:incidentId', function (req, res, next) {
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
                                            "message": constants.usersRoute.SUCCESSFUL_CANCEL_INCIDENT,
                                            incident
                                        });
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.status(500).send(err);
                                    });
                            } else {
                                incident.status === "canceled" ?
                                    res.status(400).send({
                                        "message": constants.usersRoute.ALREADY_CANCELED_INCIDENT,
                                        incident
                                    })
                                    :
                                    res.status(400).send({
                                        "message": constants.usersRoute.ALREADY_RESOLVED_INCIDENT,
                                        incident
                                    });
                            }
                        } else {
                            // if (user !== null)
                            res.status(400).send({
                                "message": constants.usersRoute.INCIDENT_NOT_FOUND,
                            });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(400).send({
                            "message": constants.usersRoute.INCIDENT_NOT_FOUND,
                            err
                        });
                    })
            }
        })
});

/* POST incident of user . */
router.post('/user/open', function (req, res, next) {
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
                    res.status(200).send({"message": constants.usersRoute.SUCCESSFUL_INCIDENT, newIncident, newEvent});
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                });
        })
        .catch(err => {
            res.status(400).send({
                "message": constants.usersRoute.USER_NOT_FOUND,
                err
            });
        })
});

/* GET incidents of user by userId listing. */
router.get('/user/userId/:userId', function (req, res, next) {
    validations.checkIfUserExist(req.params.userId, res)
        .then(user => {
            if (user.dataValues) {
                let whereClause = {};
                whereClause.userId = req.params.userId;
                req.query.status ? whereClause.status = req.query.status : null;
                req.query.incidentId ? whereClause.incidentId = req.query.incidentId : null;
                Incidents.findAll({
                    where: whereClause
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
        });
});


module.exports = router;
