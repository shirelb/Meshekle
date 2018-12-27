const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {sequelize, Users, AppointmentRequests, AppointmentDetails, ScheduledAppointments, Incidents, UsersChoresTypes, Events} = require('../../DBorm/DBorm');

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
                    return res.status(500).send({
                        "message": "userId doesn't exist!",
                    });
                }
            })
            .catch(err => {
                return res.status(500).send({
                    "message": "userId doesn't exist!",
                    err
                });
            })
    },
};
