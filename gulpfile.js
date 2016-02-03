var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	reload = require('browser-sync').reload;

var serverConfig = {
	server: {
		baseDir: "./src"
	},
	// tunnel: true,
	host: 'localhost',
	port: 63341,
	logPrefix: "aavia"
};

// SERVER
gulp.task('browser-sync', function() {
	browserSync.init(serverConfig);
});

// RELOAD
gulp.task('browser-reload', function() {
	// console.log('test');
	reload();
	// stream({injectChanges: true});
	// gulp.dest('dist/css')
	// 	.pipe(reload({stream:true}));
});

gulp.task('default', ['browser-sync', 'watch']);

// WATCH
gulp.task('watch', function(){
	gulp.watch('src/**/*.*', ['browser-reload']);
	// gulp.watch('**/*.*', reload());
});