
var params = {
	fiction_id: getUrlStr('fiction_id'),
	chapter_id: getUrlStr('chapter_id'),
	from: getUrlStr('from')
}


if(!params.fiction_id) {
	history.back();
}

var toc = JSON.parse(Storage.getItem(params.fiction_id + '_toc')); 
var chapter_id = Storage.getItem(params.fiction_id + '_last_chapter') || params.chapter_id;

$('#nav_title').html('返回');
var windowWidth = $(document.body).width();
if(windowWidth < 320) {
	windowWidth = 320;
}
if(!toc) {
	$.ajax({
		url: '/ajax/chapters',
		type:'get',
		data:{
			fiction_id : params.fiction_id
		},
		dataType: 'json',
		success: function(res) {
			if (res.result == 0) {
				toc = res.item.toc;
				setApp();
				Storage.setItem(params.fiction_id + '_toc', JSON.stringify(toc));
			} else {
				console.log('请求数据为空');
			}
		},
		error: function (e) {
		}
	});
} else {
	setApp();
}



function setApp() {
	new Vue({
		el: '#app_chapter',
		data: {
			screen_width: windowWidth,
			double_screen_width: windowWidth * 2,
			item: toc,
			fiction_id: params.fiction_id,
			chapter_id: chapter_id
		},
		created:function(){
			var that = this;
			$('#init_loading').hide();
			$('#goBack').click(function() {
				params.from == 'book'? params.from = 'main' : ''; 
				if(params.from == 'categoryDetails') {
					var cate_id = getUrlStr('cate_id'),
					nav = getUrlStr('nav');
					location.href = '/reader?fiction_id=' + that.fiction_id +'&chapter_id='+ that.chapter_id + '&cate_id='+ cate_id +'&nav='+ nav +'&from='+ params.from;
					return false;
				}
				location.href = '/reader?fiction_id='+ that.fiction_id +'&chapter_id='+ that.chapter_id + '&from=' + params.from;
			});
		},
		methods:{
			gotoChapter: function(chapter_id) {
				var chapter = this.item[chapter_id];
				console.log(chapter);
				if(chapter.price !== 0) {
					return false;
				} else if (chapter.free) {
					Storage.setItem(params.fiction_id +'_last_chapter', chapter_id);
					params.from == 'book'? params.from = 'main' : ''; 
					if(params.from == 'categoryDetails') {
						var cate_id = getUrlStr('cate_id'),
						nav = getUrlStr('nav');
						location.href = '/reader?fiction_id=' + this.fiction_id +'&chapter_id='+ this.chapter_id + '&cate_id='+ cate_id +'&nav='+ nav +'&from='+ params.from;
						return false;
					}
					location.href = '/reader?fiction_id=' + params.fiction_id + '&chapter_id=' + chapter_id + '&from=' + params.from;
				}
			}
		}
	});
}


