_me = frm_categories.prototype;
function frm_categories() {};

_me.__constructor = function(sInitString, aResponse) {

	this._title('TAGS::TAGS');
	this._size(430,500,true);
	this._modal(true);
	this._dockable(false);

    var me = this;
    this.__tags = {};

	this._draw('frm_categories', 'main');

    // Create 'OK' button
	this._create('x_btn_ok', 'obj_button', 'footer', 'ok noborder color1');
	this.x_btn_ok._value('FORM_BUTTONS::CLOSE');
	this.x_btn_ok._onclick = function() {
		me._destruct();
	};

	this._onclose = function(b){
		me._updateTags();
		executeCallbackFunction(aResponse, me.tags._value());
		return true;
	};

	if (Is.Defined(sInitString))
    	this._updateTags(sInitString);

	var aColors = {
		'*':getLang('COLOR_LABELS::NONE'),
		'#E7A1A2':['','cE7A1A2'],
		'#F9BA89':['','cF9BA89'],
		'#F7DD8F':['','cF7DD8F'],
		'#FCFA90':['','cFCFA90'],
		'#78D168':['','c78D168'],
		'#9FDCC9':['','c9FDCC9'],
		'#C6D2B0':['','cC6D2B0'],
		'#9DB7E8':['','c9DB7E8'],
		'#B5A1E2':['','cB5A1E2'],
		'#DAAEC2':['','cDAAEC2'],
		'#DAD9DC':['','cDAD9DC'],
		'#6B7994':['','c6B7994'],
		'#BFBFBF':['','cBFBFBF'],
		'#6F6F6F':['','c6F6F6F'],
		'#4F4F4F':['','c4F4F4F'],
		'#C11A25':['','cC11A25'],
		'#E2620D':['','cE2620D'],
		'#C79930':['','cC79930'],
		'#B9B300':['','cB9B300'],
		'#368F2B':['','c368F2B'],
		'#329B7A':['','c329B7A'],
		'#778B45':['','c778B45'],
		'#2858A5':['','c2858A5'],
		'#5C3FA3':['','c5C3FA3'],
		'#93446B':['','c93446B']
	};

	this.pd_color._fill(aColors);
	this.pd_color._value('*');
	this.pd_color._onchange = function(v){
		var arg;
		if (me.grid._value()[0] && (arg = me.grid._aData[me.grid._value()[0]])){
			var v = this._value();
				v = v=='*'?'':v;

			if (arg.TAGCOLOR != v){
				if (dataSet.get('tags',[arg.arg.TAGNAME])){

					dataSet.add('tags',[arg.arg.TAGNAME,'TEXTCOLOR'],colors.fast_contrast(v),true);
					dataSet.add('tags',[arg.arg.TAGNAME,'TAGCOLOR'],v);

					WMItems.add([sPrimaryAccount,'__@@TAGS@@__',[arg.id]],{values:{TAGCOLOR:v,TAGNAME:arg.arg.TAGNAME}},'','','',[function(){}]);
				}
				else
					WMItems.add([sPrimaryAccount,'__@@TAGS@@__',[arg.id]],{values:{TAGCOLOR:v,TAGNAME:arg.arg.TAGNAME}},'','','',[me,'__reload']);
			}
		}
	};


	this.grid._select_single = true;
	this.grid.__sortColumn = 'TAGNAME';
	this.grid._addColumns({
		'CHECK':{"title": '',"width":20,css:'check'},
		'COLOR':{"title": '',"width":20,css:'color'},
		'TAGNAME':{"title": 'TAGS::TAGS',"width":100, mode:'%', arg:{'sort':'desc'}},
		'TAGCOUNT':{"title": 'TAGS::USED',"width":50}
	});

	this.grid.__update = function (){

		var aData = dataSet.get('tags','',true),
			aOut = {};

		var sName = '', escSQL = '';

		//merge with tags
		for (var i in me.__tags)
			if (!aData[i])
				aData[i] = {TAGNAME:i,TAGCOUNT:1};

		var search = new GlobalTools.search();

		if (this._SQLfilter)
			escSQL = this._SQLfilter.toString().escapeXML();

		for (var i in aData){
			if (Is.String(sName = aData[i].TAGNAME)){

				if (escSQL) {
					if (search.within(sName.escapeXML()).find(escSQL))
						sName = search.highlight('b');
					else
						continue;
				}
				else
					sName = sName.escapeXML();

				aOut[aData[i].TAGNAME] ={
					id:aData[i].ID,
					css:me.__tags[aData[i].TAGNAME]?'checked':'',
					arg:{TAGNAME:aData[i].TAGNAME,TAGCOLOR:aData[i].TAGCOLOR},
					data:{
						COLOR:'<span '+ (aData[i].TAGCOLOR?'style="background-color: '+ aData[i].TAGCOLOR +'"':'') +'></span>',
						TAGNAME:sName,
						TAGCOUNT:aData[i].TAGCOUNT
					}
				};
			}
		}

		this._serverSort(aOut);

		//Disable buttons if no tag selected
		var v = this._value(),
			b = !(v && (v = v[0]) && aOut[v]);

		me.pd_color._disabled(b);
		me.btn_edit._disabled(b);
		me.btn_remove._disabled(b);
	};

	this.grid._listen_data('tags');

	this.grid._ondblclick = function (e1,e2,arg,row,cell){
		if (cell != 'CHECK')
			me._addOrRemoveTag(arg.TAGNAME);
	};

	this.grid._onkeydown = function (e){
		if (e.keyCode == 32)
			try{
				var arg = this._aData[this.__value[0]].arg;
				if (arg)
					this._ondblclick(e,'',arg);
			}
			catch(r){
				return;
			}
	};

	this.grid._onkeypress = function (e){
		var s = String.fromCharCode(e.charCode);
		if (s && (s = s.trim()) && !/[\x00-\x1F]/.test(s)){
			me.search._focus(true);
	        me.search._value(s);
		}
	};

	this.grid._onclick = function (e,e2,arg,row,cell){
		if (cell == 'CHECK')
			this._ondblclick(e,e2,arg);
	};

	this.grid._onchange = function(v){
		var b = true;
		if (v && (v = v[0])){
			b = false;
			if (!me.pd_color._value(dataSet.get('tags',[v,'TAGCOLOR']) || '*',true))
				me.pd_color._value('*',true);
		}
		else
			me.pd_color._value('*',true);

		me.pd_color._disabled(b);
		me.btn_edit._disabled(b);
		me.btn_remove._disabled(b);
	};

	/*
	this.grid._oncontext = function(e,elm,arg,sLineId,sColumn){
		var bAccess = false;
		gui._create("cmenu","obj_context",'','',this);

        gui.cmenu._fill([{'title':'FORM_BUTTONS::REMOVE','arg':{'method':'remove',id:dataSet.get('tags',[arg.TAGNAME,'ID']),tag:arg.TAGNAME},disabled:bAccess}]);
        gui.cmenu._place(e.clientX,e.clientY);
		gui.cmenu._onclick = function(e,elm,id,arg){
			if (arg.method == 'remove')
				if (arg.id)
                	WMItems.remove({'aid':sPrimaryAccount,'fid':'__@@TAGS@@__','iid':[arg.id]},'','','',[me,'__removed',[arg]]);
				else
				if (tag){
					me._addOrRemoveTag(tag);
				}
		};
	};
	*/

	// SEARCH
	this.search._onsearch = function(){
		var v = this._value();

		if (this._parent.grid._SQLfilter != v){
			this._parent.grid._SQLfilter = v;
			this._parent.grid.__update();

			me._selectFirst();
		}
	};
	this.search._onkeydown = function(e){
		if (e.keyCode == 13){
			if (e.ctrlKey)
				me.btn_add._onclick();
			else
				this._onsearch();
		}

		if ((e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13) && me.grid._value().length && me.grid._aData[me.grid._value()[0]])
			me.grid._focus();
	};


	this.btn_add._onclick = function(){
		var v = me.search._value();

		//explode tags and use 1st one
		if (v && (v = me.tags._decode(v)[0]) && (v = v.tag)){
			me._addOrRemoveTag(v,true);

			WMItems.add([sPrimaryAccount,'__@@TAGS@@__'],{values:{TAGNAME:v}},'','','',[me,'__reload']);

			me.search._value('');
			me.search._onsearch();

			me.grid._value([v],true);
		}

		me.search._focus();
	};

	this.btn_edit._onclick = function(){
		var arg;
		if (Is.Defined(me.grid._value()) && (arg = me.grid._aData[me.grid._value()[0]])){

			var ds = dataSet.get('tags');
			var frm = gui._create('edit','frm_ok_cancel');
				frm._modal(true);
				frm._resizable(false);
				frm._size(350,180,true);
				frm._title('FORM_BUTTONS::EDIT');

				frm._draw('frm_tags_edit','main');
				frm.inp_select._fill(me.pd_color.__idTable);
				frm.inp_select._value(arg.arg.TAGCOLOR || '*');

				frm.inp_name._value(arg.arg.TAGNAME);
				frm.inp_name._restrict('![\,]', '', '.+', '', [function(v){
					return !ds[v] || ds[v].ID === arg.id;
				}]);

				frm.inp_name._onerror = function(b){
					frm.x_btn_ok._disabled(b);
					frm.inp_select._disabled(b);
				};

				frm.x_btn_ok._onclick = function(){
					var v = frm.inp_name._value();
					if (v){
						WMItems.add(
							[sPrimaryAccount,'__@@TAGS@@__',[arg.id]],
							{
								values:{
									TAGNAME: v,
									TAGCOLOR: frm.inp_select._value() == '*' ? '' : frm.inp_select._value()
								}
							},
							'',
							'',
							'',
							[me,'__reload',[arg,v]]
						);
						frm._destruct();
					}
					else
						frm.inp_name._focus();
				};

				frm.inp_name._onsubmit = function(){frm.x_btn_ok._onclick()};
				frm.inp_name._focus();
		}
	};

	this.btn_remove._onclick = function(){
		var arg;
		if (Is.Defined(me.grid._value()) && (arg = me.grid._aData[me.grid._value()[0]])){

			if (me.__tags[arg.arg.TAGNAME])
		    	me._addOrRemoveTag(arg.arg.TAGNAME);

			if (arg.id)
				WMItems.remove({'aid':sPrimaryAccount,'fid':'__@@TAGS@@__','iid':[arg.id]},'','','',[me,'__reload']);
			else
				me.grid.__update();
		}
	};

	this.tags._onblur = function(){
		me._updateTags(null,true);
	};

	// Do Query
	this.__reload();
};

_me._selectFirst = function(){
	if (!this.grid._selectFirst()){
		this.search._focus();
		return false;
	}
	return true;
};

_me.__reload = function(bOK,response, arg,v){
	var sNewTags;

	if (bOK && arg && arg.arg && v != arg.arg.TAGNAME && this.__tags[arg.arg.TAGNAME]){
		delete this.__tags[arg.arg.TAGNAME];
		this.__tags[v] = true;

		sNewTags = arrayKeys(this.__tags).join(', ');
		this.tags._value(sNewTags);

		if (this._onChange) {
			this._onChange(sNewTags);
		}
	}

	gui.frm_main._loadTags();
};

_me._addOrRemoveTag = function(sTag,bAdd){
	if (sTag){
		if (this.__tags[sTag]){
			if (bAdd) return;

			delete this.__tags[sTag];
		}
		else
			this.__tags[sTag] = true;

		this.tags._value(arrayKeys(this.__tags).join(', '));

		this.grid.__update();
	}
};

_me._updateTags = function(sTags, bRefresh){
	sTags = sTags || this.tags._value();

	var aSplit = [],atmp = sTags.split(','),aTags = {};
	for(var i=0,j = atmp.length; i<j;i++)
		if (atmp[i] && (atmp[i] = atmp[i].trim())){
			aSplit.push(atmp[i]);
			aTags[atmp[i]] = true;
		}

    if (compareObj(this.__tags,aTags))
        bRefresh = false;

	this.__tags = aTags;
	this.tags._value(aSplit.join(', '));

	if (bRefresh)
		this.grid.__update();
};