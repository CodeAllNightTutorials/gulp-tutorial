module.exports = function(gulp, $){
	gulp.task('svg', function(){
		return gulp.src('source/svg/*.svg')
			.pipe($.plumber($.plumberSettings))
			.pipe(gulp.dest('public/svg/'))
			.pipe($.svgSprite({
				mode: {
					symbol: {
						dest: 'svg',
						inline: true,
						sprite: 'sprite.svg'
					}
				}
			}))
			.pipe($.rename('sprite.svg'))
			.pipe(gulp.dest('public'));
	});

	gulp.task('build-svg', function(){
		$.del.sync('public/' + $.manifest['sprite.svg']);
		return gulp.src('source/svg/*.svg')
			.pipe($.plumber($.plumberSettings))
			.pipe($.svgmin())
			.pipe(gulp.dest('public/svg/'))
			.pipe($.svgSprite({
				mode: {
					symbol: {
						dest: 'svg',
						inline: true,
						sprite: 'sprite.svg'
					}
				}
			}))
			.pipe($.rename('sprite.svg'))
			.pipe($.rev())
			.pipe(gulp.dest('public'))
			.pipe($.rev.manifest({merge: true}));
	});
}