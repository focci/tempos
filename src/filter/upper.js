const log = require('../tool/log');

const upper = (data, flag) => {
    log.checkType('Filter:upper()', data, 'string');

    let ret;
    switch(flag) {
    case true:
        ret = data.replace(/\b[a-z]\w*\b/g, function(word) {
            return word.substr(0,1).toUpperCase() + word.substr(1);
        });
        break;
    default:
        ret = data.toUpperCase();
    }
    return ret || data;
};

module.exports = upper;