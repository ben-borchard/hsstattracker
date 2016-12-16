#!/usr/bin/node

var util = require("../function/util.js");

var propCheckTest = function() {
  console.log("\n~~~~~~~~ propCheckTest ~~~~~~~~\n");

  var obj = {
    one: {
      two: {
        three: {
          four: "five"
        }
      }
    }
  };

  console.log(util.prop_check(obj, ["one"]) + "  should be true");
  console.log(util.prop_check(obj, ["two"]) + "  should be false");
  console.log(util.prop_check(obj, ["one", "two"]) + "  should be true");
  console.log(util.prop_check(obj, ["one", "three"]) + "  should be false");
  console.log(util.prop_check(obj, ["one", "two", "three"]) + "  should be true");
  console.log(util.prop_check(obj, ["one", "two", "three", "four"]) + "  should be true");
  console.log(util.prop_check(obj, ["one", "two", "three", "four"], "five") + "  should be true");
  console.log(util.prop_check(obj, ["one", "two", "three", "four"], "five", util.not_equal) + "  should be false");
  console.log(util.prop_check(obj, ["one", "two", "three", "four"], "six", util.not_equal) + "  should be true");
}

propCheckTest();
console.log();