'use strict';

const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const eslint = require('gulp-eslint');
const closureCompiler = require('gulp-closure-compiler');
const replace = require('gulp-string-replace');
const copy = require('gulp-copy');

gulp.task('autoprefixer', function() {
    return gulp.src('src/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dest/css'));
});
gulp.task('cssmin', ['autoprefixer'], function() {
    return gulp.src('dest/css/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('dest/css'))
        .pipe(gulp.dest('example/css'));
});
gulp.task('lint', ['cssmin'], function() {
    return gulp.src('src/js/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
gulp.task('jsCompiler', ['lint'], function() {
    return gulp.src('src/js/lightbox.js')
        .pipe(closureCompiler({fileName: 'lightbox.min.js',
                               compilerFlags: {
                                   compilation_level: 'ADVANCED_OPTIMIZATIONS',
                                   language_in: 'ECMASCRIPT6_STRICT',
                                   language_out: 'ECMASCRIPT5_STRICT'
                               }
                              }))
        .pipe(gulp.dest('dest/js'));
});
gulp.task('replace', ['jsCompiler'], function() {
    return gulp.src(['./dest/js/lightbox.min.js'])
        .pipe(replace(/\\n\s+/g, ''))
        .pipe(gulp.dest('./dest/js'))
        .pipe(gulp.dest('./example/js'));
});
gulp.task('copy', ['replace'], function() {
   return gulp.src('src/lb-img/**')
       .pipe(copy('dest', {prefix: 1}))
       .pipe(gulp.dest('dest/lb-img'))
       .pipe(gulp.dest('example/lb-img'));
});
gulp.task('default', ['copy']);