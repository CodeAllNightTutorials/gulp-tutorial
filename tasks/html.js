var jades = require('../functions/crawler.js')('js/', new RegExp('\/\/(?:\t| |)*include[\'" ]*([^\'"\n]+)', 'g'));

module.exports = function(gulp, $){
	function buildTask(build){
		return function(){
			gulp.src('./source/**/*.jade')
				.pipe($.data({
					build: build,
					assets: build ? $.manifest : {}
				}))
				.pipe($.jade())
				.pipe(gulp.dest('./public/'));
		}
	}

	Object.keys(jades).forEach(function(mainFile){
		gulp.task(mainFile, buildTask(false));
		gulp.task('build-' + mainFile, buildTask(true));
	});

	gulp.task('html', Object.keys(jades));
	gulp.task('build-html', Object.keys(gulp.tasks).filter(function(task){
		return /build-.*\.jade/gi.test(task);
	}));
}