/**
 * This object provides methods that handle actions in hearthstone
 * given a specific game status object and cards database object
 */

 var cards = require("../cards/cards-test.json");
 var effects = require("./effects.js");

 module.exports = {

  /*********** GAME PUBLIC API ***********/

  attack: function(gameState, attacker, attackee) {

  },

  play_minion: function(gameState) {

  },

  play_spell: function(gameState) {

  },

  play_weapon: function(gameState) {

  },

  take_damage: function(gameState) {

  },

  end_turn: function(gameState) {

    broadcastHeroEvent(gameState, "end_turn");

    // switch turn    
    if (gameState["turn"] === "hero_one") {
      gameState["turn"] = "hero_two";
    } else {
      gameState["turn"] = "hero_one";
    }

    broadcastHeroEvent(gameState, "start_turn");    
  }

}

/*********** GAME PRIVATE API ***********/
var friendlyMinions = function(gameState) {
  return gameState["board"][gameState["turn"]]["minions"];
}

var broadcastHeroEvent = function(gameState, event) {

}