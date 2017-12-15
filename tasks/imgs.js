import gulp from 'gulp';
import gulpif from 'gulp-if';
import livereload from 'gulp-livereload';
// import imagemin from 'gulp-imagemin';
// import cache from 'gulp-cache';
import args from './util/args';
import del from 'del';

var condition = function (f) {
	var reg = /\.(png|jpeg|gif|ico)$/gi;
	if(reg.test(f.path)){
		return true;
	}
	return false;
}

gulp.task('imgs',()=>{
	// del('build/img');
  return gulp.src('app/static/img/**/*',{ base: 'app' })
  	/*.pipe(gulpif( condition, cache(imagemin())))*/
    .pipe(gulp.dest('dist/')) 
    .pipe(gulpif(args.watch,livereload()))
})
