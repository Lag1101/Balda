/**
 * Created by vasiliy.lomanov on 24.02.2015.
 */
var winston = require('winston');
var ENV = process.env.NODE_ENV;

// can be much more flexible than that O_o
function getLogger(module) {

    var path = module.filename.split('/').slice(-2).join('/');

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: (ENV == 'development') ? 'debug' : 'error',
                label: path
            })
        ]
    });
}

module.exports = getLogger;