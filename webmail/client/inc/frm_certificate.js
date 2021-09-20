_me = frm_certificate.prototype;
function frm_certificate(){};

/**
 * View Certificate
 */
_me.__constructor = function(aData,oParent) {

	var me = this;

    this._resizable(false);
	this._size(450,450,true);

	this._title ('CERTIFICATE::CERTIFICATE');

	var aOut = {purposes:{},data:aData};
		aOut.from =	IcewarpDate.utct(aData.VALIDFROM[0].VALUE).format('L LT');
	    aOut.to = IcewarpDate.utct(aData.VALIDTO[0].VALUE).format('L LT');

	if (aData.PURPOSES && aData.PURPOSES[0] && aData.PURPOSES[0].ITEM)
	    for (var i in aData.PURPOSES[0].ITEM)
			if (aData.PURPOSES[0].ITEM[i].VAR1 && aData.PURPOSES[0].ITEM[i].VAR1[0] && aData.PURPOSES[0].ITEM[i].VAR1[0].VALUE == '1' &&
				aData.PURPOSES[0].ITEM[i].VAR3 && aData.PURPOSES[0].ITEM[i].VAR3[0] && aData.PURPOSES[0].ITEM[i].VAR3[0].VALUE)
				switch(aData.PURPOSES[0].ITEM[i].VAR3[0].VALUE){
				case 'sslclient':
					aOut.purposes.SSL = true;
				    break;
				case 'smimeencrypt':
				case 'smimesign':
					aOut.purposes.SMIME = true;
				    break;
				}

	this._draw('frm_certificate', 'main', aOut);

	// Create 'OK' button
	this._create('btn_ok', 'obj_button', 'footer', 'noborder simple ok color1');
	this.btn_ok._value('FORM_BUTTONS::OK');
	this.btn_ok._onclick = function() {
		me._destruct();
	};

	// Create 'OK' button
	if (oParent){
		this._create('btn_download', 'obj_button', 'footer', 'noborder simple download');
		this.btn_download._value('ATTACHMENT::DOWNLOAD');
		this.btn_download._onclick = function() {
			var v = oParent.attachments._value();
			if (v.length)
				oParent._save(v[0]);
		};
	}

	this.btn_ok._focus();
};