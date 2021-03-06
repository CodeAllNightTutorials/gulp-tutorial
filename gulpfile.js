var fs                  = require('fs');
var gulp                = require('gulp');
var plugins             = require('gulp-load-plugins')();

plugins.fs              = fs;
plugins.del             = require('del');
plugins.path            = require('path');
plugins.lazypipe        = require('lazypipe');
plugins.multipipe       = require('multipipe');
plugins.pngquant        = require('imagemin-pngquant');
plugins.jpgmin          = require('imagemin-jpegoptim');
plugins.bs              = require('browser-sync').create();

plugins.manifest        = require('./rev-manifest.json');
plugins.updateManifest  = require('./functions/update-manifest.js');

plugins.plumberSettings = {
	errorHandler: function(err){
		console.log(err);
		this.emit('end')
	}
}

// Load gulp tasks
fs.readdirSync('./tasks/').forEach(function(file) {
	require('./tasks/' + file)(gulp, plugins);
});

// Define dafault task
gulp.task('default', ['css', 'js', 'svg', 'html', 'browser-sync', 'watch']);

// Run all watch tasks
gulp.task('watch', Object.keys(gulp.tasks).filter(function(task){
	return /watch-.*/gi.test(task);
}));

// Run all build tasks
gulp.task('build', ['build-css', 'build-js', 'build-svg', 'build-html', 'images']);
