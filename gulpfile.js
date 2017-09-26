var gulp = require('gulp');
var tempos = require('gulp-tempos');
var	notify = require('gulp-notify');
var data = require('gulp-data');
var config = {
	index: {
		title: 'Tempos',
		slideFlag: false
	},
	doc: {
		title: 'Documentation Tempos',
		slideFlag: true
	}
};

gulp.task('doc', function() {
	return gulp.src('./docs/template/*.temp')
		.pipe(data((file) => {
			return config[ file.relative.replace('.temp', '') ];
		}))
		.pipe(tempos(null, {
			extname: '.html'
		}))
		.pipe(gulp.dest('./docs'))
		.pipe(notify({
			message: 'Doc task complete'
		}));
});
gulp.task('default', function() {
	gulp.start(['doc']);
});