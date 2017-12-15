import gulp from 'gulp';
import gulpif from 'gulp-if';
import livereload from 'gulp-livereload';
import gulpPostcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssmin from 'gulp-cssmin';
import args from './util/args';

gulp.task('css', () => {
    return gulp.src('app/static/css/**/*.css',{base: 'app'})
        .pipe(gulpPostcss([ autoprefixer({ browsers: ['last 2 versions'] }) ])) // 加css前缀
        .pipe(cssmin({
            compatibility: 'ie8' // 兼容ie8
        }))
        .pipe(gulp.dest('dist/'))
})
