import gulp from 'gulp';
import gulpif from 'gulp-if';
import concat from 'gulp-concat';
import webpack from 'webpack';
import gulpWebpack from 'webpack-stream';
import named from 'vinyl-named';
import livereload from 'gulp-livereload';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import filter from 'gulp-filter';
import uglify from 'gulp-uglify';
import {log,colors} from 'gulp-util';
import args from './util/args';
// import webpackConfig from '../webpack.config.js';

// 用来排除已压缩文件
var condition = function(f){
    var reg1 = /(city|localhostdata|\.min)\.js$/g,
        reg2 = /\.js$/g
    if (reg1.test(f.path)) {
        return false;
    } else if (reg2.test(f.path)) {
        return true;
    } else {
        return false;
    }
};

var jsFilter = filter(condition, {restore: true});
gulp.task('scripts',()=>{
  return gulp.src('app/static/script/**/*.js',{ base: 'app' })
  .pipe(jsFilter)
  .pipe(uglify({
    compress:{
      properties:false,
      drop_console: true // 删除console
    },output:{
      'quote_keys':true
    },mangle: {
      except: ['require' ,'exports' ,'module' ,'$']  //排除混淆关键字
    }}))
  .pipe(jsFilter.restore)
  .pipe(gulp.dest('dist/'))
  .pipe(gulpif(args.watch,livereload()))
});
