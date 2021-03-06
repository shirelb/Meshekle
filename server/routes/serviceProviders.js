var authentications = require('./shared/authentications');
var validations = require('./shared/validations');
var helpers = require('./shared/helpers');
var constants = require('./shared/constants');
var serviceProvidersRoute = constants.serviceProvidersRoute;
var express = require('express');
var moment = require('moment');
var router = express.Router();

const Sequelize = require('sequelize');
const {ServiceProviders, Users, RolesModules, Categories} = require('../DBorm/DBorm');
const Op = Sequelize.Op;

var sha512 = require('js-sha512');


var serviceProviderRolesMapper = function (value) {
    switch (value) {
        case "Admin":
            return "מנהלה";
        case "PhoneBookSecretary":
            return "מזכירות ספר טלפונים";
        case "ChoresSecretary":
            return "מזכירות תורנויות";
        case "AnnouncementsSecretary":
            return "מזכירות לוח מודעות";
        case "appointmentsHairDresser":
            return "מספרה";
        case "appointmentsDentist":
            return "מרפאת שיניים";
        default:
            return value;
    }
};

//Login from service provider by userId and password
router.post('/login/authenticate', function (req, res, next) {
    Users.findAll({
        where: {
            userId: req.body.userId,
            password: req.body.password,
        }
    })
        .then(users => {
            if (users.length === 0)
                return res.status(400).send({
                    "result": false,
                    "message": serviceProvidersRoute.AUTHENTICATION_FAIL,
                    "serviceProviderId": ""
                });
            else {
                ServiceProviders.findAll({
                    where: {
                        userId: users[0].userId
                    }
                }).then(serviceProviders => {
                    if (serviceProviders.length === 0)
                        return res.status(400).send({
                            "result": false,
                            "message": serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND,
                            "serviceProviderId": ""
                        });
                    else {
                        let payload = {
                            serviceProviderId: serviceProviders[0].serviceProviderId,
                            userId: serviceProviders[0].userId
                        };
                        authentications.sendToken(payload, res);
                    }
                })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send(err);
                    })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

router.use(function (req, res, next) {
    authentications.verifyToken(req, res, next);
});

router.post('/validToken', function (req, res) {
    res.status(200).send({
        message: constants.usersRoute.VALID_TOKEN,
        payload: req.decoded.payload
    });
});

// GET all serviceProviders .
router.get('/', function (req, res, next) {
    ServiceProviders.findAll()
        .then(serviceProviders => {
            console.log(serviceProviders);
            res.status(200).send(serviceProviders);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

//Get service providers by serviceProviderId
router.get('/serviceProviderId/:serviceProviderId', function (req, res, next) {
    validations.getServiceProvidersByServProIdPromise(req.params.serviceProviderId)
        .then(serviceProviders => {
            if (serviceProviders.length === 0) {
                return res.status(400).send({message: serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND});
            }
            console.log(serviceProviders);
            res.status(200).send(serviceProviders);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

//Get service providers user details by serviceProviderId
router.get('/userDetails/serviceProviderId/:serviceProviderId', function (req, res, next) {
    validations.getServiceProvidersByServProIdPromise(req.params.serviceProviderId)
        .then(serviceProvider => {
            if (serviceProvider.length === 0) {
                return res.status(400).send({message: serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND});
            }
            console.log(serviceProvider);
            Users.findOne({
                where: {
                    userId: serviceProvider[0].userId
                }
            })
                .then(user => {
                    res.status(200).send(user);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});


//GET serviceProviders by full name
router.get('/name/:name', function (req, res, next) {
    Users.findAll({
        attributes: ['userId'],
        where: {
            fullname: req.params.name
        }
    })
        .then((ids) => {
            if (ids.length === 0) {
                return res.status(400).send({"message": serviceProvidersRoute.USER_NOT_FOUND});
            }
            const idsList = ids.map((id) => id.dataValues.userId);
            console.log(ids);
            ServiceProviders.findAll({
                where: {
                    userId: {
                        [Op.in]: idsList
                    }
                }
            })
                .then(serviceProviders => {
                    if (serviceProviders.length === 0) {
                        return res.status(400).send({"message": serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND});
                    }
                    console.log(serviceProviders);
                    res.status(200).send(serviceProviders);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                })
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err);
        })
});


//Get service providers by role
router.get('/role/:role', function (req, res, next) {
    ServiceProviders.findAll({
        where: {
            role: req.params.role
        }
    })
        .then(serviceProviders => {
            if (serviceProviders.length === 0) {
                return res.status(400).send({message: serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND});
            }
            console.log(serviceProviders);
            res.status(200).send(serviceProviders);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

// GET appointmentWayType by serviceProvidersId and role
router.get('/serviceProviderId/:serviceProviderId/role/:role/appointmentWayType', function (req, res, next) {
    ServiceProviders.findAll({
        attributes: ['appointmentWayType'],
        where: {
            serviceProviderId: req.params.serviceProviderId,
            role: req.params.role,
        }
    })
        .then(serviceProviders => {
            if (serviceProviders.length === 0) {
                return res.status(400).send({message: serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND});
            }
            console.log(serviceProviders);
            res.status(200).send(serviceProviders);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

// update serviceProvider by serviceProviderId and role.
router.put('/update/serviceProviderId/:serviceProviderId/role/:role', function (req, res, next) {
    validations.getServiceProvidersByServProIdPromise(req.params.serviceProviderId)
        .then(response => {
            if (response.length === 0)
                return res.status(400).send({"message": serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND});


            if (!isRoleExists(req.params.role)) {
                return res.status(400).send({"message": serviceProvidersRoute.INVALID_ROLE_INPUT});
            }
            let updateFields = {};
            req.body.operationTime ? updateFields.operationTime = req.body.operationTime : null;
            req.body.phoneNumber ? updateFields.phoneNumber = req.body.phoneNumber : null;
            req.body.appointmentWayType ? updateFields.appointmentWayType = req.body.appointmentWayType : null;
            if (req.body.appointmentWayType)
                if (!isAppWayTypeExists(req.body.appointmentWayType))
                    return res.status(400).send({"message": serviceProvidersRoute.INVALID_APP_WAY_TYPE_INPUT});

            req.body.subjects ? updateFields.subjects = req.body.subjects : null;
            typeof req.body.active === 'boolean' ? updateFields.active = req.body.active : null;

            ServiceProviders.update(
                updateFields,
                {
                    where: {
                        serviceProviderId: req.params.serviceProviderId,
                        role: req.params.role
                    }
                })
                .then(isUpdated => {
                    if (isUpdated[0] === 0)
                        return res.status(400).send({"message": serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND});
                    res.status(200).send({
                        "message": serviceProvidersRoute.SERVICE_PROVIDER_UPDATE_SUCCESS,
                        "result": isUpdated[0]
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

//Add serviceProvider
router.post('/add', function (req, res, next) {
    let isInputValid = isServiceProviderInputValid(req.body);
    if (isInputValid !== '')
        return res.status(400).send({"message": isInputValid});
    validations.getUsersByUserIdPromise(req.body.userId).then(users => {
        if (users.length === 0)
            return res.status(400).send({"message": serviceProvidersRoute.USER_NOT_FOUND});
        validations.getServiceProvidersByServProIdPromise(req.body.serviceProviderId)
            .then(serviceProviders => {
                if (serviceProviders.length !== 0) {
                    serviceProviders.forEach(provider => {
                        if (provider.dataValues.role === req.body.role)
                            return res.status(400).send({"message": serviceProvidersRoute.SERVICE_PROVIDER_ALREADY_EXISTS});
                    });
                }
                ServiceProviders.create({
                    serviceProviderId: req.body.serviceProviderId,
                    role: req.body.role,
                    userId: req.body.userId,
                    operationTime: req.body.operationTime ? req.body.operationTime : null,
                    phoneNumber: req.body.phoneNumber,
                    appointmentWayType: req.body.appointmentWayType ? req.body.appointmentWayType : null,
                    subjects: req.body.subjects ? req.body.subjects : null,
                    active: req.body.active === null ? false : req.body.active,
                })
                    .then(newServiceProvider => {
                        Categories.create({
                            categoryName: serviceProviderRolesMapper(req.body.role),
                            serviceProviderId: req.body.serviceProviderId
                        }).then(() => {
                            res.status(200).send({
                                "message": serviceProvidersRoute.SERVICE_PROVIDER_ADDED_SUCC,
                                "result": newServiceProvider.dataValues
                            });
                            validations.getUsersByUserIdPromise(newServiceProvider.userId)
                                .then(users => {
                                    helpers.sendMail(users[0].email, constants.mailMessages.ADD_SERVICE_PROVIDER_SUBJECT,
                                        "שלום " + users[0].fullname + ",\n" + constants.mailMessages.BEFORE_ROLE + "\n תחום אחריותך החדש: " + serviceProviderRolesMapper(newServiceProvider.role) + "\n" + constants.mailMessages.MAIL_END);
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).send(err);
                                })
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send(err);
                        })

                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send(err);
                    })
            });
    })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});


// add role to a service provider
router.put('/roles/addToServiceProvider', function (req, res, next) {
    if (!isRoleExists(req.body.role))
        return res.status(400).send({"message": serviceProvidersRoute.INVALID_ROLE_INPUT});
    validations.getServiceProvidersByServProIdPromise(req.body.serviceProviderId)
        .then(serviceProviders => {
            if (serviceProviders.length === 0) {
                return res.status(400).send({message: serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND});
            }
            let rolesOfServiceProvider = serviceProviders.map(serProv => serProv.role);
            if (rolesOfServiceProvider.includes(req.body.role))
                return res.status(400).send({message: serviceProvidersRoute.SERVICE_PROVIDER_ALREADY_EXISTS});

            const serProv = serviceProviders[0];
            ServiceProviders.create(
                {
                    serviceProviderId: serProv.serviceProviderId,
                    role: req.body.role,
                    userId: serProv.userId,
                    operationTime: req.body.operationTime,
                    phoneNumber: serProv.phoneNumber,
                    appointmentWayType: serProv.appointmentWayType,
                    subjects: serProv.subjects,
                }
            ).then(updateServiceProvider => {
                res.status(200).send({
                    "message": serviceProvidersRoute.SERVICE_PROVIDER_ROLE_ADDED_SUCC,
                    "result": updateServiceProvider.dataValues
                });
                validations.getUsersByUserIdPromise(updateServiceProvider.userId)
                    .then(users => {
                        helpers.sendMail(users[0].email, constants.mailMessages.ADD_SERVICE_PROVIDER_SUBJECT,
                            "שלום " + users[0].fullname + ",\n" + constants.mailMessages.BEFORE_ROLE + "\n תחום אחריותך החדש: " + serviceProviderRolesMapper(updateServiceProvider.role) + "\n" + constants.mailMessages.MAIL_END);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send(err);
                    })
            })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});


// DELETE role to a service providers.
router.put('/roles/removeFromServiceProvider', function (req, res, next) {
    if (!isRoleExists(req.body.role))
        return res.status(400).send({"message": serviceProvidersRoute.INVALID_ROLE_INPUT});
    ServiceProviders.destroy(
        {
            where: {
                serviceProviderId: parseInt(req.body.serviceProviderId),
                role: req.body.role
            }
        })
        .then(numOfDeletes => {
            if (numOfDeletes === 0) {
                return res.status(400).send({"message": serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND});
            }
            res.status(200).send({
                "message": serviceProvidersRoute.SERVICE_PROVIDER_ROLE_DEL_SUCC,
                "result": numOfDeletes
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});


// DELETE a service provider by userId
router.delete('/userId/:userId/delete', function (req, res, next) {
    ServiceProviders.destroy(
        {
            where: {
                userId: req.params.userId
            }
        })
        .then(numOfDeletes => {
            if (numOfDeletes === 0) {
                return res.status(400).send({"message": serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND});
            }
            res.status(200).send({"message": serviceProvidersRoute.SERVICE_PROVIDER_DEL_SUCC, "result": numOfDeletes});
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});


//Add user
router.post('/users/add', function (req, res, next) {
    let isInputValid = isUserInputValid(req.body);
    if (isInputValid !== '')
        return res.status(400).send({"message": isInputValid});
    validations.getUsersByUserIdPromise(req.body.userId)
        .then(users => {
            if (users.length !== 0)
                return res.status(400).send({"message": constants.serviceProvidersRoute.USER_ALREADY_EXISTS});
            const randomPassword = helpers.generateRandomPassword();
            let hash = sha512.update(randomPassword);
            Users.create({
                userId: req.body.userId,
                fullname: req.body.fullname,
                password: hash.hex(),
                email: req.body.email,
                mailbox: req.body.mailbox,
                cellphone: req.body.cellphone,
                phone: req.body.phone,
                bornDate: req.body.bornDate,
                image: req.body.image,
            })
                .then(newUser => {
                    res.status(200).send({
                        "message": serviceProvidersRoute.USER_ADDED_SUCC,
                        "result": {"userId": newUser.userId, "password": randomPassword}
                    });
                    helpers.sendMail(newUser.email, constants.mailMessages.ADD_USER_SUBJECT,
                        "שלום " + newUser.fullname + ",\n" + constants.mailMessages.BEFORE_CRED + "\n שם המשתמש שלך: :\n" + "\n" + newUser.userId + "\nהסיסמא שלך: :\n" + "\n" + randomPassword + "\n" + constants.mailMessages.REMINDER_END + "\n" + constants.mailMessages.MAIL_END);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

// update user by userId.
router.put('/users/renewPassword/userId/:userId', function (req, res, next) {
    validations.checkIfUserExist(req.params.userId, res)
        .then(user => {
            let newPassword = helpers.generateRandomPassword();
            let hash = sha512.update(newPassword);

            Users.findOne(
                {
                    where: {
                        userId: req.params.userId
                    }
                })
                .then(user => {
                    // user.dataValues.password = newPassword;
                    user.update({
                        password: hash.hex()
                    })
                        .then(updatedUser => {
                            res.status(200).send({
                                "message": constants.usersRoute.USER_UPDATE_SUCCESS,
                                "result": updatedUser.dataValues
                            });
                            helpers.sendMail(updatedUser.email, constants.mailMessages.ADD_USER_SUBJECT,
                                "שלום " + updatedUser.fullname + ",\n" + constants.mailMessages.BEFORE_CRED + "\n שם המשתמש שלך: :\n" + "\n" + updatedUser.userId + "\nהסיסמא החדשה שלך::\n " + "\n" + newPassword + "\n" + constants.mailMessages.REMINDER_END + "\n" + constants.mailMessages.MAIL_END);
                        })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                })
        });
});

// DELETE a user by userId
router.delete('/users/userId/:userId/delete', function (req, res, next) {
    validations.checkIfUserExist(req.params.userId, res)
        .then(user => {
            Users.destroy(
                {
                    where: {
                        userId: req.params.userId
                    }
                })
                .then(numOfDeletes => {
                    if (numOfDeletes === 0) {
                        return res.status(400).send({"message": serviceProvidersRoute.USER_NOT_FOUND});
                    }
                    res.status(200).send({"message": serviceProvidersRoute.USER_DEL_SUCC, "result": numOfDeletes});
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                })
        });
});

// GET operation time of service provider with role.
router.get('/serviceProviderId/:serviceProviderId/role/:role/operationTime', function (req, res, next) {
    if (!isRoleExists(req.params.role))
        return res.status(400).send({"message": serviceProvidersRoute.INVALID_ROLE_INPUT});
    ServiceProviders.findAll({
        where: {
            serviceProviderId: req.params.serviceProviderId,
            role: req.params.role
        }
    })
        .then(serviceProviders => {
            if (serviceProviders.length === 0) {
                return res.status(400).send({message: serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND});
            }
            res.status(200).send({result: serviceProviders[0].dataValues.operationTime});
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

// GET roles of service provider by service provider id. */
router.get('/roles/serviceProviderId/:serviceProviderId', function (req, res, next) {

    ServiceProviders.findAll({
        attributes: ['role'],
        where: {
            serviceProviderId: req.params.serviceProviderId,
        }
    })
        .then(roles => {
            if (roles.length === 0)
                return res.status(400).send({"message": serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND});
            console.log(roles);
            res.status(200).send(roles.map(role => role.role));
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

/* GET permissions of service provider by service provider id. */
router.get('/serviceProviderId/:serviceProviderId/permissions', function (req, res, next) {
    ServiceProviders.findAll({
        attributes: ['role'],
        where: {
            serviceProviderId: req.params.serviceProviderId,
        }
    })
        .then(roles => {
            if (roles.length === 0)
                return res.status(400).send({"message": serviceProvidersRoute.SERVICE_PROVIDER_NOT_FOUND});
            const rolesList = roles.map(role => role.dataValues.role);
            RolesModules.findAll({
                attributes: ['module'],
                where: {
                    role: {
                        [Op.in]: rolesList
                    }
                }
            })
                .then(modules => {
                    const moduleList = modules.map(module => module.dataValues.module);
                    console.log(moduleList);
                    res.status(200).send(moduleList);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});


let takeValues = (dic) => {
    return Object.keys(dic).map(function (key) {
        return dic[key];
    });
};


function isServiceProviderInputValid(serviceProviderInput) {
    if (serviceProviderInput.appointmentWayType)
        if (!isAppWayTypeExists(serviceProviderInput.appointmentWayType))
            return serviceProvidersRoute.INVALID_APP_WAY_TYPE_INPUT;
    if (!isRoleExists(serviceProviderInput.role))
        return serviceProvidersRoute.INVALID_ROLE_INPUT;
    if (serviceProviderInput.phoneNumber.match(/^[0-9]+$/) === null || serviceProviderInput.phoneNumber.length < 9 || serviceProviderInput.phoneNumber.length > 10)
        return serviceProvidersRoute.INVALID_PHONE_INPUT;

    return '';
}

function isUserInputValid(userInput) {
    if (!validateEmail(userInput.email))
        return serviceProvidersRoute.INVALID_EMAIL_INPUT;
    if (!validateBornDate(userInput.bornDate))
        return serviceProvidersRoute.INVALID_BORN_DATE_INPUT;
    if (isNaN(userInput.mailbox))
        return serviceProvidersRoute.INVALID_MAIL_BOX_INPUT;
    if (userInput.phone)
        if (userInput.phone.match(/^[0-9]+$/) === null)
            return serviceProvidersRoute.INVALID_PHONE_INPUT;
    if (userInput.cellphone.match(/^[0-9]+$/) === null)
        return serviceProvidersRoute.INVALID_PHONE_INPUT;
    return '';
}


function isRoleExists(roleToCheck) {
    let roles = takeValues(constants.roles);
    return roles.includes(roleToCheck)
}

function isAppWayTypeExists(wayType) {
    let appWayTypes = takeValues(constants.appointmentWayTypes);
    return appWayTypes.includes(wayType)
}

function validateEmail(email) {
    var re = /^[^@]+@[^@]+\.[^@]+$/;
    return re.test(String(email).toLowerCase());
}

function validateBornDate(bornDateString) {
    let splitted = moment(bornDateString).format("YYYY-MM-DD").split('-');
    if (splitted.length !== 3)
        return false;
    if (splitted[0].length !== 4 && splitted[0].match(/^[0-9]+$/) === null)
        return false;
    if (splitted[1].length !== 2 && splitted[1].match(/^[0-9]+$/) === null)
        return false;
    if (splitted[2].length !== 2 && splitted[2].match(/^[0-9]+$/) === null)
        return false;
    let today = new Date();
    let bornDate = new Date(bornDateString);

    return bornDate < today
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


module.exports = router;
