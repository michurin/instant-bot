'use strict';


const fs = require('fs');
const path = require('path');
const process = require('process');

const logger = require('./logger');


module.exports.config_loader = () => {
    var config_file = path.resolve(process.env.TG_BOT_CONFIG || 'config.json');
    logger.debug(`Loading configuration from ${config_file}`);  // Yes, it never fired yet
    var config = JSON.parse(fs.readFileSync(config_file, 'utf8'));
    // TODO: It's a good place to check all options
    config.config_file = config_file;
    if (config.script !== undefined) {
        config.script = path.resolve(path.dirname(config_file), config.script);
    }
    return config;
};
