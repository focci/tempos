const Type = require('../tool/type');

const eq = (data, index = 0) => {
    let ret;
    let isObj = Type.check(data, 'object');
    if( !(Type.check(data, 'array') || isObj || Type.check(data, 'string')) ) {
        return ret;
    }
    if( 'last' === index ) {
        if( isObj ) {
            for( let key in data ) {
                ret = data[key];
            }
        }
        else {
            ret = data[ data.length-1 ];
        }
    }
    else {
        ret = data[index];
    }
    return ret; 
};

module.exports = eq;