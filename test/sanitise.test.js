const { sanitiseOEMReserved, sanitiseSmartQuotes } = require('../sanitise');

const sanitiseMacrons = require('../sanitise').sanitiseMacrons;
const sanitise = require('../sanitise').sanitise;

test('macrons', () => {
  expect(sanitiseMacrons('āēīōūĀĒĪŌŪ')).toBe('aaeeiioouuAAEEIIOOUU');
});

test('OEM reserved', () => {
  expect(sanitiseOEMReserved(`<>:"/\\|?*`)).toBe(`[lt][gt] '     `);
});

test('accents', () => {
  expect(sanitise('áèíóüÁÉÍÓÚ')).toBe('aeiouAEIOU');
});

test('smartquotes', () => {
  expect(sanitiseSmartQuotes('‘single’ “double”')).toBe(`'single' "double"`);
});

test('all', () => {
  expect(sanitise('🍦👍āēīōūĀĒĪŌŪê ‘single’ “double” "quoted"')).toBe(`aaeeiioouuAAEEIIOOUUe 'single' 'double' 'quoted'`);
});