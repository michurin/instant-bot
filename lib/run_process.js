'use strict';


const path = require('path');
const spawn = require('child_process').spawn;
const logger = require('./logger');


module.exports.run_process = (command, args, script_env) => {
    return new Promise((resolve) => {
        const proc = spawn(command, args, {
            env: script_env,
            cwd: path.dirname(command),
        });
        logger.debug(`Spawn process PID=${proc.pid} with args ${args}`);
        var stdout = [];
        var stderr = [];
        proc.stdout.on('data', data => {
            stdout.push(data);
        });
        proc.stderr.on('data', data => {
            stderr.push(data);
        });
        proc.on('close', code => {
            logger.debug(`Result of process PID=${proc.pid} is ready`);
            resolve([code, Buffer.concat(stderr), Buffer.concat(stdout)]);
        });
    });
};
