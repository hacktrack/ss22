_me = obj_dashboard_cloudstats.prototype;
function obj_dashboard_cloudstats(){};

_me.__constructor = function(tpldata){
	// Draw template
	this._draw('obj_dashboard_cloudstats','main',tpldata);

	var link = "menu=subscription";

	// Make trial licence redirect to shop with click
	if(gui._globalInfo.licence.cloudinfo.cloudplanislive!=1) {
		this.topstats_plan_box._onclick = function(e) {
			location.hash = link;
		}
		this.topstats_plan_box._main.classList.add('is-trial');
	}

	// Link to Subscription page
	var elm = this._getAnchor('topstats_manageplan');
	elm.addEventListener('click',function(e){
		location.hash = link;
		e.preventDefault();
	},true);
	var elm = this._getAnchor('topstats_plan');
	elm.addEventListener('click',function(e){
		location.hash = link;
		e.preventDefault();
	},true);

}
