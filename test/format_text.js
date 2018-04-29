/* global it, describe */

'use strict';

const assert = require('assert');
const format_text = require('../lib/format_text');


describe('Readable time test', () => {
    it('zero', () => {assert.equal(format_text.readable_time(0), '00');});
    it('seconds', () => {assert.equal(format_text.readable_time(1), '01');});
    it('minutes', () => {assert.equal(format_text.readable_time(2 * 60 + 1), '02:01');});
    it('hours', () => {assert.equal(format_text.readable_time((3 * 60 + 2) * 60 + 1), '03:02:01');});
    it('days', () => {assert.equal(format_text.readable_time(((4 * 24 + 3) * 60 + 2) * 60 + 1), '4d 03:02:01');});
    it('week', () => {assert.equal(format_text.readable_time((((7 + 4) * 24 + 3) * 60 + 2) * 60 + 1), '1w 4d 03:02:01');});
});

describe('Numbers with commas', () => {
    it('zero', () => {assert.equal(format_text.number_with_commas(0), '0');});
    it('1 digit', () => {assert.equal(format_text.number_with_commas(1), '1');});
    it('2 digits', () => {assert.equal(format_text.number_with_commas(12), '12');});
    it('3 digits', () => {assert.equal(format_text.number_with_commas(123), '123');});
    it('4 digits', () => {assert.equal(format_text.number_with_commas(1234), '1,234');});
    it('6 digits', () => {assert.equal(format_text.number_with_commas(123456), '123,456');});
    it('7 digits', () => {assert.equal(format_text.number_with_commas(1234567), '1,234,567');});
});
