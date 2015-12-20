var fs = require('fs');
var path = require('path');

module.exports = function(dir, regex){
	var files = fs.readdirSync(path.join('source', dir))

	var data = {};

	files.forEach(function(file, i){
		var contents = fs.readFileSync(path.join('source', dir, file)).toString();

		if(!contents.match(regex)){
			return;
		}

		var matches = [path.join('source', dir, file)];

		while(result = regex.exec(contents)){
			// console.log(result);
			matches.push(path.join('source', dir, result[1]));
		}

		data[file] = {
			files: matches,
			dir: dir
		}

	});
	return data;
}
