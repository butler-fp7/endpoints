// an URL parser using DOM
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

// remove trailing witespace from a string
function trim(str){
	return str.replace(/^\s+/g,'').replace(/\s+$/g,'');
}

var API = {
	// return the service model corresponding to element
	getServiceFromElement: function(element){
		while(element){
			if( element.hasAttribute && element.hasAttribute('data-service') ){
				return model.services[element.getAttribute('data-service')];
			}
			element = element.parentNode;
		}

		return null;
	},

	// intercept form submission and send an ajax request to create an HTTP request
	submit: function(e){
		e.preventDefault();

		var form = e.target;
		var service = this.getServiceFromElement(form);

		if( !service ) return;

		var submitButton = form.querySelector('*[type="submit"]');
		var url = service.url;
		var method = service.method;
		var paramTable = form.querySelector('.operation-params');
		var line;
		var params = service.params;
		var i = 0, j = params.length;
		var input;
		var urlParams = {};
		var bodyParams = {};
		var headerTable = form.querySelector('.operation-headers');
		var headers = {};

		if( paramTable ){
			line = paramTable.querySelector('tr');

			for(;i<j;i++){
				param = params[i];
				line = line.nextElementSibling;
				if( line == null ) break;
				input = line.querySelector('input');

				if( param.extra ){
					bodyParams[param.name] = input.value;
				}
				else{
					urlParams[param.name] = input.value;
				}
			}
		}

		if( headerTable ){
			line = headerTable.querySelector('tr');

			while( line.nextElementSibling ){
				line = line.nextElementSibling;
				input = line.querySelector('input');
				headers[trim(line.querySelector('td').textContent)] = input.value;
			}
		}

		var url = parseURL(service.url.replace(/&amp;/g, '&'));
		var result = '', segment;
		var paramName;

		result+= url.protocol;
		result+= '//';
		result+= url.host;
		result+= ":" + url.port;
		if( url.path ){
			result+= url.path.parse(urlParams);
		}
		if( url.query ){
			result+= url.query.parse(urlParams);
		}

		/*
		we have to use an iframe to display the response
		because when response is HTML it can conflict with current CSS/HTML/JavaScript
		*/

		var iframe = form.parentNode.querySelector('iframe');
		var container = iframe.parentNode;
		var responseElement = iframe.contentDocument.body;

		function setIframeHTML(html){
			responseElement.innerHTML = html || '';
			iframe.style.height = iframe.contentDocument.documentElement.offsetHeight + 'px';
		}

		function showResponse(response){
			setIframeHTML(response);
			container.classList.remove('loading');
			submitButton.removeAttribute('disabled');
		}

		setIframeHTML();
		submitButton.setAttribute('disabled', 'disabled');
		container.classList.add('loading');
		$.post('/proxy', Object.toQueryString({
			url: result,
			method: service.method.toUpperCase(),
			params: bodyParams,
			headers: headers,
			postBody: $("#post-body-content").val()
		}), function(response, status, xhr){
			showResponse(status === 'success' ? response : 'server respond with error');
		});
	}
};

// returns a queryString representing object
Object.toQueryString = function(object, base){
	var queryParts = [];

	for(var key in object){
		var value = object[key];
		var result;

		if( base ) key = base + '[' + key + ']';

		if( typeof value == 'object' ){
			result = Object.toQueryString(value, key);
		}
		else{
			result = key + '=' + encodeURIComponent(value);
		}

		if( value != null ) queryParts.push(result);
	}

	return queryParts.join('&');
};


RegExp.BRACLET = /\\?\{([\w.]+)\}/g;
// replace all braclet in a string by the corresponding data properties
String.prototype.parse = function(data){
	return this.replace(RegExp.BRACLET, function(match, path){
		if( match.charAt(0) == '\\' ) return match.slice(1);
		var value = data[path];
		return value != null ? value : '';
	});
};

// returns an HTMLElement from a string
String.prototype.toElement = function(){
	var div = document.createElement('div');
	div.innerHTML = trim(this);
	return div.firstChild;
};

// helpers to create view from model
var HTMLView = {
	serviceId: function(service){
		return 'service-' + model.services.indexOf(service);
	},

	drawParams: function(params){
		var i = 0, j = params.length, param, html = '';

		for(;i<j;i++){
			param = params[i];
			html+= Templates.param.parse({
				name: param.name,
				description: param.desc,
				type: param.type,
				value: param.value
			});
		}

		return Templates.params.parse({
			params: html
		});
	},

	drawHeaders: function(headers){
		var i = 0, j = headers.length, header, html = '';

		for(;i<j;i++){
			header = headers[i];
			html+= Templates.header.parse({
				name: header.name,
				description: header.desc,
				value: header.value
			});
		}

		return Templates.headers.parse({
			headers: html
		});
	},

	draw: function(){
		var services = model.services, i = 0, j = services.length;
		var html = '', head, body, params, headers;

		for(;i<j;i++){
			service = services[i];
			href = 'collapse--' + i;

			// TODO: use css_method_class(endpoint) to set service.method
			head = Templates.head.parse({
				method: Templates.method.parse({
					method: service.method,
					methodClass: service.method == 'GET' ? 'info' : 'success',
					href: href,
				}),

				url: Templates.url.parse({
					url: service.url,
					href: href
				}),

				name: Templates.name.parse({
					name: service.name,
					href: href
				}),

				description: Templates.name.parse({
					description: service.description,
				})
			});

			if( service.params && service.params.length ){
				params = this.drawParams(service.params);
			}
			else{
				params = '';
			}

			if( service.headers && service.headers.length ){
				headers = this.drawHeaders(service.headers);
			}
			else{
				headers = '';
			}

			var editbutton = service.editable ? '<a href="/account/libraries/<%=@library.id%>/services/' + service.id  + '/edit" class="btn"><i class="icon-edit"></i> Edit</a>' : '';
			var deletebutton = service.deletable ? '<a href="/account/libraries/<%=@library.id%>/services/' + service.id+'" class="btn" data-method="delete"><i class="icon-trash"></i> Delete</a>' : '';

			body = Templates.body.parse({
				id: href,
				dataService: i,
				params: params,
				headers: headers,
				editbutton: editbutton,
				deletebutton: deletebutton
			});

			html+= Templates.service.parse({
				head: head,
				body: body
			});
		}

		return Templates.api.parse({
			services: html
		});
	}
};

