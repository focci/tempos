const config = require('./config');
const render = require('./compile/render');
const compile = require('./compile/index');
const filter = require('./filter/index');
const cache = require('./tool/cache');

const Tempos = (content, data, option) => {
    return render(content, data, option);
};

Tempos.render = render;
Tempos.compile = compile;
Tempos.Config = config;
Tempos.Filter = filter;
Tempos.Cache = cache;

module.exports = Tempos;