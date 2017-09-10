const Blast = require('../../src/index');
const path = require('path');
const fs = require('fs');
const fn = Blast.compile( path.resolve(__dirname, './template/layout') );
const res = fn({
    Title: 'Blast',
    Content: '高效的Javascript模板引擎s',
    Copyright: '&copy;'+ new Date().getFullYear()
});

fs.writeFile(path.resolve(__dirname, 'index.html'), res, (err) => {
    if (err) throw err;
});
