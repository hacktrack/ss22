/**
 * @Note:
 * This object is strictly determined for use inside obj_barmenu together with obj_tree_folder in frm_main form
 * Uses Drag and Drop avaliable as obj. bellow frm_main!
 *
 * @Date: 10.7.2008 11:16:44
 **/

_me = obj_barmenu_favorites.prototype;
function obj_barmenu_favorites(){};

_me.__constructor = function(){
	var me = this;

	this.__maxcount = 10; //max number of items

    this.__aData = [];
	this.__body = this._getAnchor('main');
	this.__norefresh = 0;


	//CLICK ON FOLDER
	this.__body.onclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (elm.tagName == 'SPAN')
			elm = elm.parentNode;

		if (elm.tagName == 'DIV' && elm.id){

			if (hascss(elm,'active')){
				var pos = getSize(elm),
					show_context_menu = false,
					clientX = pos.x;

				if (gui._rtl) {
					show_context_menu = e.clientX - pos.x < 30;
				} else {
					show_context_menu = pos.x+pos.w-e.clientX < 30;
					clientX += pos.w;
				}

				if (show_context_menu){
					this.oncontextmenu({
						target: elm,
						clientX: clientX,
						clientY: pos.y + (pos.h / 2)
					});

					e.cancelBubble = true;
					if (e.stopPropagation) e.stopPropagation();
					return false;
				}
			}

			var arg,
				id = elm.id.substr(me._pathName.length+1);

			if (!me.__aData[id] || !(arg = me.__aData[id].arg)) return;

			//Naposledy otevřený folder
			var aFolder = dataSet.get('active_folder');

			gui.__exeEvent('folderSelected', Object.assign({ftype:WMFolders.getType(arg)},arg));

			//Neotvíráme již otevřený folder?
			if (aFolder != arg['aid']+'/'+arg['fid'] && dataSet.get('folders',[arg.aid,arg.fid])){
				//change view with no tree openning has to be done manually
				if (gui.frm_main.bar.tree.slide && gui.frm_main.bar.tree.slide[1] && gui.frm_main.bar.tree.slide[1].folders){
					gui.frm_main._selectView(arg, '', false, '', false, '', true);
					gui.frm_main.bar.tree.slide[1].folders._setActive(arg['aid']+'/'+arg['fid'], true);
					me._fill();
				}
				//change view
				else
					gui.frm_main._selectView(arg);
			}
		}
	};

	this.__body.oncontextmenu = function (e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (elm.tagName == 'SPAN')
			elm = elm.parentNode;

		if (elm.tagName == 'DIV' && elm.id){
			var id = elm.id.substr(me._pathName.length+1),
			    arg = me.__aData[id].arg,
				sFolType = WMFolders.getType(arg),
				aRights = WMFolders.getRights(arg);

			var aMenu = [
				{'title':'FAVORITES::RENAME','arg':{aid:arg.aid,fid:arg.fid},'handler':[me,'__rename'], css:'ico2 edit_folder'},
				{'title':'FAVORITES::REMOVE','arg':{aid:arg.aid,fid:arg.fid},'handler':[me,'__remove'], css:'ico2 remove_folder'}
				];

            if (sFolType == 'M'){

				var ds = dataSet.get('folders',[arg['aid'],arg['fid']]);

				aMenu.push({'title':'-'});

				if (ds.RSS){
					aMenu.push(
						{'title':'POPUP_FOLDERS::CHANGE_CHANNEL','arg':{'aid':arg['aid'],'fid':arg['fid'],'ftype':'R','method':'change_channel'}, 'disabled':!aRights.modify, css:'ico2 manage_rss'},
						{'title':'-'}
					);
				}

				aMenu.push({'title':'MAIN_MENU::EMPTY_FOLDER','arg':{'aid':arg['aid'],'fid':arg['fid'],'method':'empty_folder'}, 'disabled':!WMFolders.getAccess(arg, 'remove'), 'css':'color2 ico2 empty_folder'});
			}

			var cmenu = gui._create("cmenu","obj_context_folder",'','',me);
				cmenu._fill(aMenu);
				cmenu._place(e.clientX,e.clientY);

		}

		return false;
	};

	//Add destructor
	this._add_destructor('__disobey_ds');

	//Obey DataSets
	this._listen('cookies',['favorites']);

	if (typeof dataSet.get('cookies',['favorites']) == 'undefined'){
		var s,
			aData = [{title:getLang('COMMON_FOLDERS::INBOX'),arg:{aid:sPrimaryAccount,fid:'INBOX'}}],
			dgw = GWOthers.getItem('RESTRICTIONS', 'disable_gw_types') || '';

		if (dgw.indexOf('c')<0 && (s = GWOthers.getItem('DEFAULT_FOLDERS','CONTACTS')))
			aData.push({title:s.substring(s.lastIndexOf('/')+1),arg:{aid:sPrimaryAccount,fid:s.substring(sPrimaryAccount.length+1)}})
		if (dgw.indexOf('e')<0 && (s = GWOthers.getItem('DEFAULT_FOLDERS','EVENTS')))
			aData.push({title:s.substring(s.lastIndexOf('/')+1),arg:{aid:sPrimaryAccount,fid:s.substring(sPrimaryAccount.length+1)}})
		if (dgw.indexOf('t')<0 && (s = GWOthers.getItem('DEFAULT_FOLDERS','TASKS')))
			aData.push({title:s.substring(s.lastIndexOf('/')+1),arg:{aid:sPrimaryAccount,fid:s.substring(sPrimaryAccount.length+1)}})

        dataSet.add('cookies',['favorites'],aData);
		this._open(true);
	}

	dataSet.obey(this,'_listener1','folders',true);
	dataSet.obey(this,'_listener2','active_folder',true);

	//**** Drag and Drop ****
	this.__dndtimer = '';
	this.___lastdragover;
	this.__body.onmousedown = function(e){

		if (me.__dndtimer)
			window.clearTimeout(me.__dndtimer);

		var e = e || window.event;
		if (e.button>1) return;
		var elm = e.target || e.srcElement;

		if (elm.tagName == 'SPAN')
		    elm = elm.parentNode;

		if (elm == this || elm.tagName!='DIV' || !elm.id) return;

		//fire the event :)
		var id = elm.id.substring(me._pathName.length+1),
			x = e.clientX,
			y = e.clientY;
		me.__dndtimer = setTimeout(function(){
			me.__initdrag(id,x,y);
		},500);
	};


	this.__body.onmouseup = function(e){
        //stop DnD
		if (me.__dndtimer)
			window.clearTimeout(me.__dndtimer);
	};

	//Registr "folder" drop
	if (gui.frm_main && gui.frm_main.dnd)
		gui.frm_main.dnd.registr_drop(this,['folder','favorite','virtual_folder','item']);
};

_me.__remove = function(x0,x1,x2,arg){
	var aData = dataSet.get(this._listener,this._listenerPath);
	for(var i=0; i<aData.length; i++)
		if (aData[i].arg && aData[i].arg.aid == arg.aid && aData[i].arg.fid == arg.fid){
			aData.splice(i,1);
			dataSet.add(this._listener,this._listenerPath,aData,true);
			dataSet.update(this._listener,this._listenerPath);
			break;
		}
};

_me.__rename = function(x0,x1,x2,arg){

	var id;
	for(var i in this.__aData)
	    if (arg.aid == this.__aData[i].arg.aid && arg.fid == this.__aData[i].arg.fid){
			id = i;
			break;
		}

	if (typeof id != 'undefined'){
		var me = this,elm;

		//Add anchor
		this._anchors.edit = this._pathName+"/"+id;
		if ((elm = this._getAnchor('edit'))){
			elm.innerHTML = '';
			addcss(elm,'edit');
		}
		else
		 	return;

        this.__norefresh = 1;

		//Create Input
		this._create('edit','obj_input','edit','obj_input_100');
		this.edit._value(this.__aData[id].title);
		this.edit._onsubmit = function (){
            me.__aData = dataSet.get(me._listener,me._listenerPath);
			var id = null;

			for(var i in me.__aData)
			    if (arg.aid == me.__aData[i].arg.aid && arg.fid == me.__aData[i].arg.fid){
					id = i;
					break;
				}

			if (id !== null){
                me.__aData[i].title = this._value();
				dataSet.add(me._listener,me._listenerPath,me.__aData,true);
			}

			this._destruct();
			me._anchors.edit = '';
			me.__norefresh = 0;

			dataSet.update(me._listener,me._listenerPath);
		};
		this.edit._onblur = function (){
			this._destruct();
			me._anchors.edit = '';
			me.__norefresh = 0;
			me.__update(me._listener,me._listenerPath);
		};
        this.edit._onclose = this.edit._onblur;
		this.edit._focus(true);
	}
};

_me.__disobey_ds = function(){
	dataSet.disobey(this,'_listener1','folders');
	dataSet.disobey(this,'_listener2','active_folder');
};

/**
 * aData = [{title:'Inbox',arg:{aid:'admin@merakdemo.com',fid:'INBOX'}}]
 **/
_me._fill = function(aData){

	// check data
	if (aData) this.__aData = aData;
	if (!Is.Array(this.__aData)) return;

	// get datasets
	var tmp1 = dataSet.get('folders'),
		tmp2 = dataSet.get('active_folder'),
		str  = '',
		sType,
		bOk  = true,
		aDFolders = GWOthers.get('DEFAULT_FOLDERS','storage')['VALUES'],
		sSpamFolder = dataSet.get('main',['spam_path']),
		sArchivePath = dataSet.get('main',['archive_path']),
		sFid;

	for (var i=0;i<this.__aData.length;i++){

		//check if folder exists in "folders" dataset
		if (!this.__aData[i] || !this.__aData[i].arg || !tmp1[this.__aData[i].arg.aid] || !tmp1[this.__aData[i].arg.aid][this.__aData[i].arg.fid]){
		    this.__aData.splice(i,1);
		    i--;
		    bOk = false;
		}
		else{
            sType = WMFolders.getType(this.__aData[i].arg);

			if (sType == 'M'){

				//Archive Icons
				if (sArchivePath && (this.__aData[i].arg.aid+'/'+this.__aData[i].arg.fid).indexOf(sArchivePath+'/')==0)
                    sFid = (this.__aData[i].arg.aid+'/'+this.__aData[i].arg.fid).replace(sArchivePath+'/','');
				else
					sFid = this.__aData[i].arg.fid;

	            switch(this.__aData[i].arg.aid+'/'+sFid){
					case (sPrimaryAccount+'/INBOX') : sType = 'inbox'; break;
					case aDFolders.trash: sType = 'trash'; break;
					case aDFolders.sent: sType = 'sent'; break;
					case aDFolders.drafts: sType = 'drafts'; break;
					case sSpamFolder: sType = 'spam'; break;
					default:
						if (sPrimaryAccount == this.__aData[i].arg.aid && dataSet.get('folders',[this.__aData[i].arg.aid,this.__aData[i].arg.fid,'RSS']))
                            sType = 'R';
				}
			}
			else
			if (sType == 'QL' && this.__aData[i].arg.aid == sPrimaryAccount){
				if (this.__aData[i].arg.fid == 'SPAM_QUEUE/Blacklist')
					sType = 'black';
				else
				if (this.__aData[i].arg.fid == 'SPAM_QUEUE/Whitelist')
					sType = 'white';
			}

			str += '<div id="'+this._pathName +'/'+ i +'" title="'+(this.__aData[i].arg.aid+'/'+this.__aData[i].arg.fid).escapeHTML().replace(/"/g, '&quot;') +'" class="folder_'+sType+(tmp2 == this.__aData[i].arg.aid+'/'+this.__aData[i].arg.fid?' active':'')+(tmp1[this.__aData[i].arg.aid][this.__aData[i].arg.fid].RECENT>0?' recent':'')+'">'+ this.__aData[i].title + ' '+ (tmp1[this.__aData[i].arg.aid][this.__aData[i].arg.fid].RECENT>0?'<span>'+tmp1[this.__aData[i].arg.aid][this.__aData[i].arg.fid].RECENT+'</span>':'') +'</div>';
		}
	}

	this.__body.innerHTML = str;

	if (str)
		this._size((this.__aData.length*this._item_height) + 10);
	else
		this._size(0);

	//Save change to "favorites" dataset
	if (!bOk)
		dataSet.add(this._listener,this._listenerPath,this.__aData,'',this._pathName);
};

_me.__update = function (sName,sDPath){

	//refresh is prohibited during drag state
	if (this.__norefresh){
		this.__norefresh++;
		return;
	}

	if (this._listener == sName)
		this._fill(dataSet.get(this._listener,this._listenerPath));
	else
		this._fill();
};

//*** Drag and Drop - Create ***
_me.__initdrag = function(id,x,y){
	if (this.__aData[id])
		gui.frm_main.dnd.create_drag('<div class="drag_folder drag_folder_'+WMFolders.getType(this.__aData[id].arg)+'">'+this.__aData[id].title+'</div>', {type:'favorite',value:[this.__aData[id].arg]}, x, y);
};

//*** Drag and Drop - Catch ***
_me._active_dropzone = function(v){
	if (v)
		this.__norefresh = 1;
	else{
		this._ondragout();
		if (this.__norefresh>1){
		    this.__norefresh = 0;
		    this.__update(this._listener,this._listenerPath);
		}
		else
			this.__norefresh = 0;
	}
};


_me._ondragover = function(v){

 	if ((v.type == 'folder' || v.type == 'virtual_folder') && this.__aData.length>=this.__maxcount) return false;

    var iScroll = this.__body.scrollTop,
		aElm = this.__body.getElementsByTagName('DIV'),
		size,tmp = '';

	for(var i = 0; i<aElm.length; i++){
		size = getSize(aElm[i]);

        if (v.y>=size.y-iScroll && v.y<=size.y+this._item_height-iScroll){

			tmp = (v.y - size.y) > (this._item_height/2)?'b':'t';

			if (this.___lastdragover && (this.___lastdragover != aElm[i] || this.___lastdragpos != tmp)){
				removecss(this.___lastdragover,v.type == 'item'?'dragover_active':'dragover_'+this.___lastdragpos);
				this.___lastdragpos = this.___lastdragover = null;
			}

			if (v.type == 'item'){
				var id = aElm[i].id.substring(this._pathName.length+1),
					fav_type = WMFolders.getType(this.__aData[id].arg);

				//check if exists, if not the same Folder
				if (!this.__aData[id] || (this.__aData[id].arg.aid == v.value[0].aid && this.__aData[id].arg.fid == v.value[0].fid) || ((fav_type == 'M' || fav_type == 'QL') && WMFolders.getType(v.value[0]) != 'M'))
                    return false;
			}

			if (!this.___lastdragpos){

				if (tmp == 'b' && aElm.length-1>i){
					this.___lastdragover = aElm[i+1];
					this.___lastdragpos = 't';
				}
				else{
					this.___lastdragover = aElm[i];
					this.___lastdragpos = tmp;
				}

				addcss(this.___lastdragover, v.type == 'item'?'dragover_active':'dragover_' + this.___lastdragpos);
			}

			return true;
		}
	}

	// DRAG over Title
	if (v.type != 'item'){
		if (tmp === '' && aElm[0]){
			size = getSize(aElm[0]);
		    if (v.y<size.y+iScroll){
		     	if (this.___lastdragover){
					if (this.___lastdragover != aElm[0] || this.___lastdragpos != 't'){
						removecss(this.___lastdragover,'dragover_'+this.___lastdragpos);

			        	this.___lastdragover = aElm[0];
			        	this.___lastdragpos = 't';
			        	addcss(aElm[0],'dragover_t');
					}
				}
				else{
		        	this.___lastdragover = aElm[0];
		        	this.___lastdragpos = 't';
		        	addcss(aElm[0],'dragover_t');
				}
			}
		}
		return true;
	}
	else
	if (this.___lastdragover){
        removecss(this.___lastdragover,'dragover_active');
		this.___lastdragover = '';
		this.___lastdragpos = '';
	}

    return false;
};

_me._ondragout = function(){
	if (this.___lastdragover)
		removecss(this.___lastdragover,'dragover_'+this.___lastdragpos,'dragover_active');

	this.___lastdragover = null;
	this.___lastdragpos = null;
};

_me._ondrop = function(v){

	//item
	if (v.type == 'item'){
		if (this.___lastdragover){
			var id = this.___lastdragover.id.substr(this._pathName.length+1);
			if (this.__aData[id]){
				Item.__convertToFolder(this.__aData[id].arg.aid, this.__aData[id].arg.fid, v);
				return;
			}
		}
	}
	//folder, virtual
	else
	if (v.type == 'favorite' || ((v.type == 'folder' || v.type == 'virtual_folder') && this.__aData.length<this.__maxcount)){

	 	var tmp,src_id;
		for(var i = 0; i<this.__aData.length;i++)
			if (this.__aData[i].arg.aid == v.value[0].aid && this.__aData[i].arg.fid == v.value[0].fid)
				if (v.type == 'folder' || v.type == 'virtual_folder')
				    return
				else{
					src_id = i;
					break;
				}

		var aData = clone(this.__aData,1);
		tmp = {title:dataSet.get('folders',[v.value[0].aid, v.value[0].fid, 'NAME']) || Path.basename(v.value[0].fid),arg:v.value[0]};
		if (this.___lastdragover){
			var id = this.___lastdragover.id.substr(this._pathName.length+1);

			if (this.___lastdragpos == 'b')
			    id++;

			if (v.type == 'favorite'){
				tmp = aData.splice(src_id,1)[0];
				if (id>src_id)
				    id--;
				else
				if (id==src_id)
				    return;
			}

	        aData.splice(id,0,tmp);
		}
		else
		if (typeof src_id == 'undefined')
			aData.push(tmp);

		//only if successfull drop
		this.__norefresh = 0;
		dataSet.add(this._listener,this._listenerPath,aData);
	}
};