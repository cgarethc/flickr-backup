const text = require("superagent/lib/node/parsers/text");
const emojiStrip = require('emoji-strip');
const accents = require('remove-accents');

const macronMap = {
  'ā': 'aa',
  'ē': 'ee',
  'ī': 'ii',
  'ō': 'oo',
  'ū': 'uu',
  'Ā': 'AA',
  'Ē': 'EE',
  'Ī': 'II',
  'Ō': 'OO',
  'Ū': 'UU'
};

exports.sanitiseMacrons = (text) => {
  return text.replace(/[āēīōūĀĒĪŌŪ]/g, (match) => {
    return macronMap[match];
  });
}

exports.sanitise = (text) => {
  let sanitised = text;
  sanitised = exports.sanitiseMacrons(text);
  sanitised = emojiStrip(sanitised);
  sanitised = accents.remove(sanitised);
  return sanitised;
};