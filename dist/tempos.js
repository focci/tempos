/*!
 * Tempos v1.0.2
 * (c) 2017 Focci
 * Under the MIT License
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('fs'), require('path')) :
	typeof define === 'function' && define.amd ? define(['fs', 'path'], factory) :
	(global.Tempos = factory(global.fs,global.path));
}(this, (function (fs,path) { 'use strict';

fs = fs && fs.hasOwnProperty('default') ? fs['default'] : fs;
path = path && path.hasOwnProperty('default') ? path['default'] : path;

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var oneobj = function oneobj(source) {
    var obj = {};
    source.replace(/([$_\w]+)/g, function (word) {
        obj[word] = true;
    });
    return obj;
};

var DATA_TYPE_ARR = oneobj('Boolean Number String Function Array Object RegExp Set Map process');

for (var key in DATA_TYPE_ARR) {
    DATA_TYPE_ARR['[object ' + key + ']'] = key.toLowerCase();
}

var type = {
    check: function check(obj, type) {
        var types = null == obj ? '' + obj : DATA_TYPE_ARR[Object.prototype.toString.call(obj)] || 'object';
        return void 0 !== type ? type === types : types;
    }
};

var config = {
    debug: true,

    cache: true,

    startTag: '{{',

    endTag: '}}',

    extname: '.temp',

    filepath: null,

    isNode: function () {
        var flag = false;
        try {
            flag = global && type.check(global.process, 'process');
        } catch (e) {//
        }
        return flag;
    }(),

    ignore: function () {
        var KEYS = '$__data__ $__filter__ $__out__ ' + 'do if for let new try var case else with await break true false ' + 'catch class const super throw while yield delete export import return switch default ' + 'extends finally continue debugger function arguments instanceof typeof catch void this in try';

        return oneobj(KEYS);
    }()
};
var config_1 = config;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var Caches = function () {
    function Caches() {
        classCallCheck(this, Caches);

        this._data = Object.create(null);
    }

    createClass(Caches, [{
        key: 'get',
        value: function get$$1(key) {
            return config_1.cache ? this._data[key] : null;
        }
    }, {
        key: 'set',
        value: function set$$1(key, val) {
            if (config_1.cache) {
                this._data[key] = val;
            }
        }
    }, {
        key: 'detail',
        value: function detail(key, callback) {
            var self = this,
                ret = void 0;
            if (!(ret = self.get(key))) {
                self.set(key, ret = callback());
            }
            return ret;
        }
    }]);
    return Caches;
}();

var cache = Caches;

var loader_1 = createCommonjsModule(function (module) {
    var fileCache = new cache();

    var loader = function loader(source, obj) {
        var ret = '';
        if (config_1.isNode) {
            var fs$$1 = fs;
            var path$$1 = path;
            source = path$$1.resolve(path$$1.dirname(config_1.filepath), source);
            if (!path$$1.extname(source)) {
                source += config_1.extname;
            }
            if (obj) {
                obj.fnName = path$$1.basename(source, config_1.extname);
            }
            ret = fileCache.detail(source, function () {
                return fs$$1.readFileSync(source, 'utf8');
            });
        } else {
            var el = document.querySelector(source);
            if (el) {
                ret = el.value || el.innerHTML;
            }
        }
        return ret;
    };
    module.exports = loader;
});

var compiler = createCommonjsModule(function (module) {
    var fnCache = new cache();
    var expCache = new cache();
    var tokenCache = new cache();
    var strCache = new cache();
    var rQACache = new cache();
    var filterCache = new cache();
    var fnBodyCache = new cache();

    var DATA = '$__data__';
    var OUT = '$__out__';
    var FILTER = '$__filter__';
    var RDEF_EXP = /#def\.([$_a-zA-Z](?:\w+)?)/;
    var RUSE_EXP = /#use\.([$_a-zA-Z](?:\w+)?)/;
    var RINCLUDE_EXP = /(include\s+)(?:\'|\")([^\'\"]+)(?:\'|\")(?:\s+)?([\w\W]+)?/; // eslint-disable-line
    var REXTEND_EXP = /(extend\s+)(?:\'|\")([^\'\"]+)(?:\'|\")(?:\s+)?([\w\W]+)?/; // eslint-disable-line
    var RVCODE = /[\w_$]/;
    var RVAR_PREFIX = /^[a-zA-Z_$]/;

    var createFnBody = function createFnBody(self) {
        return fnBodyCache.detail(self.template, function () {
            var key = void 0;
            var fnbody = '';
            var subs = '';
            var vars = 'var ' + OUT + ' = \'\',' + FILTER + '=this';

            // Add variable
            for (key in self.vars) {
                vars += ',' + key + '=' + DATA + '.' + key;
            }
            vars += ';\n';

            self.tokens.forEach(function (tok) {
                var flag = tok.def || tok.use || tok.include;

                if (tok.def || tok.include || tok.extend) {
                    subs += 'var ' + tok.fnName + '=function(' + DATA + ') {\n' + createFnBody(tok.compile) + '};\n';
                }
                if (tok.use || tok.include || tok.extend) {
                    fnbody += OUT + ' += ' + tok.fnName + '.call(' + FILTER + ', ' + (tok.params || DATA) + ');\n';
                } else if (!flag && false === tok.out) {
                    fnbody += tok.source + '\n';
                } else if (!flag) {
                    fnbody += OUT + ' += ' + (tok.out ? addFilters(tok) : '\'' + tok.source + '\'') + ';\n';
                }
            });
            fnbody += 'return ' + OUT + ';\n';
            return vars + subs + fnbody;
        });
    };

    var getTokenAndVars = function getTokenAndVars(self) {
        var cnt = self.template;
        return tokenCache.detail(cnt, function () {
            var start = 0,
                end = void 0,
                ret = {
                token: [],
                vars: {}
            };
            while (-1 !== (end = cnt.indexOf(config_1.startTag, start))) {
                if (end > start) {
                    ret.token.push({
                        source: replaceQuotesAndEnter(cnt.substring(start, end))
                    });
                }
                start = parseExpression(self, ret.token, ret.vars, end + config_1.endTag.length);
            }

            if (start < self.template.length) {
                ret.token.push({
                    source: replaceQuotesAndEnter(cnt.substring(start))
                });
            }

            self.tokens = ret.token;
            self.vars = ret.vars;
            return ret;
        });
    };

    var replaceQuotesAndEnter = function replaceQuotesAndEnter(str) {
        return rQACache.detail(str, function () {
            var prev = void 0,
                c = void 0,
                s = void 0,
                res = '',
                i = -1,
                len = str.length;
            while (i++ < len) {
                prev = c;
                c = str.charCodeAt(i);
                s = str.charAt(i);
                switch (c) {
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

    var parseExpression = function parseExpression(self, token, vars, start) {
        var cnt = self.template;

        var res = expCache.detail(cnt + start, function () {
            var ret = void 0,
                exps = void 0,
                end = void 0,
                sdiff = 0,
                ediff = 0;

            end = cnt.indexOf(config_1.endTag, start);
            exps = cnt.substring(start, end).trim();
            var tmp = {
                out: false,
                escape: false
            };

            // {{#def ... #}}
            if (ret = exps.match(RDEF_EXP)) {
                tmp.def = true;
                tmp.fnName = ret[1];
                sdiff = ret[0].length;
                end = cnt.indexOf('#' + config_1.endTag, start);
                ediff = 1;
            }
            // {{#use ... }}
            else if (ret = exps.match(RUSE_EXP)) {
                    tmp.use = true;
                    tmp.fnName = ret[1];
                    sdiff = ret[0].length;
                }
                // {{include ... }}
                else if (ret = exps.match(RINCLUDE_EXP)) {
                        tmp.include = true;
                        tmp.path = ret[2];
                        tmp.params = ret[3];
                        sdiff = ret[1].length;
                    }
                    // {{extend ... }}
                    else if (ret = exps.match(REXTEND_EXP)) {
                            tmp.extend = true;
                            tmp.out = true;
                            tmp.path = ret[2];
                            tmp.params = ret[3];
                            sdiff = ret[1].length;
                        } else {
                            switch (exps.charCodeAt(0)) {
                                case 0x3d:
                                    // =
                                    sdiff = 1;
                                    tmp.escape = true;
                                    tmp.out = true;
                                    break;
                                case 0x2d:
                                    // -
                                    sdiff = 1;
                                    tmp.out = true;
                                    break;
                            }
                        }
            exps = cnt.substring(start + sdiff, end);

            if (tmp.def) {
                tmp.source = exps;
                tmp.compile = new Compiler({
                    template: exps
                });
            } else if (tmp.use) {
                tmp.params = exps;
            } else if (tmp.include || tmp.extend) {
                tmp.source = loader_1(tmp.path, tmp);
                tmp.compile = new Compiler({
                    template: tmp.source
                });
            } else {
                ret = addvars(exps, vars);
                tmp.source = ret.source;
                tmp.filter = ret.filter;
            }

            // 添加变量
            if ((tmp.use || tmp.include) && tmp.params) {
                addvars(tmp.params, vars);
            }

            token.push(tmp);
            return {
                end: end,
                ediff: ediff
            };
        });
        return res.end + config_1.endTag.length + res.ediff;
    };

    var parseStr = function parseStr(source) {
        var cnt = source.trim();
        return strCache.detail(cnt, function () {
            var len = cnt.length;
            var c = void 0,
                s = void 0,
                prev = void 0,
                curF = void 0;
            var i = -1;
            var vars = '';
            var exps = '';
            var fts = '';
            var varObj = {};
            var filter = {};
            var inF = false;
            var inS = false;
            var newF = false;

            while (i++ < len) {
                prev = c;
                c = cnt.charCodeAt(i);
                s = cnt.charAt(i);
                //
                if ((c === 0x27 || c === 0x22) && prev !== 0x5C) {
                    //0x27:' 0x22:" 0x5C:\
                    inS = !inS;
                } else if (!inS && c === 0x7C && prev !== 0x7C && cnt.charCodeAt(i + 1) !== 0x7C) {
                    // |
                    newF = inF = true;
                }
                if (inF && (!inS && c === 0x20 || i === len)) {
                    fts = fts.trim();
                    if (fts.charCodeAt(0) === 0x7C) {
                        newF = true;
                    } else if (newF) {
                        filter[curF = fts] = [];
                        newF = false;
                    } else {
                        filter[curF].push(fts);
                    }
                    fts = '';
                } else if (inF) {
                    fts += s;
                }
                if (!RVCODE.test(s)) {
                    vars = vars.trim();
                    RVAR_PREFIX.test(vars) && !filter[vars] ? varObj[vars] = true : null;
                    vars = '';
                }
                // Variable
                if (!inS) {
                    vars += s;
                }
                // Expression
                if (!inF) {
                    exps += s;
                }
            }

            return {
                source: exps.trim(),
                vars: varObj,
                filter: filter
            };
        });
    };

    var addvars = function addvars(str, vars) {
        var ret = parseStr(str.trim());
        for (var key in ret.vars) {
            !config_1.ignore[key] ? vars[key] = true : null;
        }
        return ret;
    };

    var addFilters = function addFilters(tok) {
        return filterCache.detail(JSON.stringify(tok), function () {
            var filters = tok.escape ? FILTER + '.escape(' + tok.source + ')' : tok.source;

            for (var key in tok.filter) {
                if (tok.escape && key === 'escape') continue;

                var params = ')';
                if (tok.filter[key].length) {
                    params = ',' + tok.filter[key].join(',') + ')';
                }
                filters = FILTER + '.' + key + '(' + filters + params;
            }
            return filters;
        });
    };

    var Compiler = function () {
        function Compiler(option) {
            classCallCheck(this, Compiler);

            this.template = option.template;
            this.tokens = null;
            this.vars = {};
            getTokenAndVars(this);
        }

        createClass(Compiler, [{
            key: 'build',
            value: function build() {
                var self = this;
                return fnCache.detail(self.template, function () {
                    return new Function(DATA, createFnBody(self));
                });
            }
        }]);
        return Compiler;
    }();

    module.exports = Compiler;
});

var _escape = createCommonjsModule(function (module) {
    var esCache = new cache();
    var rRep = /[<>\"\'&]/g; // eslint-disable-line

    var robj = {};
    ['&', '<', '>', '"', "'"].forEach(function (it) {
        // eslint-disable-line
        var code = it.charCodeAt(0);
        robj[code] = '&#' + code + ';';
    });

    var escape = function escape(data) {
        return esCache.detail(data, function () {
            return rRep.test(data) ? data.replace(rRep, function (it) {
                return robj[it.charCodeAt(0)] || it;
            }) : data;
        });
    };

    module.exports = escape;
});

var print = function print(msg) {
    /* eslint-disable */
    if (config_1.debug && console && console.log) {
        console.log(msg);
    }
    /* eslint-enable */
};

var checkType = function checkType(name, data, type$$2) {
    if (config_1.debug && !type.check(data, type$$2)) {
        throw new TypeError(name + ' Parameter type must be ' + type$$2 + '.');
    }
};
var log = {
    print: print,
    checkType: checkType
};

var upper_1 = createCommonjsModule(function (module) {
    var upper = function upper(data, flag) {
        log.checkType('Filter:upper()', data, 'string');

        var ret = void 0;
        switch (flag) {
            case true:
                ret = data.replace(/\b[a-z]\w*\b/g, function (word) {
                    return word.substr(0, 1).toUpperCase() + word.substr(1);
                });
                break;
            default:
                ret = data.toUpperCase();
        }
        return ret || data;
    };

    module.exports = upper;
});

var trim_1 = createCommonjsModule(function (module) {
    var trim = function trim(data) {
        log.checkType('Filter:trim()', data, 'string');

        return String.prototype.trim.call(data);
    };

    module.exports = trim;
});

var lower_1 = createCommonjsModule(function (module) {
    var lower = function lower(data) {
        log.checkType('Filter:lower()', data, 'string');

        return data.toLowerCase();
    };

    module.exports = lower;
});

var defaults_1 = createCommonjsModule(function (module) {
    var defaults = function defaults(data) {
        var dstr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

        return void 0 === data || null === data ? dstr : data;
    };

    module.exports = defaults;
});

var join_1 = createCommonjsModule(function (module) {
    var join = function join(data) {
        var connector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ',';

        log.checkType('Filter:join()', data, 'array');

        return data.join(connector);
    };

    module.exports = join;
});

var size_1 = createCommonjsModule(function (module) {
    var size = function size(data) {
        var size = data && data.length;
        if (!size && (typeof size === 'undefined' ? 'undefined' : _typeof(size)) === 'object') {
            size = 0;
            for (var key in data) {
                // eslint-disable-line
                size++;
            }
        }
        return size || 0;
    };

    module.exports = size;
});

var replace_1 = createCommonjsModule(function (module) {
    var replace = function replace(data, older, newer) {
        log.checkType('Filter:replace()', data, 'string');

        return data.replace(older, newer);
    };

    module.exports = replace;
});

var eq_1 = createCommonjsModule(function (module) {
    var eq = function eq(data) {
        var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var ret = void 0;
        var isObj = type.check(data, 'object');
        if (!(type.check(data, 'array') || isObj || type.check(data, 'string'))) {
            return ret;
        }
        if ('last' === index) {
            if (isObj) {
                for (var key in data) {
                    ret = data[key];
                }
            } else {
                ret = data[data.length - 1];
            }
        } else {
            ret = data[index];
        }
        return ret;
    };

    module.exports = eq;
});

var truncate_1 = createCommonjsModule(function (module) {
    var truncate = function truncate(data) {
        var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 255;
        var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '...';

        log.checkType('Filter:truncate()', data, 'string');

        return data.length > length ? data.substr(0, length) + end : data;
    };

    module.exports = truncate;
});

var filters = {
    escape: _escape,
    upper: upper_1,
    trim: trim_1,
    lower: lower_1,
    defaults: defaults_1,
    join: join_1,
    size: size_1,
    replace: replace_1,
    eq: eq_1,
    truncate: truncate_1
};

var filter = filters;

var compile_1 = createCommonjsModule(function (module) {
    var fnCache = new cache();

    var compile = function compile(source) {
        var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var types = type.check(source);

        if ('object' === types) {
            option = source;
        } else if ('string' === types) {
            config_1.filepath = source;
            option.template = loader_1(source);
        }
        option.template = option.template.trim();
        return fnCache.detail(option.template, function () {
            return new compiler(option).build().bind(filter);
        });
    };

    module.exports = compile;
});

var render_1 = createCommonjsModule(function (module) {
    var render = function render(content, data, option) {
        return compile_1(content, option)(data);
    };
    module.exports = render;
});

var src = createCommonjsModule(function (module) {
    var Blast = function Blast(content, data, option) {
        return render_1(content, data, option);
    };

    Blast.render = render_1;
    Blast.compile = compile_1;
    Blast.Config = config_1;
    Blast.Filter = filter;
    Blast.Cache = cache;

    module.exports = Blast;
});

return src;

})));
//# sourceMappingURL=tempos.js.map
