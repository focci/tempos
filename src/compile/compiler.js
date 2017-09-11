const Cache = require('../tool/cache');
const config= require('../config');
const loader= require('../tool/loader');

const fnCache = new Cache();
const expCache = new Cache();
const tokenCache = new Cache();
const strCache = new Cache();
const rQACache = new Cache();
const filterCache = new Cache();
const fnBodyCache = new Cache();

const DATA = '$__data__';
const OUT = '$__out__';
const FILTER = '$__filter__';
const RDEF_EXP = /#def\.([$_a-zA-Z](?:\w+)?)/;
const RUSE_EXP = /#use\.([$_a-zA-Z](?:\w+)?)/;
const RINCLUDE_EXP = /(include\s+)(?:\'|\")([^\'\"]+)(?:\'|\")(?:\s+)?([\w\W]+)?/; // eslint-disable-line
const REXTEND_EXP = /(extend\s+)(?:\'|\")([^\'\"]+)(?:\'|\")(?:\s+)?([\w\W]+)?/; // eslint-disable-line
const RVCODE = /[\w_$]/;
const RVAR_PREFIX = /^[a-zA-Z_$]/;

const createFnBody = (self) => {
    return fnBodyCache.detail(self.template, () => {
        let key;
        let fnbody = '';
        let subs = '';
        let vars = `var ${OUT} = '',${FILTER}=this`;
        
        // Add variable
        for( key in self.vars ) {
            vars += `,${key}=${DATA}.${key}`;
        }
        vars += ';\n';
    
        self.tokens.forEach(function(tok) {
            const flag = tok.def || tok.use || tok.include;
    
            if( tok.def || tok.include || tok.extend ) {
                subs += `var ${tok.fnName}=function(${DATA}) {\n` + createFnBody(tok.compile) + '};\n';
            }
            if( tok.use || tok.include || tok.extend ) {
                fnbody += `${OUT} += ${tok.fnName}.call(${FILTER}, ${tok.params || DATA});\n`;
            }
            else if( !flag && false === tok.out ) {
                fnbody += `${tok.source}\n`;
            }
            else if( !flag ) {
                fnbody += `${OUT} += ` + (tok.out ? addFilters(tok) : `'${tok.source}'`) + ';\n';
            }
        });
        fnbody += `return ${OUT};\n`;
        return vars + subs + fnbody;
    });
};

const getTokenAndVars = (self) => {
    const cnt = self.template;
    return tokenCache.detail(cnt, () => {
        let start = 0, end, ret = {
            token: [],
            vars: {}
        };
        while( -1 !== (end = cnt.indexOf(config.startTag, start)) ) {
            if( end > start ) {
                ret.token.push({
                    source: replaceQuotesAndEnter( cnt.substring(start, end) )
                });
            }
            start = parseExpression(self, ret.token, ret.vars, end + config.endTag.length);
        }

        if( start < self.template.length ) {
            ret.token.push({
                source: replaceQuotesAndEnter( cnt.substring(start) )
            });
        }

        self.tokens = ret.token;
        self.vars = ret.vars;
        return ret;
    });
};

const replaceQuotesAndEnter = (str) => {
    return rQACache.detail(str, () => {
        let prev, c, s, res='', i=-1, len=str.length;
        while( i++ < len ) {
            prev = c;
            c = str.charCodeAt(i);
            s = str.charAt(i);
            switch(c) {
            case 0x27:
            case 0x22:
                res += (prev !== 0x5C ? '\\' : '') + s;
                break;
            case 0x0d:
                res += '\\r';
                break;
            case 0x0a:
                res += '\\n';
                break;
            default:
                res += s;
            }
        }
        return res;
    });
};

const parseExpression = (self, token, vars, start) => {
    const cnt = self.template;
    
    const res = expCache.detail(cnt+start, () => {
        let ret, exps, end, sdiff = 0, ediff = 0;

        end = cnt.indexOf(config.endTag, start);
        exps = cnt.substring(start, end).trim();
        const tmp = {
            out: false,
            escape: false
        };
    
        // {{#def ... #}}
        if( (ret = exps.match(RDEF_EXP)) ) {
            tmp.def = true;
            tmp.fnName = ret[1];
            sdiff = ret[0].length;
            end = cnt.indexOf('#'+config.endTag, start);
            ediff = 1;
        }
        // {{#use ... }}
        else if( (ret = exps.match(RUSE_EXP)) ) {
            tmp.use = true;
            tmp.fnName = ret[1];
            sdiff = ret[0].length;
        }
        // {{include ... }}
        else if( (ret = exps.match(RINCLUDE_EXP)) ) {
            tmp.include = true;
            tmp.path = ret[2];
            tmp.params = ret[3];
            sdiff = ret[1].length;
        }
        // {{extend ... }}
        else if( (ret = exps.match(REXTEND_EXP)) ) {
            tmp.extend = true;
            tmp.out = true;
            tmp.path = ret[2];
            tmp.params = ret[3];
            sdiff = ret[1].length;
        }
        else {
            switch( exps.charCodeAt(0) ) {
            case 0x3d: // =
                sdiff = 1;
                tmp.escape = true;
                tmp.out = true;
                break;
            case 0x2d: // -
                sdiff = 1;
                tmp.out = true;
                break;
            }
        }
        exps = cnt.substring(start+sdiff, end);
        
        if( tmp.def ) {
            tmp.source = exps;
            tmp.compile = new Compiler({
                template: exps
            });
        }
        else if( tmp.use ) {
            tmp.params = exps;
        }
        else if( tmp.include || tmp.extend ) {
            tmp.source = loader(tmp.path, tmp);
            tmp.compile = new Compiler({
                template: tmp.source
            });
        }
        else {
            ret = addvars(exps, vars);
            tmp.source = ret.source;
            tmp.filter = ret.filter;
        }

        // 添加变量
        if( (tmp.use || tmp.include) && tmp.params ) {
            addvars(tmp.params, vars);
        }
    
        token.push(tmp);
        return {
            end: end,
            ediff: ediff
        };
    });
    return res.end + config.endTag.length + res.ediff;
};

const parseStr =  (source) => {
    const cnt = source.trim();
    return strCache.detail(cnt, () => {    
        const len = cnt.length;
        let c, s, prev, curF;
        let i = -1;
        let vars = '';
        let exps = '';
        let fts = '';
        let varObj = {};
        let filter = {};
        let inF = false;
        let inS = false;
        let newF = false;
        
        while( i++ < len ) {
            prev = c;
            c = cnt.charCodeAt(i);
            s = cnt.charAt(i);
            //
            if( (c === 0x27 || c === 0x22) && prev !== 0x5C ) { //0x27:' 0x22:" 0x5C:\
                inS = !inS;
            }
            else if(!inS && c === 0x7C && prev !== 0x7C && cnt.charCodeAt(i+1) !== 0x7C) { // |
                newF = inF = true;
            }
            if( inF && (!inS && c===0x20 || i===len ) ) {
                fts = fts.trim();
                if( fts.charCodeAt(0) === 0x7C ) {
                    newF = true;
                }
                else if( newF ) {
                    filter[ curF = fts ] = [];
                    newF = false;
                }
                else {
                    filter[curF].push(fts);
                }
                fts = '';
            }
            else if( inF ) {
                fts += s;
            }
            if( !RVCODE.test(s) ) {
                vars = vars.trim();
                RVAR_PREFIX.test(vars) && !filter[vars] ? varObj[vars] = true : null;
                vars = '';
            }
            // Variable
            if( !inS ) { vars += s; }
            // Expression
            if( !inF ) { exps += s; }
        }
    
        return {
            source: exps.trim(),
            vars: varObj,
            filter: filter
        };
    });
};

const addvars = (str, vars) => {
    let ret = parseStr( str.trim() );
    for( let key in ret.vars ) {
        !config.ignore[key] ? vars[key] = true : null;
    }
    return ret;
};

const addFilters = (tok) => {
    return filterCache.detail(JSON.stringify(tok), ()=>{
        let filters = tok.escape ? `${FILTER}.escape(` + tok.source + ')' : tok.source;

        for(let key in tok.filter) {
            if( tok.escape && key === 'escape' ) continue;
            
            let params = ')';
            if( tok.filter[key].length ) {
                params = ',' + tok.filter[key].join(',')+')';
            }
            filters = `${FILTER}.${key}(${filters}` + params;
        }
        return filters;
    });
};

class Compiler {
    constructor(option) {
        this.template = option.template;
        this.tokens = null;
        this.vars = {};
        getTokenAndVars(this);
    }

    build() {
        const self = this;
        return fnCache.detail(self.template, ()=>{
            return new Function(DATA, createFnBody(self));
        });
    }
}

module.exports = Compiler;