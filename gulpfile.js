var gulp = require('gulp');
var sourcemaps = require("gulp-sourcemaps");
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
 
var paths = {
  js: ['src/js/**/*.js'],
  sass: ['lib/scss/**/*.scss']
};
 
gulp.task('clean', function () {
	return gulp.src(['src/js/**/*.js', 'src/css/**/*.css'], {read: false})
		.pipe(clean());
});

// compile constructor files
gulp.task('compile-constructor', ['clean'], function() {
  return gulp.src(['lib/js/_Constructor/**/*.js','lib/js/!(_Constructor)**/*.js'])
    .pipe(concat('pbjs.js'))
    .pipe(babel())
    .pipe(gulp.dest('src/js'));
});

// compile library
gulp.task('compile-modules', ['compile-constructor'], function() {
  return gulp.src(['lib/js/!(_Constructor)**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest('src/js'));
});

// minify source files into one
gulp.task('minify-js', ['compile-modules'], function() {
  return gulp.src([
      'pbjs.router.js',
      'pbjs.core.js',
      'src/js/**/*.js'
    ])
    .pipe(concat("pbjs.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest('src/js/minified'));
});
 
gulp.task('copy-sass', function () {
	return gulp.src(['src/css/**/*.css'], {read: false})
    .pipe(gulp.dest('src/css/'));
});

gulp.task('compile-sass', function () {
  return gulp.src(paths.sass)
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(rename({
      "suffix": ".min"
    }))
    .pipe(gulp.dest('src/css/minified'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch([
    paths.js,
    paths.js
  ], [
    'compile-constructor',
    'compile-modules'
  ]);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', [
  //'watch',
  'clean',
  'compile-constructor',
  'compile-modules',
  'minify-js',
  'copy-sass',
  'compile-sass'
]);