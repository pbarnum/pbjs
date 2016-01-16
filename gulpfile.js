var gulp = require('gulp');
var sourcemaps = require("gulp-sourcemaps");
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
 
var paths = {
  js: ['src/dev/js/**/*.js'],
  sass: ['src/dev/scss/**/*.scss']
};
 
gulp.task('clean', function () {
	return gulp.src(['src/compiled/js/**/*.js', 'src/compiled/css/**/*.css'], {read: false})
		.pipe(clean());
});

// compile mods
gulp.task('compile-modules', ['clean'], function() {
  return gulp.src('src/dev/js/Modules/**/*.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('src/compiled/js/mods'));
});

// compile source files into one
gulp.task('compile-all', ['compile-modules'], function() {
  return gulp.src([
      'src/dev/js/_Constructor/pbjs.router.js',
      'src/dev/js/_Constructor/pbjs.core.js',
      'src/dev/js/Modules/*.js'
    ])
    .pipe(concat("pbjs.js"))
    .pipe(babel())
    .pipe(gulp.dest('src/compiled/js/'));
});

// minify source files into one
gulp.task('minify-js', ['compile-all'], function() {
  return gulp.src([
      'src/dev/js/_Constructor/pbjs.router.js',
      'src/dev/js/_Constructor/pbjs.core.js',
      'src/dev/js/Modules/*.js'
    ])
    .pipe(concat("pbjs.min.js"))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('src/compiled/js/'));
});
 
gulp.task('copy-sass', function () {
	return gulp.src('src/dev/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('src/compiled/css/'));
});

gulp.task('compile-sass', function () {
  return gulp.src('src/dev/scss/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(rename({
      "suffix": ".min"
    }))
    .pipe(gulp.dest('src/compiled/css/minified'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch([
    paths.js,
    paths.sass
  ], [
    'compile-all',
    'copy-sass'
  ]);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', [
  'watch',
  'clean',
  'compile-modules',
  'compile-all',
  'minify-js',
  'copy-sass',
  'compile-sass'
]);