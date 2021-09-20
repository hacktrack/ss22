/***
	SIZE AWARE Small Mode View
	14.3.2013

	@aParams:
		rows (int)		- row height multiplicator
		size (int)		- switch trashold
		sort (str)		- column name
		sorttype (str)	- asc | desc
***/
_me = obj_datagrid_small.prototype;
function obj_datagrid_small(){};

_me.__constructor = function(){
	this.__small = false;
	this.__oldSmall = false;
	this.__smallOptions = null;
};

_me._small = function (aParams){
	if (!aParams){
		//Remove resize handler
		if (this.__smallOptions != null){
			this._disobeyEvent('onsize',[this, '_onsize']);

			// var eFrame = this._main.getElementsByTagName('iframe')[0];
			// 	eFrame.parentNode.removeChild(eFrame);
		}


		this.__smallOptions = null;

		this._smallfilter = '';

		if (this.sort)
			this.sort._destruct();
		if (this.filter)
			this.filter._destruct();
	}
	else{
		var me = this;

		//Add resize handler
		if (this.__smallOptions == null){

			this._obeyEvent('onsize',[this, '_onsize']);
			/*
			var eFrame = mkElement('iframe',{seamless:'seamless', frameborder:0,name:this._pathName + "#frame", marginheight:0, marginwidth:0, src:"", id: this._pathName + '#frame'});

			this._main.appendChild(eFrame);

			eFrame.contentWindow.onresize = function (e){
				if (this.__width != eFrame.offsetWidth){
					this.__width = eFrame.offsetWidth;

					if (me._onsize && me.__smallOptions!=null) {
						me._onsize(true);

						// When size of datagrid is changed from 'small' to 'all', update headers in 'all' view to reflect current sort column and order
						if (!me.__small){
							me.__refreshHeaders();
						}
					}
				}
			};
			*/

		}

		if (aParams.filters) {
			this.filter || this._create('filter', 'obj_hmenu', 'filter', 'filter');
			this._getAnchor('small_header').classList.remove('no-filter');
		} else {
			this.filter && this.filter._destruct();
			this._getAnchor('small_header').classList.add('no-filter');
		}

		if (aParams.sorting && !this.sort){
			this._create('label', 'obj_label', 'sort', 'label');
			this.label._value(getLang('SORT::SORT_BY') + ':');

			this._create('sort', 'obj_hmenu', 'sort', 'sort');
			this.sort._onclick = function(a, b, c, arg) {
				switch (arg) {
					case 'asc':
					case 'desc':
						this.__dir = arg;
						break;
					default: 
						this.__sort = arg;
				}
				me._serverSort && me._serverSort('', this.__sort, this.__dir);
			};
		}

		this.__smallOptions = aParams;
		this.__smallOptions.size = this.__smallOptions.size || 500;
	}

	this._onsize();
};

_me.__fillSort = function() {
	if (!this._aCols || !this.sort){
		return;
	}
	var sortLabel;

	this.sort.__sort = this.__sortColumn;
	this.sort.__dir = this.__sortType ? 'desc' : 'asc';

	var sorts = [];
	for (var i in this._aCols) {
		if (this._aCols[i].arg && this._aCols[i].arg.sort && this._aCols[i]['display'] && this._aCols[i].title) {
			var title = this._aCols[i].title === 'DATAGRID_ITEMS_VIEW::ITMCLASSIFYAS' ? 'DATAGRID_ITEMS_VIEW::NAME' : this._aCols[i].title;
			sorts.push({
				title: title,
				arg: i,
				css: 'ico2' + (this.sort.__sort === i ? ' check' : '')
			});
			if(this.sort.__sort === i) {
				sortLabel = title;
			}
		}
	}
	var asc = 'SORT::' + this.sort.__sort + '_ASC';
	var desc = 'SORT::' + this.sort.__sort + '_DESC';
	if('{' + asc + '}' === getLang(asc) || !getLang(asc)) {
		asc = 'SORT::ASC';
	}
	if('{' + desc + '}' === getLang(desc) || !getLang(desc)) {
		desc = 'SORT::DESC';
	}
	sorts.push(
		{
			title: '-'
		},
		{
			arg: 'asc',
			title: asc,
			css: 'ico2' + (this.sort.__dir === 'asc' ? ' check' : '')
		},
		{
			arg: 'desc',
			title: desc,
			css: 'ico2' + (this.sort.__dir === 'desc' ? ' check' : '')
		}
	);

	this.sort._fill([{
		title: sortLabel,
		nodetype: 'click',
		callback: [function() {
			return sorts;
		}]
	}], 'static');
};

_me.__fillFilter = function() {
	if (!(this.__smallOptions || {}).filters || !this.filter){
		return;
	}

	this.filter._fill([{
		title: this.__smallOptions.filters.filter(function(filter) {
			return filter.search === (this._smallfilter || '');
		}, this)[0].text,
		nodetype: 'click',
		callback: [function() {
			return this.__smallOptions.filters.map(function(filter) {
				return {
					title: filter.text,
					arg: [filter.search],
					css: 'ico2' + (filter.search === (this._smallfilter || '') ? ' check' : '')
				};
			}.bind(this));
		}.bind(this)]
	}], 'static');
	this.filter._onclick = function(e, elm, id, args) {
		this._onfilterchange(args[0]);
		this.__fillFilter();
	}.bind(this);
};

_me._onfilterchange = function (sValue) {
	this._smallfilter = sValue;

	//Save to Cookie
	if (this._cookiesEnabled){
		var aFolder = this._getFolder();
		Cookie.set(['views',aFolder['aid'],aFolder['fid'],'filter'], this._smallfilter);
	}
	this._serverSort();
};

_me._onsize = function(e, arg){

	if (this.__smallOptions == null)
		return;

	var bRefresh = !!e;

	if (bRefresh && !this.__small)
		this.__refreshHeaders();

	var cb = false;
	var me = this;

	if (this.__smallOptions == null){
		if (this.__small == true){
			this.__small = false;
			cb = function() {
				me._main && removecss(me._main,'small');
			};
			this._row_height = this._original_height;
		}
		else
			return;
	}
	else{
		var width = this._main.offsetWidth;

		if (width<=this.__smallOptions.size && !this.__small)
			this.__small = true;
		else
		if (width>this.__smallOptions.size && this.__small)
			this.__small = false;
		else
			bRefresh = false;

		if (this.__small){
			cb = function() {
				me._main && addcss(me._main,'small');
			};
			this._row_height = 25*(this.__smallOptions.rows || 1);
		}
		else{
			cb = function() {
				me._main && removecss(me._main,'small');
			};
			this._row_height = this._original_height;
		}
	}

	if (bRefresh){
		this.__oldSmall = this.__small;
		//clear limit
		this.__limit = [0,0];
		//refreah
		if (this._serverSort)
			this._serverSort(void 0, void 0, void 0, cb ? [cb] : void 0);
		else {
			this._fill();
			cb && cb();
		}
	} else if(this.__oldSmall !== this.__small) {
		this.__oldSmall = this.__small;
		cb && cb();
	}
};
