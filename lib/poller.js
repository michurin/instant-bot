'use strict';

const util = require('util');

const logger = require('./logger');
const sleep = require('./asleep').sleep;
const run_process = require('./run_process').run_process;
const call_api = require('./call_api').call_api;
const proc_info_text = require('./proc_info_text').proc_info_text;
const magick_buffer_noreply = require('./fingerpints').magick_buffer_noreply;
const slave_env = require('./slave_env').slave_env;
const {
    simple_text_message: simple_text_message,
    buffer_to_message: buffer_to_message,
    get_updates_message: get_updates_message,
    get_me_message: get_me_message,
} = require('./message_builder');

const sleep_on_error = 20000;  // ms


async function reply_getme(chat_id, token) {
    try {
        var data = await call_api(get_me_message, token);
        await call_api(simple_text_message(`Bot info (getMe):\n${util.inspect(data)}`, chat_id), token);
    } catch (error) {
        logger.error('Error [getMe]', error);
    }
}


async function reply_process_result(chat_id, username, user_id, text, config) {
    var [code, stderr, stdout] = await run_process(
        config.script,
        text.split(/\s+/),
        slave_env(
            chat_id,
            username,
            user_id,
            config.http_host,
            config.http_port,
            config.pass_env,
            config.force_env
        )
    );
    var message;
    if (code > 0) {
        message = simple_text_message(
            `Error code: ${code}.\nStderr: ${stderr.toString('utf8')}`,
            chat_id
        );
    } else {
        if (magick_buffer_noreply(stdout)) {
            message = buffer_to_message(stdout, chat_id);
        }
    }
    if (message !== undefined) {
        await call_api(message, config.token);
    }
}


function replay(chat_id, username, user_id, text, config) {
    if (text === undefined) {  // Sticker message or any
        call_api(simple_text_message('(no text in message)', chat_id), config.token);
    } else if (text === '.getme') {
        reply_getme(chat_id, config.token);
    } else if (text === '.proc') {
        call_api(simple_text_message(proc_info_text(), chat_id), config.token);
    } else if (config.script) {
        reply_process_result(chat_id, username, user_id, text, config);
    } else {
        call_api(simple_text_message(
            'You have not setup slave script in your configuration file.',
            chat_id
        ), config.token);
    }
}


function process_update(data, config) {  // This function have to be synchronous, else it hangs update loop
    var update_id = 0;
    for (let message_body of data.result) {
        update_id = Math.max(update_id, message_body.update_id);
        let message = message_body.message || message_body.edited_message;
        if (message) {
            let {text: text, chat: {id: chat_id}, from: {id: user_id, username: username}} = message;
            if (username === undefined) {
                username = 'noname_user_' + user_id;
            }
            logger.info(`From ${username}(id=${user_id}) chat_id=${chat_id}: ${text}`);
            if (config.whilelist.includes(user_id) || config.whilelist.includes(username)) {
                replay(chat_id, username, user_id, text, config);
            } else {
                call_api(simple_text_message(
                    `You are [${username}] (id=${user_id}).\nAdd yourself to config.js.`,
                    chat_id
                ), config.token);
            }
        } else {
            logger.error('No message in', util.inspect(message_body, false, null));
        }
    }
    return update_id;
}


const poll = module.exports.poller = async (last_update_id, config) => {
    logger.debug(`Poll. last_update_id=${last_update_id}`);
    try {
        var data = await call_api(get_updates_message(config.polling_timeout, last_update_id), config.token, (config.polling_timeout + 60) * 1000);
        last_update_id = Math.max(process_update(data, config), last_update_id);
    } catch (error) {
        logger.error('Error in polling loop:', error);
        logger.info(`Going to sleep ${sleep_on_error}ms`);
        await sleep(sleep_on_error);
        logger.info('Continue polling after error.');
    }
    poll(last_update_id, config);
};
