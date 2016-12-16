module.exports = {

  clone: function(jsonObject) {
    return JSON.parse(JSON.stringify(jsonObject));
  },

  prop_check: function(obj, path, value, comp) {
    var i;
    var nextProp = obj;
    for(i=0;i<path.length;i++) {
      if (nextProp[path[i]]) {
        nextProp = nextProp[path[i]];
      } else {
        return false;
      }
    }
    if (value && comp) {
      return comp(nextProp, value)
    } else if (value) {
      return nextProp === value;
    }
    return true;

  },

  equal: function(a, b) {
    return a === b;
  },

  not_equal: function(a, b) {
    return a !== b;
  }
}