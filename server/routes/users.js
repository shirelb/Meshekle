var express = require('express');
var router = express.Router();
const { Users } = require('../DBorm/DBorm');

/* GET users listing. */
router.get('/', function (req, res, next) {
    Users.findAll()
        .then(users => {
            console.log(users);
            console.log(users[0]);
            res.send('respond with a resource users');
        });
});

module.exports = router;
