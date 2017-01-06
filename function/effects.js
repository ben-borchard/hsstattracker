
var util = require("./util.js");
var tracker = require("../stats/tracker.js");


module.exports = {

  damage: function(gameState, cardId, context) {

  }

  mana_turn: function(gameState, cardId, context) {
    var amount = context["amount"]
    util.mana(gameState) += amount;
    if (util.mana(gameState) > 10) {
      amount = util.mana(gameState) - 10;
      util.mana(gameState) = 10;
    }

    tracker.manaGain(gameState["turn"])
  }

}