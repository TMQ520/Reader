var fs = require('fs');

//获取首页数据
exports.get_index_data = function () {
	var content = fs.readFileSync('./mock/home.json', 'utf-8');
	return content;
}

//获取书籍详情页数据
exports.get_book_data = function (id) {
	if ( !id ) {
		id = "18218";
	}
	if ( fs.existsSync('./mock/book/' + id + '.json')) {
		return fs.readFileSync('./mock/book/' + id + ".json", 'utf-8');
	} else {
		return fs.readFileSync('./mock/book/ 18218.json', 'utf-8');
	}
}

// //
// exports.get_