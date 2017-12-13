// 获取分类详情页的
var start = 0; // 第几页
var count = 10; // 每页显示的数目

var id = getUrlStr('cate_id'); /*pop() 方法用于删除并返回数组的最后一个元素。*/
var params = {
	cate_id: getUrlStr('cate_id'),
	nav: getUrlStr('nav'),
	from: getUrlStr('from')
}


$.ajax({
	url: '/ajax/cateDetails',
	type: 'get',
	data:{
		id: params.cate_id,
		start: start,
		count: count,
		click: 1
	},
	dataType: 'json',
	success: function(res) {
		// 隐藏加载动画
		$('#init_loading').hide();
		var windowWidth = $(document.body).width();
		if(windowWidth < 320) {
			windowWidth = 320;
		}	
		
		// var scrollLock = false;  // 是否禁止滚动条请求

		// 使用图片懒加载中间件
		Vue.use(VueLazyload, {
			preLoad: 1.2,
			error: '../../img/default_book.png',
			loading: '../../img/default_book.png'
		});

		var app = new Vue({
			el: '#app',
			data: {
				screen_width: windowWidth,
				double_screen_width: windowWidth*2,
				item: res.items, // 数据
				more: res.more, // 是否还有更多详情
				loadmore: false, // 是否显示加载动画 
				load: false, // 是否显示加载动画
				nav: params.nav,
				cate_id: params.cate_id,
				scrollLock: false, // 是否禁止滚动条请求
			},
			created: function() {
				var that = this;
				/*$('.loading').dropload({
					autoLoad: true,
					distance: 50,
					scrollArea : window,
					loadDownFn : function(me) {
						that.getDetails(me);
					}
				})*/
				/*console.log('windowHeight: ' + windowHeight())
				console.log('scrollTop: ' + scroll().top)
				console.log('documentHeight: ' + documentHeight())
				$(window).scroll(function() {
					if(scroll().top + windowHeight() >= (documentHeight() -50)) {
						// 当加载到离底部只差一点距离时,
						//请求新的数据
						console.log('windowHeight: ' + windowHeight())
						console.log('scrollTop: ' + scroll().top)
						console.log('documentHeight: ' + documentHeight())
						if(that.more == true){
							that.getDetails();
						}
					}
				});*/

				$('#goBack').click(function(){
					location.href = '/category';
				});
			},
			methods: {
				// 获取更多详情
				getDetails: function(me) {
					var that = this;
					this.load = true;
					// if(this.loadmore){
						start += count;
						console.log('start: ' + start)
						$.ajax({
							url: '/ajax/cateDetails',
							type: 'get',
							data:{
								id: id,
								start: start,
								count: count,
								click: 1
							},
							dataType: 'json',
							success: function(res){
								// that.loadmore = true;
								that.load = false;
								for (var i = 0; i < res.items.length; i++) {
									that.item.push(res.items[i])
								}
								// me.resetload();
								that.more = res.more;
								if(res.items.length == 0){ 

									// 锁定
									// me.lock('down');
			                        // 无数据
			                        // me.noData();
			                    }
			                },
			                error: function(){
								// 即使加载出错，也得重置
								// me.resetload();
							}
						})
					/*} else {
						this.loadmore = true;
						// me.resetload();
						me.unlock('down');
					}*/
				}
			}
		})
	},
	error: function() {
		console.log('请求错误')
	}
})

$(function(){
	var Win = $(window);
	Win.scroll(function(){
	// debugger
	console.log('windowHeight: ' + windowHeight())
	console.log('scrollTop: ' + scroll().top)
	console.log('documentHeight: ' + documentHeight())

	// 监听是否滚到底部
	if(scroll().top + windowHeight() >= (documentHeight() - 50)) {
		// 当加载到离底部只差一点距离时,
		//请求新的数据
		// console.log('windowHeight: ' + windowHeight())
		// console.log('scrollTop: ' + scroll().top)
		// console.log('documentHeight: ' + documentHeight())
		console.log('正在加载中...');
		if(!that.ScrollLock) {
			that.ScrollLock = true;
			// that.load = true;
			// that.getDetails(12);
		}
	}
});
})