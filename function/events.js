/**
 * This object provides methods that handle actions in hearthstone
 * given a specific game status object and cards database object
 */

var cards =           require("../cards/cards-test.json");
var effects =         require("./effects.js");
var messages =        require("../properties/messages.js");
var util =            require("./util.js");
var tracker =         require("../stats/tracker.js");


module.exports = {

  attack: function(gameState, attacker, attackee) {

  },

  play_card: function(gameState, options) {
    var result;
    var cardName = options[0];
    var hero = util.hero(gameState);
    var card = cards[cardName];
    card["name"] = cardName;

    card["trackerId"] = tracker.initCard(gameState["card_stats"][hero], cardName, card["mana_cost"]);
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

    if (result["error"]) {
      tracker.removeCard(gameState["card_stats"][hero], card["trackerId"]);
    }

    return result;
  },

  play_minion: function(gameState, card, options) {
    var hero = util.hero(gameState);
    
    // error check
    var position = parseInt(options[0]);
    if (isNaN(position)) {
      return {"error": messages.boardPosition};
    }
    if (gameState[hero]["board"] === 7) {
      return {"error": messages.boardFull};
    }

    // change the board
    placeMinion(gameState[hero]["board"], card, position);

    // deal with on-play effects
    options = options.slice(1);
    var cardEffects;
    if (card["battlecry"]) {
      cardEffects = card["battlecry"];
    } else if (card["effects"]["combo"] && gameState["cards_played_this_turn"] > 0) {
      cardEffects = card["combo"]
    }

    if (effects) {
      var result = handleEffects(gameState, cardEffects, options)
      if (result) {
        return result;
      }  
    }

    // triggers
    broadcastEvent(gameState, "play_minion")

    return {};
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
    if (util.hero(gameState) === messages.heroOne) {
      util.hero(gameState) = messages.heroTwo;
    } else {
      util.hero(gameState) = messages.heroOne;
    }
    gameState["cards_played_this_turn"] = 0;

    // add mana
    if (util.hero(gameState)["crystals"] < 10) {
      util.hero(gameState)["crystals"] += 1;
      util.mana(gameState) = gameState[gameState.turn]["crystals"];
    }

    broadcastEvent(gameState, "start_turn");    
  }

}

/*********** GAME PRIVATE API ***********/

// trigger time :)
var broadcastEvent = function(gameState, event) {

}

var handleEffects = function(gameState, cardEffects) {
  var i;
  for (i=0;i<cardEffects.length;i++) {
    handleEffect(gameState, cardEffects[i])
  }
}

var handleEffect = function(gameState, effect) {
  var result = effects[effect](gameState, effect);
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
    "race": card["race"],
    "trackerId": card["trackerId"]
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