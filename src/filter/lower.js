const log = require('../tool/log');

const lower = (data) => {
    log.checkType('Filter:lower()', data, 'string');

    return data.toLowerCase();
};

module.exports = lower;