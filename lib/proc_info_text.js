'use strict';

const process = require('process');
const os = require('os');

const version = require('./version').version;


function number_with_commas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}


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
    const mem = process.memoryUsage();
    return [
        `bot version/pid: ${version}/${process.pid}`,
        `mem rss: ${number_with_commas(mem.rss)}`,
        `mem heap total: ${number_with_commas(mem.heapTotal)}`,
        `mem heap used: ${number_with_commas(mem.heapUsed)}`,
        `mem external: ${number_with_commas(mem.external)}`,
        `cwd: ${process.cwd()}`,
        `hostname: ${os.hostname()}`,
        `uptime: ${readable_time(process.uptime())}`,
        `node version: ${process.version}`,
    ].join('\n');
};
