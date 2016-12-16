#!/usr/bin/node

/*
 * Hearthstone card stat tracker
 * author: Ben Borchard
**/

// requirements
var actions =       require("./function/actions.js");
var util =          require("./function/util.js");
var cards =         require("./cards/cards-test.json");
var commands =      require("./properties/commands.json");
var messages =      require("./properties/messages.js");
var util =          require("./function/util.js");
var fs =            require("fs");



// initialize variables
var gameState = {
  "turn": "hero_one",
  "hero_one": {
    "klass": "",
    "hero_power": {},
    "weapon": {},
    "health": "30",
    "armor": "0",
    "attack": "0",
    "immune": "false",
    "shield": "false"
  },
  "hero_two": {
    "klass": "",
    "hero_power": {},
    "weapon": {},
    "health": "30",
    "armor": "0",
    "immune": "false",
    "shield": "false"
  },
  "triggers":{},
  "board": {
    "hero_one": {
      "minions": []
    },
    "hero_two": {
      "minions": []
    }
  },
  "secrets": {
    "hero_one": {},
    "hero_two": {}
  }
};
var repl = "\n> ";
var output = messages.firstHeroPrompt;

// Get a pretty printed version of the game state object
var gameStateStr = function() {
  return JSON.stringify(gameState, null, 2)
};

// Save the state of the game
// TODO: Make this a little more user friendly
var saveState = function(filename, exit) {
  filename = "states/"+filename;
  var resp = "";
  try {
    fs.writeFileSync(filename, gameStateStr());  
    resp = "Game saved to "+filename;
  } catch (e) {
    resp = "Game could not be saved";
  }
  
  process.stdout.write(resp+"\n");
  if (exit) {
    process.exit();  
  }
};

var initializeHero = function(gameState, hero, heroClass) {
  gameState[hero]["klass"] = heroClass;
  gameState[hero]["hero_power"] = util.clone(cards[heroClass]["hero_power"]["standard"]);
}

// configure repl mechanism
process.stdin.resume();
process.stdin.setEncoding("utf8");

// start repl
process.stdout.write(output+repl);
process.stdin.on('data', function(text) {
  text = text.trim()
  var cmd = text.split(" ");

  // quitting
  if (gameState.quitting) {
    if (text === "y") {
      saveState("state.txt", true);
    } else if (text === "n") {
      process.exit();
    } else if (text === "c") {
      output = lastoutput;
      gameState.quitting = false;
    } else {
      output = messages.quit;
    }
  } 
  else if (text === commands.quit.cmd) {
    lastoutput = output;
    output = messages.quit;
    gameState.quitting = true;
  }

  // game state dump
  else if (text.startsWith(commands.state_dump.cmd)) {
    if (cmd.length > 2) {
      output = "Usage for "+commands.state_dump.name+" command: "+commands.state_dump.cmd+" [outputfile]";
    } else if (cmd.length === 1) {
      output = messages.gameStatePrompt+"\n\n"+gameStateStr()+"\n\n"  ;
    } else {
      saveState(cmd[1]);
    }
  }

  // hero selection
  else if (!gameState["hero_two"]["klass"]) {
    if (!cards[text] || cards[text].type !== "hero") {
      output = messages.unrecognizedHero(text);
    } else if (!gameState["hero_one"]["klass"]) {
      initializeHero(gameState, 'hero_one', text);
      output = messages.secondHeroPrompt;
    } else {
      initializeHero(gameState, 'hero_two', text);
      output = messages.gameStartPrompt;
    }  
  } 

  // game actions
  else {

    // standard action
    if (actions[cmd[0]]) {
      output = actions[cmd[0]](gameState, cmd.slice(1));
    } 
    // playing a card
    else if (util.prop_check(cards, [cmd[0], "type"], "hero", util.not_equal)) {
      output = actions.play(cmd);
    }
    // error
    else {
      output = messages.unrecognizedCard(cmd[0]);
    }
  }
  
  process.stdout.write(output+repl);
});
