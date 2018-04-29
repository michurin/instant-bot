'use strict';

const process = require('process');
const os = require('os');

const version = require('./version').version;
const format_text = require('./format_text');


module.exports.proc_info_text = () => {
    const mem = process.memoryUsage();
    return [
        `bot version/pid: ${version}/${process.pid}`,
        `mem rss: ${format_text.number_with_commas(mem.rss)}`,
        `mem heap total: ${format_text.number_with_commas(mem.heapTotal)}`,
        `mem heap used: ${format_text.number_with_commas(mem.heapUsed)}`,
        `mem external: ${format_text.number_with_commas(mem.external)}`,
        `cwd: ${process.cwd()}`,
        `hostname: ${os.hostname()}`,
        `uptime: ${format_text.readable_time(process.uptime())}`,
        `node version: ${process.version}`,
    ].join('\n');
};
