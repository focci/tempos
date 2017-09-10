const Cache = require('../tool/cache');
const esCache = new Cache();
const rRep = /[<>\"\'&]/g; // eslint-disable-line

let robj = {};
['&','<','>','"',"'"].forEach(function(it) { // eslint-disable-line
    const code = it.charCodeAt(0);
    robj[ code ] = '&#'+code+';';
});

const escape = (data) => {
    return esCache.detail(data, ()=>{
        return rRep.test(data) ? data.replace(rRep, function(it) {
            return robj[ it.charCodeAt(0) ] || it;
        }) : data;
    });
};

module.exports = escape;