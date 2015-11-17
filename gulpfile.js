/**
 * Created by wander on 15/9/9.
 */
var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
gulp.task('default', function () {
    var tsResult = gulp.src(
        ['src/*.ts']
    )
        .pipe(sourcemaps.init())
        .pipe(ts({
            target: 'ES5',
            module: 'commonjs',
            out: 'src.js'
        }));
    return tsResult.js.pipe(sourcemaps.write('.')).pipe(gulp.dest('build'));
});


