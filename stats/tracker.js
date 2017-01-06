
module.exports = {
  
  initCard: function(stats, cardName, manaCost) {

    while (stats[cardName]) {
      if (isNaN(cardName.split("_")[-1])) {
        cardName = cardName + "_1";
      } else {
        cardName = cardName.subString(0, cardName.lastIndexOf("_")+1) + "_"+(parseInt(cardName.subString(cardName.lastIndexOf("_")+1))+1)
      }
    }
    stats[cardName] = {
      "mana_cost": manaCost,
      "mana_used": 0,
      "cards used": 0,
      "face_damage": 0,
      "heal": 0,
      "draw": 0,
      "damage_cost": 0
    }
  }

}