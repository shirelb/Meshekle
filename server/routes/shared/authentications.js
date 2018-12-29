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
    verifyToken: function (req, res, next) {
        console.log("in route middleware to verify a token");

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;

        token.startsWith("Bearer ") ? token = token.substring(7, token.length) : token;

        console.log("token: " + token);

        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, constants.general.superSecret, function (err, decoded) {
                if (err) {
                    return res.status(200).send({success: false, message: constants.usersRoute.failedToken,err});
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
                message: constants.usersRoute.tokenNotProvided
            });
        }
    },
};
