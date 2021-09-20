_me = obj_attach_multiple.prototype;
function obj_attach_multiple(){};

_me.__constructor = function(sButtonValue){
	var me = this;

	this.__settings = {
		post_params:{sid:dataSet.get('main',['sid']),swf:1},
		queue_limit:0
	};

	this.__drop_files = [];

	this.__eIN = this._getAnchor('file');
	this.__init();

	this.__eButton = this._getAnchor('button');

	if (sButtonValue)
		this.__eButton.value = getLang(sButtonValue);
	else
		this.__eButton.title = getLang('ATTACHMENT::UPLOAD');

	this._main.onclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (!me.__disabled && elm != me.__eIN)
			me.__eIN.click();
	};
};

_me.__init = function(bRedraw){

	if (bRedraw){
		var elm = mkElement('input',{'type':'file','id':this.__eIN.id,'className':this.__eIN.className,'accept':this.__eIN.accept});
		if (Is.Defined(this.__eIN.getAttribute('multiple')))
			elm.setAttribute('multiple','');

		elm.disabled = this.__disabled;
		this.__eIN.parentNode.replaceChild(elm,this.__eIN);
		this.__eIN = elm;
	}

	var me = this;
	this.__eIN.addEventListener("change", function(e){
		if (e.target.files.length && me.__ondropfile)
			me.__ondropfile(e.target.files);
	},false);
};

_me.__initFile = function (bDisabled){
	this.__eButton.disabled = bDisabled?true:false;
};

/**
 * SYSTEM: server vrati info o folder
 **/
_me._setPostParam = function (sName,sVal){
	if (this.__settings && Is.Defined(sName)){
		if (Is.Defined(sVal))
			this.__settings.post_params[sName] = sVal;
		else
			delete this.__settings.post_params[sName];
	}
};

_me._setFolder = function (sFolder){
	this._setPostParam('folder',sFolder);
	//this.__settings.post_params['folder'] = sFolder;
};
_me._getFolder = function (){
	return this.__settings.post_params['folder'];
};

/**
 * Extended features
 **/
_me._setFileQueueLimit = function (i){
	this.__settings.queue_limit = Is.Number(i)?i:0;
};
_me._setMultipleSelection = function (b){
	if (b)
		this.__eIN.setAttribute('multiple','');
	else
		this.__eIN.removeAttribute('multiple','');
};
_me._setFileTypes = function (sTypes){
	if (sTypes)
		this.__eIN.setAttribute('accept',sTypes);
	else
		this.__eIN.removeAttribute('accept');
};

/**
 * Handle XHR Upload
 **/

_me.__ondropfile = function(files,aHandler){

	if (files.length && files[0]){

		var f,q = files.length;

		// convert dataTransfer.files into Array
		if ((f = this.__drop_files.length)){

			if (this.__settings.queue_limit>0 && q+f>this.__settings.queue_limit)
				q += f - this.__settings.queue_limit;
		}
		else
		if (this.__settings.queue_limit>0 && q>this.__settings.queue_limit)
			q = this.__settings.queue_limit;

		for (var i = 0;i<q;i++)
			if (files[i].size > 0)
				this.__drop_files.push(files[i]);
			else
				gui.notifier._value({type: 'alert', args: {text: 'NOTIFICATION::EMPTY_FILE'}});

		if (!f && this.__drop_files.length){

			if (this._onuploadstart)
				this._onuploadstart();
			this.__exeEvent('onuploadstart',null,{"owner":this});

			this.__handleFile(aHandler);
		}
	}
};


_me.__handleFile = function(aHandler){

	// Check sizes for all files before starting upload if needed
	if(sPrimaryAccountULIMIT && this.__drop_files.length) {
		var maxsize = sPrimaryAccountULIMIT*1048576;
		for(var i=this.__drop_files.length; i--;)
			if (maxsize<this.__drop_files[i].size) {
				gui.notifier._value({type: 'alert', args: {header: 'ATTACHMENT::UPLOAD', text: 'UPLOAD::ERROR1', args: [sPrimaryAccountULIMIT]}});
				this.__drop_files.splice(i,1);
			}
	}

	/*
	file.type;
	file.size;
	file.name;
	*/

	var file = this.__drop_files[0];

	if (!file){
		//redraw file-input for webkit
		this.__init(true);

		if (this._onuploadend)
			this._onuploadend();
		this.__exeEvent('onuploadend',null,{"owner":this});
		return;
	}

	// create HTTPRequest
	var xhr = new XMLHttpRequest();
		xhr.open("POST", "server/upload.php", true);

	// create form
	if (window.FormData){
		var fd = new FormData();
		if (this._getFolder())
			fd.append("folder", this._getFolder());

		for (var sParam in this.__settings.post_params)
			fd.append(sParam, this.__settings.post_params[sParam]);

		fd.append("file", file);
	}
	/*
	else{
		var boundary = +new IcewarpDate(),
			fd = '',
			aForm = clone(this.__settings.post_params);
		if (this._getFolder())
			aForm.folder = this._getFolder();

		for(var i in aForm)
			fd += "--" + boundary + "\r\nContent-Disposition: form-data; name=\""+ i +"\"\r\n\r\n"+ aForm[i] +"\r\n";

		var fileData;
		if (file.getAsBinary && (fileData = file.getAsBinary())){
			fd += "--" + boundary + "\r\nContent-Disposition: form-data; name=\"file\"; filename=\""+ file.name +"\"\r\n";
			fd += "Content-Type: application/octet-stream\r\n\r\n";
			fd += fileData + "\r\n";
		}
		else{
				alert('file Reader needed');
				return;
		}
		fd += "--"+ boundary +'--';

		xhr.setRequestHeader("Content-Type", "multipart/form-data, boundary="+boundary);
		xhr.setRequestHeader("Content-Length", file.size);
	}
	*/

	// send HTTPRequest
	var me = this;
	xhr.upload.addEventListener("progress", function(evn) {
		if (me._onuploadprogress && evn.lengthComputable)
			me._onuploadprogress(file,evn.loaded,file.size,xhr);
		me.__exeEvent('onuploadprogress',null,{"owner":me});
	}, false);


	xhr.upload.addEventListener("abort", function(evn) {

		var file = me.__drop_files.shift();

		if (me._onuploadaborted)
			me._onuploadaborted(file);

		me.__exeEvent('onuploadaborted',null,{"owner":me});
		me.__handleFile(aHandler);
	}, false);


	xhr.upload.addEventListener("error", function(evn) {
		me.__drop_files = [];
		me.__handleFile(aHandler);
	}, false);

	xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			if ((this.status >= 200 && this.status <= 200) || this.status == 304) {
				if (this.responseText != ""){

					if (this.getResponseHeader("Content-Type").split(';')[0] == 'text/json'){

						var aResponse = JSON.parse(this.responseText);

						me._setFolder(aResponse.folder);

						var out = {
								folder:aResponse.folder,
								id:aResponse.id,
								name:file.name.replace(/[\/\\:?"<>|~*]/g,'_'),
								size:file.size
							};

						if (aHandler)
						    executeCallbackFunction(aHandler,aResponse,me.__drop_files.shift(),out);
						else
							me.__drop_files.shift();

						if (me._onuploadsuccess)
							me._onuploadsuccess(out);
						me.__exeEvent('onuploadsuccess',null,{"owner":me});

						//handle next...
						me.__handleFile(aHandler);
					}
					//-- Error
					else{
						me.__drop_files = [];

                       	me.__handleFile(aHandler);

						var s, pos = this.responseText.indexOf(':');
						if (pos>-1){
							var i = parseInt(this.responseText.substr(pos+2),10);

							if (!Is.Number(i) || !(s = getLang('UPLOAD::ERROR'+i,'',true)))
                                s = this.responseText;
						}
						else
							s = this.responseText;

						gui.notifier._value({type: 'alert', args: {header: '', text_plain: s}});
					}
				}
			}
		}
	};

	xhr.send(fd);
};

_me._disabled = function(b){

	if (Is.Defined(b)){
		this.__disabled = b?true:false;

		this.__eButton.disabled = this.__disabled;
		window[b?'addcss':'removecss'](this._main,'disabled');

		if (this.__eIN)
			this.__eIN.disabled = this.__disabled;
	}

	return this.__disabled;
};
