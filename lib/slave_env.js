'use strict';


module.exports.slave_env = (chat_id, username, user_id, http_host, http_port, pass_env, force_env) => {
    var env = {};
    for (let k of pass_env) {
        let v = process.env[k];
        if (v !== undefined) {
            env[k] = v;
        }
    }
    for (let [k, v] of Object.entries(force_env)) {
        env[k] = v;
    }
    env['TG_CHAT_ID'] = chat_id;
    env['TG_USER_NAME'] = username;
    env['TG_USER_ID'] = user_id;
    if (http_host) {
        env['TG_HTTP_HOST'] = http_host;
    }
    if (http_port) {
        env['TG_HTTP_PORT'] = http_port;
    }
    return env;
};
