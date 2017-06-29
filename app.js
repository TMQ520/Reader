const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const views = require('koa-views');
const static = require('koa-static');

const app = new Koa();

//静态资源路径
const staticPath = './static';


//将静态资源公布出来
app.use(static(
	path.join( __dirname, staticPath)
))

//加载模板引擎  挂载到ctx.render上
app.use(views( path.join( __dirname, './view'), {
	extension: 'ejs'
}))

//获取 Mock数据接口-service模块接口
const service = require('./service/webAppService.js');

//获取querystring模块接口
var querystring = require('querystring');

//=====================-view-============================
//书城功能首页
let home = new Router();
home.get('/', async ( ctx ) => {
	await ctx.render('index', {nav: '书城首页'});
})

//书籍详情view
let book = new Router();
book.get('/', async ( ctx ) => {
	// console.log(ctx.query);
	let params = ctx.query;
	let bookId =  params.id;
	if(!bookId) {
		bookId="";
	}
	ctx.body = await ctx.render('book',{nav: '书籍详情', bookId: bookId});
})
//=====================-view_end-========================



//实现 首页API
let homeApi = new Router();
homeApi.get('/index', async ( ctx ) => {
	ctx.body = service.get_index_data();
})
.get('/book', async ( ctx ) => {//实现书籍API  根据id去取
	let params = ctx.query;
	let id = params.id;
	if(!id) {
		id = ""; //如果没有传id，则赋为空
	}
	ctx.body = service.get_book_data(id);
})

let router = new Router();
router.use('/', home.routes()).use('/book',book.routes()).use('/ajax', homeApi.routes());

app.use(router.routes())

app.listen(3000);
console.log('Service is starting in port 3000');
