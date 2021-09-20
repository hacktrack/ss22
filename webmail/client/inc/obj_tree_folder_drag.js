_me = obj_tree_folder_drag.prototype;
function obj_tree_folder_drag(){};

_me.__constructor = function()
{
	//Drag and Drop
	this._main.onmousedown = function(e){

		if (this.__dndtimer){
			window.clearTimeout(this.__dndtimer);
			delete this.__dndtimer;
		}

		//Edit mode
		if (this.rename) return;

		var e = e || window.event;
		if (e.button>1 || e.ctrlKey || !this.__initdrag) return;
		var elm = e.target || e.srcElement;

		if (elm == this._main) return;
		if (elm.tagName != 'LI')
			elm = Is.Child(elm,'LI');

		if (!elm || !elm.id) return;

		var id = Path.split(this._getRealId(this._parseElmId(elm.id)), true);

		//Account
		if (!id.fid.length) return true;

		var	sType = WMFolders.getType(id),
			sDragType = 'folder';

		//Forbidden folders
		if (!sType || sType == 'A' || sType == 'X')
			return true;
		else
		if (id.aid == sPrimaryAccount && id.fid.indexOf('__@@VIRTUAL@@__/') == 0)
			sDragType = 'virtual_folder';

		//fire the event :)
		var x = e.clientX, y = e.clientY;

		gui._obeyEvent('mouseup',[this,'__dndDispatch']);
		this.__dndtimer = setTimeout(function(){
			this.__initdrag([id],sType,x,y,sDragType);
		}.bind(this),500);

		if (e.stopPropagation) e.stopPropagation();
		e.cancelBubble = true;

	}.bind(this);

	//Registr Drop
	this.___lastdragover = '';
	if (gui.frm_main && gui.frm_main.dnd){
		gui.frm_main.dnd.registr_drop(this,['item','folder']);
	}
};

_me.__dndDispatch = function(){
	if (this.__dndtimer){
		window.clearTimeout(this.__dndtimer);
		delete this.__dndtimer;
	}
	return false; // for _disobeyEvent
};

_me.__initdrag = function(id,sType,x,y,sDragType){
	//disable drag if rename state
	if (!sDragType || this.rename)
		return false;

	//prepare data
	var path = id[0],
		ds = dataSet.get('folders',[path.aid,path.fid]);

	if (!ds)
		return false;

	var sBody = mkElement('div', {
			className: 'drag_folder drag_folder_' + sType,
			text: (ds.NAME || Path.basename(path.fid))
		}).outerHTML;

	//create Drag box
	gui.frm_main.dnd.create_drag(sBody, {
		type: sDragType || 'folder',
		value: id
	}, x, y);
};

_me._active_dropzone = function(v){

	this.__aDragFolders = [];
	var me = this;

	if(v){

		//Opened Nodes & Opened Nodes by Search
		var tmp = arrUnique([].concat(this._value(), this.__filter && this.__filterOpen?this.__filterOpen:[])),
			val = {};
		for (var i = 0, j = tmp.length;i<j;i++)
			val[tmp[i]] = 1;

		switch(v['type']){
		case 'item':

			var sType = WMFolders.getType(v.value[0]);

			var getTargets = function (data, out){
				out = out || [];
				if (typeof data != 'object') return out;

				var i, sPath, bActive;
				for(i in data){
					if (data.hasOwnProperty(i)){

						if (data[i].arg.aid){
							bActive = false;
							sPath = data[i].arg.aid + (data[i].arg.fid?'/'+data[i].arg.fid:''),
							treeId = me._getTreeId(sPath);

							if (data[i].arg.fid && !data[i].arg.disabled && (data[i].arg.aid != v.value[0].aid || data[i].arg.fid != v.value[0].fid)){
								if ((sType == 'M' || sType == 'P') && data[i].arg.ftype == 'QL')
									bActive = true;
								else
								if ((sType == 'M' || sType == 'P' || data[i].arg.ftype != 'M') && WMFolders.getAccess(data[i].arg,'write'))
									bActive = true;
							}

							out.push([treeId, bActive]);
						}

						if (data[i].nodes && val[sPath])
							getTargets(data[i].nodes, out);
					}
				}
				return out;
			};

			this.__aDragFolders = getTargets((this.__aFillData[v.value[0].aid] || (this.__aFillData.other || {}).nodes[v.value[0].aid]).nodes);
			break;

		case 'folder':

			var sType = WMFolders.getType(v.value[0]);

			if (!this.__aFillData[v.value[0].aid] || !this.__aFillData[v.value[0].aid].nodes ||	!WMFolders.getRights(v.value[0],'remove') || sType == 'QL' || sType == 'I' || sType == 'Y')
				break;

			var getTargets = function (data, out){
				out = out || [];
                if (typeof data != 'object') return out;

                var i, sPath, bActive;
				for(i in data){
					if (data.hasOwnProperty(i) && data[i].arg.ftype != 'QL' && data[i].arg.aid == v.value[0].aid){
						if (data[i].arg.aid && data[i].arg.fid!=v.value[0].fid){
							sPath = data[i].arg.aid + (data[i].arg.fid?'/'+data[i].arg.fid:'');

							bActive = false;
							if (!data[i].arg.fid || (!data[i].arg['disabled'] && WMFolders.getAccess(data[i].arg,'write')))
								bActive = true;

							var treeId = me._getTreeId(sPath);

							out.push([treeId, bActive]);
						}

						if (data[i].nodes && val[sPath])
							getTargets(data[i].nodes, out);
					}
				}

                return out;
			};

			this.__aDragFolders = getTargets((this.__aFillData[v.value[0].aid] || (this.__aFillData.other || {}).nodes[v.value[0].aid]).nodes);

			break;

		default:
			return;
		}
	}

	if (this.__aDragFolders.length){
		addcss(this._main,'active_drop');
		this.__objPos = getSize(this.__eBody);
	}
	else{
		removecss(this._main,'active_drop');
		this._ondragout();
	}
};

_me._ondragover = function(v){
	var me = this;

	//obey scroll
	if (!this.__dragON){
		this.__dragON = true;

		gui._obeyEvent('mousewheel',[this,'__mousewheel']);

		this.__dragscrollloop = window.setInterval(function(){
			if (me.__objPos){
				var delta;
				if (((delta = gui.__Y - me.__objPos.y)<51 && (delta -= 50)) || ((delta = gui.__Y - me.__objPos.y - me.__objPos.h)>-51 && (delta += 50)))
					me.__eBody.scrollTop += Math.floor(delta/4);
			}
		},100);
	}

	var a,size,elm,bOK = false, bFound = false;

	if (this.__aDragFolders){
		for (var i=0, j = this.__aDragFolders.length;i<j;i++){

			if (!(elm = document.getElementById(this._getElmId(this.__aDragFolders[i][0]))))
	      		continue;

			size = getSize(elm);

			if (v.y>=size.y && v.y<=size.y+elm.firstChild.offsetHeight){

				bOK = this.__aDragFolders[i][1];

				if ((a = elm.firstChild.getElementsByTagName('B')[0])){

					bFound = true;

			        if (!this.___lastdragover || this.___lastdragover[1] != this.__aDragFolders[i][0]){

						if (this.___lastdragover)
							removecss(this.___lastdragover[0],'dragover');

						addcss(a,'dragover');
						this.___lastdragover = [a,this.__aDragFolders[i][0]];

						//Kill Auto-Open
						if (this.__dragopentimer)
							if (this.__dragopentimer[1] != this.__aDragFolders[i][0]){
								window.clearTimeout(this.__dragopentimer[0]);
								this.__dragopentimer = '';
							}
							else
								break;

						if (hascss(elm,'plus')){
							this.__dragopentimer = [
								window.setTimeout(function(){
									if (me.__dragopentimer){
										me.__open(me.__dragopentimer[1]);
										me._active_dropzone(v);
									}
								},800),
								me.__aDragFolders[i][0]
							];
						}
			        }
				}

				break;
			}
		}

		if (!bFound && this.___lastdragover){
			removecss(this.___lastdragover[0],'dragover');
			this.___lastdragover = '';
		}
	}

	a = null;
	elm = null;

	return bOK;
};

_me._ondragout = function(v){

	//disobey scroll
	gui._disobeyEvent('mousewheel',[this,'__mousewheel']);
	this.__dragON = false;

	if (this.__dragscrollloop){
		window.clearInterval(this.__dragscrollloop);
		this.__dragscrollloop = '';
	}

	if (this.__dragopentimer){
		window.clearTimeout(this.__dragopentimer[0]);
		this.__dragopentimer = '';
	}

	if (this.___lastdragover){
		removecss(this.___lastdragover[0],'dragover');
		this.___lastdragover = '';
	}
};

_me._ondrop = function(v){

	//disobey scroll
	gui._disobeyEvent('mousewheel',[this,'__mousewheel']);
	this.__dragON = false;

	var size,elm,id = '';
	for (var i = 0, j = this.__aDragFolders.length; i < j; i++) {
		if (!this.__aDragFolders[i][1] || !(elm = document.getElementById(this._getElmId(this.__aDragFolders[i][0]))))
			continue;

		size = getSize(elm);

		if (v.y>=size.y && v.y<=size.y + elm.firstChild.offsetHeight){
			id = this.__aDragFolders[i][0];
			break;
		}
	}

	if (!id) return false;

	var realId = this._getRealId(id);
	if (!realId) return false;

	var path = Path.split(realId,true);

	//Drag & Drop doesnt work with popups because of event handlers.
	gui.frm_main.dnd.remove_drag(true);

	switch(v.type){
		case 'folder':
			var bIsDefault = dataSet.get('folders',[v.value[0].aid, v.value[0].fid,'DEFAULT']);
			gui._create('move','frm_confirm','','',[function(){

				storage.library('obj_context_folder');
				obj_context_folder.__moveFolder(v.value[0].aid, v.value[0].fid, (path.fid?path.fid + '/':'') + Path.basename(v.value[0].fid));

			}], 'POPUP_FOLDERS::MOVE_FOLDER', bIsDefault ? 'POPUP_FOLDERS::MOVE_DEFAULT' : 'POPUP_FOLDERS::MOVE_FOLDER_CONFIRMATION');

			break;

		case 'item':
			if (path.fid)
				Item.__convertToFolder(path.aid,path.fid,v);
	}
};

///AUX
_me.__mousewheel = function(e){
	this.__eBody.scrollTop += e.delta*20;
};
_me.__dragscroll = function(){
	if (this.__objPos){
		var delta;
		if (((delta = gui.__Y - this.__objPos.y)<51 && (delta -= 50)) || ((delta = gui.__Y - this.__objPos.y - this.__objPos.h)>-51 && (delta += 50)))
			this.__eBody.scrollTop += Math.floor(delta/10);
	}
};
