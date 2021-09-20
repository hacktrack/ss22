_me = frm_duplicity.prototype;
function frm_duplicity(){};

/**
 *
 */
_me.__constructor = function(aParams) {
	var me = this;

	this._size(450,230,true);
	this._modal(true);
	this._dockable(false);
	this._resizable(false);

	this._draw('frm_duplicity', 'main');
	this._title('DUPLICITY::DUPLICITY');

	// Create 'Rename' button
	this._create('x_btn_rename', 'obj_button', 'footer', 'noborder simple ok color1');
	this.x_btn_rename._value('FORM_BUTTONS::RENAME');
	this.x_btn_rename._onclick = function() {
		me.__action(me.filename._value());
	};

	// Create 'Rewrite All' button
	this._create('x_btn_rewrite_all', 'obj_button', 'footer', 'noborder simple cancel color2 x_btn_right');
	this.x_btn_rewrite_all._value('FORM_BUTTONS::REWRITE_ALL');
	this.x_btn_rewrite_all._onclick = function() {
		me.__action(null, true);
	};

	// Create 'Rewrite' button
	this._create('x_btn_rewrite', 'obj_button', 'footer', 'noborder cancel color2 x_btn_right');
	this.x_btn_rewrite._value('FORM_BUTTONS::REWRITE');
	this.x_btn_rewrite._onclick = function() {
		me.__action();
	};

	// Parse duplicity
	this.__req = aParams.request;
	this.__att = [];
	this.__id = 0;

	for(var i = 0, j = aParams.duplicate.ITEM.length; i < j; i++)
		this.__att.push({
			'class':aParams.duplicate.ITEM[i].CLASS[0].VALUE,
			'fullpath':aParams.duplicate.ITEM[i].FULLPATH[0].VALUE,
			'name':aParams.duplicate.ITEM[i].NAME[0].VALUE,
			'freename':aParams.duplicate.ITEM[i].FREENAME[0].VALUE
		});

	this.filename._restrict([Is.Filename]);
	this.filename._onsubmit = function(){
		me.x_btn_rename._onclick();
	};
	this.filename._onerror = function(b){
		me.x_btn_rename._disabled(b);
	};

	//init form
	this.__init();
};

_me.__init = function(bNext){

	if (bNext)
		this.__id++;

	var att = this.__att[this.__id];
	if (att){
		this.text._value(getLang('DUPLICITY::LABEL',[att.name]));

		this.filename._value(att.freename);
		this.filename._setRange(0,att.freename.indexOf('.')>-1?att.freename.lastIndexOf('.'):0);
	}
	else
		this._destruct();
};

_me._onclose = function(){
	this.__init(true);
	return false;
};

_me.__action = function(sName, bAll){

	var err = this.__att[this.__id],
		args = [];

	for(var i=0, j=this.__req.args.length; i<j; i++)
		args.push(this.__req.args[i]);

	switch(this.__req.type){
		case 'add':
			var aItemInfo = clone(args[1],true);

			if (args[1].ATTACHMENTS){

				//rename
				if (Is.String(sName) && aItemInfo.values){

					if (aItemInfo.values.EVNTITLE)
						aItemInfo.values.EVNTITLE = sName;

					if (aItemInfo.values.EVNLOCATION)
						aItemInfo.values.EVNLOCATION = sName;

					if (aItemInfo.values.EVNRID)
						aItemInfo.values.EVNRID = sName;
				}

				aItemInfo.ATTACHMENTS.splice(0, this.__id);

				for (var v, i = 0; i<aItemInfo.ATTACHMENTS.length; i++){

					if ((v = aItemInfo.ATTACHMENTS[i].values) && (!v.fullpath || v.fullpath == err.fullpath)){

						// rename
						if (Is.String(sName))
							v.description = sName;
						// replace
						else
							aItemInfo.replace = true;

						// for rest
						if (bAll){
							this.__id = this.__att.length-1;
							break;
						}
					}
					else{
						aItemInfo.ATTACHMENTS.splice(i,1);
						i--;
					}
				}

				args[1] = aItemInfo;
			}
			else
				this.__init(true);

			break;

		case 'move':
		case 'copy':

			var aItemInfo = clone(args[0],true),
				iid = WMItems.__clientID(Path.basename(err.fullpath));

			aItemInfo.iid.splice(0, this.__id);

			for (var i = 0; i<aItemInfo.iid.length; i++){
				if (iid == aItemInfo.iid[i]){
					if (Is.String(sName)){
						aItemInfo.duplicity = "rename";
						aItemInfo.rename = sName;
					}
					else
						aItemInfo.duplicity = "replace";

					// for rest
					if (bAll){
						this.__id = this.__att.length-1;
						break;
					}
				}
				else{
					aItemInfo.iid.splice(i,1);
					i--;
				}
			}

			args[0] = aItemInfo;
			break;

		default:
			this.__init(true);
			return;
	}

	WMItems[this.__req.type].apply(WMItems, args);
	this.__init(true);
};



/*
	request
	duplicate

Copy

 [request]
.. [ACCOUNT]
.... [0]
...... [ATTRIBUTES]
........ [UID](string) = admin@merakdemo.com
...... [FOLDER]
........ [0]
.......... [ATTRIBUTES]
............ [UID](string) = Documents
.......... [ITEM]
............ [0]
.............. [ATTRIBUTES]
................ [UID](string) = 45136e10a203
................ [ACTION](string) = copy
.............. [ACCOUNT]
................ [0]
.................. [VALUE](string) = admin@merakdemo.com
.............. [FOLDER]
................ [0]
.................. [VALUE](string) = Documents
 [duplicate]
.. [ITEM]
.... [0]
...... [CLASS]
........ [0]
.......... [VALUE](string) = item
...... [FULLPATH]
........ [0]
.......... [VALUE](string) = admin@merakdemo.com/Documents/45136e10a203
...... [FREENAME]
........ [0]
.......... [VALUE](string) = abigail-clancy-1280x1024-25689(1).jpg


Move
[request]
.. [ACCOUNT]
.... [0]
...... [ATTRIBUTES]
........ [UID](string) = admin@merakdemo.com
...... [FOLDER]
........ [0]
.......... [ATTRIBUTES]
............ [UID](string) = doc2
.......... [ITEM]
............ [0]
.............. [ATTRIBUTES]
................ [UID](string) = 45136e10a203
................ [ACTION](string) = move
.............. [ACCOUNT]
................ [0]
.................. [VALUE](string) = admin@merakdemo.com
.............. [FOLDER]
................ [0]
.................. [VALUE](string) = Documents
 [duplicate]
.. [ITEM]
.... [0]
...... [CLASS]
........ [0]
.......... [VALUE](string) = item
...... [FULLPATH]
........ [0]
.......... [VALUE](string) = admin@merakdemo.com/Documents/45136e10a203
...... [FREENAME]
........ [0]
.......... [VALUE](string) = abigail-clancy-1280x1024-25689(1).jpg


Upload
 [request]
.. [ACCOUNT]
.... [0]
...... [ATTRIBUTES]
........ [UID](string) = admin@merakdemo.com
...... [FOLDER]
........ [0]
.......... [ATTRIBUTES]
............ [UID](string) = doc2
.......... [ITEM]
............ [0]
.............. [ATTRIBUTES]
................ [ACTION](string) = add
.............. [VALUES]
................ [0]
.................. [EVNSHARETYPE]
.................... [0]
...................... [VALUE](string) = U
.................. [EVNSTARTDATE]
.................... [0]
...................... [VALUE](number) = 2456889
.................. [EVNSTARTTIME]
.................... [0]
...................... [VALUE](number) = 982
.................. [CTZ]
.................... [0]
...................... [VALUE](number) = 120
.............. [ATTACHMENTS]
................ [0]
.................. [ATTACHMENT]
.................... [0]
...................... [VALUES]
........................ [0]
.......................... [class]
............................ [0]
.............................. [VALUE](string) = file
.......................... [description]
............................ [0]
.............................. [VALUE](string) = abigail-clancy-1280x1024-25689.jpg
.......................... [size]
............................ [0]
.............................. [VALUE](number) = 219008
.......................... [fullpath]
............................ [0]
.............................. [VALUE](string) = 2014-08-19-53f35daz2a52b8z06449141/53f35daz2a52b4z45797626
 [duplicate]
.. [ITEM]
.... [0]
...... [CLASS]
........ [0]
.......... [VALUE](string) = file
...... [FULLPATH]
........ [0]
.......... [VALUE](string) = 2014-08-19-53f35daz2a52b8z06449141/53f35daz2a52b4z45797626
...... [FREENAME]
........ [0]
.......... [VALUE](string) = abigail-clancy-1280x1024-25689(1).jpg



ADD New
 [request]
.. [ACCOUNT]
.... [0]
...... [ATTRIBUTES]
........ [UID](string) = admin@merakdemo.com
...... [FOLDER]
........ [0]
.......... [ATTRIBUTES]
............ [UID](string) = doc2
.......... [ITEM]
............ [0]
.............. [ATTRIBUTES]
................ [ACTION](string) = add
.............. [VALUES]
................ [0]
.................. [EVNNOTE]
.................... [0]
...................... [VALUE](string) =
.................. [EVNTYPE]
.................... [0]
...................... [VALUE](string) =
.................. [EVNSHARETYPE]
.................... [0]
...................... [VALUE](string) = U
.................. [EVNTITLE]
.................... [0]
...................... [VALUE](string) = abigail-clancy-1280x1024-25689.jpg
.................. [EVNLOCATION]
.................... [0]
...................... [VALUE](string) = abigail-clancy-1280x1024-25689.jpg
.................. [EVNRID]
.................... [0]
...................... [VALUE](string) = abigail-clancy-1280x1024-25689.jpg
.................. [EVNCOMPLETE]
.................... [0]
...................... [VALUE](number) = 219008
.................. [EVNSTARTDATE]
.................... [0]
...................... [VALUE](number) = 2456889
.................. [EVNSTARTTIME]
.................... [0]
...................... [VALUE](number) = 983
.................. [CTZ]
.................... [0]
...................... [VALUE](number) = 120
.............. [ATTACHMENTS]
................ [0]
.................. [ATTACHMENT]
.................... [0]
...................... [VALUES]
........................ [0]
.......................... [class]
............................ [0]
.............................. [VALUE](string) = file
.......................... [description]
............................ [0]
.............................. [VALUE](string) = abigail-clancy-1280x1024-25689.jpg
.......................... [size]
............................ [0]
.............................. [VALUE](number) = 219008
.......................... [fullpath]
............................ [0]
.............................. [VALUE](string) = 2014-08-19-53f35ddbf2ab74z81923862/53f35ddbf2z9f4z20990256
 [duplicate]
.. [ITEM]
.... [0]
...... [CLASS]
........ [0]
.......... [VALUE](string) = file
...... [FULLPATH]
........ [0]
.......... [VALUE](string) = 2014-08-19-53f35ddbf2ab74z81923862/53f35ddbf2z9f4z20990256
...... [FREENAME]
........ [0]
.......... [VALUE](string) = abigail-clancy-1280x1024-25689(1).jpg




*/
