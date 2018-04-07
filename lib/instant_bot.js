'use strict';


const util = require('util');

const logger = require('./logger');
const config_loader = require('./config_loader').config_loader;
const http_server = require('./http_server').http_server;
const poll = require('./poller').poller;
const version = require('./version').version;


module.exports.main = () => {
    logger.info(`Starting version ${version}...`);
    var config = config_loader();
    logger.set_debug(config.debug);
    logger.debug(`Use config file ${config.cinfig_file}`, util.inspect(config));
    // we read config only here and pass it everywere as argument, it makes
    // possible (in future) to rasie multiply bots in one nodejs instance
    poll(0, config);
    http_server(config.http_host, config.http_port, config.token);
};
