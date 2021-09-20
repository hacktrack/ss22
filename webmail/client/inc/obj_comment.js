function obj_comment(){};
_me = obj_comment.prototype;

_me.__constructor = function(aData){

	// compatibility for apply(frm_comment)
	this.__aData = aData;
	this.__aid = aData.aid;
	this.__fid = aData.fid;
	this.__iid = aData.EVNCOMEVNID || aData.EVN_ID;

	this._create('list', 'obj_groupchat','','noborder');
	this.list.__options.comments = false;
	this.list._onerror = function(){
		this.text && this.text._disabled(true);
	}.bind(this);

	this.list._serverSort({aid:this.__aid, fid:this.__fid}, true, {sys_search:'comments:' + (WMItems.__serverID(this.__iid))});

	// compatibility for apply(frm_comment)
	this.tabs = {room:{list:this.list}};

	if (WMFolders.getRights([this.__aid, this.__fid]).write) {

		///// Chat input /////
		this._create("text", "obj_chat_input", "", "", {
			parseurl: true,
			block:true,
			remember: true,
			remember_path:[this.__fid, this.__iid],
			smiles_enabled: GWOthers.getItem('CHAT', 'smiles') == '1',
			handlers: {
				file: [this.upload, '_click'],
				attach:[this,'_attachFile'],
				event: [this, '_addEvent', [WMItems.__serverID(this.__iid)]],
				code: [this, '_code']
			},
			memory:{
				set:[function(val){
					dataSet.add('teamchat', [this.__fid, this.__iid, 'input'], val, true);
				}.bind(this)],
				get:[function(){
					return dataSet.get('teamchat', [this.__fid, this.__iid, 'input']) || '';
				}.bind(this)]
			}
		});

		this.text._folder({aid: this.__aid, fid: this.__fid});
		this.text.input._placeholder(getLang('IM::COMMENT_PH'));

		this.text._onsubmit = function (v, arg) {
			if (v.length || (arg && arg.url)) {
				arg = arg || {};
				arg.comevnid = WMItems.__serverID(this.__iid);
				this._message(v, arg, this.text.__private);
			} else
				return false;

		}.bind(this);

		///// Upload /////

		this._create('upload','obj_upload');
		this.upload._onuploadstart = function(){
			//SHOW
			this.text._create('info', 'obj_upload_info', 'block');
			addcss(this.text._main, 'block');

			this.__upload_buffer = [];
		}.bind(this);

		this.upload._onuploadend = function(){

			//HIDE
			removecss(this.text._main, 'block');
			this.text.info && this.text.info._destruct();

			if (!this._destructed && this.__upload_buffer.length){

				if (this.__upload_buffer.length == 1){
					gui._create('chat_upload','frm_chat_upload','','', this.__upload_buffer[0].description, '', {aid:this.__aid, fid:this.__fid}, [function(sName, sDesc, aArgs){
						if (!this._destructed)
							this.__uploadhandler(this.__upload_buffer, sName, sDesc, aArgs, WMItems.__serverID(this.__iid));
					}.bind(this)]);
				}
				else
					this.__uploadhandler(this.__upload_buffer,'','','',WMItems.__serverID(this.__iid));

			}
		}.bind(this);

		this.upload._onuploadsuccess = function(file){

			this.text.info && this.text.info._handler(null);

			this.__upload_buffer.push({
				'class':'file',
				'description':file.name,
				'size':file.size,
				'fullpath':file.folder+'/'+file.id
			});
		}.bind(this);

		this.upload._onuploadprogress = function(file, a, b, xhr){
			this.text.info && this.text.info._value(file.name, a, b, [function(){xhr.abort()}]);
		}.bind(this);

	}
};

_me._code = function () {
	gui._create('insert_code', 'frm_insert_code', '', '', [function (sBody) {
		this._message(sBody, {
			comevnid: WMItems.__serverID(this.__iid)
		});
	}.bind(this)]);
};

_me._attachFile = function(){
	if (this.__aid && this.__fid){
		var sFolder = Mapping.getDefaultFolderForGWType('F');
		if (!dataSet.get('folders', [this.__aid, sFolder]))
			sFolder = '';

		gui._create('insert_item', 'frm_insert_item', '', 'frm_insert_item_nobottomdiv', [this, '__addItems'], this.__aid, sFolder, '', 'r', false, ['F', 'X']);
	}
};

_me.__addItems = function(files) {

	this.__upload_buffer = [];

	files.forEach(function (file) {
		this.__upload_buffer.push({
			'class': 'item',
			'description': file.title,
			'size': file.size,
			'fullpath': file.fullpath
		});
	}, this);

	if (this.__upload_buffer.length == 1) {
		gui._create('chat_upload', 'frm_chat_upload', '', '', this.__upload_buffer[0].description, '', {aid:this.__aid, fid:this.__fid}, [function (sName, sDesc, aArgs) {
			this.__uploadhandler(this.__upload_buffer, sName, sDesc, aArgs, WMItems.__serverID(this.__iid));
		}.bind(this)]);
	} else
		this.__uploadhandler(this.__upload_buffer);
};

_me._message = function(){
	storage.library('frm_comment');
	frm_comment.prototype._message.apply(this,arguments);
};
_me._response = function(){
	storage.library('frm_comment');
	frm_comment.prototype._response.apply(this,arguments);
};
_me.__uploadhandler = function(){
	storage.library('frm_main_chat');
	frm_main_chat.prototype.__uploadhandler.apply(this,arguments);
};
_me._addEvent = function(){
	storage.library('frm_main_chat');
	frm_main_chat.prototype._addEvent.apply(this,arguments);
};