module.exports = function(source) {
    const obj = {};
    source.replace(/([$_\w]+)/g, function(word) {
        obj[word] = true;
    });
    return obj;
};