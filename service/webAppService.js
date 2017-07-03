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
	return new Promise(function ( resolve, reject) {
		//异步读取数据 
		fs.readFile('./mock/rank.json', 'utf-8', function (err, data) {
			if( err ) return reject(err);

			resolve(data);
		});
	});
}


//获取分类数据
exports.get_category_data = function () {
	return new Promise(function ( resolve, reject) {
		//异步读取数据 
		fs.readFile('./mock/category.json', 'utf-8', function (err, data) {
			if( err ) return reject(err);

			resolve(data);
		});
	});
}


//获取男频数据
exports.get_male_data = function () {
	return new Promise(function ( resolve, reject) {
		//异步读取数据 
		fs.readFile('./mock/channel/male.json', 'utf-8', function (err, data) {
			if( err ) return reject(err);

			resolve(data);
		});
	});
}

//获取女频数据   
exports.get_female_data = function () {
	return new Promise(function ( resolve, reject) {
		//异步读取数据 
		fs.readFile('./mock/channel/female.json', 'utf-8', function (err, data) {
			if( err ) return reject(err);

			resolve(data);
		});
	});
}


//获取文章详情页数据
exports.get_chapter_data = function () {
	return new Promise( function ( resolve, reject ) {
		fs.readFile('./mock/reader/chapter.json', 'utf-8', function (err,data) {
			if( err ) return reject(err);

			resolve(data);
		})
	});
};

//获取文章内容数据
exports.get_chapter_content_data = function (id) {
	return new Promise( function ( resolve, reject ) {
		fs.readFile('./mock/reader/data/data' + id + '.json', 'utf-8', function (err, data) {
			if(err) return reject(err);

			resolve(data);
		})
	});
};

//获取搜索数据
exports.get_search_data = function (start, end, keyword) {
	return new Promise (function (resolve, reject) {
		let http = require('http');
		let qs = require('querystring');
		let data = {
			s: keyword,
			start: start,
			source: '2,5',
			count: 10
		};
		let content = qs.stringify( data );
		
		http.get('http://dushu.xiaomi.com/store/v0/lib/query/onebox?' + content, function (res) {
			var chunks = '';

			res.setEncoding('utf-8');

			res.on('data', function (chunk) {
				chunks +=chunk;
			});

			res.on('end', function () {
				resolve(JSON.parse(chunks));
			});

		}).on('error', function (e) {
			console.log("Got error:" + e.message);
		});

	});
}