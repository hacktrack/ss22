_me = frm_reminder.prototype;
function frm_reminder(){};

_me.__constructor = function() {
	var me = this;

	this._size(500,350,true);
	this._closable(false);

	this._title('REMINDER::REMINDER');

	this._draw('frm_reminder', 'footer',{conference:sPrimaryAccountCONFERENCE});

	this._create('grid','obj_datagrid','','noborder');
	this.grid._select_single = true;
	this.grid._addColumns({
		'CHECK':{width:30, type:'static',css:'check'},
		'TYPE':{width:20, type:'static',css:'ico type'},
		'EVNTITLE':{title:'DATAGRID_ITEMS_VIEW::EVNTITLE','width':100,mode:'%','arg':{'sort':'asc'},encode:true},
		'EVENT_STARTDATE':{title:'DATAGRID_ITEMS_VIEW::EVENT_STARTDATE','width':120,'arg':{'sort':'desc'}},
		'BUTTON':{width:34, type:'static', css:'ico button'}
	});

	// checkbox & conference button handling
	this.grid._onclick = function(e,elm,arg,id,col,aClickType){
		switch(col){
			case 'CHECK':
				if (this._aData[id])
					this._aData[id].arg.checked = !arg.checked;

				me._fill();
				break;
			case 'BUTTON':
				if (sPrimaryAccountCONFERENCE && arg.conferenceid){
					// Start conference
					storage.library('wm_conference');
					wm_conference.get(arg.conferenceid).join();
					// Remove this reminder
					if (arg.rid)
						WMItems.reminders({rid:[arg.rid]}, [me,'__handler']);
				}

				break;
		}
	};

	// open item
	this.grid._ondblclick = function(e,elm,arg,id,col,aClickType){
		if (col != 'CHECK' && arg && arg.iid)
			Item.openwindow([arg.aid,arg.fid,arg.iid]);
	};

	// define 'Snooze' button
	this.btn_snooze._onclick = function() {
		var aID = me.__getIds();
		if (aID.length){

			me.snooze._disabled(true);
			me.btn_snooze._disabled(true);
			me.btn_dismiss._disabled(true);

			WMItems.reminders({rid:aID,snooze:me.snooze._value()},[me,'__handler']);
		}
	};

	// define 'Dismiss' button
	this.btn_dismiss._onclick = function() {
		var aID = me.__getIds();
		if (aID.length){

			me.snooze._disabled(true);
			me.btn_snooze._disabled(true);
			me.btn_dismiss._disabled(true);

			WMItems.reminders({rid:aID},[me,'__handler']);
		}
	};
	this.btn_dismiss._focus();

	// All reminders are snoozed by 5min on close by [x]
	/*
	this._onclose = function(b){
		if (b){
			var aID = me.__getIds(true);
			if (aID.length)
				WMItems.reminders({rid:aID,snooze:5},[me,'__handler']);
		}
		return false;
	};
	*/
};

_me.__getIds = function(bAll){
	var aID = [];

	if (this.grid._aData)
		for(var i in this.grid._aData)
		    if (this.grid._aData[i].arg && (this.grid._aData[i].arg.checked || bAll))
		    	aID.push(this.grid._aData[i].arg.rid);

	return aID;
};

_me._fill = function(aData){

	if (Is.Defined(aData))
		this._aData = aData;
	else
		aData = this._aData;

	var out = {};
	for(var i in aData){

		aData[i].checked = !this.grid._aData || !this.grid._aData[i] || this.grid._aData[i].arg.checked;

	    out[i] = {
	    	data:{
	    		EVNTITLE:(aData[i].title || getLang('EVENT_VIEW::NOTITLE')),
	    		BUTTON:(sPrimaryAccountCONFERENCE && aData[i]['conferenceid']?['','',getLang(typeof aData[i].organizer != 'string' || aData[i].organizer.indexOf('@')==-1 || MailAddress.splitEmailsAndNames(aData[i].organizer)[0].email == sPrimaryAccount ? 'CONFERENCE::START' : 'CONFERENCE::JOIN')]:'')
	    	},
	    	css:'reminder_'+aData[i]['class'] + (sPrimaryAccountCONFERENCE && aData[i]['conferenceid']?' conference':'') + (aData[i].checked?' checked':''),
	    	arg:aData[i]
	    }

		out[i].data.EVENT_STARTDATE = CalendarFormatting.formatStartDate(aData[i]);

		//Title
		if (gui.frm_main && gui.frm_main.title && (!this.grid._aData || !this.grid._aData[i]))
			gui.frm_main.title._add(getLang('TITLE::NEW_REMINDER',[aData[i].title || getLang('EVENT_VIEW::NOTITLE')]),5);
	}

	if (Is.Empty(out))
		this._destruct();
	else
		this.grid._fill(out);
};

_me.__handler = function (){
	dataSet.remove('reminders',null,true);
	this._destruct();
	gui.frm_main.__RMN_get();
};
