const property = 'yuzu-path';

var addYuzuMarker = function(template) {

	return template.replace(/<\w*\s/, '$&{{#if '+ property +'}}data-yuzu="{{'+ property +'}}"{{/if}} ');
}

module.exports.property = property;
module.exports.addYuzuMarker = addYuzuMarker;