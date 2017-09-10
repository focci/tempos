const escape = require('./escape');
const upper = require('./upper');
const trim = require('./trim');
const lower = require('./lower');
const defaults = require('./defaults');
const join = require('./join');
const size = require('./size');
const replace = require('./replace');
const eq = require('./eq');
const truncate = require('./truncate');

const filters = {
    escape: escape,
    upper: upper,
    trim: trim,
    lower: lower,
    defaults: defaults,
    join: join,
    size: size,
    replace: replace,
    eq: eq,
    truncate: truncate
};

module.exports = filters;