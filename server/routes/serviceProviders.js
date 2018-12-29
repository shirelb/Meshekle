const Sequelize = require('sequelize');
var express = require('express');
var router = express.Router();
const {ServiceProviders,Users,ScheduledAppointments, AppointmentDetails,RulesModules,Permissions} = require('../DBorm/DBorm');
const Op = Sequelize.Op;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var constants = require('./shared/constants');

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
                res.status(200).send({"result":false, "message": "Wrong user id or password", "serviceProviderId": ""});
            else {
                ServiceProviders.findAll({
                    where: {
                        userId: users[0].userId
                    }
                }).then(serviceProviders => {
                    if (serviceProviders.length === 0)
                        res.status(200).send({"result":false, "message": "Wrong user id or password", "serviceProviderId": ""});
                    else
                        sendToken(serviceProviders[0],res);
                        // res.status(200).send({"result":true, "message": "Login successful", "serviceProviderId": serviceProviders[0].serviceProviderId
                        // });
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


function sendToken(serProv, res) {
    var payload = {
        serviceProviderId: serProv.serviceProviderId,
        userId: serProv.userId
    };

    var token = jwt.sign(payload, constants.superSecret, {
        expiresIn: "10h" // expires in 10 hours
    });

    // return the information including token as JSON
    res.status(200).send({
        success: true,
        message: 'Token generated successfully !',
        token: token
    });
}

/*router.use(function (req, res, next) {
    console.log("in route middleware to verify a token");

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;

    token.startsWith("Bearer ") ? token = token.substring(7, token.length) : token;

    console.log("token: " + token);

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, constants.superSecret, function (err, decoded) {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token.',err});
            } else {
                // if everything is good, save to request for use in other routes
                // get the decoded payload and header
                var decoded = jwt.decode(token, {complete: true});
                req.decoded = decoded;
                console.log(decoded.header);
                console.log(decoded.payload);
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});
*/

// GET all serviceProviders .
router.get('/', function(req, res, next) {
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

//GET serviceProviders by full name
router.get('/name/:name', function(req, res, next) {
    Users.findAll({
        attributes: ['userId'],
        where: {
            fullname: req.params.name
        }
    })
    .then((ids) => {
            const idsList = ids.map((id) => id.dataValues.userId);
            console.log(ids);
            ServiceProviders.findAll({
                where: {
                    userId:{
                        [Op.in]: idsList
                    }
                }
            })
                .then(serviceProviders => {
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
router.get('/role/:role', function(req, res, next) {
    ServiceProviders.findAll({
        where: {
            role: req.params.role
        }
    })
        .then(serviceProviders => {
            console.log(serviceProviders);
            res.status(200).send(serviceProviders);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

// GET appointmentWayType by serviceProvidersId
router.get('/serviceProviderId/:serviceProviderId/appointmentWayType', function(req, res, next) {
    ServiceProviders.findAll({
        attributes: ['appointmentWayType'],
        where: {
            serviceProviderId: req.params.serviceProviderId
        }
    })
        .then(serviceProviders => {
            console.log(serviceProviders);
            res.status(200).send(serviceProviders);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

// update the appointment way of service provider
router.put('/serviceProviderId/:serviceProviderId/appointmentWayType/set', function (req, res, next) {
    ServiceProviders.update(
        {appointmentWayType: req.body.appointmentWayType},
        {where : {
            serviceProviderId: req.params.serviceProviderId
            }
    })
        .then(result => {
            res.status(200).send({"message": "User successfully updated!","result":result[0]});
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

//Add serviceProvider
router.post('/add', function (req, res, next) {
    ServiceProviders.create({
        serviceProviderId: req.body.serviceProviderId,
        role: req.body.role,
        userId: req.body.userId,
        operationTime: req.body.operationTime,
        phoneNumber: req.body.phoneNumber,
        appointmentWayType: req.body.appointmentWayType,
    })
        .then(result => {
            res.status(200).send({"message": "ServiceProvider successfully added!","newServiceProvider":result.dataValues});
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

// put role to a service provider
router.put('/roles/addToServiceProvider', function (req, res, next) {
    ServiceProviders.findAll(
        {where : {
                serviceProviderId: req.body.serviceProviderId
            }
        })
        .then(serviceProvider => {
            const serProv = serviceProvider[0];
            ServiceProviders.create(
                {
                     serviceProviderId: serProv.serviceProviderId,
                    role: req.body.role,
                    userId: serProv.userId,
                    operationTime: req.body.operationTime,
                    phoneNumber: serProv.phoneNumber,
                    appointmentWayType: serProv.appointmentWayType,
                }
            ).then(result => {
                    res.status(200).send({"message": "ServiceProvider role successfully added!","newServiceProvider":result.dataValues});
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
    ServiceProviders.destroy(
        {where : {
                serviceProviderId: req.body.serviceProviderId,
                role:req.body.role
            }
        })
        .then(result => {
            res.status(200).send({"message": "Role successfully deleted!","result":result});
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});



// DELETE a service provider by userId
router.delete('/userId/:userId/delete', function (req, res, next) {
    ServiceProviders.destroy(
        {where : {
                userId: req.params.userId
            }
        })
        .then(result => {
            res.status(200).send({"message": "serviceProviders successfully deleted!","result":result});
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});



//Add user
router.post('/users/add', function (req, res, next) {
    const randomPassword=genereateRandomPassword();
    Users.create({
        userId: req.body.userId,
        fullname: req.body.fullname,
        password: randomPassword,
        email: req.body.email,
        mailbox: req.body.mailbox,
        mobile: req.body.mobile,
        phone: req.body.phone,
        bornDate: req.body.bornDate,

    })
        .then(result => {
            res.status(200).send({"message": "User successfully added!","userId":result.userId,"password":randomPassword});
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

// DELETE a user by userId
router.delete('/users/userId/:userId/delete', function (req, res, next) {
    Users.destroy(
        {where : {
                userId: req.params.userId
            }
        })
        .then(result => {
            res.status(200).send({"message": "User successfully deleted!","result":result});
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});




// Update the operation time of a service provider with role
router.put('/serviceProviderId/:serviceProviderId/role/:role/operationTime/set', function (req, res, next) {
    ServiceProviders.update(
        {operationTime: req.body.operationTime},
        {where : {
                serviceProviderId: req.params.serviceProviderId,
                role: req.params.role
            }
        })
        .then(result => {
            res.status(200).send({"message": "Service Provider operationTime updated successfully!","result":result[0]});
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

// GET operation time of service provider with role.
router.get('/serviceProviderId/:serviceProviderId/role/:role/operationTime', function(req, res, next) {
    ServiceProviders.findAll({
        where:{
            serviceProviderId : req.params.serviceProviderId,
            role : req.params.role
        }
    })
        .then(serviceProviders => {
            console.log(serviceProviders);
            res.status(200).send({operationTime: serviceProviders[0].operationTime});
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});


// update appointment status to 'cancelled' by appointmentId .
router.put('/appointments/cancel/appointmentId/:appointmentId', function (req, res, next) {
    ScheduledAppointments.update(
        {status: 'cancelled'},
        {where : {
                appointmentId: req.params.appointmentId
            }
        })
        .then(result => {
            res.status(200).send({"message": "Appointment status changed to cancelled successfully!","result":result[0]});
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

//GET all appointments by serviceProviderId .
router.get('/appointments/serviceProviderId/:serviceProviderId', function(req, res, next) {
    AppointmentDetails.findAll({
        where: {
            serviceProviderId: req.params.serviceProviderId
        }
    })
        .then((apps) => {
            const idsList = apps.map((app) => app.dataValues.appointmentId);
            ScheduledAppointments.findAll({
                where: {
                    appointmentId:{
                        [Op.in]: idsList
                    }
                }
            })
                .then(appointmentsDetails => {
                    console.log(appointmentsDetails);
                    res.status(200).send(appointmentsDetails);
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




// GET roles of service provider by service provider id. */
router.get('/roles/serviceProviderId/:serviceProviderId', function(req, res, next) {
    ServiceProviders.findAll({
        attributes: ['role'],
        where:{
            serviceProviderId : req.params.serviceProviderId,
        }
    })
        .then(roles => {
            console.log(roles);
            res.status(200).send({roles: roles.map(role => role.role)});
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});


/* GET permissions of service provider by service provider id. */
router.get('/serviceProviderId/:serviceProviderId/permissions', function(req, res, next) {
    ServiceProviders.findAll({
        attributes: ['role'],
        where:{
            serviceProviderId : req.params.serviceProviderId,
        }
    })
        .then(roles => {
            const rolesList=roles.map(role => role.role);
            RulesModules.findAll({
                attributes: ['module'],
                where:{
                    role:{
                        [Op.in]: rolesList
                    }
                }
            }).then(modules =>{
                const moduleList=modules.map(module => module.module);
                Permissions.findAll({
                    attributes: ['operationName'],
                    where:{
                        module:{
                            [Op.in]: moduleList
                        }
                    }
                }).then(permissions => {
                    console.log(permissions);
                    res.status(200).send(permissions.map(permission => permission.operationName));
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



function genereateRandomPassword()
{
    let randomPassword=Math.random().toString(36).slice(-8);
    while(!checkIfPasswordLegal(randomPassword)){
        randomPassword=Math.random().toString(36).slice(-8);
    }
    return randomPassword;
}

function checkIfPasswordLegal(passToCheck)
{
    return /\d/.test(passToCheck) && isNaN(passToCheck) ;
}

module.exports = router;
