// ## Globals
/*global $:true*/
var $           = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var gulp        = require('gulp');


// ### Styles
gulp.task('styles', function() {
  return gulp.src('sass/main.scss')
    .pipe($.sass({errLogToConsole: true}))
    .pipe($.autoprefixer('last 2 versions'))
    .pipe(gulp.dest('css'))
    .pipe(reload({stream:true}));
});


// ### Scripts
gulp.task('scripts', function() {
  return gulp.src('js/main.js')
    .pipe(reload({stream:true}));
});


// ### Watch
// `gulp watch` - Use BrowserSync to proxy your dev server and synchronize code
// changes across devices. 
gulp.task('watch', function() {
  browserSync.init({server: './', open: false});
  gulp.watch(['sass/**/*'], ['styles']);
  gulp.watch(['js/**/*'], ['scripts']);
  gulp.watch(['bower.json'], ['build']);
  gulp.watch('**/*.html', function() {
    reload({stream:true});
  });
});

// ### Build
// `gulp build` - Run all the build tasks but don't clean up beforehand.
// Generally you should be running `gulp` instead of `gulp build`.
gulp.task('build', function(callback) {
  runSequence('styles',
              'scripts',
              callback);
});


// ### Gulp
// `gulp` - Run a complete build. To compile for production run `gulp --production`.
gulp.task('default', function() {
  gulp.start('build');
});
