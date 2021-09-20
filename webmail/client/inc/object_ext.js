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
	for (var obj, j, i=1; i<arguments.length; i++){
		obj = arguments[i];
		for(j in obj){
			switch(typeof obj[j]) {
			case 'object'	: break;
			case 'function'	: break;
			default			: main[j] = obj[j];
			}
		}
		for (j in obj.prototype)
			main[j] = obj.prototype[j];
	}
};


/**
 * @brief	: clone object
 *
 * @author	: DRZ 10.03.2005
 * @date	: 23.05.2017
 *
 * deep 	: switch for deep clone mode
 */

function clone (obj, bDeep){

	//Do not clone IcewarpDate
	if (typeof obj != 'object' || (typeof IcewarpDate !== 'undefined' && obj instanceof IcewarpDate))
		return obj;

	try{
		var	objectClone = new obj.constructor();
	}
	catch(err){
		var objectClone = {};
	}

	if (objectClone.constructor === Array){
		for (var i = 0, j = obj.length;i<j;i++){
			if (bDeep && typeof obj[i] === 'object')
				objectClone.push(clone(obj[i], true));
			else
			if (typeof obj[i] != 'undefined')
				objectClone.push(obj[i]);
		}
	}
	else
		for (var i in obj){
			if (obj.hasOwnProperty(i)){
				if (bDeep && typeof obj[i] == 'object')
			    	objectClone[i] = clone(obj[i], true);
				else
				if (typeof obj[i] != 'undefined')
					objectClone[i] = obj[i];
			}
		}

	return objectClone;
};


/*
	function clone (obj, bDeep, bStrict){

		//Do not clone IcewarpDate
		if (obj === null || typeof obj != 'object' || (typeof IcewarpDate !== 'undefined' && obj instanceof IcewarpDate))
			return obj;

		var	objectClone = new obj.constructor();

		if (bStrict && objectClone.constructor === Array){
			for (var i = 0, j = obj.length;i<j;i++){
				if (bDeep && typeof obj[i] === 'object')
					objectClone.push(clone(obj[i], true, bStrict));
				else
					objectClone.push(obj[i]);
			}
		}
		else
		for (var i in obj)
			if (obj.hasOwnProperty(i)){
				if (bDeep && typeof obj[i] == 'object')
				    objectClone[i] = clone(obj[i], true, bStrict);
				else
					objectClone[i] = obj[i];
			}

		return objectClone;
	};
*/

/*
HTML5 way
function copy(o) {
  var copy = Object.create(Object.getPrototypeOf(o));
  var propNames = Object.getOwnPropertyNames(o);

  propNames.forEach(function(name) {
    var desc = Object.getOwnPropertyDescriptor(o, name);
    Object.defineProperty(copy, name, desc);
  });

  return copy;
}
*/

/**
 * @brief: deep object comparsion (for asociative arrays)
 * FALSE if aold != anew
 **/
function compareObj(aold,anew,keepOld){
	var a1 = aold !== void 0?(keepOld?clone(aold,true):aold):void 0,
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

window.roundTo = function(number, precision) {
	var factor = Math.pow(10, precision);
	return Math.round(number * factor) / factor;

};
