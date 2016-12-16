module.exports = {
  
  quit: "Would you like to save the game before quitting (y/n/c)?",

  firstHeroPrompt: "Hero going first?",

  secondHeroPrompt: "Hero going second?",

  gameStartPrompt: "Great!  Now enter actions in game:",

  gameStatePrompt: "Game State:",

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
  }


}