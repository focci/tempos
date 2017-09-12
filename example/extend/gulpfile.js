// Load plugins
const gulp = require('gulp');
const fs = require('fs');
const tempos = require('gulp-tempos');
const data = require('gulp-data');
const EXTNAME = '.temp';

let res = JSON.parse( fs.readFileSync(__dirname + '/data.json') );
for( let key in res ) {
    res[key].Data = res;
}

// html
gulp.task('html', () => {
    return gulp.src('./template/_post/**/*' + EXTNAME)
    	.pipe(data((file) => {
            return res[ file.relative.replace(EXTNAME, '') ];
        }))
        .pipe(tempos(null, {
            extname: '.html'
        }))
        .pipe(gulp.dest('./dist'));
});

// Default task
gulp.task('default', () => {
	gulp.start('html');
});