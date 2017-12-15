import gulp from 'gulp';
import gulpif from 'gulp-if';
import livereload from 'gulp-livereload';
import htmlmin from 'gulp-htmlmin';
import args from './util/args';

var options = {
    removeComments: true, //清除HTML注释
    // collapseWhitespace: true, //压缩HTML
    minfyJS: true,//压缩JS
    minfyCss: true,//压缩CSS
};

gulp.task('pages', () => {
    return gulp.src(['app/**/*.ejs', 'app/**/*.html'], {base: 'app'})
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist'))
        .pipe(gulpif(args.watch, livereload()))
})
