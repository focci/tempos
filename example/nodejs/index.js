const Tempos = require('../../src/index');
const path = require('path');
const fs = require('fs');
const fn = Tempos.compile( path.resolve(__dirname, './template/layout') );
const res = fn({
    Title: 'Tempos',
    Content: '高效的Javascript模板引擎',
    Copyright: '&copy;'+ new Date().getFullYear()
});

fs.writeFile(path.resolve(__dirname, 'index.html'), res, (err) => {
    if (err) throw err;
});
