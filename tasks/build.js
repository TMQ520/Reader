import gulp from 'gulp';
import gulpSequence from 'gulp-sequence';

gulp.task('build',gulpSequence('clean','pages','imgs','css','scripts',['browser','serve']));
