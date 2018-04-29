/* global it, describe */

'use strict';

const assert = require('assert');
const fp = require('../lib/fingerpints');


describe('Test data fingerpints', () => {
    it('known file type', () => {
        assert.equal('gif', fp.get_type(new Buffer('GIF89a')));
    });
    it('unknown file type', () => {
        assert.equal(undefined, fp.get_type(new Buffer('xxx')));
    });
    it('blank message marker', () => {
        assert.equal(false, fp.magick_buffer_noreply(new Buffer('. \n\r')));
    });
    it('none blank message marker', () => {
        assert.equal(true, fp.magick_buffer_noreply(new Buffer(' .')));
    });
});
