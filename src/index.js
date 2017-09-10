const config = require('./config');
const render = require('./compile/render');
const compile = require('./compile/index');
const filter = require('./filter/index');
const cache = require('./tool/cache');

const Blast = (content, data, option) => {
    return render(content, data, option);
};

Blast.render = render;
Blast.compile = compile;
Blast.Config = config;
Blast.Filter = filter;
Blast.Cache = cache;

module.exports = Blast;