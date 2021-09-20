_me = obj_form_tab.prototype;
function obj_form_tab(){};

/**
 * Catch TabIndex
 **/
_me.__constructor = function (){
	var me = this, eFocus;
	if (this._getFocusElement && (eFocus = this._getFocusElement())){

		//Opera Hack
		if (currentBrowser() == 'Opera'){
			AttachEvent(eFocus,'onkeydown', function(e){
	            this.lastKey = e.keyCode;
	            this.lastShift = e.shiftKey;
			});
            AttachEvent(eFocus,'onblur', function(e){
				if (this.lastKey == 9 && me.__tabIndex_dock){
                    if (this.lastShift)
						me.__tabIndex_dock._tabIndexPrev(me);
					else
                        me.__tabIndex_dock._tabIndexNext(me);
	            }

                this._focused = false;
				if (me.__tabIndex_dock)
				    me.__tabIndex_dock.__lastFocus = me._pathName;

	            this.lastKey = null;
	            this.lastShift = null;
			});
			AttachEvent(eFocus,'onfocus', function(e){
				this._focused = true;
				if (me.__tabIndex_dock)
				    me.__tabIndex_dock.__lastFocus = me._pathName;

				this.lastKey = null;
	            this.lastShift = null;
			});
		}
		//Other "normal" browsers
		else{
			//Append Event
			AttachEvent(eFocus,'onkeydown', function(e){

	            e = e || window.event;
				if (e.keyCode == 9){
					e.cancelBubble = true;
					try{e.preventDefault()}catch(r){}
					try{e.stopPropagation()}catch(r){}
					if (!e.ctrlKey && me.__tabIndex_dock)
						if (e.shiftKey)
							me.__tabIndex_dock._tabIndexPrev(me);
						else
	                        me.__tabIndex_dock._tabIndexNext(me);

					return false;
				}
			});

            AttachEvent(eFocus,'onblur', function(e){
				this._focused = false;
				if (me.__tabIndex_dock)
					me.__tabIndex_dock.__lastFocus = '';

			});
			AttachEvent(eFocus,'onfocus', function(e){
				this._focused = true;
				if (me.__tabIndex_dock)
				    me.__tabIndex_dock.__lastFocus = me._pathName;
			});
		}

		this._add_destructor('__disobeyTabIndex');
	}
};

/**
 * Set tabIndex position in parent dock
 * @Public
 **/
_me._tabIndex = function(sContainer,i, oDock){
	//search for dock
	if (!oDock){
		var tmp = this;
		while((tmp = tmp._parent))
			if (tmp.__addTabIndex){
                oDock = tmp;
				break;
			}
	}

	if (oDock){
		//remove old tabIndex
		this.__disobeyTabIndex();
		if (oDock.__addTabIndex(this,sContainer,i))
			this.__tabIndex_dock = oDock;
	}
};

_me._hasFocus = function(){
	return this._getFocusElement()._focused;
};

/**
 * Remove object from dock
 * @Private
 **/
_me.__disobeyTabIndex = function(){
	if (this.__tabIndex_dock){
		this.__tabIndex_dock.__removeTabIndex(this);
		this.__tabIndex_dock = null;
	}
};