module.exports = function(gulp, $){
	gulp.task('browser-sync', function(){
		$.bs.init(null, {
			proxy: 'http://localhost:8080',
			open: false,
			port: 4000,
			files: [
				'views/**/*.jade',
				'source/**/*.jade',
				'source/**/*.js',
				'source/images/**'
			],
			ghostMode: false
		});
	});
}