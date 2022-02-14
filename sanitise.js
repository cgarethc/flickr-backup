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

/*
< (less than)
> (greater than)
: (colon)
" (double quote)
/ (forward slash)
\ (backslash)
| (vertical bar or pipe)
? (question mark)
* (asterisk)
*/
const OEMreservedMap = {
  '<': '[lt]',
  '>': '[gt]',
  ':': ' ',
  '"': `'`,
  '/': ' ',
  '\\': ' ',
  '|': ' ',
  '?': ' ',
  '*': ' '
};

exports.sanitiseMacrons = (text) => {
  return text.replace(/[āēīōūĀĒĪŌŪ]/g, (match) => {
    return macronMap[match];
  });
}

exports.sanitiseOEMReserved = (text) => {
  return text.replace(/[<>:"/\\|?*]/g, (match) => {
    return OEMreservedMap[match];
  });
}

exports.sanitiseSmartQuotes = (text) => {
  return text.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
};

exports.sanitise = (text) => {
  let sanitised = text;
  sanitised = exports.sanitiseMacrons(text);
  sanitised = emojiStrip(sanitised);
  sanitised = accents.remove(sanitised);
  sanitised = exports.sanitiseSmartQuotes(sanitised);
  sanitised = exports.sanitiseOEMReserved(sanitised);
  return sanitised;
};