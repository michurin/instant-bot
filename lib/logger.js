'use strict';


var debug_mode = false;
var is_tty = process.stdout.isTTY || process.stdout.isTTY ? 'tty' : 'stream';
var level_descriptions = {
    debug: {
        if_not_debug: false,
        tty: [{
            label: '\x1b[34mDEBUG\x1b[0m',
            method: 'log',
        }],
        stream: [{
            label: 'DEBUG',
            method: 'log',
        }],
    },
    info: {
        if_not_debug: true,
        tty: [{
            label: '\x1b[32mINFO\x1b[0m',
            method: 'log',
        }],
        stream: [{
            label: 'INFO',
            method: 'log',
        }],
    },
    error: {
        if_not_debug: true,
        tty: [{
            label: '\x1b[1;33;41mERROR\x1b[0m',
            method: 'log',
        }],
        stream: [{  // mirror error to both logs
            label: 'ERROR',
            method: 'log',
        }, {
            label: 'ERROR',
            method: 'error',
        }],
    },
};


function print(level, args) {
    if (level_descriptions[level].if_not_debug || debug_mode) {
        for (var {label: label, method: method} of level_descriptions[level][is_tty]) {
            console[method].apply(console, [new Date().toISOString(), process.pid, label].concat(args));  // eslint-disable-line no-console
        }
    }
}


for (var k of Object.keys(level_descriptions)) {
    module.exports[k] = ((k) => (...args) => {
        print(k, args);
    })(k);
}


module.exports.set_debug = (mode) => {
    debug_mode = mode;
};
