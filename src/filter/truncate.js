const log = require('../tool/log');

const truncate = (data, length=255, end='...') => {
    log.checkType('Filter:truncate()', data, 'string');

    return data.length > length ? data.substr(0, length) + end : data;
};

module.exports = truncate;