var scripts = require('../functions/crawler.js')('js/', new RegExp('require\\([\'" ]*([^\'"]+)', 'g'));

module.exports = function(gulp, $){
	var devTasks = [];
	var prodTasks = [];

	Object.keys(scripts).forEach(function(mainFile){

		// Define common tasks
		var commonTasks = $.lazypipe()
			.pipe($.plumber, $.plumberSettings)
			.pipe($.sourcemaps.init)
			.pipe($.if,
				function(file){return $.path.extname(file.path) === '.hbs'},
				$.multipipe(
					$.htmlmin(),
					$.handlebars(),
					$.wrap('Handlebars.template(<%= contents %>)'),
					$.declare({
						namespace: 'templates',
						noRedeclare: true,
					})
				)
			)
			.pipe($.concat, mainFile);

		// Development task
		gulp.task(mainFile, function(){
			return gulp.src(scripts[mainFile].files)
				.pipe(commonTasks())
				.pipe($.sourcemaps.write('maps/'))
				.pipe(gulp.dest('public/' + scripts[mainFile].dir))
				.pipe($.bs.stream());
		});

		// Production task
		gulp.task('build-' + mainFile, function(){
			$.del.sync('./public/' + scripts[mainFile].dir + $.manifest[mainFile]);

			return gulp.src(scripts[mainFile].files)
				.pipe(commonTasks())
				.pipe($.uglify())
				.pipe($.rev())
				.pipe(gulp.dest('public/' + scripts[mainFile].dir))
				.pipe($.rev.manifest({merge: true}))
				.pipe(gulp.dest('./'));
		});

		// Watch task
		gulp.task('watch-' + mainFile, function(){
			gulp.watch(scripts[mainFile].files, [mainFile]);
		});

		// Update task arrays
		devTasks.push(mainFile);
		prodTasks.push('build-' + mainFile);
	});

	// Run all js tasks for development
	gulp.task('js', devTasks);

	// Run all js tasks for production
	gulp.task('build-js', prodTasks);
}
