/*
    @Note: default contextmenu className is obj_button_menu_external
*/
function obj_button_menu(){};

obj_button_menu.prototype.__constructor = function(){
    this.__aMenu = [];

    this.__eArrow = mkElement('div',{className:'arrow'});

	this.__eArrow.onmousedown = function(e){
		if (this.cmenu && !this.cmenu._destructed){
            if (e.stopPropagation) e.stopPropagation();
			return false;
		}
	}.bind(this);

	this.__eArrow.onclick = function(e){

        if (this._disabled()) return;

        var e = e || window.event;

        if (!Is.Empty(this.__aMenu) && (!this.cmenu || this.cmenu._destructed)){
			addcss(this._main, 'active');

			this.cmenu = gui._create('cmenu','obj_context','',this.__sMenuCss || 'obj_button_menu_external');
			this.cmenu._fill(Is.Function(this.__aMenu)?this.__aMenu():this.__aMenu);
			this.cmenu._obeyEvent('ondestruct',[
				function(){
					removecss(this._main,'active');
				}.bind(this)
			]);

            var pos = getSize(this.__eArrow);
            this.cmenu._place(pos.x+pos.w/2,pos.y+pos.h/2+5,null,2);

            if (e.stopPropagation) e.stopPropagation();
            e.cancelBubble = true;
            return false;
		}
    }.bind(this);

    this._main.appendChild(this.__eArrow);
};

obj_button_menu.prototype._menu = function(aMenu, sCss){
    if (Is.Object(aMenu)){
        this.__aMenu = aMenu;
        this.__sMenuCss = sCss;

        if (this.cmenu && !this.cmenu._destructed){
            this.cmenu._destruct();
            this.__eArrow.onclick({});
        }
    }
    else
        return this.__aMenu;
};