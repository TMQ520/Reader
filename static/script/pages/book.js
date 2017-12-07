/*pop() 方法用于删除并返回数组的最后一个元素。*/
var id = location.href.split('?id=').pop();



// 设置cookie
function setCookie(name,value){
	document.cookie = name + '=' + escape(value);
}
// 清空所有的cookie
function clearCookie(){ 
	var keys = document.cookie.match(/[^ =;]+(?=\=)/g); 
	if (keys) { 
		for (var i = keys.length; i--;) 
			document.cookie = keys[i]+'=0;expires=' + new Date( 0).toUTCString() 
	} 
} 
// 获取 设备随机数
function t() {
	for (var t = "0123456789QWERTYUIOPASDFGHJKLZXCVBNM", n = "", e = 0; 12 > e; e++)
		n += t.charAt(Math.ceil(1e8 * Math.random()) % t.length);
	return "D950" + n;
}

var obj = {
	app_id: 'mi_wap',
	build: 8888,
	device_hash: '5528999bb9b7cae495ff68a2792b9c81',
	device_id: t(),
	user_type: 2
};


$(function(){
	$.get('/ajax/books?id=' + id, function (d) {
		new Vue({
			el: "#app",
			data:d,
			created: function() {
				$('#init_loading').hide();
			},
			methods: {
				readBook: function() {
					var chapter_id = localStorage.getItem('ficiton_reader_' + this.item.fiction_id + '_last_chapter') || 0;
					location.href = '/reader?fiction_id=' + this.item.fiction_id + '&chapter_id=' + chapter_id;
				}
			}
		});
	}, 'json');		
})
