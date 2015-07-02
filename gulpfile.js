var
  sourcemaps = require('gulp-sourcemaps'),
  gutil = require('gulp-util'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
  semistandard = require('gulp-semistandard'),
  webpack = require('webpack'),
  gulp = require('gulp');

var paths = {
  js: './src/**/*.js',
  sass: './sass/**/*'
}

gulp.task('lint', function () {
  return gulp.src(paths.js)
    .pipe(semistandard())
    .pipe(semistandard.reporter('default', {
      breakOnError: true,
      breakOnWarning: false
    }));
});

gulp.task('sass', function () {
  return gulp.src(paths.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./deploy/'));
});

gulp.task('js', function(callback) {
  console.log(__dirname.concat('deploy/'));
    // run webpack
    webpack({
        entry: './src/index.js',
        output: {
            path: __dirname.concat('/deploy/'),
            filename: 'app.js'
        },
        module: {
            loaders: [
                {
                  test: /\.js$/,
                  loader: 'babel-loader'
                }
            ]
        }
    }, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});

gulp.task('default', ['lint', 'sass', 'js'], function () {
  gulp.watch(paths.js, ['lint', 'js']);
  gulp.watch(paths.sass, ['sass']);
});
