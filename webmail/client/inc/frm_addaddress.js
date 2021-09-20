_me = frm_addaddress.prototype;
function frm_addaddress(){};

_me.__constructor = function(aOnPopupCloseResponse, aTabsNames, aTabsValues, sPreselect, bDistrList, bSwitch, bNoShared, bIsModal)
{
//	this._dockable(false);
	var me = this;
	this._modal(bIsModal);

	this._distrList = bDistrList;

	this._title('SELECT_RECIPIENTS::SELECT_EMAILS');
	this._defaultSize(-1,-1,660,620);

	this._draw('frm_addaddress', 'main',{shared:!this._phoneList});

	//Data for
	this.__aData = {'__@@ADDRESSBOOK@@__':getLang('ADDRESS_BOOK::ADDRESS_BOOK')};

	if (!this._phoneList && !bNoShared)
		this.__aData['__@@SHARED@@__'] = getLang('ATTENDEES::SHARED');

	this.__aData['*'] = getLang('COMPOSE::SELECT_C');

	if (sPrimaryAccountCHAT && !this._phoneList)
		this.__aData['**'] = getLang('COMPOSE::SELECT_I');

	var sResourcesFolderName = dataSet.get('main', ['resources_path']);
	if (Is.Defined(sResourcesFolderName) && WMFolders.getType({aid:sPrimaryAccount, fid:sResourcesFolderName}) == 'C') {
		this.__aData[sResourcesFolderName] = sResourcesFolderName;
	}

	switch(bSwitch){
	case 2:
    	this._distrList = bDistrList!==false?true:false;
	   	this._sharedList = 2;
    	this._activeFolder = "__@@SHARED@@__";
	    break;

	case 3:
    	this._sharedList = 3;
    	this._activeFolder = "__@@SHARED@@__";
	    break;

	case 4:
		if (this.__aData[sResourcesFolderName])
			this._activeFolder = sResourcesFolderName;
		break;

	default:
		if (bSwitch)
			this._phoneList = bSwitch;

		var f = GWOthers.getItem('DEFAULT_FOLDERS','ab');
		if (f!='__@@ADDRESSBOOK@@__' && (f = Path.split(f)) && f[1] && WMFolders.getType(f) == 'C')
			this._activeFolder = f[1];
		else
			this._activeFolder = "__@@ADDRESSBOOK@@__";
	}

	//RENDER INPUTS
	this.__selected = sPreselect || '';

	var obj = {input:[]};
	for (var i in aTabsNames)
		obj.input.push({name:i,label:aTabsNames[i]});

	this._draw('frm_addaddress_line','right',obj);
	this.x_btn_ok._tabIndex();
	this.x_btn_cancel._tabIndex();

	for (var i in aTabsNames){

		if (!this.__selected.toString()) this.__selected = i;

		this['button_'+i]._onclick = function(){
			var n = this._name.replace('button_','');
			if (me.__selected != n){
				removecss(me['button_'+me.__selected]._main,'color1');
				removecss(me['input_'+me.__selected]._main,'active');
				addcss(me['button_'+n]._main,'color1');
				addcss(me['input_'+n]._main,'active');

				me.__selected = n;
			}

			me.__add();
		};

		this['input_'+i]._onfocus = function(){
			var n = this._name.replace('input_','');
			if (me.__selected != n){
				removecss(me['button_'+me.__selected]._main,'color1');
                removecss(me['input_'+me.__selected]._main,'active');

	            addcss(me['button_'+n]._main,'color1');
	            addcss(me['input_'+n]._main,'active');

                me.__selected = n;
			}
		};
		if (aTabsValues && aTabsValues[i])
        	this['input_'+i]._value(MailAddress.splitEmails(aTabsValues[i]).join(', '));

		if (i == this.__selected){
			addcss(this['button_'+i]._main,'color1');
			addcss(this['input_'+i]._main,'active');
		}

		this['input_'+i]._onchange = this['input_'+i]._onkeyup = function(){
			check_inp();
		};
	}

	// FOOTER
	me.__ok = false;
    this.x_btn_ok._disabled(true);
	this.x_btn_ok._onclick = function(){
        me.__ok = true;
		me._destruct();
	};

	this._onclose = function(){

		if (typeof aOnPopupCloseResponse != 'undefined'){
			var aReturnVars = {};
			for (var i in aTabsNames)
				aReturnVars[i] = MailAddress.splitEmails(me['input_'+i]._value());

			pushParameterToCallback(aOnPopupCloseResponse, me);
			executeCallbackFunction(aOnPopupCloseResponse, me.__ok, aReturnVars);
		}
		return true;
	};

	var check_inp = function(sName){
		var b = true;
		for (var i in aTabsNames)
			if (me['input_'+i]._value()){
				b = false;
				break;
			}

		me.x_btn_ok._disabled(b);
	};
	check_inp();

	// LEFT
	this.grid._cookiesEnabled = false;
	this.grid._default_columns = function(){
		if (me._phoneList)
			return {'LABEL':{"title": 'DATAGRID_ITEMS_VIEW::ITMCLASSIFYAS',"width":50,encode: true, mode:'%','arg':{'sort':'asc'}},'PHONE':{"title": 'DATAGRID_ITEMS_VIEW::LCTPHNMOBILE',"width":50, mode:'%', encode: true},'COMPANY':{"title":'DATAGRID_ITEMS_VIEW::ITMCOMPANY',"width":150, encode: true, 'arg':{'sort':'asc'}},'DEPARTMENT':{"title":'DATAGRID_ITEMS_VIEW::ITMDEPARTMENT',"width":150,encode: true, 'arg':{'sort':'asc'}}};
		if (me._activeFolder == '__@@SHARED@@__')
			return {'LABEL':{"title": 'DATAGRID_ITEMS_VIEW::ITMCLASSIFYAS',"width":50,encode: true, mode:'%','arg':{'sort':'asc'}},'EMAIL':{"title": 'DATAGRID_ITEMS_VIEW::CONTACT_EMAIL',"width":50, mode:'%', encode: true,'arg':{'sort':'asc'}}};
		else
			return {'LABEL':{"title": 'DATAGRID_ITEMS_VIEW::ITMCLASSIFYAS',"width":50,encode: true, mode:'%','arg':{'sort':'asc'}},'EMAIL':{"title": 'DATAGRID_ITEMS_VIEW::CONTACT_EMAIL',"width":50, mode:'%', encode: true},'COMPANY':{"title":'DATAGRID_ITEMS_VIEW::ITMCOMPANY',"width":150,'arg':{'sort':'asc'},encode: true},'DEPARTMENT':{"title":'DATAGRID_ITEMS_VIEW::ITMDEPARTMENT',"width":150,'arg':{'sort':'asc'},encode: true}};
	};
	this.grid._default_values = function(){
        if (me._phoneList)
			return ['ITMTITLE','ITMCLASS','ITMCLASSIFYAS','ITMFIRSTNAME','ITMMIDDLENAME','ITMSURNAME','ITMSUFFIX','LCTPHNMOBILE','ITMCOMPANY','ITMDEPARTMENT'];
		if (me._activeFolder == '__@@SHARED@@__')
			return ['ITMTITLE','LCTEMAIL1','FLAGS','ITMCOMPANY'];
		else
			return ['ITMTITLE','ITMCLASS','ITMCLASSIFYAS','ITMFIRSTNAME','ITMMIDDLENAME','ITMSURNAME','ITMSUFFIX','LCTEMAIL1','LCTEMAIL2','LCTEMAIL3','LCTTYPE','ITMCOMPANY','ITMDEPARTMENT'];
	};
	this.grid._serverOrder = function(sColumn,iSortType){
		var sSort = iSortType?'desc':'asc';

		if (!me._phoneList && me._activeFolder == '__@@SHARED@@__'){
			if (sColumn == 'LABEL')
				return 'ITMTITLE '+sSort+', LCTEMAIL1 asc';
			else
				return 'LCTEMAIL1 '+sSort+', ITMTITLE asc';
		}
		else{
			switch(sColumn){
			case 'COMPANY':
				return 'ITMCOMPANY '+sSort+', ITMDEPARTMENT asc, ITMFIRSTNAME asc, ITMMIDDLENAME asc, ITMSURNAME asc';
			case 'DEPARTMENT':
				return 'ITMDEPARTMENT '+sSort+', ITMCOMPANY asc, ITMFIRSTNAME asc, ITMMIDDLENAME asc, ITMSURNAME asc';
			default:
				return (GWOthers.getItem('RESTRICTIONS','sortstring') == '1'?'ITMSORTSTRING '+sSort+',':'') + 'ITMCLASSIFYAS '+sSort+', ITMFIRSTNAME '+sSort+', ITMMIDDLENAME '+sSort+', ITMSURNAME '+sSort + (me._phoneList?', LCTPHNMOBILE asc':'');
			}
		}
	};
	this.grid._prepareBody = function (aItems, sFolType){
		var aResult = {},
			sPrefix, sName, sFullName, sCompany, aRow, sEmail;

/*
		if (me._SQLsearch)
			var rxp  = new RegExp('('+me._SQLsearch+')', "gi");
*/
		for(var sItId in aItems)
		{
			if (aItems[sItId]['FLAGS'] == 4){

				if (me._activeFolder == '__@@SHARED@@__' && aItems[sItId].LCTEMAIL1 == 'anyone' && !aItems[sItId].ITMTITLE)
					aItems[sItId].ITMTITLE = getLang('SHARING::ANONYMOUS');
/*
				//highlight Name
				if (me._SQLsearch)
					sName = aItems[sItId].ITMTITLE.replace(rxp,"<b>$1</b>");
				else
*/
					sName = aItems[sItId].ITMTITLE;

				aResult[sItId] = {"id":sItId,"data":{'LABEL':[sName,sName/*aItems[sItId].LCTEMAIL1*/],'EMAIL':aItems[sItId].LCTEMAIL1,'COMPANY':aItems[sItId].ITMCOMPANY,'DEPARTMENT':aItems[sItId].ITMDEPARTMENT},"arg":{'aid':aItems[sItId]['aid'],'fid':aItems[sItId]['fid'],'iid':sItId}};
			}
			else
			if (aItems[sItId]['ITMCLASS'] == 'L'){

				if (me._distrList) {
					sPrefix = '';
					sName = aItems[sItId]['ITMCLASSIFYAS'] || aItems[sItId]['ITMTITLE'] || '';

					if (aItems[sItId].aid != sPrimaryAccount || sName.indexOf('::') >= 0)
						sPrefix = aItems[sItId].aid + '::' + aItems[sItId].fid + '::';
					else
					if (aItems[sItId].fid != Mapping.getDefaultFolderForGWType('C') && aItems[sItId].fid != "__@@ADDRESSBOOK@@__")
						sPrefix = aItems[sItId].fid + '::';

					aResult[sItId] = {"id":sItId,"data":{'LABEL':'['+sPrefix+sName+']','EMAIL':'','COMPANY':aItems[sItId].ITMCOMPANY,'DEPARTMENT':aItems[sItId].ITMDEPARTMENT},"arg":{'aid':aItems[sItId]['aid'],'fid':aItems[sItId]['fid'],'iid':sItId}};
				}
			}
			else{

				if (!aItems[sItId]['ITMCLASSIFYAS']){
					sFullName = '';
					var aFullNameParts = ['ITMTITLE','ITMFIRSTNAME','ITMMIDDLENAME','ITMSURNAME','ITMSUFFIX'];

					for (var n in aFullNameParts)
						if (aItems[sItId][aFullNameParts[n]])
							sFullName += aItems[sItId][aFullNameParts[n]] + ' ';

					sFullName.trim();
				}
				else
					sFullName = aItems[sItId]['ITMCLASSIFYAS'];

				//highlight Name
/*
				if (me._SQLsearch)
					sName = sFullName.replace(rxp,"<b>$1</b>");
				else
*/
					sName = sFullName;

				aRow = {};

				sCompany = aItems[sItId].ITMCOMPANY;
/*
				if ((sCompany = aItems[sItId].ITMCOMPANY) && me._SQLsearch)
                	sCompany = sCompany.replace(rxp,"<b>$1</b>");
*/
				if (me._phoneList){
					if (Is.Defined(aItems[sItId]['LCTPHNMOBILE'])){
						aRow = {'LABEL':[sName,sFullName],'PHONE':[aItems[sItId]['LCTPHNMOBILE']],'COMPANY':sCompany,'DEPARTMENT':aItems[sItId].ITMDEPARTMENT};
						aResult[sItId] = {"id":sItId,"data":aRow,"arg":{'aid':aItems[sItId]['aid'],'fid':aItems[sItId]['fid'],'iid':sItId,'phone':aItems[sItId]['LCTPHNMOBILE']}};
					}
				}
				else{
					for(var i = 1;i<4;i++)
						if (Is.Defined(aItems[sItId]['LCTEMAIL'+i])){
/*
							if (me._SQLsearch)
								sEmail = aItems[sItId]['LCTEMAIL'+i].replace(rxp,"<b>$1</b>");
							else
*/
								sEmail = aItems[sItId]['LCTEMAIL'+i];

							aRow = {'LABEL':[sName,sFullName],'EMAIL':[sEmail,aItems[sItId]['LCTEMAIL'+i]],'COMPANY':sCompany,'DEPARTMENT':aItems[sItId].ITMDEPARTMENT};
							aResult[sItId+'#'+i] = {"id":sItId+'#'+i,"data":aRow,"arg":{'aid':aItems[sItId]['aid'],'fid':aItems[sItId]['fid'],'iid':sItId}};
						}
				}
			}
		}

		return aResult;
	};
	this.grid._onclick = function(e){
        if (e.type == 'keydown' && e.keyCode == 13){
			me.__add();
			// After adding set focus on search input
			me.search._focus();
			me.search._select();
		//	this._focus();
			//me.search._setRange(0,me.search._value().length);
		}
	};
	this.grid._ondblclick = function(e,elm,col,row){
		if (row){
			me.__add();

			if (me.search._value().length>0)
				me.search._setRange(0,me.search._value().length);
		}
	};
	this.grid._onkeypress = function (e){
		var s = String.fromCharCode(e.charCode);
		if (s && (s = s.trim()) && !/[\x00-\x1F]/.test(s)){
			me.search._value(s);
			me.search._focus(true);
		}
	};

	this.grid._oncontext = function(e,elm,arg) {
		if (arg && arg.fid != '__@@SHARED@@__' && arg.iid) {
				var id = [arg['aid'], arg['fid'], arg['iid']];
				var menu = gui._create('context', 'obj_context');

				menu._place(e.clientX,e.clientY);
				menu._fill([{"title": 'POPUP_ITEMS::EDIT', 'arg': [Item.openwindow,[id, null, null, dataSet.get(this._listener_data,[arg['aid'],arg['fid'],arg['iid'],'ITMCLASS']) == 'L'?'L':'C']]}]);
				menu._onclick = function(e, elm, id, arg) {
					if (!arg) return;
					executeCallbackFunction(arg);
				};
		}
	};

	this.grid._listen_data('contacts_'+this._pathName,'',true);

	//Create first request
	switch(this._activeFolder){
		case '__@@SHARED@@__':
		case '__@@ADDRESSBOOK@@__':
			this.__changeFolder('',this._activeFolder);
			break;
		default:
			this.__changeFolder(sPrimaryAccount,this._activeFolder);
	}

    this.select._value(this._activeFolder);
    this.select._onbeforechange = function(sOld, sNew){
		var sFolder;
		if (sNew == '*'){

			if (me.frm_select_folder && !me.frm_select_folder._destructed)
				me.frm_select_folder._destruct();

			if (me._activeFolder != '__@@SHARED@@__' && WMFolders.getType([sPrimaryAccount, me._activeFolder]) == 'C')
				sFolder = me._activeFolder;
			else
				sFolder = Mapping.getDefaultFolderForGWType('C');

			me.frm_select_folder = gui._create('frm_select_folder','frm_select_folder','','','POPUP_FOLDERS::SELECT_FOLDER',sPrimaryAccount,sFolder,[me,'__changeFolder'],true,true,'C','',true);
			return false;
		}
		else
		if (sNew == '**'){

			if (me.frm_select_folder && !me.frm_select_folder._destructed)
				me.frm_select_folder._destruct();

			if (WMFolders.getType([sPrimaryAccount, me._activeFolder]) == 'I')
				sFolder = me._activeFolder;
			else{
				var f = dataSet.get('folders', [sPrimaryAccount]);
				for(var id in f){
					if (f[id].TYPE == 'I'){
						sFolder = id;
						break;
					}
				}
			}

			me.frm_select_folder = gui._create('frm_select_folder','frm_select_folder','','','CHAT::SELECT',sPrimaryAccount,sFolder,[me,'__addRoom'],true,true,['Y','I'],'',true);
			return false;
		}
	};

    this.select._onchange = function(){
		if (this._value() != '*')
			me.__changeFolder('',this._value());
	};

	//SEARCH
	this.search._onsearch = function(v,s){
		if ((me.grid._defaultfilter || '') != me.__defaultFilter() || (me.grid._SQLsearch || '') != (v || '') || (me.grid._SQLfulltext || '') != (s || '')){
			// Get search string or expression
			me.grid._defaultfilter = me.__defaultFilter();
			me.grid._SQLsearch = v;
			me.grid._SQLfulltext = s;

			// Send search query to server
			me.grid._serverSort('','','',[me,'_selectFirst']);
		}
	};
/*
	this.search._onkeydown = function(e){
		if (e.keyCode == 13)
			this._onsearch();

		if ((e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13) && me.grid._value().length && me.grid._aData[me.grid._value()[0]])
			me.grid._focus();
	};
*/
};

_me._selectFirst = function () {
	if (!this._destructed) {
		// If possible select first matching search result
		if (this.grid && this.grid._selectFirst()) {
			this.grid._focus();

			return true;
		} else
			// Otherwise, select search box again
			if (this.search) {
				this.search._focus();

				// Check if it appears to be an email and in that case add it to current recipient field
				var obj = this['input_' + this.__selected];
				var str = obj._value();
				var v = this.search._value();
				v = v.indexOf(':') == -1 ? v : v.substr(v.indexOf(':') + 1);
				if (obj && v && v.length > 2 && v.indexOf('@') && v.indexOf('@') != -1 && v.indexOf('@') != v.length - 1 && /^\S+$/.test(v) && str.indexOf(v) == -1) {
					obj._value(str ? str + ', ' + v : v);
					this.search._select();
				}

				return false;
			}
	}
};

_me.__add = function(){
	var obj;
	if (!(obj = this['input_'+this.__selected]))
		return;

	var v = this.grid._value();
	if (v.length){
		var tmp,a = [], s = obj._value() || '',sData;
		if (s)
			a = MailAddress.splitEmails(s);

		for(var i in v){

			if (typeof (tmp = this.grid.__valueData[v[i]]) != 'undefined'){
                sData = '';

				if (this._phoneList)
					sData = MailAddress.createEmail(tmp.data.LABEL[1],tmp.data.PHONE[0]);
				else{
					//distribution list
					if (!tmp.data.EMAIL && typeof tmp.data.LABEL == 'string')
						sData = tmp.data.LABEL;
					else
					//contact
					if (typeof tmp.data.EMAIL == 'string' && tmp.data.EMAIL.indexOf('[')==0)
						sData = tmp.data.EMAIL;
					else
						sData = MailAddress.createEmail(tmp.data.LABEL[1], typeof tmp.data.EMAIL == 'object'?tmp.data.EMAIL[1]:tmp.data.EMAIL);
				}

				sData.trim();

				if (sData && inArray(a,sData)<0)
					a.push(sData);
			}
		}

		if (a.length){
			var str = a.join(', ');
			obj._value(str);
			obj._setRange(str.length);
		}

	} else if(this.grid._SQLsearch && typeof this.grid._SQLsearch == "string") {
		// If no contact is found and selected, add typed in search instead
		var str = this.grid._SQLsearch;
		var v = obj._value();
		str = str.indexOf(':')==-1 ? str : str.substr(str.indexOf(':')+1);
		obj._value(v?v+', '+str:str);
		if(str.indexOf('@')!=-1)
			this.search._focus();
		else
			obj._focus();
	}
};

_me.__defaultFilter = function(){
	var filter = '';
	if (this._activeFolder == '__@@SHARED@@__'){
		filter = "has:email1";

		if (+GWOthers.getItem('RESTRICTIONS','disable_anyone'))
			filter += ' AND -is:anyone';

		if (this._sharedList == 3 || +GWOthers.getItem('RESTRICTIONS', 'disable_group_sharing'))
			filter += ' AND flags:0';
    }
	else
	if (WMFolders.getType([sPrimaryAccount, this._activeFolder]) == 'C'){
		if (this._phoneList)
	        filter = "has:mobile";
		else
			filter = "has:email";
	}

	return filter;
};

_me.__changeFolder = function(sAccount, sFolder) {
	var sResourcesFolderName = dataSet.get('main', ['resources_path']),
		sValue,
		aData;

	this._activeFolder = sFolder;
	this.grid._defaultfilter = this.__defaultFilter();

	this.search._setFolder({aid:sAccount || sPrimaryAccount,fid:sFolder}, 'C'); //WMFolders.getType([sPrimaryAccount, this._activeFolder])
	this.search._focus();

	aData = clone(this.__aData);
	if (sAccount && sFolder){
		// In case Resources folder was selected, do not add it to select options - it is already present by default
		if (sFolder === sResourcesFolderName) {
			sValue = sFolder;
		} else {
			sValue = sAccount+'/'+sFolder;
			aData[sValue] = sFolder;
			this.select._fill(aData);
		}

	    this.select._value(sValue,true);
	} else {
		this.select._fill(aData);
	}

	this.grid._serverSort({aid:sAccount || sPrimaryAccount,fid:this._activeFolder},this._activeFolder == '__@@SHARED@@__'?'EMAIL':'LABEL','',[this,'_selectFirst'], { groupbyemail: GWOthers.getItem('MAIL_SETTINGS_GENERAL', 'GROUP_CONTACTS_BY_EMAIL') == '1' });
};

_me.__addRoom = function(sAccount, sFolder){

	this.select._value(sAccount+'/'+this._activeFolder, true);
	this.search._focus();

	var obj;
	if (!(obj = this['input_'+this.__selected]))
		return;

	var sName = dataSet.get('folders', [sAccount, sFolder,'NAME']) || dataSet.get('folders', [sAccount, sFolder,'RELATIVE_PATH']) || '';
	if (sName.length){
		sFolder += '::'+ sName;
		obj._value(MailAddress.appendEmail(obj._value(), '['+sFolder+']'));
	}
};
