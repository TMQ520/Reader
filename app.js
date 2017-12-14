const Koa = require('koa');
const router = require('koa-router')();
const path = require('path');
const views = require('koa-views');
const static = require('koa-static');
const app = new Koa();
const routers = require("./service/routes");


// 设置全局的axios配置
// axios.defaults.withCredentials = true;

//静态资源路径
const staticPath = './static';


//实现代理
// var proxyMiddleWare = require("http-proxy-middleware");

var options = {
  target: 'http://dushu.xiaomi.com', // target host
  changeOrigin: true,               // needed for virtual hosted sites    // proxy websockets
  // rewrite: {
  //   '^/apis' : '',    // rewrite path
  // },
  // remoteAddress:'101.227.139.217:443'//可能没有用
};


// var exampleProxy = proxyMiddleWare(options);

//app.use('/apis',proxy('http://dushu.xiaomi.com'));//当请求已apis开头的路径时，会自动跳转到相应的qq路径


//将静态资源公布出来
app.use(static(
	path.join( __dirname, staticPath)
	)
)

//加载模板引擎  挂载到ctx.render上
app.use(views( path.join( __dirname, './view'), {
	extension: 'ejs'
}))

//获取 Mock数据接口-service模块接口
//const service = require('./service/webAppService.js');

//获取querystring模块接口
// var querystring = require('querystring');

router.use('/', routers.home.routes())
.use('/book', routers.book.routes())
.use('/search', routers.search.routes())
.use('/rank', routers.rank.routes())
.use('/category', routers.category.routes())
.use('/female', routers.female.routes())
.use('/male', routers.male.routes())
.use('/list', routers.commonView.routes())
.use('/chapter', routers.catolog.routes())
.use('/reader', routers.reader.routes())
.use('/ajax', routers.homeApi.routes());

app.use(router.routes())
var port = process.env.PORT || '3000';

app.listen(port);
console.log('Service is starting in port 3000');
