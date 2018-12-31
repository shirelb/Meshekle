const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {ChoreTypes, sequelize, Users, AppointmentRequests, AppointmentDetails, ScheduledAppointments, Incidents, UsersChoresTypes, Events} = require('../../DBorm/DBorm');

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
                    return res.status(400).send({"message":"choreType is not exist!",err});
                })
    },

    checkIfUserExist: function (uId, res) {
        return Users.findOne({
            where: {
                userId: uId,
            }
        })
            .then(user => {
                if (user) {
                    return user;
                }
                else {
                    return res.status(400).send({
                        "message": "userId doesn't exist!",
                    });
                }
            })
            .catch(err => {
                return res.status(400).send({
                    "message": "user is not exist...",
                    err
                });
            })
    },
};
