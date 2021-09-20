_me = obj_block_ext.prototype;
function obj_block_ext(){};

_me.__constructor = function(eSkipClose){
	this._position('absolute');

	this._closeOnContext = true;

	this._zIndex();
	this._add_destructor('__destructClickEvn');

	this.__eSkipClose = eSkipClose || this._main;

	var me = this;

	this._main.onclick = function(e){
		var e = e || window.event;
			e.__source = {obj:me, type:me._type, path:me._pathName};
	};

	gui._obeyEvent('click',[this,'__destruction']);
};

_me._arrow = function(sArrowType){
	if (sArrowType){
		if (!this.__eArrow){
			this.__eArrow = mkElement('div',{className:'arrow'});
			this._main.appendChild(this.__eArrow);
		}

		this._main.setAttribute('iw-arrow', sArrowType);
	}
	else
	if (this.__eArrow){
		this.__eArrow.parentNode.removeChild(this.__eArrow);
		this.__eArrow = null;
		this._main.removeAttribute('iw-arrow');
	}
};

_me._place = function(x,y,w,h,sArrow){
	obj_block.prototype._place.call(this,x,y,w,h);
	this._arrow(sArrow);
};

_me.__destruction = function(e) {

	if (e.button > 1 && !this._closeOnContext)
		return;

	//New (check all child obj)
	if (e.__source && (e.__source.skip || e.__source.path === this._pathName))
		return;

	var elm = e.target || e.srcElement,
		aPaths = [],
		aChilds = this._getChildObjects();

	for(var i = 0; i<aChilds.length; i++){
		if (aChilds[i]._pathName){

			if (e.__source && e.__source.path){
				if (e.__source.path === aChilds[i]._pathName || e.__source.path.indexOf(aChilds[i]._pathName+'.') === 0)
					return;
			}
			else
			if (aChilds[i]._main && elm && Is.Child(elm, aChilds[i]._main))
				return;

			aPaths.push(aChilds[i]._pathName);

			if (aChilds[i]._getChildObjects)
				aChilds = aChilds.concat(aChilds[i]._getChildObjects());
		}
	}

// console.warn(e.__source, gui.calendar_block);
// console.warn(aPaths);

	//Old
	if(!this.__eSkipClose || (this.__eSkipClose && !Is.Child(e.target || e.srcElement,this.__eSkipClose)))
		this._destruct();
};

_me.__destructClickEvn = function(){
	gui._disobeyEvent('click',[this,'__destruction']);
};