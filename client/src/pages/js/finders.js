import React from 'react';

//FINDERS AND PARSERS

//determine if a string begins with any of an array of other strings
function doesThisStartWithThose(thisThing, those) {
    for (let thatThing of those) {
      if (thisThing.toLowerCase().startsWith(thatThing) && (thatThing.length > 1)) {
        return true
      } else if (thisThing.split(" ")[0].toLowerCase() === thatThing.toLowerCase()) {
        return true
      }
    }
    return false
  }
  
  //single value startWith() that tests for space or equal value
  function startsWithOrIs(thing, stringy) {
    if (stringy.toLowerCase().startsWith(`${thing} `) || ((stringy.toLowerCase().startsWith(thing)) && (stringy.length === thing.length))) {
      return true
    }
    return false
  }
  
  //slice off any string from an array that is found at the beginning of another string
  function takeTheseOffThat(these, that) {
    for (let thing of these) {
      if (that.toLowerCase().startsWith(thing)) {
        return that.slice(thing.length).trim();
      }
    }
  
    return that;
  }
  
  //see if a string is equal to any of the strings in an array
  function doesThisEqualThat(thisThing, thatStuff) {
    for (let thatThing of thatStuff) {
      if (thisThing.toLowerCase().trim() === thatThing) {
        return true;
      }
    }
    return false;
  }

  export default doesThisStartWithThose;

  export {
    doesThisStartWithThose,
    startsWithOrIs,
    takeTheseOffThat,
    doesThisEqualThat
  }