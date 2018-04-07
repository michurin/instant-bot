'use strict';


const bin_dash = new Buffer('--');
const bin_nl = new Buffer([13, 10]);


module.exports.pack_multipart = (parts) => {
    const base_bound = Array(21).join('-') + Math.random().toString(36).substring(2);
    const bin_bound = Buffer.concat([bin_dash, new Buffer(base_bound)]);
    const inter_bound = Buffer.concat([bin_bound, bin_nl]);
    const fin_bound = Buffer.concat([bin_bound, bin_dash, bin_nl]);
    var body = [];
    for (let [k, v] of Object.entries(parts)) {
        body.push(inter_bound);
        if (v.mime) {
            body = body.concat([
                new Buffer(`Content-Disposition: form-data; name="${k}"; filename="${k}.${v.ext}"`),
                bin_nl,
                new Buffer(`Content-Type: ${v.mime}`),
                bin_nl,
                bin_nl,
                v.data,
            ]);
        } else {
            body = body.concat([
                new Buffer(`Content-Disposition: form-data; name="${k}"`),
                bin_nl,
                bin_nl,
                v,
            ]);
        }
        body.push(bin_nl);
    }
    body.push(fin_bound);
    return [Buffer.concat(body), base_bound];
};
