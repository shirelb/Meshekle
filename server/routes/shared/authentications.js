var jwt = require('jsonwebtoken');

var constants = require('./constants');

module.exports = {
    sendToken: function (payload, res) {
            var token = jwt.sign(payload, constants.general.superSecret, {
                expiresIn: "10h" // expires in 10 hours
            });

            // return the information including token as JSON
            res.status(200).send({
                'success': true,
                'message': constants.general.successfulToken,
                'token': token
            });
        },
};
