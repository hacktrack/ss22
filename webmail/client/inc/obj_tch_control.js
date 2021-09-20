_me = obj_tch_control.prototype;
function obj_tch_control(){};

_me.__constructor = function(aOpt, aData, aHandler){
	this.__state = 'hidden';

	if (aOpt){
		aOpt.nomore = aOpt.noedit && aOpt.notrash;
	}

	this._draw('obj_tch_control', 'main', aOpt);

	this._main.onclick = function(e){
		var elm = e.target || e.srcElement;
		if (elm != this._main && !hascss(elm, 'disabled'))
			var rel = elm.getAttribute('rel'),
				obj, fresh = false;

			switch(rel){
				case 'like':
					if (!this.smiles || this.smiles._destructed){
						this.smiles = gui._create('smiles', 'obj_minismile', '','',[function(sReaction){
							executeCallbackFunction(aHandler, 'reaction', sReaction);
						}]);

						fresh = true;
					}

					obj = this.smiles;

					//Activate Smile
					[].forEach.call(obj._main.querySelectorAll('.active'), function(elm) {
						removecss(tmp,'active');
					});
					if (aData.REAVALUE){
						var tmp = obj._main.querySelector('.' + aData.REAVALUE);
						if (tmp) addcss(tmp,'active');
					}

					break;

				case 'pin':
					if (!this.pins || this.pins._destructed){
						this.pins = gui._create('pins', 'obj_minipin', '','',[function(sType){
							executeCallbackFunction(aHandler, 'pin', sType);
						}]);

						fresh = true;
					}
					obj = this.pins;

					//Activate Pin
					var linkextras;
					if ((aData.PINOWNEMAIL && aData.PINOWNEMAIL !== sPrimaryAccount) || (aData.EVNLINKEXTRAS && (linkextras = parseURL(aData.EVNLINKEXTRAS)) && linkextras.AccountEmail))
						addcss(obj._main.querySelector('.public'), 'disabled');

					window[aData.GPINWHEN?'addcss':'removecss'](obj._main.querySelector('.public'), 'active');
					window[aData.LPINWHEN?'addcss':'removecss'](obj._main.querySelector('.private'), 'active');

					break;

				case 'more':
					if (!this.more || this.more._destructed){
						this.more = gui._create('more', 'obj_minimore', '','',[function(sAction){
							executeCallbackFunction(aHandler, sAction);
						}]);

						if (aOpt.noedit)
							addcss(this.more._main.querySelector('.edit'), 'disabled');
						if (aOpt.notrash)
							addcss(this.more._main.querySelector('.remove'), 'disabled');

						fresh = true;
					}

					obj = this.more;
					break;

				default:
					addcss(elm, 'active');
					executeCallbackFunction(aHandler, rel);
					removecss(elm, 'active');
					return;
			}

			// ALL BUBBLES ARE THE SAME!

			//close the bubbles
			['smiles','pins','more'].forEach(function(s){
				if (rel != s && this[s] && !this[s]._destructed && this[s].__state == 'visible')
					this[s]._hide(true);
			}.bind(this))

			// init bubble
			if (fresh){
				obj._modal(true);

				obj._onclose = function(){
					obj._hide();
					this._hide(true);
				}.bind(this);

/*
				obj._onshow = function(e){
					var elm = this._getAnchor('border');
						elm && elm.onmouseover(e);
				}.bind(this._parent);

				obj._onhide = function(e){
					var elm = this._getAnchor('border');
						elm && elm.onmouseout(e);
				}.bind(this._parent);
*/
				obj._onstate = function(s){
					if (s == 'visible')
						addcss(elm, 'active');
					else
						removecss(elm, 'active');
				};
			}
			else
			if (obj.__state == 'visible'){
				obj._hide(true);
				return;
			}

			//place bubble
			var pos = getSize(this._main);
			obj._place({left: 'auto', right:(document.body.offsetWidth - pos.x - pos.w) + 'px', top:(pos.y - obj._main.offsetHeight - 4) + 'px'});

			addcss(elm, 'active');
			obj._show();

	}.bind(this);
};

_me._hide = function(bForce){

	if (this.__state == 'visible'){

		for(var i = 0, a = ['smiles','pins','more']; a[i]; i++)
			if (this[a[i]] && !this[a[i]]._destructed && this[a[i]].__state == 'visible')
				if (bForce)
					this[a[i]]._hide(true);
				else
					return false;

		removecss(this._main, 'show');
		this.__state = 'hidden';

		// if (this.smiles)
		// 	this.smiles._hide(true);

		// if (this.pins)
		// 	this.pins._hide(true);

		// if (this.more)
		// 	this.more._hide(true);

		if (this._onhide)
			this._onhide();
	}

	return true;
};

_me._show = function(){
	if (this.__state == 'hidden'){
		addcss(this._main, 'show');
		this.__state = 'visible';
	}
};