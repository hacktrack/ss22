_me = obj_search_wizard.prototype;
function obj_search_wizard(){};

_me.__constructor = function(sType,oCallBack,bCreateFolder){
	var me = this;

	this.__sType = sType.toLowerCase();
	this._draw('search_wizard_' + this.__sType, 'main', {fulltext:sPrimaryAccountFULLTEXT});

	//init controls
	if (this.X_BEFORE && this.X_AFTER){

		this.before.__bNoEmpty = true;
		this.X_BEFORE._onchange = function() {
			me.before._disabled(!this._value());

			if (this._value())
				if (!me.before._getObjectDate()){
					if (me.after._getObjectDate())
						me.before._value(me.after._getObjectDate());
					else
						me.before._value(new IcewarpDate());
				}
		};

		this.after.__bNoEmpty = true;
		this.X_AFTER._onchange = function() {
			me.after._disabled(!this._value());

			if (this._value())
				if (!me.after._getObjectDate()){
					if (me.before._getObjectDate())
						me.after._value(me.before._getObjectDate());
					else
						me.after._value(new IcewarpDate());
				}
		};
	}

	if (bCreateFolder) {
		var a = document.createElement('a');
		a.appendChild(document.createTextNode(getLang('SEARCH::MAKEFOLDER')));
		a.onclick = function(e) {
			gui._create('frm_virtual','frm_virtual','','',Path.split(dataSet.get('active_folder'))[1],me._value());
			me._destruct();
		};
		this._main.appendChild(a);
	}

	if (oCallBack){
		this._create('x_search','obj_button');
		this.x_search._value('FORM_BUTTONS::SEARCH');
		this.x_search._onclick = function(){
			executeCallbackFunction(oCallBack,me._value());
			me._destruct();
		};
	}

	//set focus to the first input
	setTimeout(function(){
		try{
		var obj = me._getChildObjects();
		for(var i in obj)
			if (obj[i]._focus){
				obj[i]._focus();
				break;
			}
		}catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
	},100);

	AttachEvent(this._main, 'onkeydown', function(e){
		var e = e || window.event;
		if (e.keyCode == '27'){
			executeCallbackFunction(oCallBack);
			me._destruct();
		}
	});

	//bind onsubmit
	var inp = this._getChildObjects();
	for (var i = inp.length-1;i>=0;i--)
		if (inp[i]._type == 'obj_input'){
			if (!inp[i]._onsubmit)
				inp[i]._onsubmit = function(){
					me.x_search._onclick();
				};

			if (!inp[i]._onclose)
				inp[i]._onclose = function(){
					executeCallbackFunction(oCallBack);
					me._destruct();
				};
		}
};

_me._value = function(str){
	//set
	if (Is.Defined(str)){
		var aData = this._parse(str);

		//Control data
		if (aData.before && (aData.before = new IcewarpDate(aData.before)) != NaN)
			this.X_BEFORE._value(1);
		else
			delete aData.before;

		if (aData.after && (aData.after = new IcewarpDate(aData.after)) != NaN)
			this.X_AFTER._value(1);
		else
			delete aData.after;

		loadDataIntoForm(this,aData);
	}
	//get
	else{
		var aValues = {},
			aOut = [];

		storeDataFromForm(this,aValues);

		for (var i in aValues){

			if (Is.String(aValues[i]))
				aValues[i] = aValues[i].trim();

			switch(i){
			case 'private':
			case 'busy':
			case 'free':
			case 'done':
				if (aValues[i])
					aOut.push('is:'+i);
				break;

			case 'attachment':
				if (aValues[i])
					aOut.push('has:'+i);
				break;

			case 'any':
				if (Is.String(aValues[i]) && aValues[i].length)
					aOut.push(aValues[i]);
				break;

			case 'before':
				if (this.X_BEFORE._value() && aValues[i]){
					var d = IcewarpDate.julian(aValues[i], false, {calendar: IcewarpDate.Calendars.GREGORIAN});

					aOut.push(i+':'+d.format('searchDate'));
				}
				break;

			case 'after':
				if (this.X_AFTER._value() && aValues[i]){
					var d = IcewarpDate.julian(aValues[i], false, {calendar: IcewarpDate.Calendars.GREGORIAN});

					aOut.push(i+':'+d.format('searchDate'));
				}
				break;

			default:
				if (aValues[i] && Is.String(aValues[i])){

					switch(i){
					case 'from':
					case 'to':
					case 'subject':
						if (aValues[i].indexOf(' ')>-1 && !(aValues[i].charAt(0) == '(' && aValues[i].charAt(aValues[i].length-1) == ')'))
							aValues[i] = '('+ aValues[i] +')';

						break;

					default:
						if (aValues[i].indexOf(' ')>-1 && !((aValues[i].charAt(0) == '"' && aValues[i].charAt(aValues[i].length-1) == '"') || (aValues[i].charAt(0) == '(' && aValues[i].charAt(aValues[i].length-1) == ')'))){
							if (aValues[i].toLowerCase().indexOf(' and ')>-1 || aValues[i].toLowerCase().indexOf(' or ')>-1)
								aValues[i] = '('+ aValues[i] +')';
							else {
								aValues[i] = aValues[i].replace(/\"/g,'\\"');
								aValues[i] = '"'+ aValues[i] +'"';
							}
						}
					}

					aOut.push(i+':'+aValues[i]);
				}
			}
		}

		return aOut.join(' ');
	}
};

// Parse search string into array
_me._parse = function(str){

	var str = str.trim() + ' ';

	var sChar = '',
		out = {'any':''},
		flags = {
		'slash':false,
		'word': '',
		'block': false,
		'block2': 0,
		'key':false
		};

	for(var i = 0;i<str.length;i++){
		sChar = str.charAt(i);

		if (flags.slash)
			flags.word += sChar;
		else
		switch(sChar){
		case '\\':
				flags.slash = true;
				continue;
		case '"':
			flags.block = !flags.block;
			break;

		case '(':
			if (flags.block2)
				flags.word += sChar;

			flags.block2++;
			break;

		case ')':
			if (flags.block2>0)
				flags.block2--;

			if (flags.block2)
				flags.word += sChar;

			break;

		case ' ':
			if (flags.block || flags.block2>0)
				flags.word += sChar;
			else
			if (flags.key){

				if (flags.key == 'is' || flags.key == 'has')
					out[flags.word] = true;
				else
					out[flags.key] = flags.word;

				flags.word = '';
				flags.key = '';
			}
			else
			if (flags.word){
				out['any'] += ' ' + flags.word;
				flags.word = '';
			}

			break;

		case ':':
			if (flags.word && !flags.block && !flags.block2){
				flags.key = flags.word;
				flags.word = '';
				break;
			}

		default:
			flags.word += sChar;
		}

		flags.slash = false;
	}

	out['any'] = out['any'].trim();
	if (out['any'] == '' || out['any'] == '?')
		delete out['any'];

	return out;
};
