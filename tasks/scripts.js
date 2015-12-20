var scripts = require('../functions/crawler.js')('js/', new RegExp('\/\/(?:\t| |)*include[\'" ]*([^\'"\n]+)', 'g'));

module.exports = function(gulp, $){
	gulp.task('js', Object.keys(scripts));

	Object.keys(scripts).forEach(function(mainFile){

		gulp.task(mainFile, function(){
			return gulp.src(scripts[mainFile].files)
				.pipe($.plumber($.plumberSettings))
				.pipe($.sourcemaps.init())
				.pipe($.if(
					function(file){return $.path.extname(file.path) === '.hbs'},
					$.multipipe(
						$.minifyHtml({quotes: true}),
						$.handlebars(),
						$.wrap('Handlebars.template(<%= contents %>)'),
						$.declare({
							namespace: 'templates',
							noRedeclare: true,
						})
					)
				))
				.pipe($.concat(mainFile))
				.pipe($.sourcemaps.write('maps/'))
				.pipe(gulp.dest('public/' + scripts[mainFile].dir))
				.pipe($.bs.stream());
		});

		gulp.task('build-' + mainFile, function(){
			$.del.sync('./public/' + scripts[mainFile].dir + $.manifest[mainFile]);

			return gulp.src(scripts[mainFile].files)
				.pipe($.plumber($.plumberSettings))
				.pipe($.if(
					function(file){return $.path.extname(file.path) === '.hbs'},
					$.multipipe(
						$.minifyHtml({quotes: true}),
						$.handlebars(),
						$.wrap('Handlebars.template(<%= contents %>)'),
						$.declare({
							namespace: 'templates',
							noRedeclare: true,
						})
					)
				))
				.pipe($.concat(mainFile))
				.pipe($.uglify())
				.pipe($.rev())
				.pipe(gulp.dest('public/' + scripts[mainFile].dir))
				.pipe($.tap($.updateManifest));

		});

		gulp.task('watch-' + mainFile, function(){
			gulp.watch(scripts[mainFile].files, [mainFile]);
		});
	});
}