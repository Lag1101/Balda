/**
 * Created by vasiliy.lomanov on 06.04.2015.
 */


module.exports.Game = require('./Game');
module.exports.GamePool = require('./GamePool');

module.exports.gamePool = module.exports.gamePool || new module.exports.GamePool();
