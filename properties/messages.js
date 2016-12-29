module.exports = {

  heroOne: "hero_one",

  heroTwo: "hero_two",
  
  quit: "Would you like to save the game before quitting (y/n/c)?",

  firstHeroPrompt: "Hero going first?",

  secondHeroPrompt: "Hero going second?",

  gameStartPrompt: "Great!  Now enter actions in game:",

  gameStatePrompt: "Game State:",

  boardPosition: "When you play a card, you must always put a valid integer as the second argument",

  boardFull: "Cannot play a minion, the board is full",

  argumentsError: "wrong number of arguments",

  unrecognizedHero: function(hero) {
    return "\""+hero+"\" is not a recognized hero, please reenter a valid hero";
  }, 

  unrecognizedCard: function(card) {
    return "\n\""+card+"\" is not a recognized action or card, please enter the card played (see json file for list of valid card names) or a valid action:\n\n"+
                                             "- play (card was played)\n"+
                                             "- end turn (end of current turn)\n"+
                                             "- attack (there was an attack made)\n"+
                                             "- hero_power (current hero used hero power)\n"+
                                             "- concede (current hero conceded)\n";
  },

  // option messages
  invalidTargetOption: function(target) {
    return "specified target option "+target+" is invalid, please enter 1, 2, 3, 4, 5, 6, 7, or face";
  },

  invalidHeroOption: function(hero) {
   return "specified hero option "+target+" is invalid, please enter 1, 2, 3, 4, 5, 6, 7, or face"; 
  },

  // effect usages
  damageError: function(message) {
    return "damage options: damage_effect hero target\n"+message
  }


}