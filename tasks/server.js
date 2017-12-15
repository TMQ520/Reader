import gulp from 'gulp';
import gulpif from 'gulp-if';
import liveserver from 'gulp-live-server';
import args from './util/args';

gulp.task('serve',(cb)=>{
  if(!args.watch) return cb();
  var serverPath = './prodServer.js';
  var server = liveserver.new(['--harmony',serverPath]);
  server.start();

  gulp.watch(['dist/static/**/*.js','dist/view/**/*.ejs'],function(file){
    server.notify.apply(server,[file]);
  })

  gulp.watch(['service/routes.js','./app.js'],function(){
    server.start.bind(server)()
  });
})
