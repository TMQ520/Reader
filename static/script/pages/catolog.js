$.get('/ajax/chapter', function (d) {
	var windowWidth = $(document.body).width();
	if(windowWidth < 320) {
		windowWidth = 320;
	}
	new Vue({
		el: '#app_chapter',
		data: {
			screen_width: windowWidth,
			double_screen_width: windowWidth*2,
			item: d
		}
	})
}, 'json');