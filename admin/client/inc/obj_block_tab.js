_me = obj_block_tab.prototype;
function obj_block_tab(){};

_me.__constructor = function (){
	this.__tabIndexes = {};
	this.__lastFocus = '';   //Path name of last focused object;
};

_me.__addTabIndex = function(obj,sContainer,i){
    sContainer = sContainer || 'main';

	if (!this.__tabIndexes[sContainer])
    	this.__tabIndexes[sContainer] = [];

	if (typeof i != 'undefined' && this.__tabIndexes[sContainer].length)
		this.__tabIndexes[sContainer].splice(i,0,obj._pathName);
	else
		this.__tabIndexes[sContainer].push(obj._pathName);

	return true;
};

_me.__removeTabIndex = function(obj){
	var i,j;
	for (i in this.__tabIndexes)
		if ((j = inArray(this.__tabIndexes[i], obj._pathName))>-1)
			this.__tabIndexes[i].splice(j,1);
};

_me._tabIndexPrev = function(obj, bReturn){
	var i, j = -1;

	for (i in this.__tabIndexes)
		if ((j = inArray(this.__tabIndexes[i], obj._pathName))>-1)
			break;

	if (j>-1){
		j--;

		if (j<0)
			j = this.__tabIndexes[i].length-1;

		if (j>-1)
			try{
				var tmp = (eval(this.__tabIndexes[i][j]));

				if (tmp._focus)
					if (tmp._disabled && tmp._disabled())
						this._tabIndexPrev(tmp,bReturn);
					else
					if (bReturn)
						return tmp;
					else{
						if (tmp._focus(true) === false)
							return this._tabIndexPrev(tmp,bReturn);
						else	
						if (tmp._setRange && tmp._value)
							tmp._setRange(0,tmp._value().length);
					}
						
				return true;
			}
			//object doesn't exist anymore
			catch(e){
	            this.__tabIndexes[i].splice(j,1);
				if (this.__tabIndexes[i].length)
					return this._tabIndexPrev(obj,bReturn);
			}
	}
};

_me._tabIndexNext = function(obj, bReturn){
	var i, j = -1;
	for (i in this.__tabIndexes)
		if ((j = inArray(this.__tabIndexes[i], obj._pathName))>-1)
			break;

	if (j>-1){
	
		j++;

		if (j>this.__tabIndexes[i].length-1)
			j = 0;

		try{
			var tmp = (eval(this.__tabIndexes[i][j]));

			if (tmp._focus)
				if (tmp._disabled && tmp._disabled())
					this._tabIndexNext(tmp,bReturn);
				else
				if (bReturn)
					return tmp;
				else{
					if (tmp._focus(true) === false)
						return this._tabIndexNext(tmp,bReturn);
					else
					if (tmp._setRange && tmp._value)
						tmp._setRange(0,tmp._value().length);
				}

			return true;
		}
		//object doesn't exist anymore
		catch(r){
			this.__tabIndexes[i].splice(j,1);
			if (this.__tabIndexes[i].length)
				return this._tabIndexNext(obj,bReturn);
		}
	}
};