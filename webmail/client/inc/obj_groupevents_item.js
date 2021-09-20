_me = obj_groupevents_item.prototype;
function obj_groupevents_item(){};

_me.__constructor = function(aData) {
	this.__fill(aData);
};

_me.__fill = function(aData){
	this._clean();

	var me = this;

	this.__aData = aData;
	this.__aData.iid = WMItems.__clientID(aData.EVN_ID);

	var d1 = IcewarpDate.julian(aData.EVNSTARTDATE);
	d1.setTime(Math.max(0, aData.EVNSTARTTIME), true);

	var out = clone(aData, true);
	out.day = d1.date();
	out.date = d1.format('L LT');

	if (out.EVNACCEPTEDPARTICIPANTCOUNT > '0') {
		out.attendee = getLang('CHAT::PEOPLE', [out.EVNACCEPTEDPARTICIPANTCOUNT]);
	}


	if (aData.EVNENDDATE) {
		var d2 = IcewarpDate.julian(aData.EVNENDDATE);
		d2.setTime(Math.max(0, aData.EVNENDTIME), true);
		out.duration = IcewarpDate.duration(d2.diff(d1)).humanize();
		out.fulltime = out.date + ' - ' + d2.format('L LT');
	} else {
		out.fulltime = out.date;
	}

	this._draw('obj_groupevents_item', 'main', {item:out});

	// Open
	this._main.onclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (Is.Child(elm, me._getAnchor('control'), this))
			return;

		//dataSet.add('items', [me.__aData.aid, me.__aData.fid, me.__aData.iid, 'EVNRCR_ID'], me.__aData.EVNRCR_ID, true);
		Item.openwindow([me.__aData.aid, me.__aData.fid, me.__aData.iid], null, me.__aData, 'E', [me, '__update']);
	};

	//linkextras.EvnMyStatus == 'A'

	// Button
	if (out.EVNMYSTATUS == 'A' || out.EVNMYSTATUS == 'D'){
		removecss(this.btn_accept._main, 'color3');
		this.btn_accept._value(out.EVNMYSTATUS == 'A'?'FORM_BUTTONS::ACCEPTED':'FORM_BUTTONS::DECLINED');
	}

	this.btn_accept._disabled(sPrimaryAccountGUEST === 1);

	this.btn_accept._onclick = function(e){
		if (!me.cmenu || me.cmenu._destructed){
			e.cancelBubble=true;
			if (e.stopPropagation)
				e.stopPropagation();
			if (e.preventDefault)
				e.preventDefault();

			var pos = getSize(this._main);

			me.cmenu = gui._create('cmenu','obj_context');
			me.cmenu._fill([
				{title:'FORM_BUTTONS::ACCEPT', arg:[me,'_action',['accept']], disabled: out.EVNMYSTATUS == 'A'},
				{title:'FORM_BUTTONS::DECLINE', arg:[me,'_action',['decline']], disabled: out.EVNMYSTATUS == 'D'}
			]);

			me.cmenu._place(pos.x+pos.w/2, pos.y+pos.h, '', 2);
			return false;
		}
	};

};

_me._action = function(name){
	var me = this,
		aItem = {aid:me.__aData.aid, fid:me.__aData.fid, iid:me.__aData.iid};

	if (!this.__aData.EVNRCR_ID)
		this.btn_accept._disabled(true);

	switch(name){
		case 'decline':
			if (me.__aData.EVNRCR_ID) {
				gui._create('frm_confirm','frm_confirm_repeating','','', [function(iState) {
					var frm = gui._create('decline', 'frm_text', '', 'frm_ok_cancel', [
						function (s) {
							aItem.reason = s;
							aItem.gwparams = {};
							switch (+iState) {
								case 2:
									aItem.EXPFOLLOWING = 'true';
								case 0:
									aItem.EXPDATE = me.__aData.EVNSTARTDATE;
							}
							WMItems.imip(aItem, name, [function () {
								me.__update(true);
							}]);
						}], 'EVENT::REASON');

					frm._onclose = function () {
						me.btn_accept._disabled(false);
					};

					frm.x_btn_ok._value('FORM_BUTTONS::DECLINE');
				}],'REPEATING_CONFIRM::TITLE_DELETE','REPEATING_CONFIRM::TEXT_DELETE');
			} else {
				var frm = gui._create('decline', 'frm_text', '', 'frm_ok_cancel', [
					function (s) {
						aItem.reason = s;
						WMItems.imip(aItem, name, [function () {
								me.__update(true);
							}]);
					}], 'EVENT::REASON');

				frm._onclose = function () {
					me.btn_accept._disabled(false);
				};

				frm.x_btn_ok._value('FORM_BUTTONS::DECLINE');
			}
		break;

		case 'accept':
			WMItems.imip(aItem, name, [function(){
				me.__update(true);
			}]);
	}
};

_me.__update = function(bOK){

	if (bOK == true){
		var me = this;

		WMItems.list({aid:this.__aData.aid, fid:this.__aData.fid, iid:this.__aData.iid},'','','',[function(aData){
				if (aData && (aData = aData[me.__aData.aid]) && (aData = aData[me.__aData.fid]) && (aData = aData[me.__aData.iid])){

					if (aData.EVNSTARTDATE != me.__aData.EVNSTARTDATE || aData.EVNSTARTTIME != me.__aData.EVNSTARTTIME){
						me._parent._serverSort(me._parent.__aRequestData.folder, true);
						return;
					}

					me.__fill(aData);
				}
				// delete
				else
					me._parent._remove(me._anchor, me.__aData.iid);

			}]);

		if (this._parent && !this._parent._destructed)
			this._parent._serverSort();
	}

};
