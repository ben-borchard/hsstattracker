

var cards = require("../cards/cards-test.json");
var effects = require("./effects.js");
var events = require("./events.js");
var messages = require("../properties/messages.js");
var util = require("./util.js");

module.exports = {

  // end the current turn
  end_turn: function(gameState) {
    effects.end_turn(gameState);
  },

  // attack (with a minion or hero)
  attack: function(gameState, options) {

  },

  // use current hero's hero power
  hero_power: function(gameState, options) {

  },

  // play a card
  play: function(gameState, options) {
    if (util.prop_check(cards, [options[0], "type"], "hero", util.not_equal)) {
      return events.play_card(gameState, options);
    } else {
      return messages.unrecognizedCard(options[0]);
    }
  },

  // concede the game
  concede: function(gameState) {

  }

}