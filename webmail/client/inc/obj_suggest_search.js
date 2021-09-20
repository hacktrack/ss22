_me = obj_suggest_search.prototype;
function obj_suggest_search(){};

_me.__constructor = function(aFolder){
	this._min = 1;
	this._limit = 15;
	this._folder;

	this.__wizard = false;

	if (aFolder)
		this._setFolder(aFolder);
	else
		this._disabled(true);

	this._placeholder(getLang('TAGS::PLACEHOLDER'));

	var me = this;
	this.__setMask({'clear':['&#xe036;',getLang('COMMON::CLEAR')]},
		[function(id){
			if (id == 'clear')
				if (me._value()){
					me._value('');
					if (me._onsubmit)
						me._onsubmit();
				}
		}]);

	this.__eICO = mkElement('a',{className:'input_ico',onclick:function(e){if (me._onsubmit) me._onsubmit();}});
	this._main.appendChild(this.__eICO);
};

	_me._setType = function(sType){
		this.__wizard = false;
		this.__operators = ['tag:','keyword:']; //'OR ','NOT ',
		this.__hints = [];

		var sType = sType.toLowerCase(),
			sIco = sType;

		switch(sType){
        case 'g':
			this.__operators = ['title:','after:','before:','folder:'];
			this.__hints.push('title:','folder:');
			break;
		case 'm':

			if (this._folder && this._folder.fid){
				var aFolder = dataSet.get('folders',[this._folder.aid,this._folder.fid]);
				if (aFolder.RSS){
					sIco = 'r';

					this.__operators.push('has:attachment','from:','to:','subject:','is:unread','is:read','is:flagged','smaller:','greater:','after:','before:','priority:','has:tag');
					this.__hints.push('from:','to:','subject:');

					if (sPrimaryAccountFULLTEXT){
						this.__operators.splice(0,0,'fulltext:');
						this.__hints.push('fulltext:');
					}

					break;
				}
			}

			this.__operators.push('has:attachment','from:','to:','cc:','bcc:','sms:','subject:','is:unread','is:read','is:flagged','smaller:','greater:','after:','before:','priority:','has:tag');
			this.__hints.push('from:','to:','subject:');

			if (sPrimaryAccountFULLTEXT){
				this.__operators.splice(0,0,'fulltext:');
				this.__hints.push('fulltext:');
			}

			this.__wizard = true;
			break;
		case 'c':
			this.__operators.push('name:','email:','company:','department:','note:','is:public','is:private');
			this.__hints.push('name:','email:','company:');
			this.__wizard = true;
			break;
		case 'n':
			this.__operators.push('title:','description:');
			this.__hints.push('title:');
			this.__wizard = true;
			break;
		case 'f':
			this.__operators.push('smaller:','greater:','title:','description:','is:public','is:private','after:','before:');
			this.__hints.push('title:');
			this.__wizard = true;
			break;
		case 't':
			this.__operators.push('title:','description:','is:done','is:public','is:private','after:','before:');
			this.__hints.push('title:');
			this.__wizard = true;
			break;
		case 'j':
		case 'e':
		case 'w':
			this.__operators.push('title:','description:','after:','before:','location:','is:public','is:private','is:free','is:busy');
			this.__hints.push('title:');
			this.__wizard = true;
			break;

		case 'i':
			this.__operators = ['from:','aftertime:','beforetime:','creationdate:'];
			this.__hints.push('from:','aftertime:','beforetime:','creationdate:');
			break;
		}

		this.__eICO.className = 'input_ico type_' + sIco;

		//translate
		var hint;
		for(var i in this.__operators)
			if (hint = getLang('SEARCH_HINTS::'+this.__operators[i].replace(/[\: ]/g,'').toUpperCase()+'_'+sType.toUpperCase(),false,2))
				this.__operators[i] = [this.__operators[i],hint];
			else
			if (hint = getLang('SEARCH_HINTS::'+this.__operators[i].replace(/[\: ]/g,'').toUpperCase()))
				this.__operators[i] = [this.__operators[i],hint];

		//sort
		//this.__operators = this.__operators.sort();
	};

	_me._setFolder = function(aFolder,sType){
		this._disabled(aFolder?false:true);

        this._folder = aFolder;

		var sType = WMFolders.getType(aFolder) || sType;
		if (sType)
			this._setType(sType);
	};
	_me._getFolder = function(){
		return this._folder;
	};

	//DONE
	_me._qdata = function(v){

		var cart = this._getCartPos(),
			block = false, end = false, skip = false, word = [0,0];

		for (var i=0, l=v.length; i<l; i++){
			switch(v.charAt(i)){
            case '\\':
				skip = true;
				break;
            case ')':
			case '(':
			case ' ':
				if (!block){
					if (cart<=i)
						end = true;
					else
						word = [i+1,i+1];
				}
				else
                	word[1] = i+1;

				break;

			case '"':
				if (skip)
	                skip = false;
				else{
					if (cart<=i){
						end = true;
						word[0] = [word[0]-1];
					}
					else
						word = [i+1];

	                block = !block;
				}

			default:
            	word[1] = i+1;
			}

			if (end) break;
		}

		v = v.substring(word[0],word[1]).toLowerCase();
		this.__last_pos = [word[0],word[1],v];
		return v;
	};


	_me._qvalue = function(v){
        if (Is.Object(v)){
			if (Is.Object(v.callback))
				v = executeCallbackFunction(v.callback);
			else
				v = v.value;
		}

		if (Is.String(v)){
			this._value(this.__input_value.slice(0,this.__last_pos[0]) + v + this.__input_value.substring(this.__last_pos[1]));
			this._setRange(this.__last_pos[0] + v.length);
		}
		else
			this.__skipblur = false;
	};

	_me._query = function(v){

		var tmp, hint, out = [];


		if (this.__operators.length)
			for(var i in this.__operators){
				if (Is.Array(this.__operators[i])){
					tmp = this.__operators[i][0].toLowerCase();
					hint = this.__operators[i][1] || '';
				}
				else{
					tmp = this.__operators[i].toLowerCase();
					hint = '';
				}

				if (v == '?' || !v || (tmp!=v && tmp.indexOf(v)===0))
					out.push({value:tmp, hint:hint});
			}

		//try to create search hint
		if (!out.length && this.__hints.length && v.indexOf(':')<0){
			//check if no : before suggested word
			var skip = false, str = this.__last_pos[2].substring(0,this.__last_pos[0]);
			for (var s,i = str.length-1;i>=0;i--){
				s = str.charAt(i);
				if (s == ':'){
					skip = true;
					break;
				}
				else
				if (s != ' ')
					break;
			}

			if (!skip)
				for(var i in this.__hints)
					out.push({value:this.__hints[i]+v.toString()});
		}

		this._parse(clone(out));

		if (v == 'tag' || v == 'keyword')
			return;
		else
		if (v.indexOf(':')>-1){
			var m = v.match(/^(tag|keyword):\s*(.+)$/i);
			if (m && m[2])
				v ='tag:'+m[2];
			else
				return;
		}

		if (v) {
			var aFilter = {
				search: v.trim(),
				sort: 'TAGNAME',
				limit:this._limit
			};

            if (Is.Object(this._folder))
                aFilter.folder = this._folder.fid;

			WMItems.list({'aid':sPrimaryAccount,'fid':"__@@TAGS@@__",'values':['TAGNAME','TAGCOUNT'],'filter':aFilter},'','','',[this,'__appendTAG',[v,out]]);
		}
	};

	_me.__appendTAG = function(sWord,aOut,aData){
		if (this.__last_pos[2] == sWord){
            aData = aData[sPrimaryAccount]['__@@TAGS@@__'];
			if (parseInt(aData['#'],10)>0){
				delete aData['/'];
	            delete aData['#'];
	            delete aData['$'];
	            delete aData['@'];

				for(var id in aData)
					aOut.push({value:'tag:' + (aData[id].TAGNAME.match(/[ \+\-\!]/g)?'"'+aData[id].TAGNAME+'"':aData[id].TAGNAME), hint:getLang('SEARCH_HINTS::TAG2',[aData[id].TAGNAME,aData[id].TAGCOUNT])});

	            this._parse(aOut);
			}
		}
	};

	_me._parse = function(aValues){
		if (!Is.Array(aValues) || !aValues.length)
			this.__hide();
		else{

			if (this.__wizard && this._createWizard)
				aValues.push({value:getLang('SEARCH::WIZARD'), css:'wizard', callback:[this,'_createWizard']});

			this.__show(aValues);
		}
	};
/*
_me._createWizard = function(){

};
*/