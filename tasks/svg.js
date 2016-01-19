module.exports = function(gulp, $){

	// Define common tasks
	var commonTasks = $.lazypipe()
		.pipe($.plumber, $.plumberSettings)
		.pipe($.svgmin)
		.pipe(gulp.dest, 'public/svg/')
		.pipe($.svgSprite, {
			mode: {
				symbol: {
					dest: 'svg',
					inline: true,
					sprite: 'sprite.svg'
				}
			}
		})
		.pipe($.rename, 'sprite.svg');

	// Development task
	gulp.task('svg', function(){
		return gulp.src('source/svg/*.svg')
			.pipe(commonTasks())
			.pipe(gulp.dest('public'));
	});

	// Production task
	gulp.task('build-svg', function(){
		$.del.sync('public/' + $.manifest['sprite.svg']);
		return gulp.src('source/svg/*.svg')
			.pipe(commonTasks())
			.pipe($.rev())
			.pipe(gulp.dest('public'))
			.pipe($.rev.manifest({merge: true}));
	});

	// Watch task
	gulp.task('watch-css', function(){
		gulp.watch('./source/svg/*', ['svg']);
	})
}