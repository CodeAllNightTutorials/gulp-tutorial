var styles = require('../functions/crawler.js')('css/', new RegExp('^@import[\'" ]*([^\'"\n]+)', 'gm'));
console.log(styles);
module.exports = function(gulp, $){
	Object.keys(styles).forEach(function(mainFile){

		gulp.task(mainFile, function(){
			return gulp.src('./source/' + styles[mainFile].dir + mainFile)
				.pipe($.plumber($.plumberSettings))
				.pipe($.sourcemaps.init())
				.pipe($.sass())
				.pipe($.minifyCss())
				.pipe($.autoprefixer())
				.pipe($.sourcemaps.write('maps/'))
				.pipe(gulp.dest('public/' + styles[mainFile].dir))
				.pipe($.if(
					function(file){return $.path.extname(file.path) === '.css'},
					$.bs.stream()
				));
		});

		gulp.task('build-' + mainFile, function(){
			$.del.sync('./public/' + styles[mainFile].dir +  $.manifest[mainFile]);

			return gulp.src('./source/' + styles[mainFile].dir + mainFile)
				.pipe($.plumber($.plumberSettings))
				.pipe($.sass())
				.pipe($.minifyCss())
				.pipe($.autoprefixer())
				.pipe($.rev())
				.pipe($.tap($.updateManifest))
				.pipe(gulp.dest('public/' + styles[mainFile].dir));
		});

		gulp.task('watch-' + mainFile, function(){
			gulp.watch(styles[mainFile].files, [mainFile]);
		});
	});

	gulp.task('css', Object.keys(styles));
}