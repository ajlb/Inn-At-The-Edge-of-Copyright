import {doesThisStartWithOneOfThese} from "./finders";
import pluralize from "pluralize";
const MULTIPLES = ["set", "pair", "box", "bag"];
const VOWELS = ["a", "e", "i", "o", "u"];

//only pluralize things that don't start with multiples words
function pluralizeAppropriateWords(itemName, itemQuantity) {
    if (doesThisStartWithOneOfThese(itemName, MULTIPLES)) {
        return itemName;
    } else {
        return pluralize(itemName, itemQuantity);
    }
}

//put "a" before consonants and y, put "an" before vowels
function insertArticleSingleValue(value) {
    if (doesThisStartWithOneOfThese(value, VOWELS)) {
        return `an ${value}`;
    } else {
        return `a ${value}`;
    }
}

  //return alias for words with multiple ways to type them
  function parseAlternateWords(thisThing, objecty) {
    for (let thatThing in objecty) {
      if (thisThing.toLowerCase().trim() === objecty[thatThing]) {
        return thatThing;
      }
    }
    return thisThing;
  }

export {
    pluralizeAppropriateWords,
    insertArticleSingleValue,
    parseAlternateWords,
}