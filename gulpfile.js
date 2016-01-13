var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var del = require('del');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// css
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
// coffee-script
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');
// slim
var slim = require("gulp-slim");

gulp.task('sass', function() {
  return gulp.src(['css/**/*.scss', 'css/**/*.sass'])
    .pipe(sass().on('error', gutil.log))
    .pipe(prefix("> 1%"))
    // This will output the non-minified version
    .pipe(gulp.dest('public/css'))
    // This will minify and rename to foo.min.css
    .pipe(cssmin({ keepSpecialComments: 0 }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('public/css'));
});

gulp.task('sass:lite', function() {
  gulp.src(['css/**/*.scss', 'css/**/*.sass'])
    .pipe(watch(['css/**/*.scss', 'css/**/*.sass']))
    .pipe(sass().on('error', gutil.log))
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream());
});

gulp.task('coffee', function() {
  gulp.src(['js/**/*.coffee'])
    .pipe(coffee({ bare: true }).on('error', gutil.log))
    // This will output the non-minified version
    .pipe(gulp.dest('public/js'))
    // This will minify and rename to foo.min.js
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('public/js'));
});
gulp.task('slim', function(){
  gulp.src(["*.slim"])
    .pipe(slim({ pretty: true }).on('error', gutil.log))
    .pipe(gulp.dest("."));
});


gulp.task('watch:coffee', function(){
  gulp.src('js/**/*.coffee')
    .pipe(watch('js/**/*.coffee').on('error', gutil.log))
    .pipe(coffee())
    .pipe(gulp.dest('public/js'));
});
gulp.task('watch:slim', function(){
  gulp.src(['*.slim'])
    .pipe(watch(['*.slim']))
    .pipe(slim({pretty: true}))
    .pipe(gulp.dest('.'));
});
gulp.task('watch:sass', function(){
  gulp.watch(['css/**/*.scss', 'css/**/*.sass'], ["sass:lite"]);
});

// watch files for changes and reload
gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: './index.html'
    }
  });
  gulp.watch(['*.html', 'public/**/*.css', 'public/**/*.js'], reload);
});


gulp.task('build', ['sass', 'coffee', 'slim']);
gulp.task('clear', function(){
  return del([
    'public/**/*',
    './*.html'
  ]);
});

gulp.task('default', [ 'build', 'watch:sass', 'watch:coffee', 'watch:slim', 'serve']);
