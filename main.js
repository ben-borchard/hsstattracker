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


var h1 = messages.heroOne;
var h2 = messages.heroOne;

// initialize variables
var gameState = {
  "turn": h2,
  "cards_played_this_turn": 0,
  h1: {
    "klass": "",
    "hero_power": {},
    "weapon": {},
    "health": 30,
    "armor": 0,
    "attack": 0,
    "immune": "false",
    "shield": "false",
    "board": []
  },
  h2: {
    "klass": "",
    "hero_power": {},
    "weapon": {},
    "health": 30,
    "armor": 0,
    "immune": "false",
    "shield": "false",
    "board": []
  },
  "triggers":{},
  "secrets": {
    h1: {},
    h2: {}
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

var boardDump = function() {
  var i;
  console.log();
  console.log(gameState[h1]["health"]);
  console.log(getBoardStr(h1));
  console.log();
  console.log(getBoardStr(h2));
  console.log(gameState[h2]["health"])
  console.log();
}

var getBoardStr = function(hero) {
  var board = gameState[hero]["board"];
  var boardStr = "";
  for(i=0;i<board.length;i++) {
    boardStr = boardStr + board[i]
    if (i !== board.length - 1) {
      boardStr = boardStr + " | "
    }
  }
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
    } else if (!gameState[h1]["klass"]) {
      initializeHero(gameState, h1, text);
      output = messages.secondHeroPrompt;
    } else {
      initializeHero(gameState, h2, text);
      output = messages.gameStartPrompt;
    }  
  } 

  // game actions
  else {

    // standard action
    if (actions[cmd[0]]) {
      result = actions[cmd[0]](gameState, cmd.slice(1));
    } 
    // playing a card
    else {
      result = actions.play(gameState, cmd);
    }
    if (result) {
      if (result["error"]) {
        output = result["error"];
      } else if (effect) {
        effect = result["effect"]
        output = messages.promptEffect(effect["name"], effect["card"], effect["multiplicity"]);
      }
    }
    
  }
  
  process.stdout.write(output+repl);
});
