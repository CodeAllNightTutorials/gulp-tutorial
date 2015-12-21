var fs = require('fs');
var path = require('path');

module.exports = function(file){
	if(!('revOrigPath' in file)){
		return;
	}
	if(!fs.existsSync('./rev-manifest.json')){
		fs.writeFileSync('./rev-manifest.json', '{}');
	}

	var revmanifest = JSON.parse(fs.readFileSync('./rev-manifest.json', 'utf8').replace(/,(?=\n})/g, ''));
	if(typeof revmanifest !== 'object') revmanifest = {};
	revmanifest[path.basename(file.revOrigPath)] = path.basename(file.path);
	manifest = revmanifest;
	fs.writeFileSync('./rev-manifest.json', JSON.stringify(revmanifest, null, '	'));
}