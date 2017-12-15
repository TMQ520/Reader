
var params = {
	from: getUrlStr('from')
}
var id = 0;
params.from == 'free' ? id = 371 : id = 369;

$.get('/ajax/males?id=' + id,function (d) {
	var windowWidth = $(document.body).width();
	if(windowWidth < 320) {
		windowWidth = 320;
	}
	// 使用图片懒加载中间件
	Vue.use(VueLazyload, {
		preLoad: 1.3,
		error: 'img/default_book.png',
		loading: 'img/default_book.png'
	});
	
	if(params.from == 'free'){
		var a = d.items.forEach(function(arr1, index){
			var a = arr1.data.data;
			a.forEach(function (arr2, index) {
				Object.assign(arr2, arr2.data)
			})
		})
	}
	new Vue({
		el: '#app',
		data: {
			screen_width: windowWidth,
			double_screen_width: windowWidth*2,
			item: d,
			from: params.from || 'male',
		},
		created: function(){
			$('#goBack').click(function(){
				location.href = '/';
			});
			$('#init_loading').hide();
		}
	})
}, 'json');