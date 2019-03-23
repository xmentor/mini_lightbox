(function(gulp) {
    'use strict';

    const sass = require('gulp-sass');
    const autoprefixer = require('gulp-autoprefixer');
    const cssmin = require('gulp-cssmin');
    const webpack = require('webpack');
    const gulpWebpack = require('gulp-webpack');
    const webpackConfig = require('./config/bundler.js');
    const browserSync = require('browser-sync');
    const rename = require('gulp-rename');

    gulp.task('sass', () => {
        return gulp.src('src/sass/lightbox.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer({
                browsers: ['last 2 version'],
                cascade: false
            }))
            .pipe(cssmin())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest('dist/css'))
            .pipe(gulp.dest('example/css'));
    });

    gulp.task('js', () => {
        return gulp.src('src/js/index.js')
            .pipe(gulpWebpack(webpackConfig, webpack))
            .pipe(gulp.dest('dist/js'))
            .pipe(gulp.dest('example/js'));
    });

    gulp.task('watch', (done) => {
        gulp.watch('src/sass/**/*.scss', gulp.series(['sass']));
        gulp.watch('src/js/**/*.js', gulp.series(['js']));

        browserSync({
            server: {
                baseDir: ['example']
            }
        });

        gulp.watch(['dist/css/*.css', 'dist/js/*.js']).on('change', browserSync.reload);

        done();
    });

    gulp.task('default', gulp.series(['sass', 'js', 'watch']));
    
}(require('gulp')));