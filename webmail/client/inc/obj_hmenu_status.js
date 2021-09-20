_me = obj_hmenu_status.prototype;
function obj_hmenu_status(){};

_me.__constructor = function() {

	this.__uniq = unique_id();
	this.__btncss = {im:''};

	var aMenu = [
		{"text":'<u></u><i><b></b></i>', "css":'noarrow', "arg": 'status', rel:'status', nodetype: ['click','context'], "callback":[this,'__submenu'], "destructor":[this,'__submenuDestruct']}
	];

	this.__ignoreMouseOut = true;

	this._fill(aMenu);

	//IM
	if (window.sPrimaryAccountIM && (GWOthers.getItem('RESTRICTIONS', 'disable_im') || 0)<1){
		// Add tooltip for im button
		var elm = document.getElementById(this._pathName + '/' + (this.__aData.length-1)).parentNode;
		addcss(elm, 'im');
		gui.tooltip._add(elm,getLang('IM::IM')+' ‒ '+getLang('STATUS::OFFLINE'),{x: '-60', y: '+36'});
	}

	this._listen('xmpp',['status']);

	this.__avatar();
};

_me._onclick = function(e,elm,id,arg)
{
	switch(arg)
	{
		case 'status':
			if ((e.ctrlKey || e.metaKey) && Cookie && !Cookie.store([gui.frm_main,'__logout']))
				gui.frm_main.__logout();

			break;

		default:
			if (Is.Object(arg))
				executeCallbackFunction(arg);
	}
};

// Show user details (called from onclick in template...)
_me.__vcard = function(){
	// If GW is disabled, do not show (would fail)
	if(GWOthers.getItem('RESTRICTIONS', 'disable_gw_types')==1) return;
	// Close dropdown and open user details
	this.__close(true);
	Item.openwindow([sPrimaryAccount, '@@mycard@@','@@mycard@@'], '', '', 'C', [this,'__refreshMyAvatar']);
};

_me.__im = function(sStatus){
	if (gui.frm_main.im){
		gui.frm_main.im._status(sStatus);
	}
};

_me.__refreshMyAvatar = function(){
	sAvatarNo++;
	var myEmail = encodeURIComponent(sPrimaryAccount);
	[].forEach.call(document.querySelectorAll('[style], [src]'), function(element) {
		['src', 'style'].forEach(function(attr) {
			var value = element.getAttribute(attr);
			if(value && ~value.indexOf(myEmail)){
				element.setAttribute(attr, value.replace(/&no=\d+/, '').replace(myEmail, myEmail + '&no=' + sAvatarNo));
			}
		});
	});

	//update im presence
	if (gui.socket && gui.socket.xmpp)
		setTimeout(function(){
			if (gui.socket && gui.socket.xmpp)
				gui.socket.xmpp._updatePresencePhoto();
		}, 5000);
};

_me.__avatar = function(){

	if (!sPrimaryAccountGW) return;

	this.__uniq = unique_id();

	var me = this,
		sURL = getAvatarURL(sPrimaryAccount),
		img = new Image();

		img.onload = function(){
			var elm = me._main.getElementsByTagName('B')[0];
			if (elm){
				if (this.height>10 && this.width>10){

					if (currentBrowser() == 'MSIE7'){

						var img = mkElement('img',{src:sURL});
						if (this.width>this.height){
							var r = this.height/elm.clientHeight;
							img.style.height = '100%';

							if ((this.width/r)>elm.clientWidth)
								img.style.right = (((this.width/r)-elm.clientWidth)/2) + 'px';
						}
						else{
							var r = this.width/elm.clientWidth;
							img.style.width = '100%';

							if ((this.height/r)>elm.clientHeight)
								this.style.bottom = (((this.height/r)-elm.clientHeight)/2) + 'px';
						}

						elm.innerHTML = '';
						elm.appendChild(img);
						elm.style.backgroundImage = 'none';
					}
					else
						elm.style.backgroundImage = 'url("'+ sURL +'")';

					elm.style.backgroundColor = '#FFFFFF';
				}
				//Should never happen, because of download.php fallback to skin
				else{
					elm.style.backgroundImage = '';
					elm.style.backgroundColor = '';

					if (currentBrowser() == 'MSIE7')
						elm.innerHTML = '';
				}
			}
		};

		img.src = sURL;
};

_me.__twoFactor = function(e) {
	gui._create('settings', 'frm_settings','','','account_settings', 'primary');
	gui._create('verify','frm_verify');
	if (this.__ePull){
		this.__ePull.style.display = 'none';
	}
};

_me.__submenu = function(e, id){
try{
	if (this.cmenu){
		this.cmenu._destruct();
		delete this.cmenu;
	}

	var aTplData = {
			//src:getAvatarURL(sPrimaryAccount),
			path:this._pathName,
			name:dataSet.get('main',['fullname']) || dataSet.get('main', ['user']),
			type:sPrimaryAccountGUEST?getLang('COMMON::GUEST'):dataSet.get('main',['domain']),
			msie:(currentBrowser() == 'MSIE7'),
			gw:sPrimaryAccountGW?true:false
		};

	if (sPrimaryAccountGW)
		aTplData['src'] = getAvatarURL(sPrimaryAccount);

	var aMenu = [{text:template.tmp('obj_hmenu_status',aTplData), css:'info', arg:[this, '__vcard']},{title:'-'}];

	if (window.sPrimaryAccountIM && (GWOthers.getItem('RESTRICTIONS', 'disable_im') || 0)<1 && gui.frm_main.im){

		// if (count(Cookie.get(['im','queue']) || [])>0 && gui.frm_main.im._is_active()){
		// 	gui.frm_main.im._openQueue();
		// 	return false;
		// }

		var im = gui.frm_main.im,
			s = im && im._status(),
			bStatus = im && im._getStatusText() || e && (e.type == 'contextmenu' || e.type == 'click' && e.shiftKey);

		if (bStatus)
			aMenu.push({anchor:'input',keep:true},{title:'-'});

		var nodes = [];
		if (s!='online')
			nodes.push({title:'STATUS::ONLINE', arg:[this,'__im',['online']], css:'ico im online'});

		if (s!='away' && GWOthers.getItem('IM', 'status_away')>0)
			nodes.push({title:'STATUS::AWAY', arg:[this,'__im',['away']], css:'ico im away'});

		if (s!='xa' && GWOthers.getItem('IM', 'status_xa')>0)
			nodes.push({title:'STATUS::XA', arg:[this,'__im',['xa']], css:'ico im xa'});

		if (s!='dnd' && GWOthers.getItem('IM', 'status_dnd')>0)
			nodes.push({title:'STATUS::DND', arg:[this,'__im',['dnd']], css:'ico im dnd'});

		// if (s!='invisible' && GWOthers.getItem('IM', 'status_invisible')>0)
		// 	nodes.push({title:'STATUS::INVISIBLE', arg:[this,'__im',['invisible']], css:'ico im invisible'});

		if (s!='offline' && GWOthers.getItem('IM', 'status_offline')>0)
			nodes.push({title:'STATUS::OFFLINE', arg:[this,'__im',['offline']], css:'ico im offline'});

		aMenu.push(
			{title:'STATUS::'+ s.toUpperCase(), css:'ico im '+ s, nodes:nodes},
			{title:'-'}
		);
	}


	if (!sPrimaryAccountGUEST)
		switch (sPrimaryAccountType) {
			case 'admin':
				aMenu.push({"title": 'MAIN_MENU::ADMIN_OPTIONS',"arg": [gui,'_create',['settings', 'frm_settings_admin']], "css":'ico asettings'});
				break;
			case 'domainadmin':
				aMenu.push({"title": 'MAIN_MENU::DOMAIN_OPTIONS',"arg": [gui,'_create',['settings', 'frm_settings_admin','','',true]], "css":'ico asettings'});
				break;
		}

	aMenu.push(
		{"title": 'MAIN_MENU::OPTIONS',"arg": [gui,'_create',['settings', 'frm_settings']], "css":'ico settings'}
	);

	aMenu.push({"title":'-'});

	if(!sPrimaryAccountGUEST && sPrimaryAccount2F && !sPrimaryAccount2FE) {
		aMenu.push({text:getLang('VERIFICATION::INACTIVE',['<span class="color1">'+ getLang('SETTINGS::DISABLED') +'</span>']) +'<span class="color2">'+ getLang('SETTINGS::SETUP_NOW') +'</span>', css:'ico two_factor', arg:[this,'__twoFactor']});
		// aMenu.push({title:'COMMON::ENABLE', arg:[this,'__twoFactor'], css:'ico'});
		aMenu.push({title:'-'});
	}

	if (sPrimaryAccountACTIVESYNC)
		aMenu.push({"title": 'MAIN_MENU::DEVICES',"arg": [gui,'_create',['devices', 'frm_devices']], "css":'ico devices'});

	aMenu.push({"title": 'MAIN_MENU::HELP',"arg": [function(){
		if (gui.help)
			gui.help._destruct();
		else
			gui._create('help', 'frm_help');
	}], "css":'ico help'});

	aMenu.push({title:'-'});

	if (!sPrimaryAccountGUEST){
		// Add option to switch to tablet interface for all users
		if ((GWOthers.getItem('LAYOUT_SETTINGS', 'interfaces') || '').indexOf('b')>-1)
			aMenu.push({"title": 'MAIN_MENU::BASIC', "css":'ico switch',"arg": [function(){

				// check for opened frm_compose
				if (GWOthers.getItem('LAYOUT_SETTINGS','confirm_exit') == 2)
					GWOthers.setItem('LAYOUT_SETTINGS','confirm_exit', 1);

				//to prevent red-bar in FFox
				//MSIE in secure mode may not allow that
				try{
					if (window.onbeforeunload)
						window.onbeforeunload({});
				}
				catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}

				document.location.replace(document.location.protocol +'//'+ document.location.hostname + (document.location.port?':'+document.location.port:'') + document.location.pathname + 'basic/?sid=' + dataSet.get('main', ['sid']));
			}]});

		// Add option to go to WebAdmin for admins
		if ((sPrimaryAccountType == 'admin' || sPrimaryAccountType == 'domainadmin') && sPrimaryAccountWebAdmin)
			aMenu.push({"title": 'MAIN_MENU::WEBADMIN', "css":'ico window',"arg": [function(){
				var win = window.open(sPrimaryAccountWebAdmin + '?sid=' + dataSet.get('main', ['sid']) + '&from=WebClient&language=' + (GWOthers.getItem('LAYOUT_SETTINGS', 'language') || 'en'), '_blank');
					win.focus();
			}]});

		// Add option to switch to old interface
		if (sPrimaryAccountOLDWC)
			aMenu.push({"title": 'MAIN_MENU::OLD_CLIENT', "css":'ico switch',"arg": [function(){

				// check for opened frm_compose
				if (GWOthers.getItem('LAYOUT_SETTINGS','confirm_exit') == 2)
					GWOthers.setItem('LAYOUT_SETTINGS','confirm_exit', 1);

				//to prevent red-bar in FFox
				//MSIE in secure mode may not allow that
				try{
					if (window.onbeforeunload)
						window.onbeforeunload({});
				}
				catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}

				document.location.replace(document.location.protocol +'//'+ document.location.hostname + (document.location.port?':'+document.location.port:'') + document.location.pathname + 'old/?sid=' + dataSet.get('main', ['sid']));
			}]});

		aMenu.push({title:'-'});
	}


	// Add log out option
	aMenu.push({
		title: 'MAIN_MENU::LOGOUT',
		arg: [function () {
			if (Cookie && !Cookie.store([gui.frm_main, '__logout']))
				gui.frm_main.__logout();
		}],
		css: 'ico logout color2'
	});

	//hack, render it itself + return false;
	this.__ePull.appendChild(this.__row(aMenu,id));

	if (bStatus){
		var stat = this._create('status', 'obj_input','input','noborder status_text');
			stat._placeholder(getLang('IM::STATUS_MSG'));
			stat._value(gui.frm_main.im._getStatusText());
			stat._onblur = function(){
				if (gui.frm_main.im._getStatusText() != this._value())
					gui.frm_main.im._status(gui.frm_main.im._status(),this._value());
			};
			stat._onclose = function(){
				this._value(gui.frm_main.im._getStatusText() || '');
			};
			stat._onsubmit = function(){
				this._onblur();
				this._onblur = null;
				this._parent.__close();
			};
	}

	if (this.__ePull.clientHeight > document.body.clientHeight)
		addcss(this.__ePull, 'scrollable');
	else
		removecss(this.__ePull, 'scrollable');

}catch(r){
	if (console)
		console.log('#Error', r);
}
};

_me.__submenuDestruct = function(){
	if (this.status)
		this.status._destruct();
};
_me.__update = function(sDName,aDPath){

	var elm = document.getElementById(this._pathName + '/' + (this.__aData.length-1)),
		sStatus = gui.frm_main.im._status();

	elm.setAttribute('state', sStatus);
	gui.tooltip._title(elm.parentNode, getLang('IM::IM')+' ‒ '+getLang('STATUS::'+sStatus.toUpperCase()));

	if (sStatus == 'offline')
		gui.frm_main.im._dock(true);
	else
	if (!Is.Defined(gui.frm_main.__rightDock))
		gui.frm_main.im._undock(true);
};
