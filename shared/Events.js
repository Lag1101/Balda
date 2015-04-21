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
        checkAndCommit: getId(),
        state: getId(),
        message: getId(),
        joinGame: getId(),
        createGame: getId(),
        points: getId(),
        usedWords: getId(),
        waiting: getId(),
        ready: getId(),
        bonusLetters: getId(),
        gameList: getId(),
        myGamesList: getId()
    };
})();

try{
    module.exports = Events;
} catch (e) {
    console.log("Browser");
}