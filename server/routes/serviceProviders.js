const Sequelize = require('sequelize');
var express = require('express');
var router = express.Router();
const {ServiceProviders,Users} = require('../DBorm/DBorm');
const Op = Sequelize.Op;

/* GET serviceProviders listing. */
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

/* GET serviceProviders by name listing. */
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

/* GET serviceProviders by role. */
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

/* GET appointmentWayType serviceProvidersId */
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

/* put service providers day user . */
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

/* put role to a service provider . */
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

/* DELETE role to a service providers. */
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
                        res.status(200).send({"result":true, "message": "Login successful", "serviceProviderId": serviceProviders[0].serviceProviderId
                    });
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


/* DELETE a service providers. */
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

/* DELETE a user. */
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




/* Update the operation time of a service provider with role */
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

/* GET operation time of service provider with role. */
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
