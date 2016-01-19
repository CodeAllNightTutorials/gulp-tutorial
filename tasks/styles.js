var styles = require('../functions/crawler.js')('css/', new RegExp('^@import[\'" ]*([^\'"\n]+)', 'gm'));

module.exports = function(gulp, $){
	var devTasks = [];
	var prodTasks = [];

	Object.keys(styles).forEach(function(mainFile){

		// Define common tasks
		var commonTasks = $.lazypipe()
			.pipe($.plumber, $.plumberSettings)
				.pipe($.sourcemaps.init)
				.pipe($.sass)
				.pipe($.cssnano)
				.pipe($.autoprefixer);

		// Development task
		gulp.task(mainFile, function(){
			return gulp.src($.path.join('./source/', styles[mainFile].dir, mainFile))
				.pipe(commonTasks())
				.pipe($.sourcemaps.write('maps/'))
				.pipe(gulp.dest('public/' + styles[mainFile].dir))
				.pipe($.if(
					function(file){return $.path.extname(file.path) === '.css'},
					$.bs.stream()
				));
		});

		// Production task
		gulp.task('build-' + mainFile, function(){
			$.del.sync('./public/' + styles[mainFile].dir +  $.manifest[mainFile]);

			return gulp.src($.path.join('./source/', styles[mainFile].dir, mainFile))
				.pipe(commonTasks())
				.pipe($.rev())
				.pipe(gulp.dest('./public/' + styles[mainFile].dir))
				.pipe($.rev.manifest({merge: true}))
				.pipe(gulp.dest('./'));
		});

		// Watch task
		gulp.task('watch-' + mainFile, function(){
			gulp.watch(styles[mainFile].files, [mainFile]);
		});

		// Update task arrays
		devTasks.push(mainFile);
		prodTasks.push('build-' + mainFile);
	});

	// Run all css tasks for development
	gulp.task('css', devTasks);

	// Run all css tasks for production
	gulp.task('build-css', prodTasks);
}