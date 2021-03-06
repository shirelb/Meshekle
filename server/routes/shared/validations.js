const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {ChoreTypes, ServiceProviders, sequelize, Users, Announcements, AnnouncementSubscriptions, ScheduledAppointments,  UsersChores,  Categories} = require('../../DBorm/DBorm');
var constants = require('./constants');

module.exports = {
    checkIfChoreTypeExist: function (typeName, res) {
        return ChoreTypes.findOne({
            where: {
                choreTypeName: typeName
            }
        })
            .then(choreType => {
                return choreType;
            })
            .catch(err => {
                return res.status(400).send({"message": "choreType is not exist", err});
            })
    },

    checkIfUserChoreExist: function (choreId, res) {
        return UsersChores.findOne({
            where: {
                userChoreId: choreId
            }
        })
            .then(chore => {
                return chore;
            })
            .catch(err => {
                return res.status(400).send({"message": "chore is not exist", err});
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
                    if (user.dataValues)
                        return user;
                    else
                        return res.status(400).send({
                            "message": constants.usersRoute.USER_NOT_FOUND,
                        });
                } else {
                    return res.status(400).send({
                        "message": constants.usersRoute.USER_NOT_FOUND,
                    });
                }
            })
            .catch(err => {
                res.status(400).send({
                    "message": constants.usersRoute.USER_NOT_FOUND,
                    err
                });
            })
    },

    getUsersByUserIdPromise: function (userId) {
        return Users.findAll({
            where: {
                userId: userId
            }
        })
    },
    getServiceProvidersByServProIdPromise: function (serviceProviderId) {
        return ServiceProviders.findAll({
            where: {
                serviceProviderId: serviceProviderId
            }
        })
    },
    getAnnouncementByAnnounceIdPromise: function (announcementId) {
        return Announcements.findAll({
            where: {
                announcementId: announcementId
            }
        })
    },
    getCategoryByCategoryIdPromise: function (categoryId) {
        return Categories.findAll({
            where: {
                categoryId: categoryId
            }
        })
    },
    getServiceProvidersByServiceProviderIdsPromise: function (serviceProvidersIds) {
        return ServiceProviders.findAll({
            where: {
                serviceProviderId: {
                    [Op.in]: serviceProvidersIds
                },
            }
        })
    },
    getCategoriesPromise: function () {
        return Categories.findAll({})
    },
    getSchedAppointmentByIdPromise: function (appointmentId) {
        return ScheduledAppointments.findAll({
            where: {
                appointmentId: appointmentId
            }
        })
    },
    getSubsByCategoryIdPromise: function (categoryId) {
        return AnnouncementSubscriptions.findAll({
            where: {
                categoryId: categoryId
            }
        })
    },
};
