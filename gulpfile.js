/**
 * Created by Christianson on 24/09/2015.
 */
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('default',['watch']);

gulp.task('jshint', function(){
   return gulp.src('public/scripts/**/*.js')
       .pipe(jshint())
       .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build-css', function(){
   return gulp.src('source/scss/**/*.scss')
       .pipe(sourcemaps.init())
       .pipe(sass())
       .pipe(sourcemaps.write())
       .pipe(gulp.dest('public/assets/stylesheets'));
});

gulp.task('watch', function(){
    gulp.watch('public/scripts/**/*.js', ['jshint']);
    gulp.watch('source/scss/**/*.scss', ['build-css']);
});