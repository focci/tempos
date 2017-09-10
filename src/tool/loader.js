const config = require('../config');
const Cache = require('./cache');
const fileCache = new Cache();

const loader = (source, obj) => {
    let ret = '';
    if( config.isNode ) {
        const fs = require('fs');
        const path = require('path');
        source = path.resolve( path.dirname(config.filepath), source );
        if( !path.extname( source) ) {
            source += config.extname;
        }
        if( obj ) {
            obj.fnName = path.basename(source, config.extname);
        }
        ret = fileCache.detail(source, () => {
            return fs.readFileSync(source, 'utf8');
        });
    }
    else {
        const el = document.querySelector(source);
        if( el ) {
            ret = el.value || el.innerHTML;
        }
    }
    return ret;
};
module.exports = loader;