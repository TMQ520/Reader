var fs = require('fs');

//获取首页数据
exports.get_index_data = function () {
	var content = fs.readFileSync('./mock/home.json', 'utf-8');
	return content;
}

//获取书籍详情页数据
exports.get_book_data = function (id) {
	if ( !id ) {
		id = "323725";
	}
	if ( fs.existsSync('./mock/book/' + id + '.json')) {
		return fs.readFileSync('./mock/book/' + id + ".json", 'utf-8');
	} else {
		return fs.readFileSync('./mock/book/323725.json', 'utf-8');
	}
}

//获取排行数据
exports.get_rank_data = function () {
	var content = fs.readFileSync('./mock/rank.json', 'utf-8');
	return content;
}


//获取分类数据
exports.get_category_data = function () {
	var content = fs.readFileSync('./mock/category.json', 'utf-8');
	return content;
}


//获取男频数据
exports.get_male_data = function () {
	var content = fs.readFileSync('./mock/channel/male.json', 'utf-8');
	return content;
}

//获取女频数据
exports.get_female_data = function () {
	var content = fs.readFileSync('./mock/channel/female.json', 'utf-8');
	return content;
}


//获取书籍详情页数据
exports.get_search_data = function (start, end, keyword) {
	return function (cb) {
		var http = require('http');
		var qs = require('querystring');
		var data = {
			start: start,
			end: end,
			k: keyword
		};
		var content = qs.stringify( data );
		var http_request = {
			hostname: 'dushu.xiaomi.com',
			port: 80,
			path: '/store/v0/lib/query/onebox?' + content,
			method: 'GET'
		};

		//发送http请求
		req_obj = http.request( http_request, function (_res) {
			var callback_content = '';
			var _this = this;
			var content = '';
			_res.setEncoding('utf-8');

			_res.on('data', function (chunk) {
				content += chunk;
			});

			_res.on('end', function (e) {
				cb(null, content);
			});

		});

		req_obj.end();
	}
}