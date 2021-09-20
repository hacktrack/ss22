_me = frm_print.prototype;
function frm_print(){};

_me.__constructor = function(){

	if (currentBrowser() == 'Opera'){
		gui.notifier._value({type: 'alert', args: {header: '', text: 'PRINT::OPERA'}});
		this._destruct();
		return;
	}

	this__template = new cTemplate();
	this__template.strict = false;

	var me = this;
	this._title('PRINT::PREVIEW');
	this._size(450,500,true);

	this._create("frame","obj_frame","main");

	this.__data	= {};
	this.__libs = 0;

	//onload=\"window.parent."+this._pathName+"._remove(this)\"
	var //bMSIE = currentBrowser().indexOf('MSIE')>-1,
		sHTML =	"<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">\n"+
				'<html lang="'+document.documentElement.lang+'">\n<head>\n'+
				//(bMSIE?'<link type="text/css" rel="stylesheet" href="client/skins/default/css/frm_print_all.css" /><link type="text/css" rel="stylesheet" href="client/skins/default/css/frm_print_print.css" media="print"/>':'')+
				'\n</head>\n<body></body>\n</html>';

	this.frame._write(sHTML);

	AttachEvent(this.frame.__doc, "onclick", function(e){

		var e = e || window.event,
			elm = e.srcElement || e.target;

		if (elm.tagName == 'SPAN' && elm.id && hascss(elm,'btnx')){
			var id = elm.id.substr(me._pathName.length+1).split('/');
			if (me.__data[id[0]])
				for(var i = me.__data[id[0]].length-1; i>=0; i--)
					if (me.__data[id[0]][i].id == id[1]){

						me.__data[id[0]].splice(i,1);
						me._fill(id[0]);

						break;
					}
		}

	});


	// Append Style Sheet (all browsers except MSIE)
	//if (!bMSIE){
		var link = mkElement('link','',this.frame.__doc);
		link.setAttribute("type","text/css");
		link.setAttribute("rel","stylesheet");
		link.setAttribute("href","client/skins/default/css/frm_print_all.css");
		link.onload = function(){me.__load()};
		this.frame.__doc.getElementsByTagName('head')[0].appendChild(link);

		link = mkElement('link','',this.frame.__doc);
		link.setAttribute("type","text/css");
		link.setAttribute("rel","stylesheet");
		link.setAttribute("media","print");
		link.setAttribute("href","client/skins/default/css/frm_print_print.css");
		link.onload = function(){me.__load()};
		this.frame.__doc.getElementsByTagName('head')[0].appendChild(link);

		link = null;
	//}

	// Create 'OK' button
	this._create('x_btn_ok', 'obj_button', 'footer','ok noborder color1');
	this.x_btn_ok._value('MAIN_MENU::PRINT');
	this.x_btn_ok._onclick = function() {
		me.frame._print();
	};

	// Create 'CANCEL' button
	this._create('x_btn_cancel', 'obj_button', 'footer', 'cancel noborder simple');
	this.x_btn_cancel._value('FORM_BUTTONS::CANCEL');
	this.x_btn_cancel._onclick = function() { me._destruct() };
};

_me._add = function (sType, aData){

	if (sType){

		this.__data[sType] = this.__data[sType] || [];

		// Save data
		if (Is.Array(aData)){
			if (aData.EVNNOTE)
				aData.EVNNOTE = mkElement('div',{innerHTML:aData.EVNNOTE}).innerHTML;
			else
			if (aData.NOTE_TEXT)
				aData.NOTE_TEXT = mkElement('div',{innerHTML:aData.NOTE_TEXT}).innerHTML;

			for(var i in aData){
				aData[i] = this.__parse(sType, aData[i]);
				this.__data[sType].push({id:unique_id(), data:aData[i], out:this__template.tmp('print_' + sType.toLowerCase(), aData[i])});
			}
		}
		else{
			if (aData.EVNNOTE)
				aData.EVNNOTE = mkElement('div',{innerHTML:aData.EVNNOTE}).innerHTML;
			else
			if (aData.NOTE_TEXT)
				aData.NOTE_TEXT = mkElement('div',{innerHTML:aData.NOTE_TEXT}).innerHTML;

			aData = this.__parse(sType, aData);
			this.__data[sType].push({id:unique_id(), data:aData, out:this__template.tmp('print_' + sType.toLowerCase(), aData)});
		}

		this._fill(sType);
	}
};

_me._fill = function(sType){

	if (sType){
		var elm = this.frame.__doc.getElementById(sType);

		if (Is.Empty(this.__data[sType])){
			if (elm)
				elm.parentNode.removeChild(elm);
			delete this.__data[sType];
			return;
		}

		var html = '';

		// Sort
		switch(sType){
		case 'C':
			this.__data[sType].sort(function(a,b){
				if (a.data.ITMSURNAME>b.data.ITMSURNAME)
					return 1;
				else
				if (a.data.ITMSURNAME<b.data.ITMSURNAME)
					return -1;
				else
				if (a.data.ITMCLASSIFYAS>b.data.ITMCLASSIFYAS)
					return 1;
				else
				if (a.data.ITMCLASSIFYAS<b.data.ITMCLASSIFYAS)
					return -1;
				else
					return 0;
			});

			var last, s;
			for (var i in this.__data[sType]){
				s = (this.__data[sType][i].data.ITMSURNAME || this.__data[sType][i].data.ITMCLASSIFYAS || '').trim().charAt(0).toUpperCase();

				html += '<div class="card">';

				if (last != s){
					last = s;
					html += '<div class="char">'+ (last || '...') +'</div>';
				}

				html += '<span class="btnx" id="'+this._pathName+'/'+sType+'/'+this.__data[sType][i].id+'"></span>' + this.__data[sType][i].out + '</div>';

			}

			break;

		default:
				// Refresh
			for (var i in this.__data[sType])
				html += '<div class="card"><span class="btnx" id="'+this._pathName+'/'+sType+'/'+this.__data[sType][i].id+'"></span>' + this.__data[sType][i].out + '</div>';
		}

		if (!elm){
			elm = mkElement('div', {id:sType}, this.frame.__doc);
			this.frame.__doc.body.appendChild(elm);
		}

		elm.innerHTML = html;
	}

	this._focus();
};

_me.__parse = function(sType,aData){
	switch (sType) {
	case 'T':
		if (aData.EVNENDDATE) {
			aData.evnenddate = IcewarpDate.julian(aData.EVNENDDATE).format('L');
		}
		if (aData.EVNSTARTDATE) {
			aData.evnstartdate = IcewarpDate.julian(aData.EVNSTARTDATE).format('L');
		}
		if (aData.EVNSTATUS) {
			aData.evnstatus = getLang({I: 'TASK::IN_PROGRESS', N: 'TASK::WAITING', B: 'TASK::NOT_STARTED', M: 'TASK::COMPLETED', Q: 'TASK::DEFERRED'}[aData.EVNSTATUS]);
			switch (aData.EVNSTATUS) {
			case 'I':
			case 'Q':
			case 'N':
				if (aData.EVNCOMPLETE * 1 > 0) {
					aData.evncomplete = (aData.EVNCOMPLETE * 1) + '%';
				}
			}
		}
		break;

	case 'C':
		if (aData.ITMBDATE){
			if (+aData.ITMBDATE)
				aData.ITMBDATE = IcewarpDate.julian(aData.ITMBDATE).format('L');
			else
				delete aData.ITMBDATE;
		}

		if (aData.ITMGENDER){
			switch(aData.ITMGENDER){
				case '1':
					aData.ITMGENDER = getLang('CONTACT::MALE');
					break;
				case '2':
					aData.ITMGENDER = getLang('CONTACT::FEMALE');
					break;
				default:
					delete aData.ITMGENDER;
			}
		}
	}
	return aData;
};
_me.__load = function(){
	this.__libs++;
	if (this.__libs == 2 && GWOthers.getItem('LAYOUT_SETTINGS', 'night_mode') == 1) {
		storage.library('night_mode');
		NightMode(this.frame.__eFrame.contentWindow).activate();
	}
};
