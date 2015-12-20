module.exports = function(gulp, $){
	gulp.task('images', function(){
		return gulp.src('source/images/**')
			.pipe($.plumber($.plumberSettings))
	        .pipe($.if(
				function(file){return path.extname(file.path) === '.jpg'},
				$.jpgmin({progressive: true, max: 75})(),
				$.imagemin({
					progressive: true,
		            use: [$.pngquant()]
		        })
			))
			.pipe(gulp.dest('public/images/'));
	});
}