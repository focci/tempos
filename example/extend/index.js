const Tempos = require('../../src/index');
const path = require('path');
const fs = require('fs');

const Data = {
    index: {
        Title: 'Index'
    },
    about: {
        Title: 'About'
    },
    contact: {
        Title: 'Contact'
    }
};

for( let key in Data ) {
    const paths = path.resolve(__dirname, './_post/'+key);
    const fn = Tempos.compile( paths );
    const data = Data[key];
    data.Data = Data;
    const res = fn( data );
    
    fs.writeFile( path.resolve(__dirname, key+'.html'), res, (err) => {
        if (err) throw err;
    });
}