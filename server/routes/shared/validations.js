const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {ChoreTypes,ServiceProviders, sequelize, Users, AppointmentRequests, AppointmentDetails, ScheduledAppointments, Incidents, UsersChoresTypes, Events} = require('../../DBorm/DBorm');
var constants = require('./constants');

module.exports = {
    checkIfChoreTypeExist: function (typeName, res){
             return ChoreTypes.findOne({
                            where: {
                                choreTypeName: typeName
                            }
                        })
                .then(choreType => {
                    return choreType;
                    // if (choreType){
                    //     return choreType;
                    // }
                    // else{
                    //     return res.status(400).send({
                    //         "message": "choreType doesn't exist!",
                    //     });
                    // }
                })
                .catch(err => {
                    return res.status(400).send({"message":"choreType is not exist",err});
                })
    },

    checkIfUserExist: function (uId, res) {
        return Users.findOne({
            where: {
                userId: userId,
                active: true,
            }
        })
            .then(user => {
                if (user.dataValues) {
                    return user;
                }
                else {
                    return res.status(400).send({
                        //"message": "userId doesn't exist!",
                        "message": constants.usersRoute.userNotFound,
                    });
                }
            })
            .catch(err => {
                return res.status(500).send({
                    // "message": "userId doesn't exist!", err
                    "message": constants.usersRoute.userNotFound,
                    err
                });
            })
    },

    getUsersByUserIdPromise: function(userId) {
        return Users.findAll({
            where: {
                userId: userId
            }
        })
    },
    getServiceProvidersByServProIdPromise: function(serviceProviderId) {
        return ServiceProviders.findAll({
            where: {
                serviceProviderId: serviceProviderId
            }
        })
    },
    getSchedAppointmentByIdPromise: function(appointmentId) {
        return ScheduledAppointments.findAll({
            where: {
                appointmentId: appointmentId
            }
        })
    },
};
