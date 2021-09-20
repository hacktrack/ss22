/**
 * @brief: Manage Outlook Sync settings
 * @date : 13.02.2018
 *
 * Note, this file manage sync settings at all levels (global, domain and user)
 * and not only for account (despite filename)
 **/


function obj_accountinfo_os_manage(){};
var _me = obj_accountinfo_os_manage.prototype;

// Map incoming data to input fields in template
obj_accountinfo_os_manage._mapping = {
	// Footer
	dropdown_save_as: 'saveastype',
	// Login credentials tab
	toggle_line_security: 'linesecurity',
	dropdown_line_security: 'linesecurityvalue',
	toggle_authentication_method: 'authenticationmethod',
	dropdown_authentication_method: 'authenticationmethodvalue',
	toggle_login_port: 'loginport',
	input_login_port: 'loginportvalue',
	toggle_do_not_show_login_errors: 'donotshowloginerrors',
	dropdown_do_not_show_login_errors: 'donotshowloginerrorsvalue',
	toggle_do_not_show_connection_errors: 'donotshowconnectionerrors',
	dropdown_do_not_show_connection_errors: 'donotshowconnectionerrorsvalue',
	// Advanced tab
	toggle_folder_synchronization_threshold: 'foldersyncthreshold',
	input_folder_synchronization_threshold: 'foldersyncthresholdmessages',
	toggle_threshold_for_full_download: 'downloadthreshold',
	dropdown_threshold_for_full_download: 'downloadfilestype',
	input_threshold_for_full_download: 'downloadthresholdmb',
	toggle_download_files: 'downloadfilesfully',
	toggle_skip_trash_folder: 'skiptrashfolderstartupcheck',
	dropdown_skip_trash_folder: 'skiptrashfolderstartupcheckvalue',
	toggle_disable_tnef: 'disabletnef',
	dropdown_disable_tnef: 'disabletnefvalue',
	// Synchronization tab
	toggle_folder_structure_after: 'syncfolderstructure',			// bool
	input_folder_structure_after: 'syncfolderstructureafter',		// int
	toggle_selected_priority_folders: 'syncpriorityfolders',		// bool
	input_selected_priority_folders: 'syncpriorityfoldersafter',	// int
	toggle_selected_standard_folders: 'syncstandardfolders',		// bool
	input_selected_standard_folders: 'syncstandardfoldersafter',	// int
	toggle_content_of_folders: 'syncfoldersimmediately',
	dropdown_content_of_folders: 'syncfoldersimmediatelyvalue',
	toggle_gal_automatically: 'syncgal',
	dropdown_gal_automatically: 'syncgalvalue',
	toggle_do_not_show_progress: 'donotshowprogress',
	dropdown_do_not_show_progress: 'donotshowprogressvalue',
	toggle_automatically_revert_changes: 'autorevertchangesinreadonly',
	dropdown_automatically_revert_changes: 'autorevertchangesinreadonlyvalue',
	// Appearance tab
	toggle_display_address_book_names: 'displayabnames',
	dropdown_display_address_book_names: 'displayabnamesas',
	toggle_show_desktop_notification: 'showdesktopnotification',		// bool
	dropdown_show_desktop_notification: 'showdesktopnotificationvalue',	// bool
	input_hide_notification_after: 'hidenotificationaftervalue',		// int
	toggle_play_default_sound: 'playdefaultnotificationsound',			// bool
	dropdown_play_default_sound: 'playdefaultnotificationsoundvalue',	// bool
	// Licences and updates tab
	toggle_check_for_updates: 'checkforupdates',
	dropdown_check_for_updates: 'checkforupdatesvalue',
	// Logs tab
	toggle_logging_level: 'loglevel',
	dropdown_logging_level: 'loglevelvalue',
	toggle_delete_logs: 'deletelogs',
	dropdown_delete_logs: 'deletelogsvalue',
	input_delete_after_specified_days: 'deletelogsaftervalue'
};

_me.__constructor = function(s){

};

_me._load = function(accountOrDomain,isDomain) {
	var me = this;

	// Determine level of sync settings (global, domain or user)
	if(!accountOrDomain) {
		this._store = com;
		this._property = 'global_outlookpolicies';
	} else if(accountOrDomain && isDomain) {
		this._store = new Domain(accountOrDomain);
		this._property = 'd_outlookpolicies';
	} else {
		this._store = new Account(accountOrDomain);
		this._property = 'a_outlookpolicies';
	}

	this._draw('obj_accountinfo_os_manage', '', {items:{}});
	
	this._leftMenu=[
		{
			isdefault: true,
			name: 'login_credentials',
			icon: '',
			value: 'synchronization::login_credentials',
			show: this._getAnchor('login_credentials')
		},{
			name:'advanced',
			icon:'',
			value:'synchronization::advanced',
			show: this._getAnchor('advanced')
		},{
			name:'synchronization',
			icon:'',
			value:'accountdetail::synchronization',
			show: this._getAnchor('synchronization')
		},{
			name:'appearance',
			icon:'',
			value:'synchronization::appearance',
			show: this._getAnchor('appearance')
		},{
			name:'licence_and_updates',
			icon:'',
			value:'synchronization::licence_and_updates',
			show: this._getAnchor('licence_and_updates')
		},{
			name:'logs',
			icon:'',
			value:'synchronization::logs',
			show: this._getAnchor('logs')
		}
	];
	this._parent.left_menu._fill(this._leftMenu);
	this._parent.left_menu._show();
	this._parent.left_menu.__hash_handler();

	// Force or set as default options in footer
	this._parent.dropdown_save_as._fillLang([
		'accountdetail::force_settings',
		'accountdetail::set_as_default'
	]);

	// Login credentials tab
	this.dropdown_line_security._fillLang([
		'synchronization::plain',
		'synchronization::starttsl',
		'synchronization::ssl'
	]);
	this.dropdown_authentication_method._fillLang([
		'synchronization::cram_md5',
		'synchronization::plain'
	]);
	// Advanced tab
	this.dropdown_threshold_for_full_download._fillLang([
		'accountdetail::custom',
		'accountdetail::headers',
		'accountdetail::full'
	]);
	// Appearance tab
	this.dropdown_display_address_book_names._fillLang([
		'accountdetail::numbered_structure',
		'accountdetail::folder_name_only',
		'accountdetail::full_folder_path',
		'accountdetail::outlook_native'
	]);
	// Logging tab
	this.dropdown_logging_level._fillLang([
		'synchronization::log_debug',
		'synchronization::log_errors'
	]);

	// Get sync data from server	
	this._store.getProperty(this._property,function(r){
		// If data could not fetched or parsing failed
		if(r.error) {
			gui.message.error(getLang("error::fetch_failed"));
			me._close();
			return false;
		}

		// Save reference to result later access
		me._data = r;

		me._fillFieldsWithData();

		// Disable download depending on threshold
		me.toggle_download_files._disabled(!me.toggle_threshold_for_full_download._checked());
	});
	
}

_me._save = function() {
	// Send data to server
	if(this._data.hasChanged()) {
		this._data.saveChanges(this._saveFeedbackAndClose);
	} else {
		this._close();
	}
}
