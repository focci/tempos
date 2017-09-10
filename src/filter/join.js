const log = require('../tool/log');

const join = (data, connector = ',') => {
    log.checkType('Filter:join()', data, 'array');

    return data.join(connector);
};

module.exports = join;