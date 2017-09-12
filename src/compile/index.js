const Compiler = require('./compiler');
const Cache = require('../tool/cache');
const config = require('../config');
const loader = require('../tool/loader');
const filter= require('../filter/index');
const Type = require('../tool/type');

const fnCache = new Cache();

const compile = (source, option = {}) => {
    const types = Type.check(source);
    if( 'object' === types ) {
        option = source;
    }
    else if( 'string' === types ) {
        config.filepath = source;
        option.template = loader(source);
    }
    config.filepath = config.filepath || option.filepath;
    option.template = option.template.trim();
    return fnCache.detail(option.template, () => {
        return new Compiler(option).build().bind(filter);
    });
};

module.exports = compile;