'use strict';


const mime_fingerpints = [
    [new Buffer([137, 80, 78, 71, 13, 10, 26, 10]), 'png'],
    [new Buffer([255, 216, 255]), 'jpeg'],
    [new Buffer('GIF89a'), 'gif'],
];


module.exports.get_type = (buffer) => {
    for (let [fp, t] of mime_fingerpints) {
        if (buffer.slice(0, fp.length).equals(fp)) {
            return t;
        }
    }
};  // return undefined


module.exports.magick_buffer_noreply = (buffer) => {
    var len = buffer.byteLength;
    if (len === 0) {
        return true;
    }
    if (buffer[0] !== 46) {  // ascii dot
        return true;
    }
    for (let i = 1; i < len; ++i) {
        if ([32, 13, 10, 9].indexOf(buffer[i]) < 0) {
            return true;
        }
    }
    return false;
};
