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

/* POST appointment request of user . */
router.post('/user/request', function (req, res, next) {
    createAppointmentRequestId()
        .then(appointmentRequestId => {
            helpers.createAppointmentDetails(appointmentRequestId, req, res)
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
                                    "message": constants.usersRoute.SUCCESSFUL_APPOINTMENT_REQUEST,
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

/* GET all appointment requests of user . */
router.get('/user/userId/:userId', function (req, res, next) {
    validations.checkIfUserExist(req.params.userId, res)
        .then(user => {
            if (user.dataValues) {
                let whereClause = {};
                req.query.status ? whereClause.status = req.query.status : null;
                req.query.appointmentRequestId ? whereClause.requestId = req.query.appointmentRequestId : null;
                AppointmentRequests.findAll({
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
            }
        })
});

/* POST appointment requests user approve . */
router.put('/user/approve', function (req, res, next) {
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
                                "message": constants.usersRoute.SUCCESSFUL_APPOINTMENT,
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
            res.status(400).send({
                "message": constants.usersRoute.APPOINTMENT_REQUEST_NOT_FOUND,
                err
            });
        });
});

/* POST appointment requests user reject . */
router.put('/user/reject', function (req, res, next) {
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
            res.status(200).send({
                "message": constants.usersRoute.SUCCESSFUL_REJECT_APPOINTMENT_REQUEST,
                appointmentsRequest
            });
        })
        .catch(err => {
            console.log(err);
            res.status(400).send({
                "message": constants.usersRoute.APPOINTMENT_REQUEST_NOT_FOUND,
                err
            });
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


//////////////   serviceProvider requests    ///////////////////////////////////////////////////////////////////////

/* GET all appointment requests of user . */
router.get('/serviceProvider/serviceProviderId/:serviceProviderId', function (req, res, next) {
    validations.getServiceProvidersByServProIdPromise(req.params.serviceProviderId)
        .then(serviceProviders => {
            if (serviceProviders.length === 0)
                return res.status(400).send({"message": serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND});
            let whereClause = {};
            req.query.status ? whereClause.status = req.query.status : null;
            req.query.appointmentRequestId ? whereClause.requestId = req.query.appointmentRequestId : null;
            AppointmentRequests.findAll({
                where: whereClause,
                include: [
                    {
                        model: AppointmentDetails,
                        where: {
                            serviceProviderId: typeof req.params.serviceProviderId==='string'? parseInt(req.params.serviceProviderId):req.params.serviceProviderId
                        },
                        required: true
                    }
                ]
            })
                .then(appointmentsRequests => {
                    console.log(appointmentsRequests);
                    res.status(200).send(appointmentsRequests);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                })
        });
});

// update appointmentRequest status to 'approved'/'rejected' by appointmentRequestId .
router.put('/serviceProvider/update/status/appointmentRequestId/:appointmentRequestId', function (req, res, next) {
    AppointmentRequests.update(
        {
            // status: constants.appointmentRequestStatusesMapper(req.query.status)
            status: req.query.status
        },
        {
            where: {
                requestId: typeof req.params.appointmentRequestId === 'string' ? parseInt(req.params.appointmentRequestId) : req.params.appointmentRequestId
            }
        })
        .then(isUpdated => {
            if (isUpdated[0] === 0)
                return res.status(400).send({"message": serviceProvidersRoute.APPOINTMENT_NOT_FOUND});
            res.status(200).send({
                "message": serviceProvidersRoute.APPOINTMENT_STATUS_CACELLED,
                "result": isUpdated[0]
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});


module.exports = router;
