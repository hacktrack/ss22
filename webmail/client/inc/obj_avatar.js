_me = obj_avatar.prototype;
function obj_avatar(){};

_me.__constructor = function(v){

	this._imonly = false; //show only IM contextmenu
	this.__value = {};

	this.__elm = mkElement('div');
	this._main.appendChild(this.__elm);

	var me = this;
	this.__elm.onclick = function (e){
		var e = e || window.event;

		me._menu();

		if (e.preventDefault) e.preventDefault();
		e.cancelBubble=true;
		return false;
	};

	this._listen('xmpp');

	if (v)
		this._value(v);
};

_me._menu = function(){
	if (this.__value.email || this.__value.distributionList){
		var name = this.__value.name;
		var email = this.__value.email;
		if(!this.__value.name && !~this.__value.email.indexOf('@')) {
			name = this.__value.email;
			email = '';
		}

		var pos = getSize(this.__elm),
			cmenu = gui._create('cmenu','obj_context_link','','',name,email,'',{nomail:this._imonly, noadd:true, distibutionList: this.__value.distributionList}, false, this._specificIds);
			cmenu._place(pos.x+(pos.w/2),pos.y+pos.h,'',2);
	}
};

_me.__specifyIds = function(v){
	this._specificIds = v;
};

_me._value = function(v){
	var contactId = false;
	if(Array.isArray(v)) {
		contactId = v.pop();
		v = v[0];
	}
	if (Is.Defined(v)){
		this.__value = MailAddress.splitEmailsAndNames(v)[0];

		if (contactId) {
			if (gui.frm_main && gui.frm_main.im && gui.frm_main.im._is_active()){
				var stat = gui.frm_main.im._inRoster(this.__value.email) || '';
				if (stat)
					this.__elm.className = 'status im_' + stat.escapeXML(true);
			}
			return this.__elm.style.backgroundImage = 'url("' + getContactAvatarURL(contactId) + '")';
		}

		if (this.__value.email){
			this.__elm.style.backgroundImage = 'url("'+getAvatarURL(this.__value.email) +'")';

			//IM
			if (gui.frm_main && gui.frm_main.im && gui.frm_main.im._is_active()){
				var stat = gui.frm_main.im._inRoster(this.__value.email) || '';
				if (stat)
					this.__elm.className = 'status im_' + stat.escapeXML(true);
			}
		}
		else{
			this.__elm.style.backgroundImage = '';
			this.__elm.className = '';
		}
		if(v.indexOf('@') === -1) {
			this.__value.email = v;
			this.__value.distributionList = true;
			this.__value.name = v;
		}
	}
};

_me.__update = function(sName,aPath){
	//header links update
	if (sName == 'xmpp' && this.__value.email && gui.frm_main.im){

		// one user
		if (aPath && aPath[0] == 'roster' && aPath[1] && aPath[1] == this.__value.email && aPath[2] == 'show')
			this.__elm.className = 'status im_' + gui.frm_main.im._inRoster(this.__value.email).escapeXML(true);
		// IM goes offline
		else
		if (!gui.frm_main.im._is_active())
			this.__elm.className = '';
	}
};
