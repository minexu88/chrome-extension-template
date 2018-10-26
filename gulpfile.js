const gulp = require('gulp');
const clean = require('gulp-clean');
const webpack = require('webpack-stream');
const webpackConfig = require('./config/webpack');
const runSequence = require('run-sequence');
const path = require('path');

const isChildOf = (child, parent) => {
  if (child === parent) return false;
  const parentTokens = parent.split(path.sep).filter(i => i.length);
  return parentTokens.every((t, i) => child.split(path.sep)[i] === t);
};

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

gulp.task('watch', ['clean', 'build'], callback => {
  const watcher = gulp.watch(['src/**']);
  watcher.on('change', info => {
    if (isChildOf(info.path, path.join(__dirname, 'src/content'))) {
      runSequence('compile-content');
    } else if (isChildOf(info.path, path.join(__dirname, 'src/background'))) {
      runSequence('compile-background');
    } else if (isChildOf(info.path, path.join(__dirname, 'src/popup'))) {
      runSequence('compile-popup');
    } else if (isChildOf(info.path, path.join(__dirname, 'src'))) {
      runSequence('copy-resources');
    }
  });

  callback();
});
