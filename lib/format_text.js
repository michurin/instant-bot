'use strict';


function pad2(x) {
    return ('0' + x).substr(-2);
}


function asis(x) {
    return x;
}


module.exports.readable_time = (seconds) => {
    var t = Math.floor(seconds);
    var parts = [];
    var a, b;
    for (var [w, sfx, proc] of [[60, '', pad2], [60, ':', pad2], [24, ':', pad2], [7, 'd ', asis], [undefined, 'w ', asis]]) {
        if (w !== undefined) {
            a = t % w;
            b = (t - a) / w;
        } else {
            a = t;
            b = 0;
        }
        parts.unshift(proc(a) + sfx);
        if (b === 0) {
            break;
        }
        t = b;
    }
    return parts.join('');
};


module.exports.number_with_commas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
