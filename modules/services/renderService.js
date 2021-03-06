var extend = require('extend');
var layoutHelper = require('./layoutService');
var errorSvc = require('./errorService');
var errorSource = 'Template rendering';

const render = (hbs, data, errors) => {
    var output = '';

    try {
        var template = handlebars.compile(hbs);
        output = template(data);
    } 
    catch (err) {
		errorSvc.AddError(errors, errorSource, err.message, err);
    }
    
    return output;
}

const wrapSingle = (hbs, data, contents, errors) => {
    
    var content = {contents: contents};
    var newData = extend(data, content);
    return render(hbs, newData, errors);
}

const wrapMultiple = function(hbses, datas, errors) {

    var prevTemplate;
    for(var index in hbses) {
        var hbs = hbses[index];
        var data = datas[index];

        if(prevTemplate) {
            prevTemplate = wrapSingle(hbs, data, prevTemplate, errors);
        }
        else {
            prevTemplate = render(hbs, data, errors);
        }
    }

    return prevTemplate
}

const fromTemplate = function(path, template, data, layouts, errors, blockLayout) {

    //build hbs wrapping
    var templates = [
        template
    ];
    var datas = [
        data
    ]

    //add selected layout
    var layout = layoutHelper.GetLayout(path, layouts, data);
    if(layout) {
        templates.push(layout.template);
        datas.push(layout.data);
    }

    return wrapMultiple(templates, datas, errors);

}

module.exports.fromTemplate = fromTemplate;
module.exports.wrapMultiple = wrapMultiple;
module.exports.wrapSingle = wrapSingle;
module.exports.render = render;
