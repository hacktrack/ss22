/*****************************************************
 * Extension script: TextArea form object
 *
 * INHERITS FROM obj_form_generic
 *    _me._value
 *    _me._disabled
 *    _me.__update
 *
 *****************************************************/

_me = obj_upload.prototype;
function obj_upload(){};

/**
* @brief: CONSTRUCTOR, create upload HTML element to __eIN variable
* @date : 20.4.2006 17:24:21
**/
_me.__constructor = function(){
	var elm = this._main;
	this.__eIN = elm.getElementsByTagName('input')[0];
	this._elm=elm;

	elm.enctype = "multipart/form-data";
	elm.method = "post";

	this.__eUpl = this._main.appendChild(mkElement('input',{type:'file',name: this._name,multiple: 'multiple', style: 'display:none'}));

	var me = this;

	/*** ADD EVENTS ***/
	this.__eIN.onclick = this._main.onclick = function (e){
		var elm = e.target;

		if (!me._disabled()){
			if (elm == me._main)
				me._focus();
			
			if (me._onclick)
				me._onclick(e);
		}
		// Initiate upload
		me.__eUpl.click();

		e.stopPropagation();
	};

	// ONFOCUS
	this.__eIN.onfocus = function(e){
		me.__hasFocus = true;

		if (me._onfocus) me._onfocus(e);
		me.__exeEvent('onfocus',e,{"owner":me});

		addcss(me._main, 'focus');
		return true;
	};

	// ONBLUR
	this.__eIN.onblur = function(e){
		me.__hasFocus = false;

		if (me._onblur && me._onblur(e) === false) return false;
		me.__exeEvent('onblur',e,{"owner":me});
		
		removecss(me._main, 'focus');
		return true;
	};


	this._main.oncontextmenu = function(e){
		var elm = e.target;

		if (me._oncontext && me._oncontext(e) !== false)
			me.__exeEvent('oncontext',e,{"owner":me});		

		//return false;
	};

	this._main.onkeydown = function(e){
		if (!me._disabled() && me._onkeypress)
			me._onkeypress(e);

		return true;
	};

	this.__allow = false;

	this.__file = {
		content: ''
	}

	this._title("GENERIC::UPLOAD");

	// Fire onfile with file data when files selected
	this.__eUpl.addEventListener('change',function(e){
		// Currently only handling one single file
		if(this.files[0]) {
			me.__parseFiles(this.files);
		}
	});

};

_me._imagesOnly = function() {
	this.__mimesTypesAllowed = {
		'image/gif': true,
		'image/jpeg': true,
		'image/png': true
	};
}

_me._mimetypes = function(types) {
	if(!this.__mimesTypesAllowed) {
		this.__mimesTypesAllowed = {};
	}

	if(types instanceof Array) {
		var i = types.length;
		while(i--) {
			this.__mimesTypesAllowed[types[i]] = true;
		}
	}

	return this.__mimesTypesAllowed;
}

_me._extensions = function(extensions) {
	if(!this.__extensionsAllowed) {
		this.__extensionsAllowed = {};
	}

	if(extensions instanceof Array) {
		var i = extensions.length;
		while(i--) {
			this.__extensionsAllowed[extensions[i]] = true;
		}
	}

	this.__eUpl.setAttribute('accept', extensions.map(function(extension) {
		return '.' + extension;
	}).join(','));

	return this.__extensionsAllowed;
}

_me._displayElement = function(elm) {
	if(elm==undefined) {
		return this.__displayElement;
	} else {
		this.__displayElement = elm;
	}
}

_me._droparea = function(elm) {
	var me = this;

	function preventDefault(e) {
		e.preventDefault();
	}

	elm.addEventListener('dragover',preventDefault,false);
	elm.addEventListener('dragenter',preventDefault,false);

	elm.addEventListener('drop',function(e){
		var files = e.dataTransfer.files;
		me.__parseFiles(files);
		e.preventDefault();
	},false);
}

_me.__parseFiles = function(files) {
	var me = this;

	var file = files[0];
	var reader = new FileReader();
	// Collect file properties
	var upload = {
		name: file.name,
		type: file.type,
		size: file.size
	}
	// Add extension if possible
	if(file.name.indexOf('.')!=-1) {
		upload.extension = file.name.substr(file.name.lastIndexOf('.')+1);
	}
	// Add file content when loaded
	reader.addEventListener("load", function () {
		upload.content = reader.result;
		me.__file = upload;
		if(me.__mimesTypesAllowed) {
			if(!(upload.type in me.__mimesTypesAllowed) && !me.__mimesTypesAllowed[upload.type]) {
				me._onmimetypeerror && me._onmimetypeerror(upload.type);
				return false;
			}
		}
		if(me.__extensionsAllowed) {
			if(!(upload.extension in me.__extensionsAllowed) && !me.__extensionsAllowed[upload.extension]) {
				me._onextensionerror && me._onextensionerror(upload.extension);
				return false;
			}
		}
		if(me.__apivalue) {
			// If a property is assigned but with NoValue type, change it to Image
			if(me.__apivalue.value===null) {
				me.__apivalue = me.__apivalue.changeType('Image');
			}

			me.__apivalue.contenttype.value = upload.type;
			me.__apivalue.base64data.value = upload.content.split("base64,")[1];

			if(me.__displayElement) {
				me.__displayElement.style.backgroundImage = 'url('+upload.content+')';
			}
		}
		me._onfile && me._onfile(upload);
	}, false);
	// Make file available as url
	reader.readAsDataURL(file);
}

_me._title = function(sValue){
	if(sValue==undefined) {
		return this.__eIN.value;
	} else {
		this.__eIN.value = sValue.indexOf('::')!=-1?getLang(sValue):sValue;
	}
};

_me._value = function(base64image,imagetype){
	if(base64image && imagetype) {
		this.__file.content = "data:"+imagetype+';base64,'+base64image;
	} else {
		return this.__file.content;
	}
};

_me._setValue = function(imgprop) {
	this.__apivalue = imgprop;

	if(this.__displayElement && !imgprop.denied && imgprop.contenttype && imgprop.base64data) {
		this.__displayElement.style.backgroundImage = "url(data:"+imgprop.contenttype+';base64,'+imgprop.base64data+")";
	}

	if(imgprop.readonly) {
		this._readonly(true);
	}

	if(imgprop.denied) {
		this._main.setAttribute('is-hidden','1');
	}

}

_me._reset = function() {
	this.__file = {
		content: ''
	}
}

_me._info = function() {

}

_me._file = function() {

}

_me._files = function() {

}
