/**
 * Created by vasiliy.lomanov on 10.04.2015.
 */

var StatsController = (function(){
    function StatsController(containerId){
        this.container = $("#"+containerId);
        this.myPointsEl = this.container.find(".me");
        this.opponentPointsEl = this.container.find(".opponent");
        this.bonusLettersEl = this.container.find(".bonusLetters");
        this.wordsEl = this.container.find(".words");
    }

    StatsController.prototype.setPoints = function(myPoints, opponentPoints) {
        this.myPointsEl.text(myPoints);
        this.opponentPointsEl.text(opponentPoints);
    };

    StatsController.prototype.setBonusLetters = function(bonusLetters) {
        this.bonusLettersEl.empty();
        var bonusLettersEl = this.bonusLettersEl;
        bonusLetters.map(function(bonusLetter){
            $('<li>').text(bonusLetter.letter + " : " + bonusLetter.points).appendTo(bonusLettersEl);
        });
    };

    StatsController.prototype.setWords = function(words) {
        this.wordsEl.empty();
        var wordsEl = this.wordsEl;
        words.map(function(word){
            $('<li>').text(word).appendTo(wordsEl);
        });
    };

    return StatsController;
})();