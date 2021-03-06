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

const repl =        require("repl");


var h1 = messages.heroOne;
var h2 = messages.heroTwo;

// initialize variables
var gameState = {
  "turn": h1,
  "cards_played_this_turn": 0,
  "hero_one": {
    "klass": "",
    "hero_power": {},
    "weapon": {},
    "health": 30,
    "armor": 0,
    "attack": 0,
    "immune": "false",
    "shield": "false",
    "mana": 1,
    "crystals": 1
    "board": []
  },
  "hero_two": {
    "klass": "",
    "hero_power": {},
    "weapon": {},
    "health": 30,
    "armor": 0,
    "immune": "false",
    "shield": "false",
    "mana", 1,
    "crystals", 1,
    "board": []
  },
  "triggers":{},
  "secrets": {
    h1: {},
    h2: {}
  },
  "card_stats": {
    "hero_one": {},
    "hero_two": {}
  }
};
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

// dump stats on the board including the hero's health
var boardDump = function() {
  str = "\n"
  str = str + gameState[h1]["health"] + "\n";
  str = str + getBoardStr(h1) + "\n";
  str = str + "\n";
  str = str + getBoardStr(h2) + "\n";
  str = str + gameState[h2]["health"] + "\n";
  str = str + "\n";
  return str;
}

// convert a array version of a board into a readable string
var getBoardStr = function(hero) {
  var i;
  var board = gameState[hero]["board"];
  var boardStr = "";
  for(i=0;i<board.length;i++) {
    boardStr = boardStr + board[i]["name"] + ", " + board[i]["attack"] + "-" + board[i]["health"];
    if (i !== board.length - 1) {
      boardStr = boardStr + " | "
    }
  }
  return boardStr;
}

// handle text from the repl
var handleInput = function(text, context, filename, callback) {
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

  // board dump
  else if (text.startsWith(commands.board_dump.cmd)) {
    output = boardDump()
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
      } else if (result["effect"]) {
        effect = result["effect"];
        output = messages.promptEffect(effect["name"], effect["card"], effect["multiplicity"]);
      } else {
        output = "";
      }
    } else {
      output = "";
    }
    
  }
  
  callback(null, output);
}

// Silly but needed to get the output printed the way we want
var writer = function(output) {
  return output;
}

// initial prompt and begin the repl
process.stdout.write(output+"\n")
const r = repl.start({prompt: "> ", eval: handleInput, writer: writer});