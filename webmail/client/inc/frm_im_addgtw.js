_me = frm_im_addgtw.prototype;
function frm_im_addgtw(){};

/**
 * @brief
 */
_me.__constructor = function(xmpp, jid) {
	this._size(400,300,true);

	this._title('IM::ADD_SERVICE');

	this.__obj = [];
	this.__xmpp = xmpp;
	this.__jid = jid;

	// Create 'OK' button
	this.x_btn_ok._disabled(true);

	xmpp._gateway_registr('',jid,[this,'__registr']);
};

/*
[QUERY]
.. [0]
.... [USERNAME]
...... [0]
.... [PASSWORD]
...... [0]
.... [INSTRUCTIONS]
...... [0]
........ [VALUE](string) = Please enter your username and password
.... [ATTRIBUTES]
...... [XMLNS](string) = jabber:iq:register
[ATTRIBUTES]
.. [ID](string) = 799421682215594201244709021710
.. [FROM](string) = 007guard.com
.. [TO](string) = admin@merakdemo.com/Webmail
.. [TYPE](string) = result
*/
_me.__registr = function(aData){

	if (aData && aData.IQ && (aData = aData.IQ[0]) && aData.ATTRIBUTES.TYPE == 'result'){
		var sInfo = '', me = this;

		if (aData.QUERY[0].REGISTERED){
            this.__obj = [];
			sInfo = getLang('IM::REGISTRED');

			//Button REMOVE
			addcss(this.x_btn_ok._main,'color2');
			this.x_btn_ok._value('FORM_BUTTONS::REMOVE');
			this.x_btn_ok._onclick = function() {
				me.__xmpp._user_remove([me.__jid],[function(){me._destruct()}]);
			};
			this.x_btn_ok._disabled(false);
		}
		else{
			for (var i in aData.QUERY[0])
				if (i == 'ATTRIBUTES')
				    continue;
				else
				if (i == 'INSTRUCTIONS')
					sInfo = aData.QUERY[0].INSTRUCTIONS[0].VALUE;
				else
					this.__obj.push({id:'X_'+this.__obj.length,name:i.toLowerCase(),type:i=='PASSWORD'?'obj_password':'obj_input'});

			//Button OK
			this.x_btn_ok._onclick = function() {
				var aData = {};

				//Collect data
				if (me.__obj.length)
					for(var i in me.__obj)
						aData[me.__obj[i].name.toUpperCase()] = [{VALUE:me[me.__obj[i].id]._value()}];

					me.__xmpp._gateway_registr(aData,me.__jid,[me,'__response']);
			};

			this.x_btn_ok._disabled(false);
		}

		if (this.__obj.length || sInfo){
			this._draw('frm_im_addgtw','main',{form:this.__obj,info:sInfo});
			if (this.__obj.length)
				this[this.__obj[0].id]._focus();
		}
	}
	else
	    this._destruct();
};

_me.__response = function(aData){
	if (aData && aData.IQ && (aData = aData.IQ[0]) && aData.ATTRIBUTES && aData.ATTRIBUTES.TYPE == 'result')
		this._destruct();
	//Error?
	else
        gui.notifier._value({type: 'alert', args: {header: '', text: 'IM::ERROR_REGISTR'}});
};