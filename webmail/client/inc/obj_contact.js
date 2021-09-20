_me = obj_contact.prototype;
function obj_contact(){};

_me.__constructor = function(v) {
	this._fullname = false;
	this._imonly = false;

	var me = this;
	this._main.onclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (elm.tagName == 'A'){

			var rel = elm.getAttribute('rel');
			if (rel){
				var aMail = MailAddress.splitEmailsAndNames(rel);
				if (aMail && aMail.length){
					var pos = getSize(elm),
						cmenu = gui._create('cmenu','obj_context_link','','',aMail[0].name,aMail[0].email,'',{nomail:me._imonly, noadd:true});
						cmenu._place(pos.x+(pos.w/2),pos.y+pos.h,'',2);
				}

				if (e.preventDefault) e.preventDefault();
				e.cancelBubble=true;
				return false;
			}
		}

	};

	this._listen('xmpp');

	if (v)
		this._value(v);
};

_me._fill = function(emails){
	var	out = '',stat,
		bIM = gui.frm_main && gui.frm_main.im && gui.frm_main.im._is_active();

	for(var i in emails)
		out += '<a class="'+ (emails[i].email?'address':'')+ (bIM && (stat = gui.frm_main.im._inRoster(emails[i].email))?' im_'+stat.escapeXML(true):'') +(emails[i].email == sPrimaryAccount?' primary':'')+'"'+ (emails[i].email?' rel="'+ MailAddress.createEmail(emails[i].name,emails[i].email).escapeXML(true) +'" title="'+ getLang('ITEMVIEW::MESSAGE_TO',[emails[i].email.escapeXML(true)]) +'"':'') + '>'+ (this._full?MailAddress.createEmail(emails[i].name,emails[i].email, true):(emails[i].name || emails[i].email)).escapeXML() +'</a>';

	this._main.innerHTML = out;
};

_me._value = function(v){
	if (Is.String(v))
		v = MailAddress.splitEmailsAndNames(v.unescapeXML());

	if (Is.Array(v))
		this._fill(v);
};

_me.__update = function(sName,aPath){

	//header links update
	if (sName == 'xmpp'){

		var tmp,
			links = this._main.getElementsByTagName('A');

		// one user
		if (aPath && aPath[0] == 'roster' && aPath[1] && aPath[2] == 'show'){
			for(var i = links.length-1; i>-1; i--)
				if (links[i].rel && (tmp = MailAddress.splitEmailsAndNames(links[i].rel)) && (tmp = tmp[0]))
					if (tmp.email.toLowerCase() == aPath[1])
						links[i].className = 'address im_' + gui.frm_main.im._inRoster(aPath[1]);
		}
		// IM goes offline
		else
		if (!gui.frm_main.im._is_active())
			for(var i = links.length-1; i>-1; i--)
				if (links[i].rel && hascss(links[i],'address'))
					links[i].className = 'address';
	}
};