const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = function(req, res, next){
    let token = req.headers['authorization'];

    if(token){
        jwt.verify(token, config.secret, function(err, decoded){
            if(err){
                res.json({
                    success: false,
                    message: 'Failed to authenticate token'
                });
            }else{
                //this is the var we are using in the other files to get access to the decoded user
                req.decoded = decoded;
                next();
            }
        });
    }else{
        res.status(403).json({
            success:false,
            message: 'no token provided'
        });
    }
}