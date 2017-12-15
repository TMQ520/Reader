var start = 0,
count = 10;


new Vue({
	el: '#app_search',
	data: {
		search:[],
		tags: [], // 搜索标签
		condition:true,
		empty:false,
		load: false,
		more: true,
		keyword: '',
	},
	created: function () {
		var that = this;
		$.ajax({
			url: '/ajax/search/ad',
			type:'get',
			data:{
				key: 'df_search_tags',
				a: 1
			},
			dataType:'json',
			success: function (res) {
				that.tags = res.ads;
				console.log(that.tags)
			}
		})
	},
	methods: {
		searchTag: function (index) {
			this.keyword = this.tags[index].ad_name;
			this.doSearch();
		},
		doSearch: function() {

			start = 0;
			var _this = this; //将Vue实例存起来

			$.ajax({
				url: '/ajax/search/query',
				type:'get',
				data:{
					start: start,
					count: count,
					s: _this.keyword,
					source: '2,5'
				},
				dataType:'json',
				success: function (res) {
					if(res.result == 0) {
						_this.more = res.more;
						_this.search = res.items;
						_this.condition = false;
						if(_this.search.length == 0){
							_this.empty = true;
						}else{
							_this.empty = false;
						}
					}
				}
			})

			/*$.get('/ajax/search',{
				keyword: keyword
			},function(d){
				_this.condition = false;
				_this.search = d.items;
				if(_this.search.length == 0){
					_this.empty = true;
				}else{
					_this.empty = false;
				}
			},'json');*/
		},
		getMore: function () {
			start += 10;
			var _this = this;
			if(this.more) {
				this.load = true;
				$.ajax({
					url: '/ajax/search/query',
					type:'get',
					data:{
						start: start,
						count: count,
						s: _this.keyword,
						source: '2,5'
					},
					dataType:'json',
					success: function (res) {
						_this.load = false;
						if(res.result == 0) {
							_this.more = res.more;
							for (var i = 0; i < res.items.length; i++) {
								_this.search.push(res.items[i])
							}
						}
					}
				})
			}
		}
	}
});