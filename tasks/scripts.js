var scripts = require('../functions/crawler.js')('js/', new RegExp('\/\/(?:\t| |)*include[\'" ]*([^\'"\n]+)', 'g'));

module.exports = function(gulp, $){
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
				.pipe($.tap(function(file){
					if(!('revOrigPath' in file)){
						return;
					}
					if(!$.fs.existsSync('./rev-manifest.json')){
						$.fs.writeFileSync('./rev-manifest.json', '{}');
					}

					var revmanifest = JSON.parse($.fs.readFileSync('./rev-manifest.json', 'utf8').replace(/,(?=\n})/g, ''));
					if(typeof revmanifest !== 'object') revmanifest = {};
					revmanifest[$.path.basename(file.revOrigPath)] = $.path.basename(file.path);
					manifest = revmanifest;
					$.fs.writeFileSync('./rev-manifest.json', JSON.stringify(revmanifest, null, '	'));
				}));

		});

		gulp.task('watch-' + mainFile, function(){
			gulp.watch(scripts[mainFile].files, [mainFile]);
		});
	});

	gulp.task('js', Object.keys(scripts));
	gulp.task('build-js', Object.keys(gulp.tasks).filter(function(task){
		return /build-.*\.js/gi.test(task);
	}));
}
