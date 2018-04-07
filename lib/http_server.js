'use strict';


const http = require('http');
const url = require('url');

const logger = require('./logger');
const call_api = require('./call_api').call_api;

const buffer_to_message = require('./message_builder').buffer_to_message;


module.exports.http_server = (host, port, token) => {
    if (! (host && port)) {
        return;
    }
    logger.info(`Start server on ${host}:${port}`);
    http.createServer((req, res) => {
        const params = new url.URLSearchParams(url.parse(req.url).query);
        var chat_id = params.get('chat_id');
        logger.info(`HTTP message to: chat_id=${chat_id}`);
        if (typeof chat_id === 'string' && chat_id.match(/^\d{1,12}$/)) {
            chat_id = parseInt(chat_id);
        }
        var parts = [];
        if (req.method === 'POST') {
            req.on('data', data => {
                parts.push(data);
            });
            req.on('end', async () => {
                if (typeof chat_id !== 'number') {
                    res.statusCode = 400;
                    res.end(`Invalid chat_id=${chat_id}\n`);
                } else {
                    const body = Buffer.concat(parts);
                    try {
                        await call_api(buffer_to_message(
                            body,
                            chat_id
                        ), token);
                        res.end('Ok\n');
                    } catch (error) {
                        res.statusCode = 400;
                        res.end('Error: ' + JSON.stringify(error) + '\n');
                    }
                }
            });
        } else {
            res.statusCode = 405;
            res.end('Use POST method!\n');
        }
    }).listen(port, host);
};
