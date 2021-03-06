var fileService = require('./fileService');
var highlightService = require('./blockHighlightService');
var fs = require('fs');
var path = require('path');

var setPartials = function(partialsDirs)
{
	filenames = [];
	
	partialsDirs.forEach(function(partialsDir) {
		fileService.getFilesInDir(partialsDir, function(dir, filename) { 
			if(path.extname(filename) == ".hbs") 
				filenames.push(dir + filename); 
		});
	});
	
	filenames.forEach(function(filename) {

		var templateName = path.basename(filename, '.hbs');
		var template = fs.readFileSync(filename, 'utf8');
		template = highlightService.addYuzuMarker(template);

		handlebars.registerPartial(templateName, template);
	});	
}

var setHelpers = function(helpers)
{
	if(!helpers)
		throw "Hbs Helpers not found, check they have been sent to gulp build";
	Object.keys(helpers).forEach(function(key) {
		handlebars.registerHelper(key, helpers[key])
	});
}

module.exports.registerPartials = setPartials;
module.exports.registerHelpers = setHelpers;