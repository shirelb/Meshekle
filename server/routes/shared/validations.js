const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {ChoreTypes, sequelize, Users, AppointmentRequests, AppointmentDetails, ScheduledAppointments, Incidents, UsersChoresTypes, Events} = require('../../DBorm/DBorm');

module.exports = {
    checkIfChoreTypeExist: function (choreTypeName, res){
             return ChoreTypes.findOne({
                            where: {
                                choreTypeName: choreTypeName
                            }
                        })
                .then(choreType => {
                    return choreType;
                    // if (choreType){
                    //     return choreType;
                    // }
                    // else{
                    //     return res.status(200).send({
                    //         "message": "choreType doesn't exist!",
                    //     });
                    // }
                })
                .catch(err => {
                    console.log(err)
                    return res.status(500).send("Something went wrong"+ err);
                })
    },

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
