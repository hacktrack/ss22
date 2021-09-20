!function () {
	var i18n = {
		loading: false,
		polyglot: new Polyglot(),
		init: function (locale_url) {
			if (this.loading) {
				return;
			}
			this.loading = true;
			new Request({url: locale_url})
					.on('load', this.loadSuccess.bind(this))
					.on('error', this.loadError.bind(this))
					.send();
		},
		loadSuccess: function (e) {
			this.loading = false;
			this.polyglot.extend(this.parseXML(e.target.responseText));
		},
		loadError: function (e) {
			console.log(e);
		},
		parseXML: function (xml) {
			var dom = new DOMParser().parseFromString(xml, "text/xml"), language = dom.firstChild, json = {};
			return this.getChildren(language);
		},
		getChildren: function (node) {
			var children = Array.prototype.slice.call(node.childNodes), level = {};
			if (children.length === 1 && children[0].nodeType === Node.TEXT_NODE) {
				return children[0].textContent;
			}
			children.forEach(function (node) {
				node.nodeType !== Node.TEXT_NODE && (level[node.nodeName] = this.getChildren(node));
			}, this);
			return level;
		},
		t: function () {
			if (!this.polyglot.phrases[arguments[0]] && !this.stopped) {
				console.error('Missing translation for "' + arguments[0] + '" in ' + this.language);
				return arguments[0];
			}
			return this.polyglot.t.apply(this.polyglot, arguments);
		}
	};
	if (typeof module !== 'undefined') {
		module.exports = i18n;
	} else {
		window.i18n = i18n;
	}
}();