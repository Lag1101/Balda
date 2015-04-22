/**
 * Created by luckybug on 11.04.15.
 */
var StatsController = (function(){
    function StatsController(containerId){
        var container = $("#"+containerId);

        var _this = this;
        container.load("/views/stats/index.html", function(){

            _this.statsEl = container.find(".stats");

            var pointsEl = _this.statsEl.find(".points");

            _this.myPointsEl = pointsEl.find(".me");
            _this.opponentPointsEl = pointsEl.find(".opponent");

            var bonusLettersContainerEl = _this.statsEl.find(".bonusLettersContainer");

            _this.bonusLettersEl = bonusLettersContainerEl.find(".bonusLetters");

            var wordsEl = _this.statsEl.find(".words");
            _this.myWordsEl = wordsEl.find(".myWords");
            _this.opponentWordsEl = wordsEl.find(".opponentWords");
        });
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

    StatsController.prototype.setWords = function(myWords, opponentWords) {
        this.myWordsEl.empty();
        var myWordsEl = this.myWordsEl;
        myWords.map(function(word){
            $('<li>').text(word).appendTo(myWordsEl);
        });
        this.opponentWordsEl.empty();
        var opponentWordsEl = this.opponentWordsEl;
        opponentWords.map(function(word){
            $('<li>').text(word).appendTo(opponentWordsEl);
        });
    };

    return StatsController;
})();