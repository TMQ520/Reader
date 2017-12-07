/*$.get('/ajax/chapters', function (d) {
	var windowWidth = $(document.body).width();
	if(windowWidth < 320) {
		windowWidth = 320;
	}

	var params = {
		fiction_id: getUrlStr('fiction_id'),
		chapter_id: getUrlStr('chapter_id')
	}
	new Vue({
		el: '#app_chapter',
		data: {
			screen_width: windowWidth,
			double_screen_width: windowWidth*2,
			item: d
		}
	})
}, 'json');*/

var params = {
	fiction_id: getUrlStr('fiction_id'),
	chapter_id: getUrlStr('chapter_id')
}

$.ajax({
	url: '/ajax/chapters',
	type:'get',
	data:{
		fiction_id : params.fiction_id
	},
	dataType: 'json',
	success: function(res) {
		if (res.result == 0) {
			var toc = res.item.toc;
			$('#nav_title').html('返回');
			var windowWidth = $(document.body).width();
			if(windowWidth < 320) {
				windowWidth = 320;
			}

			new Vue({
				el: '#app_chapter',
				data: {
					screen_width: windowWidth,
					double_screen_width: windowWidth * 2,
					item: res.item,
					chapter_id: params.chapter_id
				},
				created:function(){
					$('#init_loading').hide();
				},
				methods:{
					gotoChapter: function(chapter_id) {
						localStorage.setItem('ficiton_reader_'+ params.fiction_id +'_last_chapter',chapter_id);
						location.href = '/reader?fiction_id=' + params.fiction_id + '&chapter_id=' + chapter_id;
					}
				}
			});
		} else {
		}
	},
	error: function (e) {

	}
});