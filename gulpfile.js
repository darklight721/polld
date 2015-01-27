'use strict';

var gulp        = require('gulp'),
    $           = require('gulp-load-plugins')(),
    sync        = $.sync(gulp).sync,
    del         = require('del'),
    browserify  = require('browserify'),
    watchify    = require('watchify'),
    source      = require('vinyl-source-stream');

gulp.task('styles', function() {
  return gulp.src('app/styles/main.scss')
    .pipe($.rubySass({
      style: 'expanded',
      precision: 10
    }))
    .on('error', $.util.log.bind($.util, 'Sass Error'))
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('dist/styles'))
    .pipe($.size());
});

gulp.task('scripts', function() {
  var bundler = watchify(browserify({
    entries: ['./app/scripts/app.js'],
    insertGlobals: true,
    cache: {},
    packageCache: {},
    fullPaths: true
  }));

  function rebundle() {
    return bundler.bundle()
      .on('error', $.util.log.bind($.util, 'Browserify Error'))
      .pipe(source('app.js'))
      .pipe(gulp.dest('dist/scripts'));
  }

  bundler.on('update', rebundle);
  return rebundle();
});

gulp.task('html', function() {
  return gulp.src('app/*.html')
    .pipe($.useref.assets())
    .pipe($.useref.restore())
    .pipe($.useref())
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size());
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
    .pipe($.size());
});

gulp.task('serve', function() {
  gulp.src('dist')
  .pipe($.webserver({
    livereload: true,
    port: 9000
  }));
});

gulp.task('minify:js', function() {
  return gulp.src('dist/scripts/**/*.js')
  .pipe($.uglify())
  .pipe(gulp.dest('dist/scripts/'))
  .pipe($.size());
});

gulp.task('minify:css', function() {
  return gulp.src('dist/styles/**/*.css')
  .pipe($.minifyCss())
  .pipe(gulp.dest('dist/styles'))
  .pipe($.size());
});

gulp.task('clean', del.bind(null, 'dist'));

gulp.task('build', ['html', 'styles', 'scripts', 'images', 'fonts']);

gulp.task('default', sync(['clean', 'build']));

gulp.task('minify', ['minify:js', 'minify:css']);

gulp.task('preview', sync(['default', 'minify', 'serve']));

gulp.task('deploy', sync(['default', 'minify']), function() {
  return gulp.src('dist/**/*')
    .pipe($.ghPages({ origin: 'github' }));
});

gulp.task('watch', ['default', 'serve'], function() {
  gulp.watch('app/*.html', ['html']);
  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/images/**/*', ['images']);
  gulp.watch('app/fonts/**/*', ['fonts']);
});
