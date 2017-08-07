'use-strict';

var gulp = require('gulp'),
    browserSync = require('browser-sync');

var path = require('../../paths.js'),
    config = require('../../config.js')();

gulp.task('browserSync', function() {
    console.log('-> Starting browserSync');

    browserSync({
        server: {
            baseDir: path.to.dest,
            index: config.syncOptions.index || 'index.html'
        },
        open: config.syncOptions.open || false,
        notify: config.syncOptions.notify || true
    });
});