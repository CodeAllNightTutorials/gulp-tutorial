var fs = require('fs');
var path = require('path');

module.exports = function(dir, regex){
	var files = fs.readdirSync(path.join('source', dir));

	files = files.filter(file => {
		return fs.lstatSync(path.join('source', dir, file)).isFile();
	});

	var data = {};

	files.forEach(function(file, i){
		var contents = fs.readFileSync(path.join('source', dir, file)).toString();

		if(!contents.match(regex)){
			return;
		}

		var matches = [path.join('source', dir, file)];

		while(result = regex.exec(contents)){
			matches.push(path.join('source', dir, result[1]));
		}

		data[file] = {
			files: matches,
			dir: dir
		}

	});
	return data;
}
