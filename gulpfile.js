var gulp = require('gulp');
var less = require('gulp-less');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var coffee = require('gulp-coffee');
var pkg = require('./package.json');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

// Set the banner content
var banner = ['/*!\n',
    ' * Studio Riehl - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2017-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    ' */\n',
    ''
].join('');

// Compile LESS files from /less into /css
gulp.task('styles', function() {
  return gulp.src('./less/*.less')
    .pipe(less())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest('./src/css'))
    .pipe(cleanCSS({ compatibility: 'ie8'}))
    .pipe(header(banner, { pkg: pkg }))
    .pipe(rename({ suffix: '.min'}))
    .pipe(gulp.dest('./public/css'))
});

gulp.task('coffee', function() {
  return gulp.src('./coffee/*.coffee')
    .pipe(coffee({bare: true}))
    .pipe(header(banner, { pkg: pkg }))
		.pipe(concat('index.js'))
    .pipe(gulp.dest('./src/js'))
    .pipe(uglify())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./public/js'))
});

gulp.task('watch', function() {
  gulp.watch('./coffee/*.coffee', ['coffee']);
  gulp.watch('./less/styles.less', ['styles']);
});
