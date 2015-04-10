/**
 * Created by vasiliy.lomanov on 10.04.2015.
 */

const Events = {
    checkWord:              1,
    checkAndCommit:         2,
    state:                  3,
    message:                4,
    joinGame:               5,
    createGame:             6,
    points:                 7,
    usedWords:              8,
    waiting:                9,
    ready:                  10,
    bonusLetters:           11
};

try{
    module.exports = Events;
} catch (e) {
    console.log("Browser");
}