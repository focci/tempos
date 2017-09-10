const log = require('../tool/log');

const trim = (data) => {
    log.checkType('Filter:trim()', data, 'string');

    return String.prototype.trim.call(data);
};

module.exports = trim;