function obj_link(){};

obj_link.prototype = {

	__constructor: function(sEmails, bFull){

		this._fill(sEmails, bFull);

		//Actions
		this._main.onclick = function(e){
			var e = e || window.event,
				elm = e.target || e.srcElement;

			if (elm.tagName == 'A'){

				//Click on TAG
				if (elm.rel){

					var aMail = MailAddress.splitEmailsAndNames(elm.rel);
					if (aMail && aMail[0]){

						addcss(elm, 'selected');

						var pos = getSize(elm),
							cmenu = gui._create('cmenu','obj_context_link','','',aMail[0].name,aMail[0].email);
							cmenu._place(pos.x+(pos.w/2),pos.y+pos.h,'',2);
							cmenu.__remove_class = function() {
								elm && removecss(elm,'selected');
							};
							cmenu._add_destructor('__remove_class');
					}

					if (e.preventDefault) e.preventDefault();
					e.cancelBubble=true;
					return false;
				}
			}
		};

		this._main.oncontextmenu = function(e){
			var e = e || window.event;
			this.onclick(e);
		};

		//listen to IM
		if (window.sPrimaryAccountIM && (GWOthers.getItem('RESTRICTIONS', 'disable_im') || 0)<1)
			dataSet.obey(this,'_listener_data','xmpp',true);
	},

	_fill: function(sEmails, bFull){
		if (sEmails){
			var out = gui._rtl ? '<bdi>' : '', stat,
				emails = MailAddress.splitEmailsAndNames(sEmails.unescapeXML()),
				bIM = gui.frm_main && gui.frm_main.im && gui.frm_main.im._is_active();

			for(var i in emails)
				out += '<a class="address'+ (bIM && (stat = gui.frm_main.im._inRoster(emails[i].email))?' im_'+stat.escapeXML(true):'') +(emails[i].email == sPrimaryAccount?' primary':'')+'" rel="'+ MailAddress.createEmail(emails[i].name,emails[i].email).escapeXML(true) +'" title="'+ getLang('ITEMVIEW::MESSAGE_TO',[emails[i].email.escapeXML(true)]) +'">'+ (bFull?MailAddress.createEmail(emails[i].name,emails[i].email, true):(emails[i].name || emails[i].email)).escapeXML() +'</a> ';

			this._main.innerHTML = gui._rtl ? out + '</bdi>' : out;
		}
	},

	__update: function(sName,aPath){

		//header links update
		if (sName == 'xmpp'){

			var tmp,
				links = this._main.getElementsByTagName('A');

			// one user
			if (aPath && aPath[0] == 'roster' && aPath[1] && aPath[2] == 'show'){
				for(var i = links.length-1; i>-1; i--)
					if (links[i].rel && (tmp = MailAddress.splitEmailsAndNames(links[i].rel)) && (tmp = tmp[0]))
						if (tmp.email.toLowerCase() == aPath[1])
							links[i].className = 'address im_' + gui.frm_main.im._inRoster(aPath[1]) + (hascss(links[i], 'primary')?' primary':'');
			}
			// IM goes offline
			else
			if (!gui.frm_main.im._is_active())
				for(var i = links.length-1; i>-1; i--)
					if (links[i].rel && hascss(links[i],'address'))
						links[i].className = 'address' + (hascss(links[i], 'primary')?' primary':'');
		}
	}
};