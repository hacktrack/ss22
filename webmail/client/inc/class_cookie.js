function class_cookie(){
	var me = this;

	this._toStore = {};

	this._notSave = false;

	storage.library('gw_others');

	var tmp = GWOthers.get('COOKIE_SETTINGS','storage');
	if (tmp && tmp.VALUES){

		var aData = {};
		for(var i in tmp.VALUES)
			try{
				if (tmp.VALUES[i].charAt(0) == '{' || tmp.VALUES[i].charAt(0) == '[') {
					try {
						aData[i] = new Function("return "+tmp.VALUES[i])();
					} catch(e) {
						// escape unescaped apostrophes in object keys
						aData[i] = new Function("return "+tmp.VALUES[i].replace(/'.*?':/gm, function(key) {
							return "'" + (key.replace(/^'|':$/g, '').replace(/([^\\])'/g, "$1\\'")) + "':";
						}))();
					}
				} else {
					aData[i] = tmp.VALUES[i];
				}
			}
			catch(r){
				aData[i] = tmp.VALUES[i];
			}

		dataSet.add('cookies','',aData);
	}
	dataSet.obey(this,'','cookies',true);

	//smaz resource
	dataSet.remove('storage',['COOKIE_SETTINGS']);

	// for cookie.views
	this.__defaultViews =  {'C':{type:'C',view:'list_wide',sort:{column:'ITMCLASSIFYAS',type:'asc'}},
							'E':{type:'E',view:GWOthers.getItem('DEFAULT_CALENDAR_SETTINGS','event_view'),sort:{column:'EVENT_STARTDATE',type:'desc'}},
							'J':{type:'J',view:'list',sort:{column:'EVENT_STARTDATE',type:'desc'}},
							'G':{type:'G',view:'list',sort:{column:'ITM_DELETED',type:'desc'}},
							'M':{type:'M',view:'mail_view_wide',sort:{column:'DATE',type:'desc'}},
							'MH':{type:'M',view:'list',sort:{column:'DATE',type:'desc'}},
							'N':{type:'N',view:'list_wide',sort:{column:'EVNTITLE',type:'asc'}},
							'F':{type:'F',view:'list_wide',sort:{column:'EVNFILENAME',type:'asc'}},
							'K':{type:'K',view:'list',sort:{column:'EVNFILENAME',type:'asc'}},
							'Q':{type:'Q',view:'mail_view_wide',sort:{column:'QDATE',type:'desc'}},
							'QL':{type:'QL',view:'list',sort:{column:'SNDEMAIL',type:'asc'}},
							'T':{type:'T',view:'list',sort:{column:'TASK_ENDDATE',type:'desc'}},
							'I':{type:'I',view:'chat_view'},
							'Y':{type:'Y',view:'chat_view'},
							'W':{type:'W',view:'conference_view'},
							'S':{type:'X',view:'nothing'},
							'X':{type:'X',view:'nothing'}};

	this.__defaultRights = ['r','i','w','t','l','k','x','a'];

	//recursive store() executing
	this._interval = setInterval(function(){
		me.store();
	}, 10000);
};

class_cookie.prototype.set = function (aPath,aData,bForce){

	if (!Is.Array(aPath)) return;

	//VIEWS
	if (aPath[0]=='views' && aPath[1] && aPath[2]){

		var aFolType = this.__getViewType(aPath);
		if (aFolType.type){

			aPath.splice(0,3,'view', aFolType.type);

			//alweys fully rewite columns to set new order
			if (aPath[2] == 'columns')
				dataSet.remove('cookies',aPath,true);

			if (aFolType.subtype && (aPath[2] == 'sort' || aPath.length<3)){
				aPath2 = clone(aPath);
				aPath2[1] = aFolType.subtype;
				this.__set(aPath2, aData);

				if (aPath.length<3)
					aData.sort = this.get([aPath[0],aPath[1],'sort']);
				else
					return;
			}
		}
		else
		    return;
	}
	else
	//RIGHTS - do not save full rights
	if (aPath[0]=='rights' && aPath[1] && aPath[2] && aData && arrayCompare(aData, this.__defaultRights)){
		if (!dataSet.get('cookies',aPath))
			return;
		else
			aData = '';
	}

	this.__set(aPath,aData,bForce);
};

	class_cookie.prototype.__set = function (aPath,aData,bForce){
		if (!aData && aPath.length>1)
			dataSet.remove('cookies',aPath,bForce);
		else
			dataSet.add('cookies',aPath,aData,bForce);

		if (bForce)
			dataSet.update('cookies',aPath);

		this._notSave = false;
	};

	class_cookie.prototype.__getViewType = function(aPath){

		var sFolType = WMFolders.getType([aPath[1],aPath[2]]),
			sSubType = '';

		if (sFolType == 'M'){

			if (aPath[2] == 'INBOX')
				sSubType = 'MI';
			else
			if(aPath[2].split('/').shift() == sPrimaryAccountAPREFIX){
				sSubType = 'MA';
			}
			else{
				var d;
				if (dataSet.get('folders',[aPath[1],aPath[2],'RSS']))
					d = 'R';
				else
					d = dataSet.get('folders',[aPath[1],aPath[2],'DEFAULT']);

				switch(d){
					case 'H':
						return {type:'MH'};
					case 'S':
					case 'D':
					case 'R':
						sSubType = 'M' + d;
				}
			}
		}

		return {type: sFolType, subtype: sSubType};
	};

class_cookie.prototype.get = function (aPath){

	if (aPath){
		if (aPath[0]=='rights' && aPath[1] && aPath[2])
			return dataSet.get('cookies',aPath) || this.__defaultRights;
		else
		if (aPath[0]=='views' && aPath[1] && aPath[2]){
			var aFolType = this.__getViewType(aPath),
				tmp = Object.assign({}, this.__defaultViews[aFolType.type], dataSet.get('cookies',['view',aFolType.type]));

			if (aFolType.subtype){
				if (tmp.sort)
					tmp = Object.assign(tmp, {sort:dataSet.get('cookies',['view',aFolType.subtype,'sort']) || tmp.sort});
			}

			return aPath.length>3?arrayPath(tmp,aPath.splice(3)):tmp;
		}
	}

	return dataSet.get('cookies',aPath,true);
};

class_cookie.prototype.__update = function(sName, aDPath){
	if (aDPath && aDPath[0])
		this._toStore[aDPath[0]] = true;
};

class_cookie.prototype.store = function(aHandler){

	if (this._notSave || (window.navigator && window.navigator.onLine === false)) return;

	var yes = false,aData = {};

	for (var i in this._toStore){
		yes = true;
		aData[i] = dataSet.get('cookies',[i]);

		if (typeof aData[i] == 'object'){
			aData[i] = arrToString(aData[i]);
			if (aData[i].length == 2) aData[i] = '';
		}
	}

	this._toStore = {};

	if (yes){
		//vytvorit
		GWOthers.set('COOKIE_SETTINGS',aData,'storage');
		//zapsat
		WMStorage.set({'resources':{'COOKIE_SETTINGS':dataSet.get('storage',['COOKIE_SETTINGS'])}},'storage','',aHandler);
		//smaz
		dataSet.remove('storage',['COOKIE_SETTINGS']);
	}

	return yes;
};
