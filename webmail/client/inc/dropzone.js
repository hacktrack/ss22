/**
 * Drop Zone
 * @params:
 *		__eDropZone     // DropZone <div> elm
 *      __dropAnchor    // Anchor for DropZone elm
 *
 * @method:
 * 		_ondropfile(<fileList>);
 **/
_me = dropzone.prototype;
function dropzone(){};

_me.__constructor = function(){
    this.__dropzones = [];

    //Unregistr Drag & Drop Upload
	this._add_destructor('__remove_dropzone');
};

_me._dropzone = function(eAnchor, body, css, callback){
	if (window.FormData){
		this.__dropzones.push({anchor: (eAnchor || this._main), body:body, css:css, callback: callback});

		if (this.__dropzones.length == 1)
			gui.frm_main._registr_dropzone(this);
	}
};

_me.__remove_dropzone = function(eAnchor){
	if (eAnchor)
		this.__dropzones = this.__dropzones.filter(function(z){
			return z.anchor !== eAnchor;
		});
	else
		this.__dropzones = [];

	if (!this.__dropzones.length)
		gui.frm_main._remove_dropzone(this);
};

_me._showDropZone = function(e) {

	for (var z, i = this.__dropzones.length-1;i>=0;i--){

		z = this.__dropzones[i];

		if (!z.anchor.parentNode){
			this.__remove_dropzone(z.anchor);
			continue;
		}

		if (e && (!this._ondropzone || this._ondropzone(e)!== false)){

			//zone
			z.zone = mkElement('div', {className:'dropzone'});
			if (z.css)
				addcss(z.zone, z.css);

			var tmpBody = z.body || '<div class="info"><h2>'+ getLang('ATTACHMENT::DROPZONE') +'</h2></div>';
			if (Is.String(tmpBody))
				z.zone.innerHTML = tmpBody;
			else
				z.zone.innerHTML = tmpBody();

			//mask
			var elm = mkElement('div', {className:'mask'});
				elm.addEventListener("dragenter", function(e){

					e.preventDefault();
					e.stopPropagation();
					addcss(z.zone,'active');

				},false);

				elm.addEventListener("dragleave", function(e){

					e.preventDefault();
					e.stopPropagation();
					removecss(z.zone,'active');

				},false);

				elm.addEventListener("drop", function(e){

					e.preventDefault();
					e.stopPropagation();
					e.cancelBubble = true;

					var files = [];
					for(var i = 0; i < e.dataTransfer.files.length; i++) {
						var file = e.dataTransfer.files[i];
						(file.size || file.type) && files.push(file);
					};
					if (files.length && this.__ondropfile)
						this.__ondropfile(files);
					else
						gui.notifier && gui.notifier._value({type: 'empty_file'});

					return false;
				}.bind(this), false);

			z.zone.appendChild(elm);
			z.anchor.appendChild(z.zone);
			z.callback && z.callback(z.zone);
		}
		else
		if (z.zone){
			if (z.zone.parentNode)
				z.zone.parentNode.removeChild(z.zone);

			delete z.zone;
		}
	}
};
