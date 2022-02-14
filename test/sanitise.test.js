const sanitiseMacrons = require('../sanitise').sanitiseMacrons;
const sanitise = require('../sanitise').sanitise;

test('macrons', () => {
  expect(sanitiseMacrons('āēīōūĀĒĪŌŪ')).toBe('aaeeiioouuAAEEIIOOUU');
});

test('accents', () => {
  expect(sanitise('áèíóüÁÉÍÓÚ')).toBe('aeiouAEIOU');
});

test('smartquotes', () => {
  expect(sanitise('‘single’ “double”')).toBe(`'single' "double"`);
});

test('all', () => {
  expect(sanitise('🍦👍āēīōūĀĒĪŌŪê ‘single’ “double”')).toBe(`aaeeiioouuAAEEIIOOUUe 'single' "double"`);
});