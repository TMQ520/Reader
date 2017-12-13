/*pop() 方法用于删除并返回数组的最后一个元素。*/
// var id = location.href.split('?id=').pop();
var params = {
	id: getUrlStr('id'),
	from: getUrlStr('from')
}


// 设置cookie
function setCookie(name,value){
	document.cookie = name + '=' + escape(value);
}
// 清空所有的cookie
function clearCookie(){ 
	var keys = document.cookie.match(/[^ =;]+(?=\=)/g); 
	if (keys) { 
		for (var i = keys.length; i--;) 
			document.cookie = keys[i]+'=0;expires=' + new Date( 0).toUTCString() 
	} 
} 
// 获取 设备随机数
function t() {
	for (var t = "0123456789QWERTYUIOPASDFGHJKLZXCVBNM", n = "", e = 0; 12 > e; e++)
		n += t.charAt(Math.ceil(1e8 * Math.random()) % t.length);
	return "D950" + n;
}

var obj = {
	app_id: 'mi_wap',
	build: 8888,
	device_hash: '5528999bb9b7cae495ff68a2792b9c81',
	device_id: t(),
	user_type: 2
};


$(function(){
	
	
	$.get('/ajax/books?id=' + params.id, function (d) {
		// 使用图片懒加载中间件
		Vue.use(VueLazyload, {
			preLoad: 1.2,
			error: 'img/default_book.png',
			loading: 'img/default_book.png'
		});
		
		new Vue({
			el: "#app",
			data:d,
			created: function() {
				$('#init_loading').hide();
				$('#goBack').click(function(){
					if(params.from == 'main') {
						location.href = '/';
					} else if (params.from == 'categoryDetails') { 
						var cate_id = getUrlStr('cate_id'),
						nav = getUrlStr('nav');
						location.href = '/category/details' + '?cate_id='+ cate_id + '&nav=' + nav + '&from='+ 'category';
					} else if(params.from) {
						location.href = '/' + params.from;
					} else {
						location.href = '/';
					}
				});
			},
			filters: {
				// 字数统计
				worldCount: function (count) {
					var world = Math.ceil(count / 10000);
					world == 1 ? world = count :  world  = world + '万';
					return world;
				}
			},
			methods: {
				readBook: function() { // 跳转到读书页面
					var from;
					var chapter_id = localStorage.getItem('ficiton_reader_' + this.item.fiction_id + '_last_chapter') || 0;
					params.from ? from = params.from : from = 'book';
					
					if(params.from == 'categoryDetails') { // 如果是从分类页面跳转过来的
						var cate_id = getUrlStr('cate_id'),
						nav = getUrlStr('nav');
						location.href = '/reader?fiction_id=' + this.item.fiction_id + '&chapter_id=' + chapter_id + '&cate_id='+ cate_id + '&nav=' + nav + '&from='+ 'categoryDetails';
					} else {
						location.href = '/reader?fiction_id=' + this.item.fiction_id + '&chapter_id=' + chapter_id + '&from=' + from;
					}
				}
			}
		});
	}, 'json');		
})
