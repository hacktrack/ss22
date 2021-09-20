_me = frm_chat_upload.prototype;
function frm_chat_upload(){};

/**
 * @brief   Form for adding folder.
 * Form has three input objects:
 *    - text input for name of the folder (folder must
 *    match this regular expr. /^ *[a-zA-Z0-9#\.\_\-]+[ a-zA-Z0-9#\.\_\-]*$/).
 *    - select box for folder type specification (mail, contact, event, journal, note, task).
 *    - folder three.
 * 'OK' button is active only if the name of the folder match the regular expr. above.
 *
 * @param[in]  sAccountID  [string] Only folders from this account will be listed because of
 * moving folders between accounts is disabled.
 * @param[in]  sFolderID   [string] Optional. Forder with this ID will be preselected.
 *
 * @see  objects/frm_add_folder.xml
 * @see  inc/frm_add_folder.js
 */
_me.__constructor = function(sName, sDesc, aFolder, aHandler){
	var me = this;

	this._modal(true);
	this._title('MAIN_MENU::NEW_UPLOAD');
	this._size(500,350,true);

	this._dockable(false);
	this._resizable(false);

	this.__count = 5;

	// Create formular from template
	this._draw('frm_chat_upload', 'main');

	sName = sName || getLang('EVENT_VIEW::NO_TITLE');
	this.input_name._value(sName);
	this.input_name._placeholder(sName);

/*
	if (sDesc){
		this.input_desc._value(sDesc);
		this.input_desc._placeholder(sDesc);
	}
	else
		this.input_desc._placeholder(getLang('IM::COMMENT_PH'));
*/

	// Chat input
	this._create("input_desc","obj_chat_input","text","",{
		smiles_enabled: GWOthers.getItem('CHAT','smiles') == '1',
		height: 60
	});

	this.input_desc._folder(aFolder);

	if (sDesc) this.input_desc._value(sDesc);
	this.input_desc.input._placeholder(getLang('IM::COMMENT_PH'));

	function test (){
		me.x_btn_ok._disabled(!me.input_name.__check());
	};

	this.input_name._onerror = function(){
		test();
	};

	this.input_desc._onsubmit = this.input_name._onsubmit = function(){
		test();
		me.x_btn_ok._onclick();
	};


    // Create 'OK' button
	this._create('x_btn_ok', 'obj_button', 'footer', 'ok noborder color1');
	this.x_btn_ok._tabIndex();
	//this.x_btn_ok._text(getLang('FORM_BUTTONS::OK') + ' (' + this.__count + ')');
	this.x_btn_ok._text(getLang('FORM_BUTTONS::OK'));

	this.x_btn_ok._onclick = function() {
		try{
			if (aHandler){
				var sDesc = me.input_desc._value(),
					aArg;

				if (sDesc)
					aArg = {mentions:me.input_desc.input._mention()};

				executeCallbackFunction(aHandler, me.input_name._value(), sDesc, aArg);
			}
		}
		catch(r){
			console.warn('upload error', r);
		}

		me._destruct();
	};

	this.input_name._restrict([Is.Filename]);
/*
	this._onclose = function(b){
		me._stop();
		return true;
	};

	this.__interval = window.setInterval(function(){

		if (this.__count){
			this.x_btn_ok._text(getLang('FORM_BUTTONS::OK') + ' (' + this.__count + ')');
			this.__count--;
		}
		else
			this._close(true);

	}.bind(this),1000);

	this._onfocus = function(){
		me._stop();
	};
*/

	this.input_desc._main.addEventListener('keyup',this._onKeyup.bind(this));

	this._main.addEventListener("dragenter", function(e){

		me.x_btn_ok._onclick();

		e.preventDefault();
		e.stopPropagation();
		return false;

	},false);

	//focus
	this._focus();
	this.input_desc._focus();
};

_me._onKeyup = function(){
	this.__interval && this._stop();
};
_me._stop = function(){
	if (this.__interval) {
		window.clearInterval(this.__interval);
		this.__interval = null;
	}

	this.x_btn_ok._value('FORM_BUTTONS::OK');
};
