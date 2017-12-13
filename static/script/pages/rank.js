// 使用图片懒加载中间件
Vue.use(VueLazyload, {
	preLoad: 1.2,
	error: 'img/default_book.png',
	loading: 'img/default_book.png'
});

$.get('/ajax/ranks',function (d) {
	var windowWidth = $(document.body).width();
	if(windowWidth < 320) {
		windowWidth = 320;
	}
	for (var i = 0; i < d.items.length; i++) {
		d.items[i].description = d.items[i].description.split('\n');
	}
	new Vue({
		el: '#app',
		data: {
			screen_width: windowWidth,
			double_screen_width: windowWidth*2,
			item: d
		},
		created: function(){
			$('#goBack').click(function(){
				location.href = '/';
			})
		}
	})
}, 'json');