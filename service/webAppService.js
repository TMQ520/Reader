var fs = require('fs');
// var SQLite3 = require('sqlite3');
// var Promise = require('promise');
var path = require('path');


/*//获取首页数据
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
*/
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



// 连接数据库
// var db = new SQLite3.Database(path.resolve(__dirname, "../dataCache/reader.db"), function () {
// 	console.log('连接数据库成功...');
// });


// 向数据库中插入数据
function insert(obj) {
	var sql = `insert into user_table (username,password,phone) values(?,?,?)`;
	var params = [
		obj.username,
		obj.password,
		obj.phone
	];

	return runSql(sql,params);
}

// 向数据库增加数据
function update(obj) {
	var sql = `update user_table set username=?,password=?,phone=? where id=?`;
	var params = [
		obj.username,
		obj.password,
		obj.phone,
		obj.id
	];

	/*return new Promise(function (resovle,reject){
		db.run(sql,params, function (err){
			err ? reject(err) : resolve(123);
		})
	}) */
	return runSql(sql, params);
}

// 向数据库删除数据
function deleteRow(obj) {
	var sql = `delete from user_table where phone=?`;
	return runSql(sql,[obj.phone]);
}


// 向数据库查询
function getRow(obj) {
	var sql = `select * from user_table where phone=?`;

	return new Promise(function (resolve, reject){
		db.get(sql, [obj.phone], function (err, data){
			if(err) {
				reject(err)
			} else {
				resolve(data);
			}
		})
	})
}


// 查所哟出数据需要做分页
function getAll() {
	var sql = `select * from user_table`;

	return new Promise(function (resolve, reject) {
		db.all(sql, function (err, data){
			if(err) {
				reject(err);
			} else {
				resovle(data);
			}
		})
	})
}

//封装运行sql语句的方法
function runSql (sql,parmas) {
	return new Promise(function (resolve,reject) {

		//三个参数  sql语句, 参数数组, 回调函数
		db.run(sql, parmas, function  (err) {
			if(err) {
				reject(err);	//失败 返回一个被拒绝的Promise对象
			} else {
				resolve(); 	//返回一个解析后成功的Promise对象
			}
		});
	});
}

module.exports = {
	getAll: getAll,
	getRow: getRow,
	deleteRow: deleteRow,
	update: update,
	insert: insert
};