_me = obj_slide.prototype;
function obj_slide(){};

_me.__constructor = function() {
	//this.__timeout
	//this.__value

	this.__eSlide = mkElement('div',{id:this._pathName+'#slide', className:'slide'});
	this._main.appendChild(this.__eSlide);
	this._anchors['main'] = this.__eSlide.id;
};
/**
 *
 *
 * @param {String} sName	name of panel
 * @returns
 */
_me._value = function(sName){
	if (Is.Defined(sName)){

		var slide = 0;

		//Select given panel
		if (!Is.Object(this[sName]) || this[sName].constructor !== Gui || ![].some.call(this.__eSlide.querySelectorAll('.panel'), function(panel, i){
			if (panel.id === this[sName]._pathName){
				slide = i;
				return true;
			}
		}, this)){
			//Select 1st
			var panel = this.__eSlide.querySelector('.panel');
			sName = panel?panel.id.split('.').pop():undefined;
		}

		if (this.__value !== sName){

			if (this[this.__value] && this[this.__value]._oninactive){
				this[this.__value]._oninactive();
			}

			if (Is.String(sName) && this[sName] && this[sName]._onactive){

				if (Is.Defined(this.__timeout)){
					clearTimeout(this.__timeout);
				}

				this.__timeout = setTimeout(function(){
					this[sName] && !this[sName]._destructed && this[sName]._onactive();
				}.bind(this), 250);
			}

			this.__value = sName;

			this.__eSlide.style.transform = 'translate(' + (slide*-100) + '%, 0)';
		}
	}
	else
		return this.__value;
};
