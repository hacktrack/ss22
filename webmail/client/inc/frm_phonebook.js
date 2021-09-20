_me = frm_phonebook.prototype;
function frm_phonebook(){};

_me.__constructor = function(aResponse) {
	var me = this;

	this._size(450,550,true);
	this._modal(true);
	this._dockable(false);

	this._title('DIAL::PBOOK');

    this._draw('frm_phonebook', 'main');


	this._activeFolder = '__@@ADDRESSBOOK@@__';

	// Create 'OK' button
	this.x_btn_ok._onclick = function() {
		executeCallbackFunction(aResponse,me._value());
		me._destruct();
	};

	// WebPhone contacts checkbox
	this.filter._value(Cookie.get(['sip','filter']) != 'off'?true:false);
	this.filter._onchange = function(){
		this._parent.search._onsearch();
		Cookie.set(['sip','filter'],this._checked()?'on':'off');
	};

	// DATAGRID
	if (this.filter._checked())
		this.grid._SQLsearch = 'has:sip';
	else
		this.grid._SQLsearch = '';

	this.grid._cookiesEnabled = false;
	this.grid._listen_data('contacts_'+me._pathName,'',true);
	this.grid._default_columns = function(){
		return {'LABEL':{"title": 'DATAGRID_ITEMS_VIEW::ITMCLASSIFYAS',"width":150,'arg':{'sort':'desc'}},
				'COMPANY':{"title": 'DATAGRID_ITEMS_VIEW::ITMCOMPANY',"width":100},
				'DEPARTMENT':{"title": 'DATAGRID_ITEMS_VIEW::ITMDEPARTMENT',"width":150}};
	};
	this.grid._default_values = function(){
		return ['ITMTITLE','ITMCLASS','ITMCLASSIFYAS','ITMFIRSTNAME','ITMMIDDLENAME','ITMSURNAME','ITMSUFFIX','LCTEMAIL1','LCTEMAIL2','LCTEMAIL3',
				'LCTPHNHOME1','LCTPHNHOME2','LCTPHNASSISTANT','LCTPHNWORK1','LCTPHNWORK2','LCTPHNFAXHOME','LCTPHNFAXWORK',
				'LCTPHNCALLBACK','LCTPHNCOMPANY','LCTPHNCAR','LCTPHNISDN','LCTPHNMOBILE','LCTPHNOTHER','LCTPHNOTHERFAX','LCTPHNPAGER',
				'LCTPHNPRIMARY','LCTPHNRADIO','LCTPHNTELEX','LCTPHNHEARING',
				'ITMCOMPANY','ITMDEPARTMENT'
				];
	};
	this.grid._serverOrder = function(sColumn,iSortType){
		var sSort = iSortType?'desc':'asc';
		return 'ITMCLASSIFYAS '+sSort+', ITMTITLE '+sSort+', ITMFIRSTNAME '+sSort+', ITMMIDDLENAME '+sSort+', ITMSURNAME '+sSort+', ITMSUFFIX '+sSort+', ITMCOMPANY '+sSort+', ITMDEPARTMENT ' + sSort;
	};
	
	this.grid._onchange = function (v){
		if (v && v[0]){
			var arg = this._aData[v[0]].arg;
			if (arg){

				var a = {};
				for (var i in arg)
					if (i.indexOf('LCTPHN') == 0 && arg[i] && !a[arg[i]])
						if (i == 'LCTPHNOTHER' && arg[i].toLowerCase().indexOf('sip:')==0){
							var tel = arg.LCTPHNOTHER.substring(arg.LCTPHNOTHER.indexOf(':')+1);
							a[tel] = '['+ getLang('PHONE::SIP') +'] '+ tel;
						}
						else
							a[arg[i]] = '['+getLang('PHONE::'+i)+'] ' + arg[i];

				if (arg.LCTEMAIL1) a[arg.LCTEMAIL1] = arg.LCTEMAIL1;
				if (arg.LCTEMAIL2) a[arg.LCTEMAIL2] = arg.LCTEMAIL2;
				if (arg.LCTEMAIL3) a[arg.LCTEMAIL3] = arg.LCTEMAIL3;

				me._value(a);
			}
		}
	};

	this.grid._onclick = function (e,x,arg){
        if (e.type == 'keydown' && e.keyCode == 13)
        	me.select._focus();
	};

    this.grid._ondblclick = null;

	this.grid._onkeypress = function (e){
		var s = String.fromCharCode(e.charCode);
		if (s && (s = s.trim()) && !/[\x00-\x1F]/.test(s)){
			this._parent.search._focus(true);
			this._parent.search._value(s);
		}
	};

	this.grid._prepareBody = function (aItems, sFolType){

		var aResult = {}, sName, sFullName, aRow,
			aFullNameParts = ['ITMTITLE','ITMFIRSTNAME','ITMMIDDLENAME','ITMSURNAME','ITMSUFFIX'];

		if (this._parent._SQLsearch)
			var rxp  = new RegExp('('+this._parent._SQLsearch+')', "gi");

		for(var sItId in aItems)
		{
			if (!aItems[sItId]['ITMCLASSIFYAS']){
				sFullName = '';
				for (var n in aFullNameParts)
					if (aItems[sItId][aFullNameParts[n]])
						sFullName += aItems[sItId][aFullNameParts[n]] + ' ';

				sFullName.trim();
			}
			else
				sFullName = aItems[sItId]['ITMCLASSIFYAS'];

			//highlight Name
			if (this._parent._SQLsearch)
				sName = sFullName.replace(rxp,"<b>$1</b>");
			else
				sName = sFullName;

			aRow = {'LABEL':[sName,sFullName],'COMPANY':[aItems[sItId]['ITMCOMPANY']],'DEPARTMENT':[aItems[sItId]['ITMDEPARTMENT']]};
			aResult[sItId+'#1'] = {"id":sItId,"data":aRow,"arg":aItems[sItId]};
		}

		return aResult;
	};

	// SEARCH
	this.search._onsearch = function(){
		var f = this._parent.filter._checked()?'has:sip':'has:phone',
			v = this._value();

		this._parent._SQLsearch = v;

		if (v)
			f += (f?' AND ':'') + '(classify:'+v+' OR company:'+v+' OR department:'+v+' OR name:'+v+' OR email:'+v+')';

		if (this._parent.grid._SQLsearch === f) return;
		
		window[v?'addcss':'removecss'](this._main,'active');

		this._parent.grid._SQLsearch = f;
		this._parent.grid._serverSort('','','',[me,'__selectFirst']);
	};
	this.search._onkeydown = function(e){
		if (e.keyCode == 13)
			this._onsearch();

		if ((e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13) && this._parent.grid._value().length && this._parent.grid._aData[this._parent.grid._value()[0]])
			this._parent.grid._focus();
	};
	this.search._placeholder(getLang('FORM_BUTTONS::SEARCH')+'...');

	this.grid._serverSort({aid:sPrimaryAccount,fid:me._activeFolder},'LABEL','',[me,'__selectFirst']);


	this.search._focus(true);
};

_me.__selectFirst = function(){
	if (!this.grid._selectFirst()){
		this.search._focus();
		return false;
	}
	// else{
	// 	var v = this.grid._value();
	// 	if (v && v.length)
	// 		this._value(v[0]);
	// }	
	return true;
};

_me._value = function(v){
	if (Is.Defined(v)){
		this.select._fill(v);
		for (var i in v){
			this.select._value(i);
			break;
		}
	}	
	else
		return this.select._value() || '';
};
