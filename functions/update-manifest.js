module.extports = function(file){
	if(!('revOrigPath' in file)){
		return;
	}
	if(!fs.existsSync('./public/rev-manifest.json')){
		fs.writeFileSync('./public/rev-manifest.json', '[]');
	}

	var revmanifest = JSON.parse(fs.readFileSync('./public/rev-manifest.json', 'utf8').replace(/,(?=\n})/g, ''));
	if(typeof revmanifest !== 'object') revmanifest = {};
	revmanifest[path.basename(file.revOrigPath)] = path.basename(file.path);
	manifest = revmanifest;
	fs.writeFileSync('./public/rev-manifest.json', JSON.stringify(revmanifest, null, '	'));
}