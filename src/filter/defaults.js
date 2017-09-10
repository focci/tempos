const defaults = (data, dstr = '') => {
    return void 0 === data || null === data ? dstr : data;
};

module.exports = defaults;