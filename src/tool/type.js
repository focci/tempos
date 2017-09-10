const oneobj = require('./oneobj');
const DATA_TYPE_ARR = oneobj('Boolean Number String Function Array Object RegExp Set Map process');

for( let key in DATA_TYPE_ARR ) {
    DATA_TYPE_ARR['[object ' + key + ']'] = key.toLowerCase();
}

module.exports = {
    check: function(obj, type) {
        var types = null == obj ? '' + obj : DATA_TYPE_ARR[ Object.prototype.toString.call(obj) ] || 'object';
        return void 0 !== type ? type === types : types;
    }
};