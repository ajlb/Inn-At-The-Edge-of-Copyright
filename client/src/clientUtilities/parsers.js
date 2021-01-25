import { doesThisStartWithOneOfThese } from "./finders";
import pluralize from "pluralize";
const MULTIPLES = ["set", "pair", "box", "bag", "bunch", "square"];
const VOWELS = ["a", "e", "i", "o", "u"];

//only pluralize things that don't start with multiples words
function pluralizeAppropriateWords(itemName, itemQuantity) {
  // console.log(itemName)
  if (doesThisStartWithOneOfThese(itemName, MULTIPLES)) {
    if (itemQuantity > 1) {
      for (const startWord of MULTIPLES) {
        if (startWord.endsWith("ch") || startWord.endsWith("x")) {
          itemName = itemName.replace(startWord, startWord + "es");
        } else {
          itemName = itemName.replace(startWord, startWord + "s");
        }
      }
    }
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

function parseSuggestion(input, actionCalls) {
  input = input.toLowerCase();
  let suggestion = '';
  input && Object.values(actionCalls).find((arr) => {
    let newSuggestion = arr.find(str => {
      if (str.startsWith(input) && str !== input) return true;
    })
    suggestion = newSuggestion ? newSuggestion : '';
    return newSuggestion;
  })

  return suggestion;
}

export {
  pluralizeAppropriateWords,
  insertArticleSingleValue,
  parseAlternateWords,
  parseSuggestion
}