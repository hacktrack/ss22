(function (scope) {
	/**
	 * @class Json
	 */
	var Json = {};

	/**
	 * Converts JSON object to XML string
	 * @param {object} json
	 * @returns {string} XML string
	 */
	Json.toXmlString = function (json) {
		if (Array.isArray(json)) {
			return json.map(function (item) {
				return this.toXmlString(item);
			}, this).join('');
		} else if (typeof json === 'object') {
			return Object.keys(json).map(function (key) {
				return '<' + key + '>' + this.toXmlString(json[key]) + '</' + key + '>';
			}, this).join('');
		}
		return json;
	};

	/**
	 * Converts JSON object to XML object
	 * @param {object} json
	 * @returns {object} xml
	 */
	Json.toXml = function (json) {
		return this.XmlStringToXml(this.toXmlString(json));
	};

	/**
	 * Parses XML string to XML
	 * @param {string} xml xml string
	 * @returns {object} XML
	 */
	Json.XmlStringToXml = function (xml) {
		return (new DOMParser()).parseFromString(xml, "text/xml");
	};

	/**
	 * Converts XML to JSON
	 * @param {object} xml
	 * @returns {object} converted json
	 */
	Json.fromXml = function (xml) {
		var obj = {};

		if (xml.nodeType === 3 || (!(xml.attributes || []).length && !xml.hasChildNodes())) {
			return xml.nodeValue;
		}

		if ((xml.attributes || []).length > 0) {
			obj._attributes = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj._attributes[attribute.nodeName] = attribute.nodeValue;
			}
		}

		for (var i = 0; i < (xml.childNodes || []).length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (nodeName === '#text') {
				if (typeof obj === 'string') {
					obj += this.fromXml(item);
				} else {
					obj = this.fromXml(item);
				}
			} else if (obj[nodeName] === void 0) {
				obj[nodeName] = this.fromXml(item);
			} else {
				if (obj[nodeName].push === void 0) {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(this.fromXml(item));
			}
		}
		return obj;
	};

	/**
	 * Converts XML string to JSON
	 * @param {type} xml
	 * @returns {unresolved}
	 */
	Json.fromXmlString = function (xml) {
		return this.fromXml(this.XmlStringToXml(xml));
	};

	/**
	 * @module Json
	 */
	scope.JsonXML = Json;
})(window);
