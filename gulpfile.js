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
		.pipe(clean())                            .on('error', swallowError);
});

// compile mods
gulp.task('compile-modules', ['clean'], function() {
  return gulp.src('src/dev/js/Modules/**/*.js')
    .pipe(babel())                            .on('error', swallowError)
    .pipe(uglify())                           .on('error', swallowError)
    .pipe(gulp.dest('src/compiled/js/mods'));
});

// compile source files into one
gulp.task('compile-all', ['compile-modules'], function() {
  return gulp.src([
      'src/dev/js/_Constructor/pbjs.router.js',
      'src/dev/js/_Constructor/pbjs.core.js',
      'src/dev/js/Modules/*.js'
    ])
    .pipe(concat("pbjs.js"))                  .on('error', swallowError)
    .pipe(babel())                            .on('error', swallowError)
    .pipe(gulp.dest('src/compiled/js/'));
});

// minify source files into one
gulp.task('minify-js', ['compile-all'], function() {
  return gulp.src([
      'src/dev/js/_Constructor/pbjs.router.js',
      'src/dev/js/_Constructor/pbjs.core.js',
      'src/dev/js/Modules/*.js'
    ])
    .pipe(concat("pbjs.min.js"))              .on('error', swallowError)
    .pipe(babel())                            .on('error', swallowError)
    .pipe(uglify())                           .on('error', swallowError)
    .pipe(gulp.dest('src/compiled/js/'));
});
 
gulp.task('copy-sass', ['minify-js'], function () {
	return gulp.src('src/dev/scss/compiler.scss')
    .pipe(sass())                             .on('error', swallowError)
    .pipe(rename("pbjs.css"))                 .on('error', swallowError)
    .pipe(gulp.dest('src/compiled/css/'));
});

gulp.task('compile-sass', ['copy-sass'], function () {
  return gulp.src('src/dev/scss/compiler.scss')
    .pipe(sass({outputStyle: 'compressed'}))  .on('error', swallowError)
    .pipe(rename({
      "basename": "pbjs",
      "suffix": ".min"
    }))                                       .on('error', swallowError)
    .pipe(gulp.dest('src/compiled/css/minified/'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch([
    paths.js,
    paths.sass
  ], [
    'compile-sass'
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

function swallowError (error) {
  console.log(error.toString());
  this.emit('end');
}