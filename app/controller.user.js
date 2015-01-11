//mongodb
var mongoose = require('mongoose');
var User = require('./model.user');

//auth
exports.getLogin = function (req, res) {
    console.log(req.user);
    if (req.user) {

        return res.send({
            success: true,
            user: req.user
        });

    } //res.send(500, {status:500, message: 'internal error', type:'internal'}); == deprecated


    res.send({
        success: false,
        message: 'not authorized'
    });
};


exports.register = function (req, res) {
    console.log("registering: " + req.body.firstName);
    User.register(new User({
        username: req.body.username,
        firstname: req.body.firstname
    }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.send(err);
        } else {
            res.send({
                success: true,
                user: user
            });
        }
    });
};

exports.login = function (req, res, next) {

    User.authenticate()(req.body.username, req.body.password, function (err, user, options) {
        if (err) return next(err);
        if (user === false) {
            res.send({
                message: options.message,
                success: false
            });
        } else {
            req.login(user, function (err) {
                res.send({
                    success: true,
                    user: user
                });
            });
        }
    });

};


exports.forgot = function (req, res) {

    if (req.body.username) {
        //find id that belongs to the user and send it along
        User.findByUsername(req.body.username, function (err, user) {
            //no user found

            if (user === null) {

                return res.send({
                    success: false,
                    message: "no user with that e-mail address"
                });
            } else {

                //set the password token
                var guid = require('node-uuid');
                user.uuid = guid.v1();
                user.save(function (err) {
                    if (!err) {
                        console.log("updated");
                    } else {
                        console.log(err);
                    }
                    //return res.send(user);
                });


                console.log("sending e-mail to user with ses");

                var email = require("emailjs");
                var server = email.server.connect({
                    user:  process.env.SMTPUSER,
                    password:  process.env.SMTPPASSWORD,
                    host:  process.env.SMTPSERVER,
                    ssl: true
                });

                // send the message and get a callback with an error or details of the message that was sent
                // this is a link to a password reset page
                server.send({
                    text: "Please click this link to reset your password: http://localhost:3000/#/reset/" + user.uuid,
                    from:  process.env.POSTMASTER,
                    to: req.body.username,
                    cc: process.env.POSTMASTER,
                    subject: "Password reset"
                }, function (err, message) {
                    console.log(err || message);
                });


                console.log("e-mail sent??");
                //email sent??
                return res.send({
                    success: true,
                    message: "message sent!"
                });

            }
        });
    }
};

exports.deleteuser = function (req, res) {
    console.log(req.user.username);

    //find the user
    if (req.user.username === req.body.username) {
        User.findOne({
            username: req.user.username
        }, function (err, user) {
            if (err) return handleError(err);
            user.remove();
            return res.send({
                success: true,
                message: "user deleted"
            });
        });

    } else {

        return res.send({
            success: false,
            message: "this is not your email address!"
        });
    }
};

//this is to check whether a user exists
//post, param = username
exports.findUserByName = function (req, res) {
    User.findOne({
        username: req.params.username
    }, function (error, response) {
        if (error || !response) {
            res.status(404).send({
                status: 401,
                success: false
            });
        } else {
            res.send({
                success: true,
                user: response
            });
        }
    });

};

//get, URL param = uuid
exports.getUuid = function (req, res) {

    console.log(req.params);
    User.findOne(req.params, function (error, user) {
        if (error || !user) {
            res.send({
                status: 401,
                success: false
            });
        } else {
            return res.send({
                success: true,
                user: user
            });
        }
    });
};


//post, param = postdata in form
exports.reset = function (req, res) {

    //find the user
      User.findOne({
        uuid: req.body.uuid
    }, function (err, user) {
        if (err) return handleError(err);
        user.setPassword(req.body.password, function (err) {
            if (err) return handleError(err);
            user.uuid = '';
            user.save();
            return res.send({
                success: true
            });
        });

    });
};


exports.logout = function (req, res) {
    req.logout();
    res.redirect('/');
};
/*
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      console.log("authorized!");

      return next();
    }
    console.log("no auth");
    res.redirect('/login');
  }
};

*/