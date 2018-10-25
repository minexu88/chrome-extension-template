const gulp = require('gulp');
var clean = require('gulp-clean');
const webpack = require('webpack-stream');
const webpackConfig = require('./config/webpack');
const runSequence = require('run-sequence');
const path = require('path');

gulp.task('compile-background', () => {
  return gulp
    .src('src/background/index.js')
    .pipe(webpack(webpackConfig.getCompileJSConfig('index.js')))
    .pipe(gulp.dest('build/background'));
});

gulp.task('compile-content', () => {
  return gulp
    .src('src/content/index.js')
    .pipe(webpack(webpackConfig.getCompileJSConfig('index.js')))
    .pipe(gulp.dest('build/content'));
});

gulp.task('compile-popup', () => {
  return gulp
    .src(['src/popup/index.js'])
    .pipe(
      webpack(
        webpackConfig.getCompileReactConfig(
          'index',
          path.resolve(__dirname, 'src/popup/index.html')
        )
      )
    )
    .pipe(gulp.dest('build/popup'));
});

gulp.task('copy-resources', () => {
  gulp
    .src(['src/manifest.json', 'src/icon/**'])
    .pipe(gulp.dest('build'));
});

gulp.task('clean', () => {
  return gulp
    .src('build', { read: false })
    .pipe(clean());
});

gulp.task('build', ['clean'], callback => {
  runSequence('compile-background', 'compile-content', 'compile-popup', 'copy-resources');
  callback();
});
