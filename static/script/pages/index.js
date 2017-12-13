//$.get()请求返回的数据是个字符串，所以需在后面加"json"条件，指明为json数据
// 书城首页接口


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
			console.log(d);
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
				preLoad: 1.2,
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
					top: d.items[0].data.data,
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
				},
				created: function(){
					$(window).on('resize',function(){
						window.location.reload();
						/*if($(this).width() < 768){
							window.location.reload();
						}*/
					});
					$('#init_loading').hide();
					$('#shelf_switch').click(function() {
						$(this).toggleClass('shelf__switch_list');
						$('.shelf > .book-list').toggleClass('shelf-book book-table');
					});
				},
				//事件绑定---书城和书架的切换
				methods: {
					tabSwitch: function (pos) {
						this.duration = 0.5;
						this.header_duration = 0.5;
						if(pos == 0) {
							this.position = 0;
							this.header_position = index_header_tab_width/2;
							this.tab_1_class = "Swipe-tab_on";
							this.tab_2_class = "";
						} else {
							this.position = (-windowWidth);
							this.header_position = index_header_tab_width/2 + index_header_tab_width;
							this.tab_2_class = "Swipe-tab_on";
							this.tab_1_class = "";
						}
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