/**
 * Created by vasiliy.lomanov on 19.03.2015.
 */

var HttpError = require('../error').HttpError;
var users = require('../models/UserModel').users;
var config = require('../config');
var async = require('async');

module.exports = function(sessionStore, cookieParser, socket) {

    function loadSession(sid, callback) {
        sessionStore.get(sid[config.get('session:key')], function(err, session) {
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
    function loadUser(session, callback) {

        if (session.user === undefined) {
            console.log("Session %s is anonymous", session.id);
            return callback(null, null);
        }

        console.log("retrieving user ", session.user);

        callback(null, users.get(session.user));

    }
    function loadUserBySid(sid, callback) {
        async.waterfall([
                function(callback) {
                    loadSession(sid, callback);
                },
                function(session, callback) {

                    if (!session) {
                        return callback(new HttpError(401, "No session"));
                    }

                    socket.handshake.session = session;

                    loadUser(session, callback)
                },
                function(user, callback) {
                    if (!user) {
                        callback(new HttpError(403, "Anonymous session may not connect"));
                    }

                    socket.handshake.user = user;

                    callback(null);
                }

            ],
            function(err){
                callback(err, socket);
            });
    }
    function fullLoadUser (socket, callback) {
        var cookies = socket.handshake.cookies;
        var sid = cookieParser.signedCookies(cookies, config.get('session:secret'));
        loadUserBySid(sid, callback);
    }


    return fullLoadUser;
}