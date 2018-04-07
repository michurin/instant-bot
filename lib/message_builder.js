'use strict';


const pack_multipart = require('./pack_multipart').pack_multipart;
const get_type = require('./fingerpints').get_type;


const simple_text_message = module.exports.simple_text_message = (text, chat_id) => {
    const len = text.length;
    if (len === 0) {
        text = '(empty message)';
    } else if (len > 4096) {
        text = text.substr(0, 2040) + '\n[…]\n' + text.substr(-2040);
    }
    return {
        method: 'sendMessage',
        type: 'application/json',
        data: new Buffer(JSON.stringify({
            text: text,
            chat_id: chat_id,
            disable_web_page_preview: true,
        })),
    };
};


module.exports.buffer_to_message = (buffer, chat_id) => {
    var type = get_type(buffer);
    if (type) {
        let [data, bound] = pack_multipart({
            photo: {
                data: buffer,
                mime: `image/${type}`,
                ext: type,
            },
            chat_id: new Buffer(chat_id.toString(10)),
        });
        return {
            method: 'sendPhoto',
            type: `multipart/form-data; boundary=${bound}`,
            data: data,
        };
    }
    return simple_text_message(buffer.toString('utf8'), chat_id);
};


module.exports.get_me_message = {  // not a functions
    method: 'getMe',
    type: 'application/json',
    data: new Buffer('{}'),
};


module.exports.get_updates_message = (polling_timeout, last_update_id) => {
    var data = {
        timeout: polling_timeout,
    };
    if (last_update_id) {
        data.offset = last_update_id + 1;
    }
    return {
        method: 'getUpdates',
        type: 'application/json',
        data: new Buffer(JSON.stringify(data)),
    };
};
