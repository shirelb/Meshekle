const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {sequelize, Users, AppointmentRequests, AppointmentDetails, ScheduledAppointments, Incidents, UsersChoresTypes, Events} = require('../../DBorm/DBorm');
var constants = require('./constants');

module.exports = {
    checkIfUserExist: function (userId, res) {
        return Users.findOne({
            where: {
                userId: userId,
            }
        })
            .then(user => {
                if (user) {
                    return user;
                }
                else {
                    return res.status(200).send({
                        "message": constants.usersRoute.userNotFound,
                    });
                }
            })
            .catch(err => {
                return res.status(500).send({
                    "message": constants.usersRoute.userNotFound,
                    err
                });
            })
    },
};
