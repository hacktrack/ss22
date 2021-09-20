_me = frm_reactions.prototype;
function frm_reactions(){}

/**
 *
 */
_me.__constructor = function(aData, sInitTab) {
	//var me = this;

	this._size(450,400,true);
	this._modal(true);
	this._dockable(false);
	this._resizable(false);

	this._title('CHAT::REACTIONS');

	this.__reactions = {};
	this.__start = sInitTab;

	this._create('tabs','obj_tabs','main','ico small nobuttons transparent');

	//Reactions
	if (aData.REACTIONS)
		this._fill(aData.REACTIONS);
	else{
		this._create('loading', 'obj_loader');

		var iid = aData.iid;
		//if (aData.EVNCLASS != 'I' && aData.EVNCLASS != 'W' && aData.EVNCLASS != 'S')
		if (aData.EVNLINKTYPE == '10')
			iid = aData.EVNLINKID?WMItems.__clientID(aData.EVNLINKID):aData.iid;

		//GET
		var aItemsInfo = {aid:aData.aid, fid:aData.fid, iid:iid, values:['REACTIONS']};

		WMItems.list(aItemsInfo,'','','',[function(aResponse){
			if (aResponse && (aResponse = aResponse[aData.aid]) && (aResponse = aResponse[aData.fid]) && (aResponse = aResponse[iid])){
				aData.REACTIONS = aResponse.REACTIONS;
				this._fill(aData.REACTIONS);
			}
			//Error
			else
				this._destruct();

		}.bind(this)]);

	}

	// Create 'OK' button
	this._create('x_btn_ok', 'obj_button', 'footer', 'noborder ok');
	this.x_btn_ok._value('FORM_BUTTONS::OK');
	this.x_btn_ok._onclick = function() {
		this._destruct();
	}.bind(this);

	this.x_btn_ok._focus();
};

_me._fill = function(aData){
	if (this.loading)
		this.loading._destruct();

	var ar = {'*':{}};
	for (var id in aData)
		if (aData[id] && aData[id].values){

			if (!ar[aData[id].values.REAVALUE])
				ar[aData[id].values.REAVALUE] = {};

			ar[aData[id].values.REAVALUE][id] = aData[id].values;
			ar['*'][id] = aData[id].values;
		}

	this.__reactions = ar;

	for (var sName in ar){
		tab = this.tabs._create('tab','obj_tab','main', (sName == '*'?'all':'ico ico_'+sName.replace(/\s+/g,'_')));
		tab.__reaction = sName;

		if (sName == '*'){
			tab._value(getLang('COMMON::ALL') +' '+ count(aData), true);
			this._fill_list(tab);
		}
		else
			tab._value(count(ar[sName]), true);

		tab._onactive = function(bFirstTime){
			if (bFirstTime){
				this._parent._parent._fill_list(this);
			}
		};

		if (this.__start == sName)
			tab._active();
	}
};

_me._fill_list = function(tab){
	if (tab){
		if (!tab.list)
			tab._create('list','obj_list');

		var arr = this.__reactions[tab.__reaction || '*'] || {},
			aData = [], elm = mkElement('div');

		for (var id in arr){
			elm.appendChild(mkElement('span',{className:'avatar', style:{backgroundImage:'url("'+ getAvatarURL(arr[id].REAOWNEMAIL) +'")'}}));
			elm.appendChild(mkElement('span',{className:'label', innerHTML:arr[id].REAOWNNAME}));

			aData.push({html:elm.innerHTML});
			elm.innerHTML = '';
		}

		tab.list._fill(aData);
	}
};
