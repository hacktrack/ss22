_me = obj_attendees.prototype;
function obj_attendees() {};

_me.__constructor = function(sType,owner) {
	var me = this,dialog_name,title_prefix;

	this.__owner = owner || sPrimaryAccount;

	this.__atts = {};
	this.__new_count = 0;
	this.__aDatagridRows = [];
	this.sType = sType;

	switch (this.sType) {
		case 'DISTRIB_LIST':
		//	this.grid.__sortColumn = 'LCTDESCRIPTION';
			this.grid.__sortType = 0;

			this.grid._addColumns({	'LCTDESCRIPTION':{"title":'DISTRIB_LIST::NAME',"width":'200',encode: true,'arg':{'sort':'asc'}},
									'LCTEMAIL1':{"title":'DISTRIB_LIST::EMAIL',"width":'200',encode: true,'arg':{'sort':'asc'}}});

			// please note that first entry of this.items array has to be a description and the second an email
			// otherwise the function __onAddNewFromAddressbook() wouldn't work properly
			this.items = ['LCTDESCRIPTION','LCTEMAIL1'];
			dialog_name = 'frm_edit_dl_member';
			title_prefix = 'DISTRIB_LIST';
			break;

		case 'ATTENDEES':
			this.grid._addColumns({
            'CNTSTATUS':{'width':18,'arg':{'sort':'desc'},'css':'status',"type":'static',"text":'&nbsp;'},
            'CNTROLE':{'width':18,'arg':{'sort':'desc'},'css':'role',"type":'static',"text":'&nbsp;'},
			'CNTCONTACTNAME':{"title": 'DISTRIB_LIST::NAME',"width":200, encode: true},
			'CNTEMAIL':{"title": 'DISTRIB_LIST::EMAIL',"width":200, encode: true}
			});

			// please note that first entry of this.items array has to be a description and the second an email
			// otherwise the function __onAddNewFromAddressbook() wouldn't work properly
			this.items = ['CNTCONTACTNAME','CNTEMAIL','CNTROLE','CNTSTATUS'];
			dialog_name = 'frm_edit_attendee';
			title_prefix = 'ATTENDEES';

			// CONTEXT MENU
			this.grid._oncontext = function(e,elm,arg,id,cell){

				if (id && (cell=='CNTROLE' || cell=='CNTSTATUS' || cell=='CNTCONTACTNAME')){
					var pos = getSize(elm);

					me.cmenu = gui._create('cmenu','obj_context','','obj_attendees_context');
					me.cmenu._place(pos.x + (cell=='CNTCONTACTNAME'?-20:0),pos.y+pos.h);

					var aMenu;
					if (cell=='CNTSTATUS')
						aMenu = [{'title':'ATTENDEES::STATUS_P',css:'bg_status_P','arg':{'id':id,'key':'CNTSTATUS',value:''}},
								{'title':'ATTENDEES::STATUS_A',css:'bg_status_A','arg':{'id':id,'key':'CNTSTATUS',value:'A'}},
								{'title':'ATTENDEES::STATUS_D',css:'bg_status_D','arg':{'id':id,'key':'CNTSTATUS',value:'D'}}];
					else
						aMenu = [{'title':'ATTENDEES::ROLE_Q',css:'bg_role_Q','arg':{'id':id,'key':'CNTROLE',value:'Q'}},
								{'title':'ATTENDEES::ROLE_S',css:'bg_role_S','arg':{'id':id,'key':'CNTROLE',value:'S'}},
								{'title':'ATTENDEES::ROLE_T',css:'bg_role_T','arg':{'id':id,'key':'CNTROLE',value:'T'}}];

					me.cmenu._fill(aMenu);
					me.cmenu._onclick = function(e,elm,id,arg){
						if (arg.id && arg.key){
							var aValue = me.__getItemDetails(arg.id);
							if (aValue){
								aValue[arg.key] = arg.value;
								me.__onEdit(aValue,arg.id);
							}
						}
					};
				}

				return false;
			};

			break;

		default:
			throw new Error('Not implemented');
	}

	this.grid._ondblclick = function() {
		me.edit_button._onclick();
	};

	this.add_button._onclick = function() {
		gui._create('address_book', 'frm_addaddress', '', '',[me, '__onAddNewFromAddressbook'], ['ADDRESS_BOOK::SELECTED_ADDRESSES'],undefined,undefined,undefined,undefined,true);
	};

	this.edit_button._onclick = function() {
		var items = me.grid._value();
		// Get actual item from row number in grid
		if (items && Is.Defined(items[0]))
			items = me.grid._aData[items[0]].id;
		else
			return;
		// Deselect items
		me.grid._value([]);

		gui._create('edit_dialog', 'frm_edit_attendee', '', '', dialog_name, title_prefix + '::EDIT_TITLE', [me, '__onEdit'], me.__getItemDetails(items,true), items);
	};

	this.remove_button._onclick = function() {
		var out = [],
			items = me.grid._value(); // returns indexes of selected rows in the grid (not ids!)

		// Get ids of items by the indexes
		for(var i in items) {
			out.push(me.grid._aData[items[i]].id);
		}

		me.__removeItems(out);
	};
};

_me._value = function(aValues) {

	if (this._destructed) return;

	if (Is.Defined(aValues)) {

		this.__aDatagridRows = [];
		this.__atts = {};

		var aData,css;
		for (var i in aValues) {
			aData = {}, css = '';
			for (var j in this.items){

				if (this.items[j] == 'CNTSTATUS' && aValues[i]['values'][this.items[j]])
                    css += (css?' ':'') + "status_"+aValues[i]['values'][this.items[j]];
	            else
                if (this.items[j] == 'CNTROLE' && aValues[i]['values'][this.items[j]])
                	css += (css?' ':'') + "role_"+aValues[i]['values'][this.items[j]];

				aData[this.items[j]] = aValues[i]['values'][this.items[j]];
			}

			this.__aDatagridRows.push({"id": i, "data": aData,'css':css});
   			this.__atts[i] = {'action':'ignore','id':i};
		}

		this.grid._fill(this.__aDatagridRows);
	}
	else {
		var aResult = [];
		for (var i in this.__atts) {
			switch (this.__atts[i]['action']) {
				case 'remove':
					aResult.push({'uid': this.__atts[i]['id']});
					break;
				case 'edit':
					aResult.push({'uid': this.__atts[i]['id'], 'values': this.__getItemDetails(i)});
					break;
				case 'new':
					aResult.push({'values': this.__getItemDetails(i)});
				default:
					break;
			}
		}
		return aResult;
	}
};

_me.__getItemDetails = function (nInd,bDatagridOnly)
{
	var aValues;

	for(var n in this.__aDatagridRows)
		if (this.__aDatagridRows[n]['id'] == nInd){
			aValues = this.__aDatagridRows[n]['data'];
			break;
		}

	if (bDatagridOnly || this.sType != 'DISTRIB_LIST')
		return aValues;

	aValues['LCTTYPE'] = 'O';
	return aValues;
};

_me.__removeItems = function(aIDs)
{
	// Remove item(s) from internal array
	for (var i in aIDs)
	  for(var n in this.__aDatagridRows)
			if (this.__aDatagridRows[n]['id'] == aIDs[i])
			{
				this.__aDatagridRows.splice(n,1);
				this.__atts[aIDs[i]]['action'] = this.__atts[aIDs[i]]['action'] == 'new' ? 'ignore' : 'remove';
				break;
			}

	// Remove item(s) from the grid
	for (var i in this.grid._aData) {
		if (-1 !== aIDs.indexOf(this.grid._aData[i].id)) {
			delete this.grid._aData[i];
		}
	}

	this.grid._fill();
};

_me.__onEdit = function(aValues, sID)
{
	if (this._destructed) return;

	var itmId,aData = {},css = '';
	if (Is.Defined(sID)) {
		itmId = sID;
		this.__atts[itmId]['action'] = this.__atts[itmId]['action'] == 'new' ? 'new' : 'edit';
	} else {

		if (aValues.LCTEMAIL1)
			for(var j in this.__aDatagridRows)
				if (this.__aDatagridRows[j].data && this.__aDatagridRows[j].data.LCTEMAIL1 == aValues.LCTEMAIL1)
					return;

		if (aValues.CNTEMAIL)
			for(var j in this.__aDatagridRows)
				if (this.__aDatagridRows[j].data && this.__aDatagridRows[j].data.CNTEMAIL == aValues.CNTEMAIL)
					return;

		itmId = this.__new_count++;
		this.__aDatagridRows.push({'id':itmId,'data':aValues});
		this.__atts[itmId] = {'action':'new'};
	}

	for (var i in this.items){
		if (this.items[i] == 'CNTSTATUS' && aValues[this.items[i]])
            css += (css?' ':'') + "status_"+aValues[this.items[i]];
        else
        if (this.items[i] == 'CNTROLE' && aValues[this.items[i]])
        	css += (css?' ':'') + "role_"+aValues[this.items[i]];

		aData[this.items[i]] = aValues[this.items[i]];
	}

	for(var n in this.__aDatagridRows)
		if (this.__aDatagridRows[n]['id'] == itmId){
			this.__aDatagridRows[n]['data'] = aData;
			this.__aDatagridRows[n]['css'] = css;
			break;
		}

	this.grid._fill(this.__aDatagridRows);
};


_me.__onAddNewFromAddressbook = function(bOK, aAddresses)
{
	if (bOK) {
		var aEmail,itmId,count,aData;
		for (var i in aAddresses[0]) {
			aEmail = MailAddress.splitEmailsAndNames(aAddresses[0][i]);

			var f = false;
			for(var j in this.__aDatagridRows)
				if (this.__aDatagridRows[j].data && (this.__aDatagridRows[j].data.LCTEMAIL1 == aEmail[0].email || this.__aDatagridRows[j].data.CNTEMAIL == aEmail[0].email)){
					f = true;
					break;
				}

			if (f)
			    continue;

			// parse data from address book form in special logic:
			// first entry in this.items stands for description, the second entry stands for email
			aData = {};
			count = 0;
			for (var j in this.items) {
				if (count == 0)
					aData[this.items[j]] = aEmail[0]['name'];
				else
					aData[this.items[j]] = aEmail[0]['email'];
				count++;
				if (count > 1)
					break;
			}

			itmId = this.__new_count++;
			this.__aDatagridRows.push({'id': itmId, 'data': aData});
			this.__atts[itmId] = {'action':'new'};
		}
		this.grid._fill(this.__aDatagridRows);
	}
	// TODO: allow only one instance of frm_addaddress
	//this.__bContactsOpened = false;
};
