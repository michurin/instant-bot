/* global it, describe */

'use strict';

const assert = require('assert');
const pack_multipart = require('../lib/pack_multipart').pack_multipart;


describe('Multipart message test', () => {
    it('bounds', () => {
        const [data, bound] = pack_multipart({
            a: new Buffer('A'),
            b: new Buffer('B'),
        });
        const lines = data.toString('utf8').split('\r\n');
        assert.equal(lines.length, 10);
        assert.equal(lines[0], '--' + bound);
        assert.equal(lines[4], '--' + bound);
        assert.equal(lines[8], '--' + bound + '--');
        assert.equal(lines[9], '');
    });
    it('default mime type', () => {
        const [data, bound] = pack_multipart({  // eslint-disable-line no-unused-vars
            a: new Buffer('A'),
        });
        const lines = data.toString('utf8').split('\r\n');
        assert.equal(lines.length, 6);
        assert.equal(lines[1], 'Content-Disposition: form-data; name="a"');
        assert.equal(lines[2], '');
        assert.equal(lines[3], 'A');
    });
    it('Photo mime type', () => {
        const [data, bound] = pack_multipart({  // eslint-disable-line no-unused-vars
            photo: {
                data: new Buffer('A'),
                mime: 'image/png',
                ext: 'png',
            },
        });
        const lines = data.toString('utf8').split('\r\n');
        assert.equal(lines.length, 7);
        assert.equal(lines[1], 'Content-Disposition: form-data; name="photo"; filename="photo.png"');
        assert.equal(lines[2], 'Content-Type: image/png');
        assert.equal(lines[3], '');
        assert.equal(lines[4], 'A');
    });
});
