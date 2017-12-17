//$.get()请求返回的数据是个字符串，所以需在后面加"json"条件，指明为json数据
// 书城首页接口
// http://www.zhangxinxu.com/wordpress/2013/06/html5-history-api-pushstate-replacestate-ajax/

var recommend = [],
female = [],
male = [],
free = [];
$.ajax({
	url: '/ajax/indexs',
	type:'get',
	dataType: 'json',
	success:function(d) {
		if(d.result == 0) {
			var windowWidth = $(window).width();
			if(windowWidth < 320) {
				windowWidth = 320;
			}
			var offset = $('.Swipe-tab').find('a').eq(0).offset();
			var index_header_tab_width = offset.width;
			recommend = d.items[2].data.data;
			// recommend_female = d.items[2].data.data;
			female = d.items[3].data.data;
			male = d.items[4].data.data;
			free = d.items[5].data.data;

			// 使用图片懒加载中间件
			Vue.use(VueLazyload, {
				preLoad: 1.3,
				error: 'img/default_book.png',
				loading: 'img/default_book.png'
			});

			count = 5;
			new Vue({
				el: '#app',
				data: {
					screen_width: windowWidth,
					double_screen_width: windowWidth*2,
					index_header_tab_width: index_header_tab_width,
					top: d.items[0].data.data.slice(0,2),
					hot: d.items[1].data.data,
					recommend: recommend.slice(0,count), // 重磅推荐
					female: female.slice(0,count),
					male: male.slice(0,count),
					free: d.items[5].data.data,
					topic: d.items[6].data.data,
					duration: 0,
					position: 0,
					header_position: index_header_tab_width/2,
					header_duration: 0,
					tab_1_class: 'Swipe-tab_on',
					tab_2_class: '',
					recommend_count: count,// 用来记录显示的数目
					female_count: count,
					male_count: count,
					recommend_sex: 'm', // 默认为男生
					fiction_array: [], // 书架信息
				},
				created: function(){
					var that = this;

					$(window).on('resize',function(){
						window.location.reload();
						/*if($(this).width() < 768){
							window.location.reload();
						}*/
					});
					$('#init_loading').hide();
					// 书架展示,列表和多行
					$('#shelf_switch').click(function() {
						if(!that.fiction_array.length) return false;
						$(this).toggleClass('shelf__switch_list');
						$('.shelf > .book-list').toggleClass('shelf-book book-table');
					});


					// 书架信息请求
					var fiction_array = JSON.parse(localStorage.getItem('ficiton_reader_fiction_array')) || [];
					var lst_arr = "";
					if(fiction_array.length > 0){
						if(fiction_array.length > 15) {
							// 限制书架数
							fiction_array = fiction_array.splice(0,15);
							localStorage.setItem('ficiton_reader_fiction_array',fiction_array);
						}
						for (var i = 0; i < fiction_array.length; i++) {
							lst_arr += fiction_array[i] + ',';
						}
						$.ajax({
							url: '/ajax/fictions_list',
							type: 'get',
							data:{
								ids: lst_arr.replace(/\,$/,""),
								owner: '0,2'
							},
							dataType: 'json',
							success: function (res) {
								if(res.result == 0) {
									that.fiction_array = res.items;
									// console.log(that.fiction_array);
								}
							},
							error: function (e) {

							}
						})	
					} else {
						this.fiction_array = fiction_array;
					}
					
				},
				ready: function() {
					var that = this;
					// 左右移动屏幕
					mySwiper = new Swiper ('.swiper-a', {
						direction: 'horizontal',
						initialSlide:0,
						slidesPerView:"auto",
						resistanceRatio : 0,
						speed: 500,
						onTransitionEnd: function(swiper){
							ind = swiper.realIndex;
			            	// console.log(ind)
			            	if(ind == 0){
			            		that.header_position = index_header_tab_width / 2;
			            		that.tab_1_class = "Swipe-tab_on";
			            		that.tab_2_class = "";
			            	} else {
			            		that.header_position = index_header_tab_width / 2 + index_header_tab_width;
			            		that.tab_2_class = "Swipe-tab_on";
			            		that.tab_1_class = "";
			            	}
			            },
			            onSlideChangeEnd: function(swiper){
			            },
			        });
					// 轮播图
					var banner = new Swiper('.swiper-banner', {
						direction: 'horizontal',
						resistanceRatio : 0,
						loop: true,
						autoplay: 2500,
						lazyLoading: true,
						autoplayDisableOnInteraction: false,
						nested: true				
					});
				},
				//事件绑定---书城和书架的切换
				methods: {
					tabSwitch: function (pos) {
						this.duration = 0.5;
						this.header_duration = 0.5;
						mySwiper.slideTo(pos, 500);
					},
					// 点击换一换
					changeContent: function (num, type) {
						var typeName = '',
						content; 

						num += 5;
						num <= 15 ? '': num = 5;  
						switch(type){
							case 0:
							typeName = 'recommend';
							if(this.recommend_sex == 'm') {
								content = recommend.slice(0,15);
							} else if (this.recommend_sex == 'f') {
								content = recommend.slice(15,30);
							}
							break;
							case 1:
							typeName = 'female';
							content = female;break;
							case 2:
							typeName = 'male';
							content = male;break;
						}
						
						this[typeName] = content.slice(num - 5, num);
						this[typeName + '_count'] = num;
					},
					// 点击切换重磅推荐的男 | 女
					changeSex: function (type) {
						$('.tab > a').removeClass('tab_on').eq(type).addClass('tab_on');
						type == 0 ? this.recommend_sex = 'm': this.recommend_sex = 'f';
						this.changeContent(0, 0);
					}
				}
			})
}
},
error:function(err){
		// console.log(err);
	}
});