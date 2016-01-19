var jades = require('../functions/crawler.js')('./', new RegExp('include[\'" ]*([^\'"\n]+)', 'g'));

module.exports = function(gulp, $){
	var devTasks = [];
	var prodTasks = [];


	Object.keys(jades).forEach(function(mainFile){

		// Build tasks for development and production
		function buildTask(build){
			return function(){
				gulp.src($.path.join('./source/', mainFile))
					.pipe($.data({
						build: build,
						assets: build ? $.manifest : {}
					}))
					.pipe($.jade())
					.pipe(gulp.dest('./public/'));
			}
		}

		// Development task
		gulp.task(mainFile, buildTask(false));

		// Production task
		gulp.task('build-' + mainFile, buildTask(true));

		gulp.task('watch-' + mainFile, function(){
			gulp.watch(jades[mainFile].files, [mainFile]);
		});

		// Update task arrays
		devTasks.push(mainFile);
		prodTasks.push('build-' + mainFile);
	});

	// Run all html tasks for development
	gulp.task('html', devTasks);

	// Run all html tasks for production
	gulp.task('build-html', prodTasks);
}