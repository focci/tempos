const config = require('./config');
const render = require('./compile/render');
const compile = require('./compile/index');
const filter = require('./filter/index');
const cache = require('./tool/cache');

const tempos = (content, data, option) => {
    return render(content, data, option);
};

tempos.render = render;
tempos.compile = compile;
tempos.config = config;
tempos.filter = filter;
tempos.cache = cache;

module.exports = tempos;