var fs = require('fs');

exports.get_index_data = function () {
	var content = fs.readFileSync('./mock/home.json', 'utf-8');
	return content;
}