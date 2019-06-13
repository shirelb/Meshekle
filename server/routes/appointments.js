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
var serviceProvidersRoute = constants.serviceProvidersRoute;


router.use(function (req, res, next) {
    authentications.verifyToken(req, res, next);
});


//////////////   user requests    ///////////////////////////////////////////////////////////////////////

/* POST appointment set of user . */
router.post('/user/set', function (req, res, next) {
    helpers.createAppointmentSetId()
        .then(appointmentSetId => {
            helpers.createAppointmentDetails(appointmentSetId, req, res)
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
                                            "message": constants.usersRoute.SUCCESSFUL_APPOINTMENT,
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

/* PUT cancel appointment of user by userId listing. */
router.put('/user/cancel/userId/:userId/appointmentId/:appointmentId', function (req, res, next) {
    validations.checkIfUserExist(req.params.userId, res)
        .then(user => {
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
                                        "message": constants.usersRoute.SUCCESSFUL_CANCEL_APPOINTMENT,
                                        appointment
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).send(err);
                                });
                        } else {
                            appointment.status === "canceled" ?
                                res.status(400).send({
                                    "message": constants.usersRoute.ALREADY_CANCELED_APPOINTMENT,
                                    appointment
                                })
                                :
                                res.status(400).send({
                                    "message": constants.usersRoute.PASSED_APPOINTMENT,
                                    appointment
                                });
                        }
                    } else {
                        res.status(400).send({
                            "message": constants.usersRoute.APPOINTMENT_NOT_FOUND,
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).send({
                        "message": constants.usersRoute.APPOINTMENT_NOT_FOUND,
                        err
                    });
                })
        })
});

/* GET appointments of user by userId listing. */
router.get('/user/userId/:userId', function (req, res, next) {
    validations.checkIfUserExist(req.params.userId, res)
        .then(user => {
            let whereClause = {};
            req.query.status ? whereClause.status = req.query.status : null;
            req.query.appointmentId ? whereClause.appointmentId = req.query.appointmentId : null;
            ScheduledAppointments.findAll({
                where: whereClause,
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
        })
});


//////////////   serviceProvider requests    ///////////////////////////////////////////////////////////////////////

// update appointment status to 'cancelled' by appointmentId .
router.put('/serviceProvider/cancel/appointmentId/:appointmentId', function (req, res, next) {
    ScheduledAppointments.update(
        {status: constants.appointmentStatuses.APPOINTMENT_CANCELLED},
        {
            where: {
                appointmentId: req.params.appointmentId
            }
        })
        .then(isUpdated => {
            if (isUpdated[0] === 0)
                return res.status(400).send({"message": serviceProvidersRoute.APPOINTMENT_NOT_FOUND});

            Events.destroy({
                where: {
                    // userId: req.body.userId,
                    eventType: "Appointments",
                    eventId: req.params.appointmentId
                }
            })
                .then((newEvent) => {
                    res.status(200).send({
                        "message": serviceProvidersRoute.APPOINTMENT_STATUS_CACELLED,
                        isUpdated,
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
});

//GET all appointments by serviceProviderId .
router.get('/serviceProvider/serviceProviderId/:serviceProviderId', function (req, res, next) {
    validations.getServiceProvidersByServProIdPromise(req.params.serviceProviderId)
        .then(serviceProviders => {
            if (serviceProviders.length === 0)
                return res.status(400).send({"message": serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND});
            let whereClause = {};
            req.query.status ? whereClause.status = req.query.status : null;
            req.query.appointmentId ? whereClause.appointmentId = req.query.appointmentId : null;
            ScheduledAppointments.findAll({
                where: whereClause,
                include: [
                    {
                        model: AppointmentDetails,
                        where: {
                            serviceProviderId: typeof req.params.serviceProviderId === 'string' ? parseInt(req.params.serviceProviderId) : req.params.serviceProviderId
                        },
                        required: true
                    }
                ]
            })
                .then(schedAppointments => {
                    console.log(schedAppointments);
                    res.status(200).send(schedAppointments);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                })
        });
});

/* POST appointment set of user . */
router.post('/serviceProvider/set', function (req, res, next) {
    helpers.createAppointmentSetId()
        .then(appointmentSetId => {
            helpers.createAppointmentDetails(appointmentSetId, req, res)
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
                                            "message": constants.usersRoute.SUCCESSFUL_APPOINTMENT,
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

// update appointment by appointmentId .
router.put('/serviceProvider/update/appointmentId/:appointmentId', function (req, res, next) {
    ScheduledAppointments.update(
        {
            startDateAndTime: req.body.startDateAndTime,
            endDateAndTime: req.body.endDateAndTime,
            remarks: req.body.remarks,
        },
        {
            where: {
                appointmentId: req.params.appointmentId
            }
        })
        .then(isUpdated => {
            if (isUpdated[0] === 0)
                return res.status(400).send({"message": serviceProvidersRoute.APPOINTMENT_NOT_FOUND});

            AppointmentDetails.update(
                {
                    role: req.body.role,
                    subject: req.body.subject,
                    clientId: req.body.clientId,
                },
                {
                    where: {
                        appointmentId: req.params.appointmentId
                    }
                })
                .then(isUpdated => {
                    res.status(200).send({
                        "message": serviceProvidersRoute.APPOINTMENT_UPDATED,
                        "result": isUpdated[0]
                    });
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


module.exports = router;
