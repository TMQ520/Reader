$.get('/ajax/categorys',function (d) {
	var windowWidth = $(document.body).width();
	if(windowWidth < 320) {
		windowWidth = 320;
	}
	new Vue({
		el: '#app',
		data: {
			screen_width: windowWidth,
			double_screen_width: windowWidth*2,
			item: d
		},
		created: function(){
			$('#goBack').click(function(){
				location.href = '/';
			});
			$('#init_loading').hide();
		}
	})
}, 'json');