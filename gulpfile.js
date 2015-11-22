var gulp = require('gulp');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
 
var paths = {
  js: ['lib/js/**/*.js'],
  sass: ['lib/scss/**/*.scss']
};

// combine source files into one
gulp.task('combine-js', function() {
  return gulp.src(paths.js)
    //.pipe(concat('pbjs.js'))
    .pipe(gulp.dest('src/js'));
});

// combine source files into one
gulp.task('combine-sass', function() {
  return gulp.src(paths.sass)
    .pipe(sass())
    .pipe(gulp.dest('src/css'));
});

// minify source files into one
gulp.task('compile-js', function() {
  return gulp.src(paths.js)
    .pipe(babel())
    .pipe(concat('pbjs.min.js'))
    .pipe(gulp.dest('src/js/minified'));
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
    paths.sass
  ], [
    'combine-js',
    'combine-sass'
  ]);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', [
  //'watch',
  'combine-js',
  'combine-sass',
  'compile-js',
  'compile-sass'
]);