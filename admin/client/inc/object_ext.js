/**
 * @brief copy methods and properties from one class to another one
 * @date  4.4.2006 9:56:24
 */
function objConcat(obj1,obj2){
	for (var i in obj2){
		switch(typeof obj2[i]) {
			case 'object'	: break;
			case 'function'	: break;
			default			: obj1[i] = obj2[i];
		}
	}
	for(var i in obj2.prototype)
		obj1.prototype[i] = obj2.prototype[i];

	return obj1;
};

/**
 * @brief   inherits only selected method from parent obj
 * @syntax  this.swiss(obj,'methodname','methodname');
 */
/*
Function.prototype.swiss = function (parent) {

	if (arguments.length == 1){
		for(var i in parent.prototype)
			this.prototype[i] = parent.prototype[i]
	}

	for(var i = 1; i < arguments.length; i += 1) {
		var name = arguments[i];
		this.prototype[name] = parent.prototype[name];
	}

	return this;
};
*/
// orig metody hodi do _uber
Function.prototype.inherit = function (parent) {

	var d = 0, p = (this.prototype = new parent());

	this.prototype.__uber = function (name) {
		var f, r, t = d, v = parent.prototype;
		if (t) {
			while (t) {
				v = v.constructor.prototype;
				t -= 1;
			}
			f = v[name];
		}
		else {
			f = p[name];
			if (f == this[name]) {
				f = v[name];
			}
		}
		d += 1;
		r = f.apply(this, Array.prototype.slice.apply(arguments, [1]));
		d -= 1;
		return r;
	};

	return this;
};

/**
 * @brief: inherits methods & properties of classes into given object (class instance)
 * @att. : main - instance, obj[,obj,...] classes
 * @date : 10.4.2006 21:17:15           PREDELAT na inherits METHODS
 **/
function inherits(main){
	for (var ii=1; ii<arguments.length; ii++){
		obj = arguments[ii];
		for(var i in obj){
			switch(typeof obj[i]) {
				case 'object'	: break;
				case 'function'	: break;
				default			: main[i] = obj[i];
			}
		}
		for (var i in obj.prototype)
			main[i] = obj.prototype[i];
	}
};


/**
 * @brief	: clone object
 *			
 * @author	: DRZ 10.03.2005
 * @date	: 29.3.2006 10:18:37
 *
 * deep 	: switch for deep clone mode
 * bStrict	: "value", "value", Array clone is sooooo sloooooooow!!!!
 */
function clone (obj, deep, bStrict){


	if (typeof(obj) != 'object') return obj;

	//Super-Fast JSON but functions are skipped :(
	/*
	if (obj && JSON)
		return (JSON.parse(JSON.stringify(obj)));
	*/

	var objectClone;
	try{
		objectClone = new obj.constructor();
	}
	catch(r){
		objectClone = {};
	}

	if (bStrict && objectClone.constructor === Array){
		for (var i = 0, j = obj.length;i<j;i++){
			if (deep && typeof obj[i] == 'object')
				objectClone.push(clone(obj[i],true));
			else
				objectClone.push(obj[i]);
		}
	}	
	else
		for (var i in obj){
			try{
				if (deep && typeof obj[i] == 'object')
					objectClone[i] = clone(obj[i], true);
				else
					objectClone[i] = obj[i];
			}
			catch(r){}
		}

	return objectClone;
};


/**
 * @brief: deep object comparsion (for asociative arrays)
 * FALSE if aold != anew
 **/
function compareObj(aold,anew,keepOld){
	var a1 = keepOld?clone(aold,true):aold,
		a2 = anew;

	if (typeof a1 == 'undefined')
		return typeof a2 == 'undefined';

	if (typeof a2 == 'undefined' || a1.constructor !== a2.constructor)
		return false;

	if (typeof a1 != 'object')
		return a1 == a2;

	for (var i in a2)
		if (!compareObj(a1[i],a2[i]))
			return false;
		else
			delete a1[i];

	for (var i in a1)
		return false;

	return true;
};