/* global it, describe */


'use strict';


const assert = require('assert');
const fp = require('../lib/fingerpints');


describe('Test data fingerpints', function() {
    it('known file type', function() {
        assert.equal('gif', fp.get_type(new Buffer('GIF89a')));
    });
    it('unknown file type', function() {
        assert.equal(undefined, fp.get_type(new Buffer('xxx')));
    });
    it('blank message marker', function() {
        assert.equal(false, fp.magick_buffer_noreply(new Buffer('. \n\r')));
    });
    it('none blank message marker', function() {
        assert.equal(true, fp.magick_buffer_noreply(new Buffer(' .')));
    });
});
