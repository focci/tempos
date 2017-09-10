const size = (data) => {
    let size = data && data.length;
    if( !size && typeof size === 'object' ) {
        size = 0;
        for( let key in data ) { // eslint-disable-line
            size ++;
        }
    }
    return size || 0;
};

module.exports = size;