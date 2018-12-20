var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {Users, AppointmentRequests, Appointments, Incidents, Events} = require('../DBorm/DBorm');

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
    AppointmentRequests.create({
        appointmentId: getAppointmentRequestId(),
        userId: req.body.userId,
        serviceProviderId: req.body.serviceProviderId,
        availableTime: req.body.availableTime,
        notes: req.body.notes,
        status: "requested",
        subject: req.body.subject
    })
        .then((newAppointmentRequest) => {
            console.log('New appointmentRequest ' + newAppointmentRequest.appointmentRequestId + ', of userId' + newAppointmentRequest.userId + ' has been created.');
            res.status(200).send({"message": "AppointmentRequest successfully added!", newAppointmentRequest});
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

/* POST appointment set of user . */
router.post('/appointments/set', function (req, res, next) {
    Appointments.create({
        appointmentId: getAppointmentSetId(),
        userId: req.body.userId,
        serviceProviderId: req.body.serviceProviderId,
        date: new Date(req.body.date),
        startHour: req.body.startHour,
        endHour: req.body.endHour,
        notes: req.body.notes,
        status: "set",
        subject: req.body.subject
    })
        .then((newAppointment) => {
            console.log('New appointmentRequest ' + newAppointment.appointmentRequestId + ', of userId' + newAppointmentRequest.userId + ' has been created.');
            Events.create({
                userId: newAppointment.userId,
                eventType: "Appointments",
                eventId: newAppointment.appointmentId
            })
                .then((newEvent) => {
                    res.status(200).send({"message": "Event successfully added!", newAppointment});
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
                    res.status(200).send({"message": "Event successfully added!", newIncident});
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

/* POST appointment user approve . */
router.post('/appointments/approve', function (req, res, next) {
    AppointmentRequests.findAll({
        where: {
            userId: req.body.userId,
            appointmentRequestId: req.body.appointmentRequestId,
        }
    })
        .then(appointmentsRequest => {
            console.log(appointmentsRequest);

            appointmentsRequest.update({
                status: "approved"
            });

            Appointments.create({
                appointmentId: appointmentsRequest.appointmentRequestId,
                userId: appointmentsRequest.userId,
                serviceProviderId: appointmentsRequest.serviceProviderId,
                date: new Date(appointmentsRequest.date),
                startHour: appointmentsRequest.startHour,
                endHour: appointmentsRequest.endHour,
                notes: appointmentsRequest.notes,
                status: "set",
                subject: appointmentsRequest.subject
            })
                .then((newAppointment) => {
                    console.log('New appointmentRequest ' + newAppointment.appointmentRequestId + ', of userId' + newAppointmentRequest.userId + ' has been created.');
                    Events.create({
                        userId: newAppointment.userId,
                        eventType: "Appointments",
                        eventId: newAppointment.appointmentId
                    })
                        .then((neEvent) => {
                            res.status(200).send({"message": "Event successfully added!", newAppointment});
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
        });
});

/* POST appointment user reject . */
router.post('/appointments/reject', function (req, res, next) {
    AppointmentRequests.findAll({
        where: {
            userId: req.body.userId,
            appointmentRequestId: req.body.appointmentRequestId,
        }
    })
        .then(appointmentsRequest => {
            console.log(appointmentsRequest);
            appointmentsRequest.update({
                status: "rejected"
            });
            res.status(200).send({"message": "AppointmentsRequest successfully rejected!", appointmentsRequest});
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
});

/* GET appointments of user by userId listing. */
router.get('/appointments/userId/:userId', function (req, res, next) {
    Appointments.findAll({
        where: {
            userId: req.params.userId,
        }
    })
        .then(userAppointments => {
            console.log(userAppointments);
            res.status(200).send(userAppointments);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

/* GET incidents of user by userId listing. */
router.get('/incidents/userId/:userId', function (req, res, next) {
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
});

function getAppointmentRequestId() {
    AppointmentRequests.max('appointmentRequestId')
        .then(max => {
            return max + 2;
        })
        .catch(err => {
            console.log(err);
        })
}

function getAppointmentSetId() {
    Sequelize.query("SELECT * from Appointment WHERE ( appointmentId % 2 ) = 0")
        .then(appointmentsSet => {
            let max = Math.max.apply(Math, appointmentsSet.map(function (o) {
                return o.appointmentId;
            }));
            return max + 2;
        })
        .catch(err => {
            console.log(err);
        })
}

/* PUT cancel appointment of user by userId listing. */
router.put('/appointments/cancel/userId/:userId/appointmentId/:appointmentId', function (req, res, next) {
    Appointments.findAll({
        where: {
            userId: req.params.userId,
            appointmentId: req.params.appointmentId,
        }
    })
        .then(appointment => {
            appointment.update({
                status: "cancelled"
            });
            res.status(200).send({"message": "Appointment cancelled successfully!", appointment});
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

/* PUT cancel incident of user by userId listing. */
router.put('/users/incidents/cancel/userId/:userId/incidentsId/:incidentsId', function (req, res, next) {
    Incidents.findAll({
        where: {
            userId: req.params.userId,
            incidentsId: req.params.incidentsId,
        }
    })
        .then(incident => {
            incident.update({
                status: "cancelled"
            });
            res.status(200).send({"message": "Incident cancelled successfully!", appointment});
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

/* GET incidents of user by userId listing. */
router.get('/userId/:userId/chores/settings', function (req, res, next) {
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
});




/* PUT cancel incident of user by userId listing. */
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
        res.status(200).send({"message": "Incident cancelled successfully!", appointment});
    })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

/* GET events of user by userId listing. */
router.get('/events/userId/:userId', function (req, res, next) {
    Events.findAll({
        where: {
            userId: req.params.userId,
        }
    })
        .then(userEvents => {
            console.log(userEvents);
            res.status(200).send(userEvents);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});


module.exports = router;
