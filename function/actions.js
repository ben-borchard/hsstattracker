


var effects = require("./effects.js");
var effects = require("./events.js");

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

  },

  // concede the game
  concede: function(gameState) {

  }

}