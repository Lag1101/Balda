/**
 * Created by vasiliy.lomanov on 19.03.2015.
 */

var HttpError = require('../error').HttpError;
var User = require('../models/user').User;
var config = require('../config');
var async = require('async');
var logger = require('../lib/logger');
var CookieParser = require('cookie-parser');


module.exports = function(sessionStore) {

    function loadUser(socket, callback) {
        logger.info("Try to load user");

        async.waterfall([
                function(callback) {
                    var cookies = socket.request.cookies;
                    var secretSid = cookies[config.get('session:key')];
                    var sid = CookieParser.signedCookie(secretSid, config.get('session:secret'));

                    logger.info("Got sid " + sid);

                    return loadSession(sid, callback);
                },
                function(session, callback) {

                    if (!session) {
                        logger.error("No session");
                        return callback(new HttpError(401, "No session"));
                    }

                    logger.info("Loaded session " + session);

                    socket.handshake.session = session;

                    return loadUserFromSession(session, callback)
                },
                function(user, gameId, callback) {
                    if (!user) {
                        logger.error("Anonymous session may not connect");
                        callback(new HttpError(403, "Anonymous session may not connect"));
                    }

                    logger.info("Loaded user " + user);
                    socket.handshake.user = user;
                    socket.handshake.gameId = gameId;

                    return callback(null);
                }

            ],
            function(err){
                return callback(err, socket);
            });
    }

    function loadSession(sid, callback) {
        sessionStore.get(sid, function(err, session) {
            if(err) {
                return callback(err, null);
            }
            if (arguments.length == 0 || !session) {
                // no arguments => no session
                return callback(new Error("Cannot load session"), null);
            } else {
                return callback(null, session);
            }
        });
    }
    function loadUserFromSession(session, callback) {

        if (session.username === undefined) {
            console.log("Session %s is anonymous", session.id);
            return callback(null, null);
        }



        User.findOne({username: session.username}, function(err, user){
            if(err) throw err;

            callback(null, user, session.gameId);
        });
    }
    return loadUser;
};