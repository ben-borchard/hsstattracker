/**
 * This object provides methods that handle actions in hearthstone
 * given a specific game status object and cards database object
 */

var cards = require("../cards/cards-test.json");
var effects = require("./effects.js");
var messages = require("../properties/messages.js");
var util = require("./util.js");


module.exports = {

  /*********** GAME PUBLIC API ***********/

  attack: function(gameState, attacker, attackee) {

  },

  play_card: function(gameState, options) {
    var result;
    var cardName = options[0];
    var card = cards[cardName]
    card["name"] = cardName;
    broadcastEvent(gameState, "play_card");
    // minion
    if (card["type"] === "minion") {
      result = this.play_minion(gameState, card, options.slice(1));
    } 
    // spell
    else if (card["type"] === "spell") {
      result = this.play_spell(gameState, card, options.slice(1));
    } 
    // weapon
    else { 
      result = this.play_weapon(gameState, card, options.slice(1));
    }
    gameState["cards_played_this_turn"] += 1;

    return result;
  },

  play_minion: function(gameState, card, options) {
    var i;
    var hero = gameState["turn"];

    // change the board
    var position = parseInt(options[0]);
    if (isNaN(position)) {
      return messages.boardPosition;
    }
    if (gameState[hero]["board"] === 7) {
      return messages.boardFull;
    }
    placeMinion(gameState[hero]["board"], card, position);

    // deal with on-play effects
    options = options.slice(1);
    var effect
    if (card["effects"]["battlecry"]) {
      effect = [card["effects"]["battlecry"]["effect"]];
    } else if (card["effects"]["combo"] && gameState["cards_played_this_turn"] > 0) {
      effect = [card["effects"]["combo"]["effect"]]
    }
    var result = handleEffect(gameState, effect, options)
    if (result) {
      return result;
    

    // triggers
    broadcastEvent(gameState, "play_minion")
    

  },

  play_spell: function(gameState, card, options) {

  },

  play_weapon: function(gameState, card, options) {

  },

  take_damage: function(gameState, options) {

  },

  end_turn: function(gameState) {

    broadcastEvent(gameState, "end_turn");

    // switch turn    
    if (gameState["turn"] === messages.heroOne) {
      gameState["turn"] = messages.heroTwo;
    } else {
      gameState["turn"] = messages.heroOne;
    }
    gameState["cards_played_this_turn"] = 0;

    broadcastEvent(gameState, "start_turn");    
  }

}

/*********** GAME PRIVATE API ***********/

// trigger time :)
var broadcastEvent = function(gameState, event) {

}

var handleEffect = function(gameState, effect, options) {
  var result = effects["effect"](gameState, options);
  if (result) {
    if (result["error"]) {
      return result["error"];
    } else {
      handleEffectResult(gameState, result);
    }
  }
  
}

var handleEffectResult = function(gameState, result) {

}

var placeMinion = function(board, card, position) {
  // don't put a minion on a full board (error checking done upstream)
  if (board.length === 7) {
    return;
  }
  var i;
  var minionToPush;
  var newCard = {
    "name": card["name"],
    "attack": card["attack"],
    "health": card["health"],
    "race": card["race"]
  }

  for (i=0;i<=board.length;i++) {
    if (i === position-1) {
      minionToPush = board[i];
      board[i] = newCard;
    } else if (minionToPush) {
      var temp = board[i];
      board[i] = minionToPush;
      minionToPush = temp;
    }
  }
  if (position >= i) {
    board[i-1] = newCard;
  }
}