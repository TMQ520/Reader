// 获取分类详情页的
var start = 0; // 第几页
var count = 10; // 每页显示的数目

var id = getUrlStr('cate_id'); /*pop() 方法用于删除并返回数组的最后一个元素。*/
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
	success: function(res) {
		// 隐藏加载动画
		$('#init_loading').hide();
		var windowWidth = $(document.body).width();
		if(windowWidth < 320) {
			windowWidth = 320;
		}	
		// console.log(res);
		var app = new Vue({
			el: '#app',
			data: {
				screen_width: windowWidth,
				double_screen_width: windowWidth*2,
				item: res.items, // 数据
				more: res.more, // 是否还有更多详情
				loadmore: false, // 是否显示加载动画 
				load: false,
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
			},
			mounted: function() {
				
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
								that.loadmore = true;
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