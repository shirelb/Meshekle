const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {ChoreTypes, ServiceProviders, sequelize, Users, AppointmentRequests, AppointmentDetails, ScheduledAppointments, Incidents, UsersChoresTypes, Events} = require('../../DBorm/DBorm');
var constants = require('./constants');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secureConnection: false,
    port: 587,
    auth: {
        user: 'meshekle2019@gmail.com',
        pass: 'geralemeshekle'
    }
});

module.exports = {
    createAppointmentSetId: function () {
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
    },

    createAppointmentDetails: function (id, req, res) {
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
                return res.status(400).send({
                    "message": constants.usersRoute.USER_NOT_FOUND,
                    err
                });
            })
    },

    // checkIfPasswordLegal: function (passToCheck) {
    //     return /\d/.test(passToCheck) && isNaN(passToCheck);
    // },

    generateRandomPassword: function () {
        let randomPassword = Math.random().toString(36).slice(-8);
        while (!(/\d/.test(randomPassword) && isNaN(randomPassword))) {
            randomPassword = Math.random().toString(36).slice(-8);
        }
        return randomPassword;
    },

    sendMail: function (mailToSend, subject, text) {

        var mailOptions = {
            from: 'meshekle2019@gmail.com',
            to: mailToSend,
            subject: subject,
            text: text,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

};
