_me = obj_upload_list.prototype;
function obj_upload_list(){};

_me.__constructor = function(bDrop, sAttLabel,sDropLabel){

	//Context menu
	this.__hasRename = true;
	this.__hasRemove = true;
	this.__hasRemoveAll = true;
	this.__dropSupport = bDrop;

	this.__labels = [getLang(sAttLabel || 'ATTACHMENT::ATTACHMENTS'), getLang(sDropLabel || 'ATTACHMENT::DROP_HOLDER')];
	this.__idtable = [];

	var me = this,
		list = this._getAnchor('list');
	list.innerHTML = '<i>' + this.__labels[0] + '</i>';

	//Scrollbar
	this._scrollbar(list,list.parentNode);

	list.oncontextmenu = list.onclick = function (e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if(elm.tagName == 'INPUT')
			elm = elm.parentNode;

		if (elm.tagName == 'SPAN'){
			if (e.type == 'contextmenu' && me._oncontext)
				me._oncontext(e, elm.id.substr(me._pathName.length+1));
			else
			if (me._onclick)
				me._onclick(elm.id.substr(me._pathName.length+1));
		}
		else
		if (elm.tagName == 'B'){
			elm = elm.parentNode;
			me._remove(elm.id.substr(me._pathName.length+1));
		}
		return false;
	};
};

_me._add = function (aArg,id){

	//if (aArg.name)
	this.__idtable.push(aArg);

	if (!aArg.removed){
		var id = this.__idtable.length-1;

		//Add gui element
		var sName, ico = '', list = this._getAnchor('list');

		if (aArg.name && aArg.name.indexOf('.')>-1)
			ico = 'ico_' + Path.extension(aArg.name);

		//Remove "Drop Here" placeholder
		if (list.getElementsByTagName('I').length>0)
			list.innerHTML = '';

		if (aArg.name && aArg.name.length>32)
			sName = aArg.name.substr(0,24) +'..'+ Path.extension(aArg.name);
		else
			sName = aArg.name || '';

		if (sName && sName.escapeHTML) {
			sName = sName.escapeHTML();
		}

		var itm = mkElement('span', {
			href: "",
			title: aArg.name,
			innerHTML: sName + (Is.Defined(aArg.size)?' <br>' + parseFileSize(aArg.size || 0):'') + (this.__hasRemove?'<b></b>':''),
			className: (this.__hasRemove?'remove ':'') + ico,
			id: this._pathName+'/'+id
		});

		list.appendChild(itm);
		list.scrollLeft = (list.scrollWidth-list.offsetWidth);

		if (this._onchange)
			this._onchange();

		return true;
	}

	return false;
};

_me._remove = function (id){
	if (typeof id == 'undefined'){
	    for(var i in this.__idtable)
			this._remove(i);

		return;
	}
	else
	if (this.__idtable[id] && !this.__idtable[id].removed){
		this.__idtable[id].removed = true;

		var elm = document.getElementById(this._pathName+'/'+id);
		if (elm)
		    elm.parentNode.removeChild(elm);
	}

	//Add "Drop Here" placeholder
	if (this._getAnchor('list').getElementsByTagName('SPAN').length<1)
		this._getAnchor('list').innerHTML = '<i>'+ (this.__dropSupport?this.__labels[1]:this.__labels[0]) +'</i>';

	if (this._onchange)
		this._onchange();
};

_me._rename = function (id){
	if (this.__idtable[id] && !this.__idtable[id].removed){
		var elm = document.getElementById(this._pathName+'/'+id);
		if (elm){
			elm.innerHTML = '';
		    var me = this;
		    	inp = mkElement('input');
		    	inp.onkeydown = function(e){
		    		var e = e || window.event;
		    		switch(e.keyCode){
		    			case 27:
		    				this.value = me.__idtable[id].name;
		    			case 13:
					if (e.stopPropagation) e.stopPropagation();
					if (e.preventDefault) e.preventDefault();
					e.cancelBubble = true;

		    				this.onblur();
					return false;
				}
			};
			inp.oninput = function(e) {
				elm.title = this.value || '';
			};
			inp.onblur = function(){
				//Blur is removed to avoid double execution
				this.onblur = null;

				var sName = me.__idtable[id].name,
					v = this.value.trim(),
					ext = Path.extension(v);

				if(v.indexOf(".")===0)
					v = getLang('POPUP_ITEMS::NEW') + v;

				if (v && v != sName && Is.Filename(v)){
					//Name
					me.__idtable[id].description = sName = v;

					//css for icon and remove
					elm.className = (me.__hasRemove?'remove ':'') + (ext ? 'ico_'+ext : '');
				}

				//Content
				elm.title = sName;

				elm.innerHTML = (sName.length>32?sName.substr(0,24).escapeXML() +'..'+ ext:sName.escapeXML()) + (Is.Defined(me.__idtable[id].size)?' <br>'+parseFileSize(me.__idtable[id].size || 0):'') + (me.__hasRemove?'<b></b>':''); /*getLang('FILE::NEW_DOC')*/

				if (me._onchange)
					me._onchange();
			};

			inp.onclick = function(e){
				var e =  e || window.event;
				if (e.stopPropagation) e.stopPropagation();
				e.cancelBubble = true;
			};

			inp.value = me.__idtable[id].description || this.__idtable[id].name;

			elm.appendChild(inp);

			//Set focus
			try{
				var pos2 = inp.value.lastIndexOf('.');
				pos2 = pos2<0?0:pos2;

				// MSIE
				if (document.selection){
					var r = inp.createTextRange();
					r.collapse(true);
					r.moveStart("character", 0);
					if (pos2) r.moveEnd("character", pos2);
					r.select();
				}
				// OTHERS
				else
					inp.setSelectionRange(0, pos2);
			}
			catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
			inp.focus();
		}
	}
};

/**
 * PUBLIC
 **/
_me._value = function(v){
	if (typeof v == 'undefined'){
		var out = [];
		for (var i in this.__idtable)
			if (this.__idtable[i]['class'] == 'attachment' && !this.__idtable[i]['fullpath']){
				if (this.__idtable[i]['removed'])
				    out.push({uid:this.__idtable[i].id});
				else
				if (this.__idtable[i]['description'] && this.__idtable[i]['description']!=this.__idtable[i]['name'])
					out.push({
						'uid':this.__idtable[i].id,
						'values':{
							'description':this.__idtable[i]['description']
						}
					});
			}
			else
			if (!this.__idtable[i]['removed']){
				out.push({values:{'class':this.__idtable[i]['class'] || 'file',description: this.__idtable[i]['description'] || this.__idtable[i]['name'],size:this.__idtable[i]['size'],fullpath:this.__idtable[i]['fullpath'] || (Is.Defined(this.__idtable[i]['id'])?this.__idtable[i]['folder']+"/"+this.__idtable[i]['id']:'')}});
			}

		return out;
	}
	else
	if (v.values){

		for(var i in v.values)
			switch(v.values[i]['class']){
			case 'pdf':
			case 'thumbnail':
				break;
			default:
				this._add(v.values[i]);
			}

		if (this._onchange)
			this._onchange();
	}
};

_me._oncontext = function(e,id) {

	if (this.__disabled)
		return;

	// PREDELAT VOLANI FUNKCE
	var aMenu = [],
		name = this.__idtable[id].name || this.__idtable[id].attachement,
		ext = Path.extension(name);

	if (Item.imageSupport(name))
		aMenu.push({"title":'ATTACHMENT::SHOW_IMAGE', 'arg':[this,'_open',[id]]});
	else
	if (ext === 'mp3')
		aMenu.push({"title":'ATTACHMENT::PLAY_SOUND', 'arg':[this,'_open',[id]]});
	else
	if (Item.officeSupport(name) || 'pdf' === ext)
		aMenu.push({"title":'POPUP_ITEMS::OPEN', 'arg':[this,'_open',[id]]});

	aMenu.push({"title":'ATTACHMENT::DOWNLOAD', 'arg':[this,'_onclick',[id, true]]});

	if (this.__hasRename)
		aMenu.push({"title":'-'}, {"title":'FORM_BUTTONS::RENAME', 'arg':[this,'_rename',[id]]});

	if (this.__hasRemove){
		aMenu.push({"title":'-'}, {"title":'ATTACHMENT::REMOVE', css:'color2', 'arg':[this,'_remove',[id]]});
		if (this.__hasRemoveAll)
			aMenu.push({"title":'ATTACHMENT::REMOVE_ALL', css:'color2', 'arg':[this,'_remove',[]]});
	}

	var cmenu = gui._create("cmenu","obj_context",'','',this);
	cmenu._fill(aMenu);
	cmenu._place(e.clientX,e.clientY);
};

_me._open = function(id){

	var sClass = this.__idtable[id]['class'] || 'file',
		sFullPath = '';

	switch (sClass) {
	case 'file':
		sFullPath = this.__idtable[id]['folder'] +'/'+ this.__idtable[id]['id'];
		break;

	case 'item':
		sFullPath = this.__idtable[id]['fullpath'];
		if (this.__idtable[id].attachement){
			sFullPath += '/' + this.__idtable[id].attachement;
			sClass = 'attachment';
		}
		else{
			var aPath = Path.split(sFullPath);
			if (WMFolders.getType([aPath[0],Path.basedir(aPath[1])]) == 'F')
				sClass = 'file_attachment';
		}

		break;

	case 'attachment':
		sFullPath = this.__idtable[id]['fullpath'] || (this.__idtable[id]['folder']+'/'+this.__idtable[id]['id']);
		break;
	}

	var name = this.__idtable[id].name || this.__idtable[id].attachement,
		ext = Path.extension(name),
		url = 'server/download.php?' + buildURL({'sid': dataSet.get('main', ['sid']), 'class': sClass, 'fullpath': sFullPath});

	//Preview
	switch(ext){
	case "pdf":
		if (GWOthers.getItem('LAYOUT_SETTINGS','disable_pdf') == 1 || currentBrowser().match(/^MSIE([6-9]|10)$/))
			return downloadItem(url, true);

		gui._create('pdf','frm_pdf')._load(url, name);
		return true;

	case "mp3":
		if (gui.audio)
			gui.audio._value(url, name);
		return true;

	default:

		if (Item.imageSupport(name)){
			var img = gui._create('imgview','frm_imgview');
			img._fill([{title:name, url:url}]);
			img._value(0);
			return true;
		}
		else
		if (Item.officeSupport(name)){
			var sURL = document.location.origin + document.location.pathname + url;
			Item.officeOpen({EVNTITLE:name, url:sURL}, [this,'_onclick',[id, true]], Path.extension(name), 'view');
			return true;
		}
	}

	return false;
};

_me._onclick = function(id, bDownload) {

	if (bDownload || this._open(id) === false){

		var sClass = this.__idtable[id]['class'] || 'file',
			sFullPath = '';

		switch (sClass) {
		case 'file':
			sFullPath = this.__idtable[id]['folder']+'/'+this.__idtable[id]['id'];
			break;

		case 'message':
			sFullPath = this.__idtable[id]['fullpath'];
			break;

		case 'item':
			sFullPath = this.__idtable[id]['fullpath'];
			if (this.__idtable[id].attachement){
				sFullPath += '/' + this.__idtable[id].attachement;
				sClass = 'attachment';
			}
			else{
				var aPath = Path.split(sFullPath);
				if (WMFolders.getType([aPath[0],Path.basedir(aPath[1])]) == 'F')
					sClass = 'file_attachment';
			}
			break;

		case 'attachment':
			sFullPath = this.__idtable[id]['fullpath'] || (this.__idtable[id]['folder']+'/'+this.__idtable[id]['id']);
			break;
		}

		if (sFullPath) {
			var aUrl = {'sid': dataSet.get('main', ['sid']), 'class': sClass, 'fullpath': sFullPath};
			downloadItem(buildURL(aUrl));
		}
	}
};

_me._getName = function(id) {
	id = typeof id == 'undefined'?this.__idtable.length-1:id;
	return this.__idtable[id]?this.__idtable[id].name:'';
};
_me._getSize = function(id) {
	id = typeof id == 'undefined'?this.__idtable.length-1:id;
	return this.__idtable[id]?this.__idtable[id].size:0;
};
