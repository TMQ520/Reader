const axios = require('axios');
const Router = require('koa-router');

//获取 Mock数据接口-service模块接口
const service = require('./webAppService.js');
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
	//渲染book详情页
	await ctx.render('book',{nav: '书籍详情', bookId: bookId});
})

//搜索页面view
let search = new Router();
search.get('/', async ( ctx ) => {
	await ctx.render('search', {nav: '搜索页面'});
})

//分类页面view
let category = new Router();
category.get('/', async ( ctx ) => {
	await ctx.render('category', {nav: "分类页面"});
})
.get('/details', async ( ctx ) => {
	let navContent = ctx.query.nav || '分类详情页面';
	await ctx.render('category-details', {nav: navContent});
})

//排行页面view
let rank = new Router();
rank.get('/', async ( ctx ) => {
	await ctx.render('rank', {nav: "排行页面"});
})

//男频页面view
let female = new Router();
female.get('/', async ( ctx ) => {
	await ctx.render('female', {nav: "女频页面"});
})

//女频页面view
let male = new Router();
male.get('/', async ( ctx ) => {
	let params = ctx.query;
	await ctx.render('male', {nav: params.nav || "男频页面"});
})

//阅读页面view
let reader = new Router();
reader.get('/', async ( ctx ) => {
	await ctx.render('reader', {nav: '阅读书籍'});
})

//目录view
let catolog = new Router();
catolog.get('/', async ( ctx ) => {
	await ctx.render('catolog', {nav: '目录'});
})

// 抽离的公用view
let commonView = new Router();
commonView.get('/', async ( ctx ) => {
	let params = ctx.query;
	await ctx.render('lists', {nav: params.nav});
})
//=====================-view_end-========================

// 封装请求方法
const headers = {
	referer:'http://dushu.xiaomi.com/',
	host: 'dushu.xiaomi.com',
	Cookie: 'app_id=web; build=8888; device_hash=5528999bb9b7cae495ff68a2792b9c81; device_id=D950J4F3ND9OIM4O; user_type=2'
}

const commonUrl = 'http://dushu.xiaomi.com'; // 定义全局变量
//实现 首页API
let homeApi = new Router();
homeApi.get('/index', async ( ctx ) => {
	ctx.body = service.get_index_data();
})
.get('/indexs', async ( ctx ) => {
	var url = commonUrl + '/hs/v3/channel/418';3

	await axios.get(url,{
		headers: headers
	}).then((res) => {
		// console.log(res.data)
		ctx.body = res.data;
	}).catch((e) => {
		console.log(e)
	})
})
.get('/book', async ( ctx ) => {//实现书籍API  根据id去取
	let params = ctx.query;
	let id = params.id;
	if(!id) {
		id = ""; //如果没有传id，则赋为空
	}
	ctx.body = service.get_book_data(id);
})
.get('/books',async ( ctx ) => {
	let params = ctx.query;
	let id = params.id;
	if(!id) {
		id = ""; //如果没有传id，则赋为空
	}
	let url = commonUrl + '/hs/v0/android/fiction/book/' + id;
	await axios.get(url,{
		headers: headers
	}).then((res) => {
		// console.log(res.data)
		ctx.body = res.data;
	}).catch((e) => {
		console.log(e)
	})
})
.get('/search', async ( ctx ) => { //实现搜索API  通过ajax方式获取HTML数据
	let params = ctx.query;
	let start = params.start;
	let end = params.end;
	let keyword = params.keyword;
	ctx.body = await service.get_search_data(start, end, keyword);
})
.get('/rank', async ( ctx ) => { //实现排行API
	ctx.body = await service.get_rank_data();
})
.get('/ranks', async ( ctx ) => {
	var url = commonUrl + '/store/v0/ad/ranks';
	await axios.get(url,{
		headers: headers
	}).then((res) => {
		// console.log(res.data)
		ctx.body = res.data;
	}).catch((e) => {
		console.log(e)
	})
})
.get('/category', async ( ctx ) => { //实现分类API
	ctx.body = await service.get_category_data();
})
.get('/categorys', async ( ctx ) => {
	var url = commonUrl + '/hs/v0/android/store/category';
	await axios.get(url,{
		headers: headers
	}).then((res) => {
		ctx.body = res.data;
	}).catch((e) => {
		console.log(e)
	})
})
.get('/cateDetails',async ( ctx ) => { // 获取分类详情页面接口
	let params = ctx.query;
	// var url = commonUrl + '/store/v0/fiction/category/' + params.id + '?start='+ params.start +'&count='+ params.count +'&click='+ params.click;
	var url = commonUrl + '/store/v0/fiction/category/' + params.id;
	await axios.get(url,{
		headers: headers,
		params: {
			start: params.start,
			count: params.count,
			click: params.click
		}
	}).then((res) => {
		ctx.body = res.data;
	}).catch((e) => {
		console.log(e)
	})
})
.get('/lists',async ( ctx ) => {
	let params = ctx.query;
	var url = commonUrl + '/store/v0/fiction/list/' + params.id;
	await axios.get(url,{
		headers: headers,
		params: {
			start: params.start,
			count: params.count
		}
	}).then((res) => {
		ctx.body = res.data
	}).catch((e) => {
		console.log(e);
	})
})
.get('/female', async ( ctx) => { //实现女频API
	ctx.body = await service.get_female_data();
})
.get('/females', async ( ctx ) => {
	var url = commonUrl + '/hs/v3/channel/370';
	await axios.get(url,{
		headers: headers
	}).then((res) => {
		// console.log(res.data)
		ctx.body = res.data;
	}).catch((e) => {
		console.log(e)
	})
})
.get('/male', async ( ctx ) => { //实现男频API
	ctx.body = await service.get_male_data();
})
.get('/males', async ( ctx ) => {
	let params = ctx.query;

	var url = commonUrl + '/hs/v3/channel/' + params.id;
	await axios.get(url,{
		headers: headers
	}).then((res) => {
		// console.log(res.data)
		ctx.body = res.data;
	}).catch((e) => {
		console.log(e)
	})
})
.get('/chapter', async ( ctx ) => { //获取目录标题列表
	ctx.body = await service.get_chapter_data();
})
.get('/chapters', async ( ctx ) => {
	let params = ctx.query;
	let url = commonUrl + '/store/v0/fiction/detail/'+ params.fiction_id;
	await axios.get(url,{
		headers: headers,
		// params: {
		// 	// fiction_id: params.fiction_id,
		// 	chapter_id: params.chapter_id,
		// 	// format: 'jsonp'
		// }
	}).then((res) => {
		ctx.body = res.data;
	}).catch((e) => {
		console.log(e);
	})
})
.get('/chapter_data', async ( ctx ) => { //获取文章内容详情
	let params = ctx.query;
	let id = params.id;
	if(!id) id = "";
	ctx.body = await service.get_chapter_content_data(id);
})
.get('/chapter_datas', async ( ctx ) => {
	let params = ctx.query;
	let url = commonUrl + '/drm/v0/fiction/link';
	await axios.get(url,{
		headers: headers,
		params: {
			fiction_id: params.fiction_id,
			chapter_id: params.chapter_id,
			format: 'jsonp'
		},
	}).then((res) => {
		// console.log(res)
		ctx.body = res.data;
	}).catch((e) => {
		console.log(e);
	})
})
.get('/fictions_list', async ( ctx ) => {
	let url = commonUrl + '/store/v0/fiction/id_list';
	let params = ctx.query;
	await axios.get(url,{
		headers:headers,
		params: params
	}).then((res) => {
		ctx.body = res.data;
	}).catch((e) => {
		console.log(e)
	})
})
// 获取搜索标签
.get('/search/ad', async ( ctx ) => {
	let url = commonUrl + '/store/v0/ad';
	let params = ctx.query;
	await axios.get(url, {
		headers:headers,
		params:params
	}).then((res) => {
		ctx.body = res.data;
	}).catch((e) => {
		ctx.body = e;
	})
})
// 获取搜索内容
.get('/search/query', async( ctx ) => {
	let url = commonUrl + '/store/v0/lib/query/onebox';
	let params = ctx.query;
	await axios.get(url, {
		headers: headers,
		params:params
	}).then((res) => {
		ctx.body = res.data;
	})
})




module.exports = {
	home: home,
	book:book,
	search:search,
	rank:rank,
	category:category,
	female:female,
	male:male,
	catolog:catolog,
	commonView:commonView,
	reader:reader,
	homeApi:homeApi
};