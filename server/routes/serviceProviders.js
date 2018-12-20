var express = require('express');
var router = express.Router();
const {ServiceProviders,Users} = require('../DBorm/DBorm');

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
    ServiceProviders.findAll({
        include:[{
            model: Users,
            where:{
                firstName:req.params.name
            }
        }]
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


module.exports = router;
