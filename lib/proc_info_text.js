'use strict';

const process = require('process');
const os = require('os');

const version = require('./version').version;


function pad2(x) {
    return ('0' + x).substr(-2);
}


function readable_time(seconds) {
    var t = Math.floor(seconds);
    var parts = [];
    for (var w of [60, 60, 24]) {
        var a = t % w;
        var b = (t - a) / w;
        parts.push(a);
        t = b;
    }
    return `${t}d ${pad2(parts[2])}:${pad2(parts[1])}:${pad2(parts[0])}`;
}


module.exports.proc_info_text = () => {
    return [
        `bot version: ${version}`,
        `memory rss: ${Math.floor(process.memoryUsage().rss / 1024 / 1024)}M`,
        `node version: ${process.version}`,
        `pid: ${process.pid}`,
        `cwd: ${process.cwd()}`,
        `hostname: ${os.hostname()}`,
        `uptime: ${readable_time(process.uptime())}`,
    ].join('\n');
};
