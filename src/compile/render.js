const compile = require('./index');

const render = (content, data, option) => {
    return compile(content, option)(data);
};
module.exports = render;