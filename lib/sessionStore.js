/**
 * Created by vasiliy.lomanov on 20.02.2015.
 */
var session = require('express-session');

module.exports.store = module.exports.store || new session.MemoryStore();
