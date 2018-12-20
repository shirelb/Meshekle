var express = require('express');
var router = express.Router();
const {ServiceProviders} = require('../DBorm/DBorm');

/* GET users listing. */
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

module.exports = router;
