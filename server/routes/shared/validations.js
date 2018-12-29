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
                        "message": constants.usersRoute.USER_NOT_FOUND,
                    });
                }
            })
            .catch(err => {
                return res.status(400).send({
                    "message": constants.usersRoute.USER_NOT_FOUND,
                    err
                });
            })
    },
};
