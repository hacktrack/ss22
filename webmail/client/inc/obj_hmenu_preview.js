_me = obj_hmenu_preview.prototype;
function obj_hmenu_preview(){};

_me.__constructor = function() {

	this.__uniq = unique_id();
	this.__btncss = {im:''};

	var aMenu = [
		{"text":'', tooltip: 'ITEMVIEW::PREVIEW', "css":'ico2 img preview noarrow', nodetype: ['click'], rel:'layout', "callback":[this,'__layout']}
	];

	this.__ignoreMouseOut = true;

	this._fill(aMenu);

	gui._obeyEvent('viewSelected', [this, '__updatePreviewIcon']);
	this._add_destructor('__destructor');
};

_me.__destructor = function() {
	gui._disobeyEvent('viewSelected', [this, '__updatePreviewIcon']);
};

_me.__updatePreviewIcon = function(sView) {
	var icon = '';
	var el = document.getElementById(this._pathName + '/0').parentNode;
	removecss(this._main, 'hidden');

	switch (sView) {
		case 'conference_view':
			icon = 'chat';
			if (!window.sPrimaryAccountIM || (GWOthers.getItem('RESTRICTIONS', 'disable_im') || 0)==1) {
				addcss(this._main, 'hidden');
			}
			break;
		case 'day_view':
		case 'week_view':
		case 'workweek_view':
		case 'month_view':
			icon = 'calendar';
			break;
		case 'mail_view':
		case 'list_view':
			icon = 'bottom';
			break;
		case 'mail_view_wide':
		case 'list_wide':
		case 'chat_view':
			icon = 'side';
			break;
	}

	['bottom', 'side', 'calendar', 'chat'].forEach(el.classList.remove.bind(el.classList));
	icon && el.classList.add(icon);
};

_me._onclick = function(e,elm,id,arg)
{
	var active = gui.frm_main.bar.tree.folders._getActive();
	switch(arg)
	{
		//Preview
		case 'month_view':
			gui.frm_main._selectView({aid: active[0], fid: active[1]}, GWOthers.getItem('DEFAULT_CALENDAR_SETTINGS', 'event_view'), true);
			break;
		case 'mail_view':
		case 'mail_view_wide':
		case 'mail_view_list':
		case 'list_view':
		case 'list_wide':
		case 'list':

			// Temporary solution to ask user if upload should be cancelled
			// @todo: implement datagrid upload that does not fail when list view is changed (if list is destructed, upload should be saved correctly anyway)
			if(gui.frm_main.main) {
				if(gui.frm_main.main._uploading) {
					return gui._create('stop_upload','frm_confirm','','',[function(){
						gui.frm_main.main._uploading = false;
						gui.frm_main.main._changeview(arg);
					}],'ALERTS::ALERT','CONFIRMATION::STOPUPLOAD');
				}
				if(~gui.frm_main._lastView.indexOf('mail') || ~gui.frm_main._lastView.indexOf('list')) {
					gui.frm_main.main._changeview(arg);
				} else {
					gui.frm_main._selectView({aid: active[0], fid: active[1]}, arg, true);
				}
			}
			return;

		//Left Pane
		case 'lp_expand':
			Cookie.set(['hide_tree'], 2);
			gui.frm_main._resize_handler();
       		break;
		case 'lp_collapsed':
			Cookie.set(['hide_tree'], 1);
			gui.frm_main._resize_handler();
       		break;
		case 'lp_auto':
			Cookie.set(['hide_tree'], '');
			gui.frm_main._resize_handler();
       		break;

       	//Right Pane
		case 'rp_expand':
			Cookie.set(['hide_im'], 2);
			gui.frm_main._rightDock(true);
       		break;
		case 'rp_collapsed':
			Cookie.set(['hide_im'], 1);
			gui.frm_main._rightDock(false);
       		break;
		case 'rp_auto':
			Cookie.set(['hide_im'], '');
			gui.frm_main._rightDock(false);
			   break;
		case 'clear_notifications':
			gui.notifier._clear_notifications();
			break;

		default:
			if (Is.Object(arg))
				executeCallbackFunction(arg);
	}
};

_me.__layout = function(e, id){
	var sType = WMFolders.getType(Path.split(dataSet.get('active_folder'))),
		sView = gui.frm_main._lastView;
	var rd = Cookie.get(['hide_im']);

	//Preview
	var a = [
		{"title":'ITEMVIEW::PREVIEW', "caption":true},
		{"title":'-'}
	];

	switch (sType){
		case 'M':
		case 'Q':
			a.push(
				{"title": 'ITEMVIEW::DOWN', 'arg':'mail_view', 'css':'ico ico2 preview' + (sView == 'mail_view'?' check':'')},
				{"title": 'ITEMVIEW::RIGHT', 'arg':'mail_view_wide', 'css':'ico ico2 wpreview' + (sView == 'mail_view_wide'?' check':'')},
				{"title": 'ITEMVIEW::NONE', 'arg':'mail_view_list', 'css':'ico ico2 lpreview' + (sView == 'mail_view_list'?' check':'')}
			);
			break;
		case 'W':
			return [
				{"title": 'COMMON::EXPAND', 'arg':'rp_expand', 'css':'ico2' + (rd == '2'?' check':'')},
				{"title": 'COMMON::COLLAPSED', 'arg':'rp_collapsed', 'css':'ico2' + (rd == '1'?' check':'')},
				{"title": 'COMMON::AUTOCOLLAPSED', 'arg':'rp_auto', 'css':'ico2' + (!rd?' check':'')}
			];
		case 'I':
		case 'Y':
		case 'X':
			a = [];
			break;
		case 'E':
				a.push({"title": 'SETTINGS::EVENT_VIEW', 'arg':'month_view', 'css':'ico ico2 calendar' + (!~sView.indexOf('list') && !~sView.indexOf('mail') ? ' check' : '')});
		default:
			a.push(
				{"title": 'ITEMVIEW::DOWN', 'arg':'list_view', 'css':'ico ico2 preview' + (sView == 'list_view'?' check':'')},
				{"title": 'ITEMVIEW::RIGHT', 'arg':'list_wide', 'css':'ico ico2 wpreview' + (sView == 'list_wide'?' check':'')},
				{"title": 'ITEMVIEW::NONE', 'arg':'list', 'css':'ico ico2 lpreview' + (sView == 'list'?' check':'')}
			);
	}

	//Folders
	var ld = Cookie.get(['hide_tree']);
	if(a.length) {
		a.push({title:'-'});
	}
	a.push(
		{title:'MAIN_MENU::LEFTPANEL', css:'ico2 empty_folder', nodes:[
			{"title": 'COMMON::EXPAND', 'arg':'lp_expand', 'css':'ico2' + (ld == '2'?' check':'')},
			{"title": 'COMMON::COLLAPSED', 'arg':'lp_collapsed', 'css':'ico2' + (ld == '1'?' check':'')},
			{"title": 'COMMON::AUTOCOLLAPSED', 'arg':'lp_auto', 'css':'ico2' + (!ld?' check':'')}
		]}
	);

	//IM
	if (window.sPrimaryAccountIM && (GWOthers.getItem('RESTRICTIONS', 'disable_im') || 0)<1) {
		a.push(
			{title:'MAIN_MENU::RIGHTPANEL', css:'ico2 im', nodes:[
				{"title": 'COMMON::EXPAND', 'arg':'rp_expand', 'css':'ico2' + (rd == '2'?' check':'')},
				{"title": 'COMMON::COLLAPSED', 'arg':'rp_collapsed', 'css':'ico2' + (rd == '1'?' check':'')},
				{"title": 'COMMON::AUTOCOLLAPSED', 'arg':'rp_auto', 'css':'ico2' + (!rd?' check':'')}
			]}
		);
	}

	return a;
};
