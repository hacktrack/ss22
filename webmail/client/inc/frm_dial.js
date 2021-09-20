_me = frm_dial.prototype;
function frm_dial() {};

_me.__constructor = function(sSearch, aPhones) {

	// Not allowed to make calls during conference
	if (gui.conference) {
		gui.notifier._value({type: 'alert', args: {header: 'MAIN_MENU::CONFERENCE', text: 'CONFERENCE::NOCALLALLOWED'}});
		this._destruct();
		return;
	}

	// Check for browser or plugin support
	if(!IceSIP.supported() || document.location.protocol!='https:') {
		var nortc = gui._create('no_webrtc','frm_confirm','','',[function(){
			window.open('https://www.icewarp.com/support/troubleshoot_webrtc/?' + buildURL({ishttps:(location.protocol.indexOf("https")===0?'1':'0'),lang:GWOthers.getItem('LAYOUT_SETTINGS','language')}));
		}],'SIP::SIP',document.location.protocol=='https:'?'SIP::NOWEBRTC':'SIP::NOTSECURE');
		nortc.x_btn_ok._value('ERROR::TROUBLESHOOT');
		addcss(nortc.x_btn_ok._main, 'help');
		this._destruct();
		return;
	}

	// If already waiting for media do not allow new call
	if(dataSet.get('sip',['media'])=='requesting') {
		gui.notifier._value({type: 'sip_external', args: {header: 'SIP::SIP', text: 'SIP::GETTINGMEDIA'}});
		this._destruct();
		return;
	}

	var me = this;

	this._defaultSize(-1,-1,650,366);
	this._title('DIAL::CALL');
	this._draw('frm_dial', 'main', {ab:(!sPrimaryAccountGW || (GWOthers.getItem('RESTRICTIONS', 'disable_gw_types') || '').indexOf('c')>-1)});

	//Call History
	this.list._select_single = true;
	this.list._addColumns({
		'AVATAR':{width:20, type:'static',css:'avatar',display:'all'},
		'TYPE':{width:20, type:'static',css:'ico type',display:'all'},
		'CALL':{title:'DATAGRID_ITEMS_VIEW::EVNTITLE','width':290, encode:true,display:'all'},
		'DATE':{title:'DATAGRID_ITEMS_VIEW::EVENT_STARTDATE','width':120,display:'all'},
		'DURATION':{title:'DATAGRID_ITEMS_VIEW::EVENT_STARTDATE','width':120,display:'all'}
	});

	var CV = +GWOthers.getItem('LAYOUT_SETTINGS','compact_view');
	var rows = 2.8;
	switch(CV) {
		case 1:
			rows = 2;
			break;
		case 2:
			rows = 1;
			break;
	}
	this._list_options = {
		rows: rows,
		filters: [{
			search: '',
			text: 'COMMON::ALL'
		}, {
			search: 'missed',
			text: 'DIAL::MISSED'
		}],
		size: 2500
	};
	this.list._small(this._list_options);

	this.list._serverSort = function(){
		var me = this;
		WMStorage.get({'resources':['sip_calls']},'','',[function(aData){

			var out = [];

			if (aData && aData.SIP_CALLS){
				var aData = aData.SIP_CALLS.ITEMS,
					itm,rcp;

				for(var i in aData){
					itm = aData[i].VALUES;

					if (!me._smallfilter || (itm.INOUT.VALUE == 'IN' && (itm.STATUS.VALUE == 'FAILED' || itm.STATUS.VALUE == 'CANCELLED'))){

						rcp = (itm.INOUT.VALUE == 'OUT'?itm.TO.VALUE:itm.FROM.VALUE);

						if (rcp)
							out.push({
								data:{
									TYPE:'&nbsp;',
									AVATAR:(sPrimaryAccountGW?'<div style="background-image: url(\''+getAvatarURL(rcp)+'\')"></div>':'<div></div>'),
									CALL:rcp,
									DATE:IcewarpDate.unix(itm.UNIXSTAMP.VALUE).format(IcewarpDate.SHORT_L),
									DURATION:itm.STATUS.VALUE == 'ANSWERED' && itm.DURATION.VALUE>0?parseJulianTime(itm.DURATION.VALUE):''
								},
								arg:{call:rcp},
								css:itm.STATUS.VALUE+' '+ itm.INOUT.VALUE}
							);
					}
				}
			}

			if (me && !me._destructed)
				me._fill(out);

		}],true);
	};

	// checkbox & conference button handling
	this.list._onclick = function(e,elm,arg,id,col,aClickType){
		if (arg && arg.call)
			me.number._value(arg.call);
	};

	// open item
	this.list._ondblclick = function(e,elm,arg,id,col,aClickType){
		if (arg && arg.call){
			me.number._value(arg.call);
			if(!me.call._disabled())
				me.call._onclick();
		}
	};

	this.list._serverSort();

	//Call input
	this.number.__minWidth = '300';
	this.number._checksize = function(){};

	//Add Button
	this.add._onclick = function(){
		if (me.pbook)
			me.pbook._destruct();

		me.pbook = gui._create('pbook', 'frm_phonebook','','',[function(v){ if (me.number) me.number._value(v); }]);
	};

	//Keypad
	this.btn_0._onclick = function(){
		var sip = gui.frm_main.sip,
			v = {btn_0:0,btn_1:1,btn_2:2,btn_3:3,btn_4:4,btn_5:5,btn_6:6,btn_7:7,btn_8:8,btn_9:9,btn_star:'*',btn_sharp:'#'}[this._name],
			str = me.number._value().toString();

		if (sip && dataSet.get('sip',['activity'])=='Phoning') {
			sip._dtmf(v);
			me.number._value(str + v);
			me.number._focus();
		}
		else{
			var pos = me.number._getCartPos();
			me.number._value(str.substr(0,pos) + v + str.substring(pos));
			me.number._setRange(pos+1);
		}
	};

	this.btn_1._onclick = this.btn_0._onclick;
	this.btn_2._onclick = this.btn_0._onclick;
	this.btn_3._onclick = this.btn_0._onclick;
	this.btn_4._onclick = this.btn_0._onclick;
	this.btn_5._onclick = this.btn_0._onclick;
	this.btn_6._onclick = this.btn_0._onclick;
	this.btn_7._onclick = this.btn_0._onclick;
	this.btn_8._onclick = this.btn_0._onclick;
	this.btn_9._onclick = this.btn_0._onclick;
	this.btn_star._onclick = this.btn_0._onclick;
	this.btn_sharp._onclick = this.btn_0._onclick;


	//Suggest

	this.number._qvalue = function(v){
		if (Is.Object(v))
			v = v.value;

		var a = MailAddress.splitEmailsAndNames(v);
		if ((a = a[0]) && Is.String(a.email))
			this._value(a.email || '');
	};

	this.number._query = function(v){

		this.__last_qdata = v;

		var tmp = v.replace(/"/g,'\\"');

		var aFilter = {
			search: 'phone:"'+ tmp +'" OR classify:"'+ tmp +'" OR title:"'+ tmp +'" OR name:"'+ tmp +'"',
			sort: 'ITMCLASSIFYAS, ITMFIRSTNAME, ITMSURNAME',
			limit: this._limit
		};

		WMItems.list({'aid':sPrimaryAccount,'fid':"__@@ADDRESSBOOK@@__",
			'values':[
			'ITMTITLE',
			'ITMCLASS',
			'ITMCLASSIFYAS',
			'ITMFIRSTNAME',
			'ITMMIDDLENAME',
			'ITMSURNAME',
			'ITMSUFFIX',

			'LCTPHNHOME1',
			'LCTPHNHOME2',
			'LCTPHNASSISTANT',
			'LCTPHNWORK1',
			'LCTPHNWORK2',
			//'LCTPHNFAXHOME',
			//'LCTPHNFAXWORK',
			'LCTPHNCALLBACK',
			'LCTPHNCOMPANY',
			'LCTPHNCAR',
			'LCTPHNMOBILE',
			'LCTPHNOTHER',
			'LCTPHNPRIMARY',

			'LCTEMAIL1',
			'LCTEMAIL2',
			'LCTEMAIL3'
		],

		'filter':aFilter},'','','',[this,'_parse']);
	};

	this.number._obeyEvent('onkeydown',[function(e){ if (e.keyCode == 13 && me.number._value().length && me.call && !me.call._disabled()) me.call._onclick(); }]);

	//Call button
	this.call._onclick = function(){
		// Make call if supported
		var calling = false;
		if(this._name=='video' && IceSIP && !IceSIP.supported())
			gui.notifier._value({type: 'sip_external', args: {header: 'SIP::SIP', text: 'SIP::VIDEONOTSUPPORTED'}});
		else
			calling = gui.frm_main._call(me.number._value(),this._name == 'video',undefined,this._name == 'screen');

		// Disable call buttons to prevent multiple calls
		if(calling) {
			me.call._disabled(true);
			if(me.video)
				me.video._disabled(true);
		}
	};


	//SIP
	if (window.sPrimaryAccountSIP && (GWOthers.getItem('RESTRICTIONS', 'disable_sip') || 0)<1){

		if (GWOthers.getItem('SIP', 'mode') == 'integrate'){

			//Call button
			var arrow = mkElement('div',{className:'arrow'});
				arrow.onclick = function(e){
					var e = e || window.event;

					if (!this.__cmenu || this.__cmenu._destructed){
						this.__cmenu = gui._create('cmenu','obj_context','','frm_dial_external');
						var aMenu = [
								{title:'SIP::EXTERNAL', css:'ico extphone',arg:[gui.frm_main,'_call',[me.number._value(),false,true]]}
							];
						if(navigator.browser && navigator.browser.application=='Chrome' && location.protocol.indexOf("https")===0)
							aMenu.push(
								{title:'SIP::SCREEN', css:'ico screen',arg:[gui.frm_main,'_call',[me.number._value(),false,false,true]]}
							);
						this.__cmenu._fill(aMenu);

						var pos = getSize(arrow);
						this.__cmenu._place(pos.x+pos.w/2,pos.y+pos.h/2+5,null,2);

						if (e.stopPropagation) e.stopPropagation();
						e.cancelBubble = true;
						return false;
					}
				};
			this.call._main.appendChild(arrow);
			this._mode('sip');

			//Video button
			if (this.video){
				this.video._onclick = this.call._onclick;
				this.video._disabled(false);
			}

			//Start SIP
			if (!gui.frm_main.sip){
				this._create('loader', 'obj_loader')._value(getLang('PRELOADER::STARTUP'));
				gui.frm_main._create('sip','obj_sip','','',function(ok){
					if(!ok) {
						gui.notifier._value({type: 'sip_not_reachable', args: {header: 'SIP::SIP', text: 'SIP::REGISTRATION_FAILED'}});
						me._destruct();
					}
				});
			}
			else{
				var stat  = dataSet.get('sip',['state']);
				if (!stat || stat == null || stat == 'offline' || stat == 'failed'){
					this._create('loader', 'obj_loader')._value(getLang('PRELOADER::STARTUP'));
					gui.frm_main.sip._login(function(ok){
						if(!ok) {
							gui.notifier._value({type: 'sip_not_reachable', args: {header: 'SIP::SIP', text: 'SIP::REGISTRATION_FAILED'}});
							me._destruct();
						}
					});
				}
			}
		}
	}

	!this._destructed && this._listen('sip');
};

_me._value = function(n) {
	if (Is.Defined(n))
		this.number._value(n);
	else
		return this.number._value();
};

_me._onclose = function() {
	// Do not allow close while waiting for device access
	if(dataSet.get('sip',['media'])=='requesting') {
		gui.notifier._value({type: 'sip_external', args: {header: 'SIP::SIP', text: 'SIP::GETTINGMEDIA'}});
		return false;
	} else
		return true;
};

//////////////// odebrat __mode

_me._mode = function(v){

	if (Is.String(v)){

		this.__mode = v || 'ext';

		removecss(this.call._main,'external','screen');

		if (this.__mode == 'ext'){
			addcss(this.call._main,'external');
			this.call._value('DIAL::DIAL');
		}
		else if(this.__mode == 'screen'){
			addcss(this.call._main,'screen');
			this.call._value('DIAL::DIAL');
		}
		else
			this.call._value('DIAL::CALL');

	}
	else
		return this.__mode || 'ext';
};


_me.__update = function(sDName){

	var ds = dataSet.get('sip');

	if (ds && ds.state == 'online'){
		addcss(this._main,'online');
		this._mode('sip');

		if (this.loader)
			this.loader._destruct();

		switch(ds.type){
			case 'PreparingCall':
				this.call._disabled(true);
				if (this.video)
					this.video._disabled(true);

				break;

			case 'IncomingCall':
			case 'CallEstablished':
			case 'Calling':
				this._undock();
				this.__hide();
				break;


			case 'CallCanceled':
			case 'CallFinished':
				this.__show();

				this.call._disabled(false);
				if (this.video)
					this.video._disabled(false);

				//refresh list
				this.list._serverSort();

				break;
		}

		return;
	}

	this._mode('ext');
	removecss(this._main,'online');
};

_me._onresize = function(e, sType){
	if (!this.__position.max && sType){

		var pos1 = getSize(this.call._main.parentNode.parentNode), //this.list._main
			pos2 = getSize(this.call._main),
			dif  = pos2.y + pos2.h - pos1.y - pos1.h,
			y = this.__position.y,
			h = this.__position.h;

		if (dif>0){

			switch(sType){
				case 't':
				case 'lt':
				case 'rt':
					y -= dif;

				default:
					h += dif;
			}

			this._place(this.__position.x, y, this.__position.w, h);
		}
	}
};
