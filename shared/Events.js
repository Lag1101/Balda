/**
 * Created by vasiliy.lomanov on 10.04.2015.
 */

var Events = (function(){
    var _id = 0;
    function getId(){
        _id++;
        return _id;
    }
    return {
        checkWord: getId(),
        turn: getId(),
        state: getId(),
        message: getId(),
        joinGame: getId(),
        createGame: getId(),
        points: getId(),
        usedWords: getId(),
        waiting: getId(),
        ready: getId(),
        bonusLetters: getId(),
        nullSession: getId(),
        gameOver: getId(),
        gameResult: getId(),

        bonuses: {
            changeTime: getId()
        },
        changePoints: getId()
    };
})();

try{
    module.exports = Events;
} catch (e) {
    console.log("Browser");
}