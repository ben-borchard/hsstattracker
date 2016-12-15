module.exports = {
  
  quit: "Would you like to save the game before quitting (y/n/c)?",

  firstHeroPrompt: "Hero going first?",

  secondHeroPrompt: "Hero going second?",

  gameStartPrompt: "Great!  Now enter actions in game:",

  gameStatePrompt: "Game State:",

  unrecognizedHero: function(hero) {
    return "\""+hero+"\" is not a recognized hero, please reenter a valid hero";
  }, 


}