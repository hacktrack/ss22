_me = frm_delivery.prototype;
function frm_delivery(){};

_me.__constructor = function(aID,aData) {
	var me = this;

	this.__id = aID;
	this.__sent = GWOthers.getItem('DEFAULT_FOLDERS','sent') === this.__id[0] + '/' + this.__id[1];

	this._title('POPUP_ITEMS::DELIVERY_REPORT');
	this._defaultSize(-1,-1,600,500);

	this._draw('frm_delivery','main',{sent:this.__sent});
	msiebox(this._getAnchor('msiebox'));

	this.grid._cookiesEnabled = false;
	this.grid._addColumns({'EMAIL':{"title": 'DATAGRID_ITEMS_VIEW::ITMCLASSIFYAS',"width":100, mode:'%'},'STATUS':{"title": 'DATAGRID_ITEMS_VIEW::EVNSTATUS',"width":200,css:'status'},'TIME':{"title":'DATAGRID_ITEMS_VIEW::DATE',"width":115}});

	this._create('x_btn_refresh', 'obj_button', 'footer', 'refresh color1 noborder');
	this.x_btn_refresh._disabled(true);
	this.x_btn_refresh._value('FORM_BUTTONS::REFRESH');

	this._create('x_btn_cancel', 'obj_button', 'footer', 'cancel noborder');
	this.x_btn_cancel._value('FORM_BUTTONS::CANCEL');
	this.x_btn_cancel._onclick = function() { me._destruct() };

	this._create('x_btn_revoke', 'obj_button', 'footer', 'trash color2 x_btn_right noborder');
	this.x_btn_revoke._disabled(true);
	this.x_btn_revoke._value('FORM_BUTTONS::REVOKE');
	this.x_btn_revoke._onclick = function() {
		this._disabled(true);
		me.__tools.revoke_sent(me._aItemInfo, [me,'__revoked',[me._aItemInfo]]);
	};

	if (this.__sent){
		this.x_btn_send._onclick = function() {
			this._disabled(true);
			me.__tools.revoke_sent(me._aItemInfo, [me,'__resend',[me._aItemInfo]]);
		};

		this.x_btn_edit._onclick = function() {
			var newMessage = OldMessage.edit(me.__id, {ask_on_close:true});
			delete newMessage.__id;
			me.x_btn_revoke._onclick();
		};
	}

	if (!Is.Object(aData)){
		var aData = WMItems.list({aid:aID[0],fid:aID[1],iid:aID[2],values:['DATE','X_MESSAGE_ID','MESSAGE_ID']});
		if (!aData || !(aData = aData[aID[0]]) || !(aData = aData[aID[1]]) || !(aData = aData[aID[2]]))
			aData = null;
	}

	if (aData.X_MESSAGE_ID || aData.MESSAGE_ID){
		storage.library('wm_tools');
		this.__tools = new wm_tools();
		this._aItemInfo = {date:aData.DATE || aData.TIME, id:aData.X_MESSAGE_ID || aData.MESSAGE_ID};

	  	this._add_destructor('__onDestruct');

		this.x_btn_refresh._onclick = function() {
			me.__onDestruct();
			this._disabled(true);
			this._value('FORM_BUTTONS::REFRESH');
			me.__tools.delivery_report(me._aItemInfo,[me,'__fill']);
		};

		this.x_btn_refresh._onclick();
	}
	//No Item Data
	else{
		gui._create('alert', 'frm_alert', '', '', [this,'_destruct'], 'POPUP_ITEMS::DELIVERY_REPORT', 'ALERTS::IMAP_NULL');
	}
};

_me.__revoked = function(bOK, aItemInfo){
	if (bOK){
		//remove from sent folder
		if (this.__sent)
			Item.remove([this.__id[0], this.__id[1], [this.__id[2]]], true);

		this._destruct();
	}
	//Error revoke
	else
		this.x_btn_revoke._disabled(false);
};

_me.__resend = function(bOK, aItemInfo){
	if (bOK){
		WMItems.action({aid:this.__id[0], fid:this.__id[1],iid:this.__id[2]}, 'resend', [function(bOK){
			if (bOK){
				//remove from sent folder
				if (this.__sent)
					Item.remove([this.__id[0], this.__id[1], [this.__id[2]]], true);

				this._destruct();
			}
			//Error resend
			else
				this.x_btn_send._disabled(false);

		}.bind(this)]);
	}
	//Error revoke
	else
		this.x_btn_send._disabled(false);
};

_me.__fill = function(aData){

	if (Is.Array(aData) && aData.length){

		//reset Grid placeholder
		this.grid._placeholder();

		var aOut = [],d,bQueue=false,me=this,tmp;

		aData.sort(function(a,b){
			if (a.status == b.status){
				if (a.email < b.email)
					return -1;
				else
				if (a.email > b.email)
					return 1;
			}
			else
			if (a.status=='error' || (a.status<b.status && b.status!='error'))
				return -1;
			else
			if (b.status=='error' || (a.status>b.status && a.status!='error'))
				return 1;

			return 0;
		});

		this.x_btn_refresh._disabled(false);
		this.x_btn_revoke._disabled(true);

		var bEdit = true;
		for (var i=0;i<aData.length;i++){
			d = IcewarpDate.unix(aData[i].time);

			if (!bQueue && aData[i].status == 'queue')
				bQueue = true;

			tmp = {data:{EMAIL:aData[i].email,STATUS:[getLang('DELIVERY_STATUS::'+aData[i].status.toUpperCase()),'',getLang('DELIVERY_STATUS::'+aData[i].status.toUpperCase()+'_INFO')],TIME:d.format('L LT')},css:aData[i].status};
			if (aData[i].error)
				tmp.data.STATUS = [tmp.data.STATUS[0] + ' ('+aData[i].error+')','',aData[i].error];

			if (aData[i].status==='sent' || aData[i].status==='delivered')
				bEdit = false;
			else
			if (aData[i].status==='deferred' || this.__sent)
				this.x_btn_revoke._disabled(false);

			aOut.push(tmp);
		}

		if (this.__sent){
			this.x_btn_send._disabled(!bEdit);
			this.x_btn_edit._disabled(!bEdit);
		}

		this.grid._fill(aOut);

		this.__onDestruct();
		if (bQueue){
			if (this.__timer)
				window.clearInterval(this.__timer);

			this.__timer = window.setInterval(function(){
				me.__counter--;

				if (me.__counter<1){
					me.__onDestruct();
					me.x_btn_refresh._onclick();
				}

				me.x_btn_refresh._text(getLang('FORM_BUTTONS::REFRESH')+' ('+ me.__counter +')');
			},1000);

			me.x_btn_refresh._disabled(false);
		}
		else
        	me.x_btn_refresh._value('FORM_BUTTONS::REFRESH');
	}
	//No Delivery data
	else{
		this.grid._placeholder(getLang('ERROR::NO_DATA'));
		this.x_btn_refresh._disabled(false);
		//gui._create('alert', 'frm_alert', '', '', [function(){ this.x_btn_refresh._disabled(false) }.bind(this)], 'POPUP_ITEMS::DELIVERY_REPORT', 'ERROR::NO_DATA');
	}
};

_me.__onDestruct = function(){
	this.__counter = 10;
	if (this.__timer)
		window.clearInterval(this.__timer);
};