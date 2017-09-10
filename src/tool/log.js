const config = require('../config');
const Type = require('../tool/type');

const print = (msg) => {
    /* eslint-disable */
    if( config.debug && console && console.log ) {
        console.log(msg);
    }
    /* eslint-enable */
};

const checkType = (name, data, type) => {
    if( config.debug && !Type.check(data, type) ) {
        throw new TypeError(name + ' Parameter type must be ' + type + '.');
    }
};
module.exports = {
    print: print,
    checkType: checkType
};