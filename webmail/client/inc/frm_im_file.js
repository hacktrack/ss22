_me = frm_im_file.prototype;
function frm_im_file(){};

/**
 * @brief
 * 
 * @see  IM/new group
 */
_me.__constructor = function(oXMPP, sUser) {

	var me = this;
	
	this.__xmpp = oXMPP;

	this.__to = sUser;

	this._size(450,248,true);
	this._resizable(false);

	this._title(getLang('IM::SEND_FILE')+' - '+(dataSet.get('xmpp', ['roster', sUser,'name']) || sUser), true);

	
	this.x_btn_ok._disabled(true);

	this._draw('frm_im_file','main');

	this.att._oncontext = null;

	this.att._onuploadstart = function(){
		me.x_btn_ok._disabled(true);
		me.x_btn_cancel._disabled(true);
	};
	this.att._onuploadend = function(){
		me.x_btn_ok._disabled(false);
		me.x_btn_cancel._disabled(false);
	};
	this.att._onchange = function(){
		var b = Is.Empty(this.list._value());
		me.x_btn_ok._disabled(b);
	};

	//disable popup close during upload
	this._onclose = function (){
		return !this.x_btn_cancel._disabled();
	};
	
	// Create 'OK' button
	this.x_btn_ok._onclick = function() {

		var v = me.att._value(),
			sFolder,
			sFile;

		for (var i in v)
			if (v[i] && v[i].values && v[i].values.fullpath){

				sFolder = v[i].values.fullpath.substring(0,v[i].values.fullpath.lastIndexOf('/'));
                if (v[i].values['class'] == 'item')
					sFolder = sFolder.substring(sFolder.indexOf('/')+1);

				sFile = v[i].values.fullpath.substring(v[i].values.fullpath.lastIndexOf('/')+1);

				if (window.sPrimaryAccountSOCKS)
     				me.__xmpp.stream_send(sFolder,sFile, v[i].values['class'],v[i].values.size, v[i].values.description,me.__to,me.text._value());
				else
					me.__xmpp.oob_send(sFolder,sFile, v[i].values['class'], me.__to,me.text._value());
			}

		me._destruct();
	};

	//Registr DropZone
	this.att._dropzone(this.__eContainer);
};