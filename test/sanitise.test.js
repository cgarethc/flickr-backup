const sanitiseMacrons = require('../sanitise').sanitiseMacrons;
const sanitise = require('../sanitise').sanitise;

test('macrons', () => {
  expect(sanitiseMacrons('āēīōūĀĒĪŌŪ')).toBe('aaeeiioouuAAEEIIOOUU');
});

test('accents', () => {
  expect(sanitise('áèíóüÁÉÍÓÚ')).toBe('aeiouAEIOU');
});

test('all', () => {
  expect(sanitise('🍦👍āēīōūĀĒĪŌŪê')).toBe('aaeeiioouuAAEEIIOOUUe');
});