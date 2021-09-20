(function () {
	var url = '//api.giphy.com/';
	var API_KEY = 'dc6zaTOxFJmzC';
	function xhr(url, data, callback, options) {
		var request = new XMLHttpRequest();
		request.open("GET", url + '?' + Object.keys(data).map(function (key) {
			return key + '=' + data[key];
		}).join('&'));
		if (callback) {
			request.onload = function () {
				callback.success && callback.success.call(callback.context, this.response);
			};
			callback.abort && (request.onabort = callback.abort.bind(callback.context));
			callback.error && (request.onerror = callback.error.bind(callback.context));
			callback.progress && (request.onprogress = callback.progress.bind(callback.context));
		}
		for (var key in options) {
			request[key] = options[key];
		}
		request.send(data);
	}
	function giphyCommand(command, data, callback) {
		data.api_key = API_KEY;
		xhr(url + command, data, {
			success: function (response) {
				response = JSON.parse(response);
				if (response.meta.status === 200) {
					callback.success && callback.success.call(callback.context, response);
				} else {
					callback.error && callback.error.call(callback.context, response);
				}
			},
			context: this
		});
	}

	var Giphy = {};
	Giphy.ratings = ['Y', 'G', 'PG', 'PG-13', 'R'];
	Giphy.enable_keyboard = false;
	Giphy.sendToTC = function (url, name, ctx) {
		xhr(url, {}, {
			success: function (response) {
				ctx.upload.file.__ondropfile([new File([response], name.trim() + '.gif')]);
			}
		}, {
			responseType: "blob"
		});
	};
	Giphy.trending = function (rating, callback, context) {
		giphyCommand('/v1/gifs/trending', {rating: rating}, {
			success: function (response) {
				if (response.meta.status === 200) {
					callback.call(context, null, response.data);
				} else {
					callback.call(context, true, []);
				}
			},
			context: this
		});
	};
	Giphy.search = function (query, lang, rating, callback, context) {
		giphyCommand('/v1/gifs/search', {rating: rating, q: query, lang: lang}, {
			success: function (response) {
				if (response.meta.status === 200) {
					callback.call(context, null, response.data);
				} else {
					callback.call(context, true, []);
				}
			},
			context: this
		});
	};
	Giphy.translate = function (query, rating) {
		giphyCommand('v1/gifs/translate', {s: query, rating: rating || 'pg-13'}, {
			success: function (response) {
				if (response && response.data && response.data.images && response.data.images.downsized) {
					xhr(response.data.images.downsized.url, {}, {
						success: function (response) {
							gui.frm_main.main.upload.file.__ondropfile([new File([response], query.trim() + '.gif')]);
						}
					}, {
						responseType: "blob"
					});
				}
			},
			context: this
		});
	};
	Giphy.translateFromInput = function (value) {
		this.translate(value.toLowerCase().replace('/giphy', ''), 'r');
	};

	window.Giphy = Giphy;
}());
