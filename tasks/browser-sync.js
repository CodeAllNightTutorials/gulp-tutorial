module.exports = function(gulp, $){
	gulp.task('browser-sync', function(){
		$.bs.init(null, {
			server: './public/',
			open: false,
			port: 5000,
			files: [
				'views/**/*.jade',
				'public/**/*.html',
				'public/**/*.js',
				'public/images/**'
			],
			ghostMode: false
		});
	});
}