/**
 * @brief: template engine
 * @date:  6.3.2006 14:36:13
 * @status: final
 * supported elements
 *                     {variable}
 *                     {variable::variable}
 *                     {optional variable}{/optional}
 *                     {dynamic variable}
 *                     {variable::*::variable2}
 *                     {/dynamic}
 **/
_me = cTemplate.prototype;
function cTemplate () {
	this.strict = true;
};

/**
 * @brief: PUBLIC
 * @date : 6.3.2006 15:17:02
 */
_me.tmp = function(sData,aData){
	return this.exe(storage.template(sData),aData);
};

/**
 * @brief: PUBLIC
 * @date : 6.3.2006 15:17:02
 */
_me.exe = function(sTpl,aData){
	this.sBuffer = '';
	if ((this.sTpl = sTpl)){
		if (typeof aData == 'object')
			this.aData = arrConcat(storage.aStorage.language,aData);
		else
			this.aData = storage.aStorage.language;

		this.parser();

		return this.sBuffer;
	}
};

/**
 * @brief: PRIVATE return value from this.aData
 * @date : 6.3.2006 15:16:48
 */
_me.variable = function(elm10,strict) {
	var result = arrayPath(this.aData, elm10.split('::'));

	if (Is.Defined(result))
		return result;
	else
	if (strict)
		return '{'+elm10+'}';
	else
		return '';
};

/**
 * @brief: PUBLIC return anchor ID, _ins must be defined
 * @date : 12.1.2014
 */
_me.anchor = function(elm10) {
	return (this.aData._ins || '') + '#' + elm10;
};

/**
 * @brief: PRIVATE parse template
 * @date : 6.3.2006 15:16:38
 */
_me.parser = function(){

	var sBuffer='', i, result, part, elm10, elm11;

	for (;;) {

		// find start element
		if ((i = this.sTpl.indexOf('{'))<0) break;

		this.sBuffer += this.sTpl.substring(0,i);
		this.sTpl = this.sTpl.substring(i);

		if ((i = this.sTpl.indexOf('}')) == 1) {
			this.sTpl = this.sTpl.substring(2);
			continue;
		}

		// elm part 1
		elm10 = this.sTpl.substring(1,i);

		// elm part 2
		if ((part = elm10.indexOf(" "))>-1) {
			elm11 = elm10.substring(part+1);
			elm10 = elm10.substring(0,part);
		}
		else
			elm11 = null;

		// strip start tag from template
		this.sTpl = this.sTpl.substring(i + 1);

		// execute tag
		switch (elm10) {
		case 'include':
			this.include(elm11);
			break;
		case 'noptional':
			this.option(elm11,1);
			break;
		case 'optional':
			this.option(elm11);
			break;
		case 'dynamic' :
			this.loop(elm11);
			break;
		case 'rdynamic':
			this.option(elm11,1);
			break;

		case 'htmlspecialchars':
			this.sBuffer += (this.variable(elm11,this.strict)).toString().escapeHTML();
			break;
		case 'encodeURIComponent':
			this.sBuffer += encodeURIComponent(this.variable(elm11,this.strict).toString());
			break;

		case 'anchor':
			if (elm11)
				this.sBuffer += this.anchor(elm11);
			break;

		case 'lang':
			elm10 = this.variable(elm11);
		default:
			this.sBuffer += this.variable(elm10,this.strict);
		}
	}

	this.sBuffer += this.sTpl;

};

/**
 * @brief: PRIVATE {option} element parser
 * @date : 6.3.2006 15:16:18
 */
_me.option = function(elm11,bInvert){

	//OR notation
	var b = false, p = this.part((bInvert?'n':'')+'optional');

	if (elm11.indexOf(' ')>-1){
		var a = elm11.split(' ');

		for(var i in a)
			if (this.variable(a[i])){
				b = true;
				break;
			}
	}
	else
	if (this.variable(elm11))
		b = true;

	if ((!b && !bInvert) || (b && bInvert))
		this.sTpl = this.sTpl.substr(p);
};

_me.include = function(elm11){
	var p = this.part('include');

	if (elm11){
		var s = this.sTpl.substr(0, p),
			o = new cTemplate(),
			a;

		try{
			if (s.length)
				a = JSON.parse(s);
		}
		catch(r){
			console.log('template.include', 'JSON error:', s);
		}

		this.sTpl = o.tmp(elm11, a) + this.sTpl.substr(p);
	}
	else{
		console.log('template.include', 'missing template');
		this.sTpl = this.sTpl.substr(p);
	}
};

/**
 * @brief: PRIVATE {dynamic} element parser
 * @date : 6.3.2006 15:15:08
 */
_me.loop = function(elm11,bInvert){

	var p = this.part((bInvert?'r':'')+'dynamic');

	var v = this.variable(elm11);
	if (typeof v != 'object'){
		this.sTpl = this.sTpl.substr(p);
		return;
	}

	if (bInvert) v = reverse(v);

	var segment = this.sTpl.substr(0,p);

	var sBuffer ='',temp = '';

	var exp1 = eval("/\{"+elm11+"\:\:\\*/g"),
		exp2 = eval("/\[ ]"+elm11+"\:\:\\*/g"),
		exp3 = eval("/\:\:"+elm11+"\:\:\\*/g");

	for (var val in v) {
		temp = segment;

		if (temp.indexOf('{'+elm11+'::*')>-1) temp = temp.replace(exp1,'{'+elm11+'::'+val);
		if (temp.indexOf(' '+elm11+'::*')>-1) temp = temp.replace(exp2,' '+elm11+'::'+val);
		if (temp.indexOf('::'+elm11+'::*')>-1) temp = temp.replace(exp3,'::'+elm11+'::'+val);

		sBuffer += temp;
	}
	exp1 = exp2 = exp3 = null;

	this.sTpl = sBuffer + this.sTpl.substr(p);
};

/**
 * @brief : PRIVATE search for block's finish tag (and remove it)
 * @return: position as int
 * @date  : 27.9.2006 11:23:35
 */
_me.part = function(part){
	var tag1 = '{' +part,
		tag2 = '{/'+part+'}',
		i,j,skip=0,start=0;

	for (;;) {
		if((i = this.sTpl.indexOf(tag2,start))<0) return;

		j = this.sTpl.indexOf(tag1,start);
		if (j>-1 && j<i){
			skip++;
			start = this.sTpl.indexOf('}',j+1);
			continue;
		}

		if (skip>0){
			skip--;
			start = i+tag2.length;
			continue;
		}

		this.sTpl = this.sTpl.substr(0,i) + this.sTpl.substr(i+tag2.length);

		return i;
	}
};

template = new cTemplate();
