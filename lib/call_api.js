'use strict';


const https = require('https');

const logger = require('./logger');

const default_network_timeout = 10000;  // ms


module.exports.call_api = ({data: buffer, method: method, type: content_type}, token, network_timeout) => {
    network_timeout = network_timeout || default_network_timeout;
    return new Promise((resolve, reject) => {
        var http_status = NaN;
        var buffers = [];
        const options = {
            hostname: 'api.telegram.org',
            port: 443,
            path: '/bot' + token + '/' + method,
            method: 'POST',
            headers: {
                'Content-type': content_type,
                'Content-Length': buffer.byteLength,
            },
        };
        const req = https.request(options, resp => {
            http_status = resp.statusCode;
            if (http_status !== 200) {
                logger.error(`API HTTP Error: ${http_status}`);
            }
            resp.on('data', chunk => {
                buffers.push(chunk);
            });
        });
        req.on('socket', sock => {
            sock.on('close', had_error => {
                // We have to emit results only when socket is completely closed
                // to avoid concurent getUpdate requests.
                if (had_error) {
                    logger.error('Socket error');
                    reject(new Error('Socket error'));
                    return;
                }
                var body = Buffer.concat(buffers).toString('utf8');
                if (http_status !== 200) {
                    logger.debug(`Error [status=${http_status}] body: ${body}`);
                    reject(new Error(`HTTP error ${http_status}`));
                    return;
                }
                try {
                    var mess = JSON.parse(body);  // Yes. It may be html
                    logger.debug('API Response:', mess);
                    if (mess && mess.ok) {
                        resolve(mess);
                    } else {
                        logger.error('Reply not OK', mess);
                        reject(new Error('Reply not OK'));
                    }
                } catch (err) {
                    logger.error('Can not parse data:', body);
                    reject(new Error('Can not parse JSON'));
                }
            });
        });
        req.on('error', error => {  // To avoid unhandled 'error' event
            logger.error(`https.request error: ${error}`);
        });
        req.on('timeout', () => {  // v0.7.8 req
            req.abort();
        });
        req.setTimeout(network_timeout);
        req.write(buffer);
    });
};
