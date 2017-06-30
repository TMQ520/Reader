$.get('/ajax/rank',function (d) {
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
		}
	})
}, 'json');