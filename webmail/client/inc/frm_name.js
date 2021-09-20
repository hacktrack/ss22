_me = frm_name.prototype;
function frm_name(){};

/**
 * Creates Full Name from given values
 */
_me.__constructor = function(oInput,aLCTval) {
	var me = this;

	this._title('CONTACT::FULL_NAME');

    this._resizable(false);
    this._dockable(false);
	this._size(400,280,true);
	this._modal(true);

    this._draw('frm_name', 'main');

	var aLang = getLang('NAME_PREFIX'),
		aFill = {};
	for(var i in aLang)
		aFill[aLang[i]] = aLang[i];
	this.ITMTITLE._fill(aFill);

    aLang = getLang('NAME_SUFFIX');
	aFill = {};
	for(var i in aLang)
		aFill[aLang[i]] = aLang[i];
	this.ITMSUFFIX._fill(aFill);

	//fill it...
	if (oInput && !oInput._destructed && createNameFromLocation(aLCTval) != oInput._value())
		parseNameToLocation(oInput._value(), aLCTval);

	this.ITMTITLE._value(aLCTval.ITMTITLE);
	this.ITMFIRSTNAME._value(aLCTval.ITMFIRSTNAME);
	this.ITMMIDDLENAME._value(aLCTval.ITMMIDDLENAME);
	this.ITMSURNAME._value(aLCTval.ITMSURNAME);
	this.ITMSUFFIX._value(aLCTval.ITMSUFFIX);

	// Create 'OK' button
	this._create('btn_ok', 'obj_button', 'footer','noborder simple color1 ok');
	this.btn_ok._value('FORM_BUTTONS::OK');
	this.btn_ok._onclick = function() {
		if (oInput && !oInput._destructed){
			var out = {
				ITMTITLE:me.ITMTITLE._value().trim(),
				ITMFIRSTNAME:me.ITMFIRSTNAME._value().trim(),
				ITMMIDDLENAME:me.ITMMIDDLENAME._value().trim(),
				ITMSURNAME:me.ITMSURNAME._value().trim(),
				ITMSUFFIX:me.ITMSUFFIX._value().trim()
			};

			oInput._value(createNameFromLocation(out));
            oInput._onblur();
			oInput._focus();

			for (var i in out)
				aLCTval[i] = out[i];
		}

		me._destruct();
	};
};