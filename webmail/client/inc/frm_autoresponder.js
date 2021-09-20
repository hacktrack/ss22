_me = frm_autoresponder.prototype;
function frm_autoresponder(){};

_me.__constructor = function() {
	var me = this;

	//init buttons
	this.x_add._onclick = function(){
		var s = (this._parent.x_personality._value() || '').trim();

		if (!s) return;

		var aEmail = MailAddress.splitEmailsAndNames(s);
			s = MailAddress.createEmail(aEmail[0].name,aEmail[0].email);

		if (!s) return;

		//domains are unigue
		var old = this._parent.x_persons._value();
		for(var i in old)
			if(old[i].person == s) return;

		this._parent.x_persons._add([{'person':s}]);

		this._parent.x_personality._value('');
		this._parent.x_personality._focus();
	};

	this.x_personality._onsubmit = function(){
		this._parent.x_add._onclick();
	};

	this.x_remove._onclick = function(){
		this._parent.x_persons._removeSelected();
	};

	this.u_respondbetweenfrom.input._onchange = function() {
		var from_date = me.u_respondbetweenfrom._value();
		var to_date = me.u_respondbetweento._value();
		if (from_date > to_date)
			me.u_respondbetweento._value(from_date);
	};

	this.u_respondbetweento.input._onchange = function() {
		var from_date = me.u_respondbetweenfrom._value();
		var to_date = me.u_respondbetweento._value();
		if (from_date > to_date)
			me.u_respondbetweenfrom._value(to_date);
	};

	this.u_respond._onchange = function() {
		var v = this._value(),b = false;
		if (v == '0')
		    b = true;

		if (v == '3')
            me.u_respondperiod._disabled(false);
		else
		    me.u_respondperiod._disabled(true);

		//me.x_from._disabled(b);
		me.x_subject._disabled(b);
		me.x_respondercontent._disabled(b);
		me.u_respondonlyiftome._disabled(b);
		me.u_respondbetweenfrom._disabled(b);
		me.u_respondbetweento._disabled(b);
		//me.u_norespondfor._disabled(b);

		//norespondfor
		me.x_persons._disabled(b);
		me.x_add._disabled(b);
		me.x_remove._disabled(b);
		me.x_personality._disabled(b);
	}

	this.u_respond._onchange();
};

_me._value = function(aValues) {
	if (Is.Defined(aValues)) {
		loadDataIntoFormOnAccess(this, aValues);
		this.__parseContent(aValues['VALUES']['u_respondercontent']);

		//u_norespondfor
		if (aValues['VALUES']['u_norespondfor']){
			var tmp = [],
				persons = aValues['VALUES']['u_norespondfor'].split("\n");

			for(var i in persons)
				if (persons[i])
					tmp.push({'person':'<'+persons[i]+'>'});

			this.x_persons._add(tmp);
		}

		this.u_respond._onchange();
	} else {
		var aReturn = {};
		storeDataFromForm(this, aReturn);
		aReturn['u_respondercontent'] = this.__getContent();

        //u_norespondfor
		var arr = [],tmp = this.x_persons._value();
		for(var i in tmp)
			if (tmp[i].person)
				arr.push(tmp[i].person.trim());
		aReturn['u_norespondfor'] = arr.join("\n").replace(/[\<\>]/g,'');

		return aReturn;
	}
};

_me.__parseContent = function (sContent) {
	var aTmp = sContent.split("\n");
	var aRest = [];

	for (var i in aTmp){
		if (aTmp[i].substring(0,2) == '$$' && aTmp[i].substring(aTmp[i].length-2) == '$$') {
			var del,nam,val;
			del = aTmp[i].indexOf(' ',2);
			nam = aTmp[i].substring(2,del);
			val = aTmp[i].substring(del+1,aTmp[i].length - 2);
			switch (nam) {
				case 'setactualfrom':
					//this.x_from._value(val);
					break;

				case 'setsubject':
					this.x_subject._value(val);
					break;

				default:
					aRest.push(aTmp[i]);
					continue;
			}
		}
		else
			aRest.push(aTmp[i]);
	}

	this.x_respondercontent._value(aRest.join('\n'));
}

_me.__getContent = function (aValues) {
	//var s1 = this.x_from._value(),
	var s2 = this.x_subject._value(),
		sResult = '';
/*
	if (s1)
		sResult += '$$setactualfrom ' + s1 + '$$\n';
*/
	if (s2)
		sResult += '$$setsubject ' + s2 + '$$\n';

	sResult += this.x_respondercontent._value();
	return sResult;
}

_me._parseRespond = function (){


}