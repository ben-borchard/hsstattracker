
var messages = require("../properties/messages.js");
var util = require("./util.js");


module.exports = {

  damage: function(gameState, options) {
    if (options.length !== 2) {
      return {"error": messages.damageError(messages.argumentsError)}
    }
    var hero = options[0];
    if (!util.validHeroOption(hero)) {
      return {"error": messages.damageError(messages.invalidHeroOption)} 
    }
    var target = options[1];
    if (!util.validTargetOption(target)) {
      return {"error": messages.damageError(messages.invalidTargetOption)} 
    }
  }

}