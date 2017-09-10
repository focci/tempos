const oneobj = require('./tool/oneobj');
const Type = require('./tool/type');

const config = {
    debug: true,

    cache: true,

    startTag: '{{',

    endTag: '}}',

    extname: '.temp',

    filepath: null,

    isNode: (function() {
        let flag = false;
        try{
            flag = global && Type.check(global.process, 'process');
        } catch (e){//
        }
        return flag;
    })(),

    ignore: (function() {
        const KEYS = '$__data__ $__filter__ $__out__ '+
            'do if for let new try var case else with await break true false '+
            'catch class const super throw while yield delete export import return switch default '+
            'extends finally continue debugger function arguments instanceof typeof catch void this in try';

        return oneobj(KEYS);
    })()
};
module.exports = config;