
/* return an object representing the pairs name/value of form elements in element

example:

<div id="test">
    <input name="firstName" value="damien">
    <input name="lastName" value="maillard">
</div>

collectElementValues(document.getElementById('test'));
-> {firstName: 'damien', lastName: 'maillard'};

*/
function collectElementValues(element){
    var values = {};

    function iterate(element, fn, bind){
        fn.call(bind, element);

        var i = 0, j = element.childNodes.length;
        for(;i<j;i++){
            iterate(element.childNodes[i], fn, bind);
        }
    }

    iterate(element, function(el){
        if( el.nodeType == 3 ) return;

        var tagName = el.tagName.toLowerCase(), type = el.type, value;

        if( !tagName.match(/input|select|textarea/i) ) return;
        if( !el.name || el.disabled ) return;
        if( type == 'submit' || type == 'reset' || type == 'file' || type == 'image' ) return;

        if( tagName == 'select' ){
            value = el.options[el.selectedIndex].value;
        }
        else if( (type == 'radio' || type == 'checkbox') && !el.checked ){
            value = null;
        }
        else{
            value = el.value;
        }

        values[el.name] = value;
    });

    return values;
}

// Before form submission, fill headers and params hidden inputs with
// a JSON representation of the headers/params
function submitService(e){

    var form = e.target;
    var paramInput = document.getElementById('endpoint_parameters');
    var paramDiv = document.getElementById('params');
    var params = [];

    var line = paramDiv.querySelector('tr');

    while( line.nextElementSibling ){
        line = line.nextElementSibling;
        params.push(collectElementValues(line));
    }

    paramInput.value = JSON.stringify(params);

    var headerInput = document.getElementById('endpoint_headers');
    var headerDiv = document.getElementById('headers');
    var headers = [];

    var line = headerDiv.querySelector('tr');

    while( line.nextElementSibling ){
        line = line.nextElementSibling;
        headers.push(collectElementValues(line));
    }

    headerInput.value = JSON.stringify(headers);
    
    document.getElementById('endpoint_post_body').value = $("#post-body-content").val();
}

function input(e){
    updateParams(e.target.value);
}

function getParamIndex(name){
    var i = 0, j = params.length;
    for(;i<j;i++){
        if( params[i].name == name ) return i;
    }
    return -1;
}

function updateParam(name, values){
    var index = getParamIndex(name);
    if( index === -1 ){
        params.push(values);
    }
    else{
        params[index] = values;
    }
}

function createParameterElement(param){
    line = document.createElement('tr');

    var html = '\
    <td>\
        <input name="name" type="text" class="form-control" value="'+(param.name || '')+'" '+(param.extra ? '' : 'readonly')+'/>\
    </td>\
    <td>\
        <input name="value" type="text" class="form-control" value="'+(param.value || '')+'" />\
    </td>\
    <td>\
        <input name="desc" type="text" class="form-control" value="'+(param.desc || '')+'" />\
    </td>\
    <td>\
        <select name="type" class="form-control">';

    ['String', 'Number'].forEach(function(option){
        html+= '<option '+(option == param.type ? 'selected="selected"' : '')+'>'+option+'</option>';
    });

    html+= '</select></td>';
    html+= '<td><button onclick="removeParameter(event)" type="button" class="btn" '+(param.extra ? '' : 'disabled')+'><span class="glyphicon glyphicon-minus"></span> Remove</button></td>';

    if( param.extra ){
        html+= '<input type="hidden" name="extra" value="true"/>';
    }

    line.innerHTML = html;

    return line;
}

Object.append = function(object, add){
    for(var key in add ){
        object[key] = add[key];
    }
    return object
};

function updateParams(url){
    url = parseURL(url);

    var names = [], name, param;
    var value, i, j, index;
    var paramDiv = document.getElementById('params');
    var table = paramDiv.querySelector('table');
    var line = table.querySelector('tr');
    var parent = line.parentNode;

    // get the name list of parameters in URL
    i = 0;
    j = url.segments.length;
    for(;i<j;i++){
        name = url.segments[i];
        if( name[0] == '{' && name[name.length - 1] == '}' ){
            name = name.slice(1, -1);
            names.push(name);
        }
    }
    for( name in url.params ){
        value = url.params[name];
        if( value === '{' + name + '}' ){
            names.push(name);
        }
    }

    // update params[index] values with the input values, and remove the DOM parameters
    index = 0;
    while( line.nextSibling ){
        Object.append(params[index], collectElementValues(line.nextSibling));
        parent.removeChild(line.nextSibling);
        index++;
    }

    // remove parameter gone from the URL
    i = 0;
    j = params.length;
    for(;i<j;i++){
        param = params[i];
        // a parameter is removed when its name is not un the URL and he is not an extra param
        if( !param.extra && names.indexOf(param.name) === - 1 ){
            params.splice(i, 1);
            j--;
        }
    }

    // add parameter added in the URL
    i = 0;
    j = names.length;
    for(;i<j;i++){
        name = names[i];
        index = getParamIndex(name);
        if( index === -1 ){
            params.push({
                name: name
            });
        }
    }

    // keey parameter in the URL above parameter added
    params = params.sort(function(a, b){
        if( a.extra && !b.extra ) return 1;
        else if( b.extra ) return -1;
        return 0;
    });

    // redraw DOM parameters
    i = 0;
    j = params.length;
    for(;i<j;i++){
        parent.appendChild(createParameterElement(params[i]));
    }
}

// http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
function parseURL(url) {
    var a =  document.createElement('a');
    a.href = url;

    var pathname = decodeURIComponent(a.pathname);

    return {
        source: url,
        protocol: a.protocol,//a.protocol.replace(':',''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function(){
            var ret = {},
                seg = a.search.replace(/^\?/,'').split('&'),
                len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
        hash: a.hash.replace('#',''),
        path: pathname.replace(/^([^\/])/,'/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
        segments: pathname.replace(/^\//,'').split('/')
    };
}

function addParameter(){
    var paramDiv = document.getElementById('params');
    var table = paramDiv.querySelector('table');
    var line = table.querySelector('tr');

    var param = {extra: true};

    params.push(param);

    line.parentNode.appendChild(createParameterElement(param));
}

function removeParameter(e){
    var input = e.target;
    var line = input;

    while( line.tagName.toLowerCase() != 'tr' && line.parentNode ){
        line = line.parentNode;
    }

    if( !line ) return;

    var index = Array.prototype.indexOf.call(line.parentNode.children, line) - 1;

    params.splice(index, 1);
    line.parentNode.removeChild(line);
}

function createHeaderElement(header){
    line = document.createElement('tr');

    var html = '\
    <td>\
        <input name="name" type="text" class="form-control" value="'+(header.name || '')+'" />\
    </td>\
    <td>\
        <input name="value" type="text" class="form-control" value="'+(header.value || '')+'" />\
    </td>\
    <td>\
        <input name="desc" type="text" class="form-control" value="'+(header.desc || '')+'" />\
    </td>\
    <td>\
        <button onclick="removeHeader(event)" type="button" class="btn"><span class="glyphicon glyphicon-minus"></span> Remove</button>\
    </td>\
    ';

    line.innerHTML = html;

    return line;
}

function addHeader(){
    var headerDiv = document.getElementById('headers');
    var table = headerDiv.querySelector('table');
    var line = table.querySelector('tr');

    var param = {extra: true};

    headers.push(param);

    line.parentNode.appendChild(createHeaderElement(param));
}

function removeHeader(e){
    var input = e.target;
    var line = input;

    while( line.tagName.toLowerCase() != 'tr' && line.parentNode ){
        line = line.parentNode;
    }

    if( !line ) return;

    var index = Array.prototype.indexOf.call(line.parentNode.children, line) - 1;

    headers.splice(index, 1);
    line.parentNode.removeChild(line);
}



