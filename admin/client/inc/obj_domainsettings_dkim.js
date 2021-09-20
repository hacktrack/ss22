/**
 * @brief: DKIM Setup Wizard
 * @date: 15.01.2018
 * @author: Martin Ekblom
 *
 *	General logic
 *
 * 	If Selector and Key already exist, just get the record and display key and record
 * 	then allow the user to save apply on emails or not
 * 
 * 	If Selector and Key does not exist:
 * 	1. Ask user for a Selector
 * 	2. Generate a Key
 * 	3. Ask server for the Record (will not exist before the Key)
 * 	4. Display the Generated Key and the New Record
 * 	5. Allow user to save the Selector and the Key as well as the apply on email state
 * 	6. Close if successful
 **/


/* Controller */

function obj_domainsettings_dkim(){};
var _me = obj_domainsettings_dkim.prototype;
_me.__constructor = function(){
	var view = this._view = new DomainSettingsDKIMView(this);
};

_me._load = function() {
	var me = this;
	
	var view = this._view;

	var domain = new Domain(location.parsed_query.domain);
	domain.getProperties(['D_DKIM_Active','D_DKIM_Selector','D_DKIM_PrivateKey'],function(p){
		me._data = p;
		if(p.D_DKIM_Selector.value && p.D_DKIM_PrivateKey.value) {
			// Key is already available, allow saving
			domain.getProperty('D_DKIM_RetrieveSelectorData',function(selector_data){
				view.showKey({generated: false, selector: p.D_DKIM_Selector + '._domainkey.' + domain.id, key: selector_data, active: p.D_DKIM_Active});
			});
		} else {
			// Step 1 - Activate setup button to start setup
			view.showInstructions(function(){
				// Step 2 - Activate Generate button
				view.showGenerate(function(selector){
					// Remember the selector
					me._data.D_DKIM_Selector.value = selector;
					domain.getProperty('D_DKIM_GeneratePrivateKey',function(private_key){
						// Step 3 - Compile the generated data and send to server
						p.D_DKIM_PrivateKey.value = private_key;
						p.saveChanges(function(r){
							if(r==1) {
								// Step 4 - Show the private key and let user save
								domain.getProperty('D_DKIM_RetrieveSelectorData',function(selector_data){
									selector += '._domainkey.' + domain.id;
									p.D_DKIM_Active.value = 1;
									view.showKey({generated: true, selector: selector, key: selector_data, active: p.D_DKIM_Active});
								});
							} else {
								gui.message.error(getLang('DKIM::SETUP_FAILED'));
								me._close();
							}
						});

					});
				});
			});
		}
	});

}

_me._save = function(data) {
	var view = this._view;
	if(this._data.hasChanged()) {
		this._data.saveChanges(function(r){
			view.saveNotification(r==1);
		});
	} else {
		this._close();
	}
}

_me._reset = function() {
	var view = this._view;

	com.security.resetDKIM(location.parsed_query.domain,function(r){
		view.notifyResetResult(r==1);
	});
}

/* View */

var DomainSettingsDKIMView = function(controller) {
	this._control = controller;

	this._control._draw('obj_domainsettings_dkim', '');

	this.fields = {
		selector: controller.input_selector,
		record: controller.input_record,
		key: controller.textarea_key,
		sign: controller.toggle_sign_outgoing_mails
	};

	this.__steps = this._control._getAnchor('fb_dkim_steps').getElementsByTagName('li');
	this.__backs = [];

	this.elements = {
		academy: controller._getAnchor('fb_dkim_academy'),
		generate: controller._getAnchor('fb_dkim_selector'),
		show: controller._getAnchor('fb_dkim_selector_record'),
		wait: controller._getAnchor('fb_dkim_loader')
	};

	this._actionbutton = this._control._parent.btn_continue;
	this._regretbutton = this._control._parent.btn_cancel;

	// Activate copy to clipboard links
	var view = this;
	controller.label_button_record._onclick = function() {
		view.fields.record._copyToClipboard();
	}
	controller.label_button_key._onclick = function() {
		view.fields.key._copyToClipboard();
	}
}

DomainSettingsDKIMView.prototype = Object.create(PopupWindowView.prototype);

DomainSettingsDKIMView.prototype.showKey = function(data) {
	var controller = this._control;
	var view = this;
	// Show the private key section
	this.hideAll();
	this.elements.show.removeAttribute('is-hidden');
	if(data.generated) {
		this.__steps[2].classList.add('is-active');
	}
	this._actionbutton._value('generic::save');
	this._actionbutton._disabled(false);
	// Fill fields with values
	if(data.selector) {
		this.fields.record._value(data.selector);
		this.fields.key._setValue(data.key);
	}
	this.fields.sign._setValue(data.active);
	// Ask Controller to save
	this._actionbutton._onclick = function() {
		var sign = controller.toggle_sign_outgoing_mails._checked();
		controller._save.call(controller,{generated: data.generated, sign: sign});
	}
	// Show Back or Reset Button
	if(data.generated) {
		this._regretbutton._onclick = function() {
			view.showGenerate(view.__secondHandler);
		}
	} else {
		this._regretbutton._value('dkim::reset');
		this._regretbutton._main.classList.add('borderless');
		this._regretbutton._onclick = function() {
			controller._reset();
		}
	}

}
DomainSettingsDKIMView.prototype.showInstructions = function(actionHandler) {
	var controller = this._control;
	this.__firstHandler = actionHandler;
	// Display only option to set up DKIM
	this.hideAll();
	this.elements.academy.removeAttribute('is-hidden');
	this._actionbutton._value('dkim::setup');
	this.__steps[0].classList.add('is-active');
	// Notifiy controller about setup action
	this._actionbutton._onclick = function() {
		actionHandler.call(controller);
	}
	this._regretbutton._value('generic::cancel');
	this._regretbutton._onclick = function() {
		controller._close();
	}
}
DomainSettingsDKIMView.prototype.showGenerate = function(actionHandler) {
	var controller = this._control;
	var view = this;
	// Show Generate section
	this.hideAll();
	this.elements.generate.removeAttribute('is-hidden');
	this.__steps[1].classList.add('is-active');
	this._actionbutton._value('dkim::generate_key');
	this.__secondHandler = actionHandler;
	// Notifiy controller about generate action
	this._actionbutton._onclick = function() {
		var v = view.fields.selector._value();
		if(v) {
			this._disabled(true);
			view.elements.generate.setAttribute('is-hidden',1);
			view.showPatience();
			actionHandler.call(controller,v);
		} else {
			gui.message.error(getLang('dkim::no_selector'));
		}
	}
	var view = this;
	this._regretbutton._value('generic::back');
	this._regretbutton._onclick = function() {
		view.showInstructions(view.__firstHandler);
	}
}
DomainSettingsDKIMView.prototype.showPatience = function() {
	this.elements.wait.removeAttribute('is-hidden');
}
DomainSettingsDKIMView.prototype.hideAll = function() {
	this.__steps[0].classList.remove('is-active');
	this.__steps[1].classList.remove('is-active');
	this.__steps[2].classList.remove('is-active');

	this.elements.wait.setAttribute('is-hidden',1);
	this.elements.academy.setAttribute('is-hidden',1);
	this.elements.generate.setAttribute('is-hidden',1);
	this.elements.show.setAttribute('is-hidden',1);
}
DomainSettingsDKIMView.prototype.notifyResetResult = function(ok) {
	if(ok) {
		gui.message.toast(getLang('dkim::reset_succeeded'));
		this._control._load();
	} else {
		gui.message.error(getLang('error::reset_failed'));
	}

}
