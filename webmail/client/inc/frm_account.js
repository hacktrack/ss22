_me = frm_account.prototype;
function frm_account(){};

/**
 * @brief   Creates "Edit account" or "Add account" dialog.
 * @param[in]  sAccountID [string]   Optional. Account to be edited. When not specified,
 * form for new account is created. 
 */ 
_me.__constructor = function(aResponse, sAccountID, aData) {
	var me = this;

	this._modal(true);
	this._dockable(false);
	this._resizable(false);

	this.__sAccountID = sAccountID;
	this.__aResponse  = aResponse;

	if (Is.Defined(sAccountID)) {
		this._title('POPUP_ACCOUNTS::EDIT_ACCOUNT');
		this._size(400,405,true);
		this._draw('frm_account', 'main');
	} else {
		this._title('POPUP_ACCOUNTS::ADD_ACCOUNT');
		this._size(400,435,true);
		this._draw('frm_account', 'main', {add:true, sPrimaryAccount:"!^"+sPrimaryAccount.quoteMeta()+"$"});

		this.SENTFOLDER._value(GWOthers.getItem('DEFAULT_FOLDERS','sent'));
		this.TRASHFOLDER._value(GWOthers.getItem('DEFAULT_FOLDERS','trash'));
	}


    // Create 'OK' button
	this.x_btn_ok._onclick = function() {
		this._disabled(true);
		me._title('POPUP_ACCOUNTS::VALIDATING');
        setTimeout('try{'+me._pathName+'.__validate()}catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}', 10);
	}

	if (Is.Defined(sAccountID) && Is.Defined(aData))
		this._loadSettings(aData);
	else
		// Set port depending on protocol (IMAP => 143, POP3 => 110)
		this._setDefaultPort();


	// Set callback functions (onerror and onchange)
	if (!Is.Defined(sAccountID)) this.EMAIL._onerror = function(isError) { me.__bIsInputEmailValid = !isError; me.__enableOrDisableOK(); };
	this.USERNAME._onerror = function(isError) { me.__bIsInputUsernameValid = !isError; me.__enableOrDisableOK(); };
	this.PROTOCOL._onchange = function() { me._setDefaultPort(); }
	this.SERVER._onerror = function(isError) { me.__bIsInputServerValid = !isError; me.__enableOrDisableOK(); }
	this.PORT._onerror = function(isError) { me.__bIsInputPortValid = !isError; me.__enableOrDisableOK(); }
	this.PASSWORD._onerror = function(isError) { me.__bIsInputPassValid= !isError; me.__enableOrDisableOK(); }
	
	// Get states of inputs (valid/invalid)
	this.__bIsInputEmailValid = (!sAccountID) ? this.EMAIL.__check() : true;
	this.__bIsInputUsernameValid = this.USERNAME.__check();
	this.__bIsInputServerValid = this.SERVER.__check();
	this.__bIsInputPortValid = this.PORT.__check();
	this.__bIsInputPassValid = sAccountID ? true : false;
	
	// Disable/Enable 'OK' button depending on input validity.
	this.__enableOrDisableOK();
};

_me.__validate = function(){
	this._create('loading','obj_loader');
	this.loading._value(getLang('popup_accounts::validating'));

	WMAccounts.test({
		EMAIL: this.__sAccountID || this.EMAIL._value(),
		USERNAME:this.USERNAME._value(),
		PROTOCOL:this.PROTOCOL._value(),
		SERVER:this.SERVER._value(),
		PORT:this.PORT._value(),
		PASSWORD:this.PASSWORD._value(),
		SENTFOLDER:this.SENTFOLDER._value(),
		TRASHFOLDER:this.TRASHFOLDER._value(),
		DESCRIPTION:this.DESCRIPTION._value(),
	},[this,'__validateResponse']);
};

_me.__validateResponse = function(aData){
	if (this && !this._destructed)
		if (aData === false){
			this.loading._destruct();
			gui.notifier._value({type: 'alert', args: {header: '', text: 'POPUP_ACCOUNTS::INVALID'}});

			if (Is.Defined(this.__sAccountID))
				this._title('POPUP_ACCOUNTS::EDIT_ACCOUNT');
			else
				this._title('POPUP_ACCOUNTS::ADD_ACCOUNT');

			this.x_btn_ok._disabled(0);
		}
		else{
			var aValues = {};
			storeDataFromForm(this, aValues);
			executeCallbackFunction(this.__aResponse, aValues,  this.__sAccountID);
			this._destruct();
		}
};

/**
 * @brief   Enable or disable OK button depending on inputs validity.   
 */
_me.__enableOrDisableOK = function() {
	var b = !(this.__bIsInputEmailValid && this.__bIsInputUsernameValid &&
			this.__bIsInputServerValid && this.__bIsInputPortValid && this.__bIsInputPassValid);
			
	//this.x_btn_test._disabled(b);
	this.x_btn_ok._disabled(b);
};

/**
 * @brief   Set default port depending on selected protocol.
 */ 
_me._setDefaultPort = function() {

	switch (this.PROTOCOL._value()) {
		case 'imap':
			this.PORT._value(143);
			this.PORT.__check();
			break;
		case 'pop3':
			this.PORT._value(110);
			this.PORT.__check();
			break;
	}
};

/**
 * @brief   Load settings from account into form.
 * @param[in]   sAccountID  [string]    Account from which the settings should be loaded.
 */
_me._loadSettings = function(aValues) {
	aValues.SENTFOLDER = aValues.SENTFOLDER || GWOthers.getItem('DEFAULT_FOLDERS','sent');
	aValues.TRASHFOLDER = aValues.TRASHFOLDER || GWOthers.getItem('DEFAULT_FOLDERS','trash');
	loadDataIntoForm(this, aValues);
};