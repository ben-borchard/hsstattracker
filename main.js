#!/usr/bin/node

/*
 * Hearthstone card stat tracker
 * author: Ben Borchard
**/

// requirements
var actions = require("./function/actions.js");
var cards = require("./cards/cards-test.json");
var commands = require("./properties/commands.json");
var messages = require("./properties/messages.js");
var fs = require("fs");
var locked = false;

// initialize variables
var game_state = {
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
  "board": {
    "hero_one": {
      "minions": {}
    },
    "hero_two": {
      "minions": {}
    }
  },
  "secrets": {
    "hero_one": {},
    "hero_two": {}
  }
};
var repl = "\n> ";
var output = messages.firstHeroPrompt;

// stop execution for until something has finished
var wait = function() {
  while (locked) {
    console.log(locked)
    var i;
    var n = 0
    for (i=0;i<1000000000;i++) {
      n = n + 1;
    }
  }
};

// Get a pretty printed version of the game state object
var gameStateStr = function() {
  return JSON.stringify(game_state, null, 2)
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

// configure repl mechanism
process.stdin.resume();
process.stdin.setEncoding("utf8");

// start repl
process.stdout.write(output+repl);
process.stdin.on('data', function(text) {
  text = text.trim()

  // quitting
  if (game_state.quitting) {
    if (text === "y") {
      saveState("state.txt", true);
    } else if (text === "n") {
      process.exit();
    } else if (text === "c") {
      output = lastoutput;
      game_state.quitting = false;
    } else {
      output = messages.quit;
    }
  } 
  else if (text === commands.quit.cmd) {
    lastoutput = output;
    output = messages.quit;
    game_state.quitting = true;
  }

  // game state dump
  else if (text.startsWith(commands.state_dump.cmd)) {
    var cmd = text.split(" ");
    if (cmd.length > 2) {
      output = "Usage for "+commands.state_dump.name+" command: "+commands.state_dump.cmd+" [outputfile]";
    } else if (cmd.length === 1) {
      output = messages.gameStatePrompt+"\n\n"+gameStateStr()+"\n\n"  ;
    } else {
      saveState(cmd[1]);
    }
  }

  // hero selection
  else if (!game_state.heroTwo) {
    if (!cards[text] || cards[text].type !== "hero") {
      output = messages.unrecognizedHero(text);
    } else if (!game_state.hero_one.klass) {
      output = messages.secondHeroPrompt;
    } else {
      game_state.heroTwo = text;
      output = messages.gameStartPrompt;
    }  
  } 

  // game actions
  else {

  }
  
  process.stdout.write(output+repl);
});
