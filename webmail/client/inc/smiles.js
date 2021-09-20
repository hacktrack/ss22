Smiles = {
	loaded: false,
	flat_smiles_list: false,
	smiles_regex: '',
	smiles_list: {},
	escape_regex: /([\(\)\[\]\{\}\|\\\/\+\*])/g,
	loadSmiles: function (callback, context) {
		var req = new XMLHttpRequest();
		req.addEventListener("load", function (e) {
			this.smiles_list = JSON.parse(e.target.responseText);
			this.loaded = true;
			callback && callback.call(context || this, this.smiles_list);
		}.bind(this));
		req.open("GET", 'client/skins/' + GWOthers.getItem('LAYOUT_SETTINGS', 'skin') + '/images/smiles/list.json');
		req.send();
	},
	getSmiles: function (callback, context) {
		if (this.loaded) {
			callback.call(context || this, this.smiles_list);
		} else {
			this.loadSmiles(callback, context);
		}
	},
	getFlatSmilesList: function () {
		if (this.flat_smiles_list !== false) {
			return this.flat_smiles_list;
		}
		this.flat_smiles_list = {};
		for (var type in this.smiles_list) {
			for (var name in this.smiles_list[type]) {
				this.smiles_list[type][name].forEach(function (item) {
					this.flat_smiles_list[item.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(this.escape_regex, '\\$1')] = {name:name,type:type};
				}, this);
			}
		}
		this.smiles_regex = new RegExp('(^|\\B|\\s)('+Object.keys(this.flat_smiles_list).join('|')+')(&|\\B|\\b|\\s)', 'g');
		return this.flat_smiles_list;
	},
	replaceSmiles: function (text) {
		var list = this.getFlatSmilesList();
		if (Object.keys(list)) {
			text = text.replace(this.smiles_regex, function (whole, before, match, after) {
				var eImg = mkElement('span',{className: 'smile'});
				eImg.classList.add('smiley-'+ list[match.replace(this.escape_regex, '\\$1')].name);
				eImg.classList.add('sprite-'+ list[match.replace(this.escape_regex, '\\$1')].type);
				return before + eImg.outerHTML + after;
			}.bind(this));
		}
		return text;
	},
	replaceSmilesArray: function(str, sReplace){
		var sReplace = sReplace || '~▒~';
			sPathlist = this.getFlatSmilesList(),
			arr = [],
			eImg = mkElement('span',{className: 'smile'});

		str = str.replace(this.smiles_regex, function (whole, before, match, after) {
			eImg.classList.add('smiley-'+ sPathlist[match.replace(this.escape_regex, '\\$1')].name);
			eImg.classList.add('sprite-'+ sPathlist[match.replace(this.escape_regex, '\\$1')].type);
			arr.push(before + eImg.outerHTML + after);
			return sReplace;
		}.bind(this));

		return {string:str, replace:sReplace, smiles:arr};
	}
};
Smiles.loadSmiles();
