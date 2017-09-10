const log = require('../tool/log');

const replace = (data, older, newer) => {
    log.checkType('Filter:replace()', data, 'string');

    return data.replace(older, newer);
};

module.exports = replace;