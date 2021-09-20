_me = frm_telemetry.prototype;
function frm_telemetry(){};

/**
 * @brief
 *
 * @see  IM/new group
 */
_me.__constructor = function(aResponse, sLabel1, sLabel2) {

	var me = this;

	this._size(400,400,true);
	this._closable(false);
	// this._resizable(false);
	// this._dockable(false);
	// this._modal(true);

	this._title('Telemetry', true);
	//this._draw('frm_telemetry','main');


	this.__idTable = {};

	this._create('text','obj_text','main','obj_text100 noborder');
	this.text._onsubmit = function(){
		if (this._value())
			me.x_btn_show._onclick();
		else
			me._hide();
	};

	this.text._placeholder('Paste Telemetry XML here...');
	//this.text._value('<telemetry><click><count>1</count><element>gui.frm_main.hmenu1/2/5</element><type>obj_hmenu_basic</type><label>MAIN_MENU::NEW_NOTE</label><arg>new_note</arg></click><click><count>1</count><element>gui.frm_event.maintab.tab1.EVNTITLE</element><type>obj_input</type></click><click><count>1</count><element>gui.frm_event.x_btn_ok</element><type>obj_button</type></click><click><count>1</count><element>gui.frm_main.stat.search.search</element><type>obj_suggest_search</type></click><click><count>1</count><element>gui.frm_main.stat.btn_im</element><type>obj_button</type></click><click><count>2</count><element>gui.frm_main.hmenu1/0</element><type>obj_hmenu_basic</type></click><click><count>1</count><element>gui.frm_main.main.list</element><type>obj_datagrid2_ext</type><shift>true</shift></click><click><count>1</count><element>gui.frm_main.main.list</element><type>obj_datagrid2_ext</type><ctrl>true</ctrl></click><click><count>1</count><element>gui.frm_main.main.list</element><type>obj_datagrid2_ext</type><button>2</button></click><click><count>1</count><element>gui.cmenu/5</element><type>obj_context_item</type><label>POPUP_ITEMS::SOURCE</label><owner>gui.frm_main.main.list</owner></click></telemetry>');

	this._create('x_btn_show', 'obj_button', 'footer', 'noborder simple ok');
	this.x_btn_show._value('COMMON::SHOW');
	this.x_btn_show._title('Ctrl+Z');
	this.x_btn_show._onclick = function() {
		if (me._prepare()){
			me._show_all();
			me._start_observer();
			this._disabled(true);
			me.x_btn_hide._disabled(false);
		}
	};

	this._create('x_btn_hide', 'obj_button', 'footer', 'noborder simple cancel');
	this.x_btn_hide._value('COMMON::HIDE');
	this.x_btn_hide._disabled(true);
	this.x_btn_hide._onclick = function() {
		me._hide();
	};

	//Ctrl + Z
	gui._obeyEvent('keydown', [function(e){
		if (e.keyCode == 90 && e.ctrlKey)
			me.x_btn_show._onclick();
	}]);

};

_me._start_observer = function(){

	this._stop_observer();

	var me = this;

	this.__DOM = function(e) {
		if (e.target && e.target.nodeType == 1){

			if (e.target.id)
				me._show(e.target.id);

			var elms = e.target.querySelectorAll('*[id]');
			for(var j = elms.length-1; j>=0; j--)
				me._show(elms[j].id);
		}
	};

	document.addEventListener("DOMNodeInserted", this.__DOM, false);

/*
	// DOM4 but doesnt work innerHTML

	// configuration of the observer:
	var config = {childList: true, subtree: true}; // , subtree: true, characterData: true, attributes: true, attributeFilter: ["class"]

	// create an observer instance
	this.__observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(m) {

				for (var elms, n = m.addedNodes, i = n.length-1; i>=0; i--)
					if (n[i]){

						if (n[i].id)
							me._show(n[i].id);

						if (n[i].querySelectorAll){
							elms = n[i].querySelectorAll('*[id]');
							for(var j = elms.length-1; j>=0; j--)
								me._show(elms[j].id);
						}
					}
		});
	});
	// pass in the target node, as well as the observer options
	this.__observer.observe(gui._main, config);
*/
};

_me._stop_observer = function(){

	if (this.__DOM)
		document.removeEventListener("DOMNodeInserted", this.__DOM);

	// if (this.__observer){
	// 	this.__observer.disconnect();
	// 	this.__observer = null;
	// }
};

_me._prepare = function(){

	this._hide();

	//clear ID table
	this.__idTable = {};

	try{
		aData = XMLTools.Str2Arr(this.text._value());
	}
	catch(r){
		alert('Invalid XML');
		return;
	}

	if (!aData || !aData.TELEMETRY){
		alert('No telemetry data');
		return;
	}

	if ((aData = aData.TELEMETRY[0].CLICK))
		for (var id, a, tag, i = aData.length - 1; i >= 0; i--)
			if (aData[i].ELEMENT && aData[i].COUNT && (id = aData[i].ELEMENT[0].VALUE)){

				if (!this.__idTable[id])
					this.__idTable[id] = [];

				a = {};
				for(tag in aData[i])
					if (tag != 'ELEMENT')
						a[tag] = aData[i][tag][0].VALUE;

				this.__idTable[id].push(a);
			}

	return true;
};

_me._show_all = function(){
	var id;
	for (id in this.__idTable)
		this._show(id);
};

_me._show = function(id){
	var data = clone(this.__idTable[id]);

	if (data && (elm = document.getElementById(id))){

		var obj = this.__getObj(id),
			click = 0, aDetail = [];

		for (i in data){

			//Check object TYPE
			if (data[i]['TYPE'] && (!obj || obj._type != data[i]['TYPE'])){
				continue;
			}
			else
			//Use object's telemetry parser
			if (obj && obj.__telemetry && obj.__telemetry(id, elm, data[i]) === false){
				continue;
			}

			click += parseInt(data[i].COUNT,10);
			aDetail.push('<td class="space" colspan="2"></td>');

			for (var j in data[i])
				if (j != 'TYPE')
					aDetail.push('<tr><th>'+ j+'</th><td>'+ data[i][j]+'</td></tr>');
		}

		if (!aDetail.length)
			return;

		aDetail.unshift('<table>', '<tr><th colspan="2">'+ data[0]['TYPE'] +'</th></tr>');
		aDetail.push('</table>');

		elm.setAttribute('telemetry',click);

		var eInfo;
		if (elm.firstChild && hascss(elm.firstChild,'telemetry_info')){
			eInfo = elm.firstChild;
		}
		else{
			eInfo = mkElement('aside',{className: 'telemetry_info', rel:id});

			try{
				if (elm.firstChild)
					elm.insertBefore(eInfo,elm.firstChild);
				else
					elm.appendChild(eInfo);
			}
			catch(r){
				return;
			}
		}

		eInfo.innerHTML = click;
		if (aDetail.length){
			eInfo.onmousemove = function(e){
				var e = e || window.event;

				e.cancelBubble = true;
				e.stopPropagation(true);
				return false;
			};
			gui.tooltip._add(eInfo,aDetail.join("\n"), {hide:false, html:true, x: "+30", css:'telemetry'});
		}
	}
};

_me._hide = function(){

	this._stop_observer();

	var elms = gui._main.querySelectorAll('aside.telemetry_info');
	for (var i = elms.length-1; i>=0; i--)
		elms[i].parentNode.removeChild(elms[i]);

	elms = gui._main.querySelectorAll('[telemetry]');
	for (var i = elms.length-1; i>=0; i--)
		elms[i].removeAttribute('telemetry');

	this.x_btn_show._disabled(false);
	this.x_btn_hide._disabled(true);
};

// Helpers
_me.__getObj = function(id){
	var obj = window,
		objid = id.split('#').shift().split('/').shift();
	try{
		objid.split('.').forEach(function(part) {
			obj = obj[part];
		});
		return obj;
	}
	catch(r){
		return false;
	}
};
