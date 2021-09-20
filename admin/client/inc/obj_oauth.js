function obj_oauth() {};

obj_oauth.prototype.__constructor = function () {
	storage.library('wm_oauth');

	gui.frm_main.main._setAlternativeButtons(function (box, target_anchor) {
		if (!box._alternativeButtons) {
			box._alternativeButtons = [];
		}

		// add oauth button
		var add = box._create('button_add', 'obj_button', target_anchor);
		add._addcss('text primary');
		add._value('generic::add');
		box._alternativeButtons.push(add);
		//

		// add oauth button
		var edit = box._create('button_edit', 'obj_button', target_anchor);
		edit._disabled(true);
		edit._addcss('text primary');
		edit._value('certificates::edit');
		box._alternativeButtons.push(edit);
		//

		// delete selected oauth button
		var del = box._create('button_delete', 'obj_button', target_anchor);
		del._disabled(true);
		del._addcss('text error');
		del._value('generic::delete');
		box._alternativeButtons.push(del);
		//
	});
};

obj_oauth.prototype._load = function () {
	var me = this;
	var parent = me._parent;

	me._draw('obj_oauth');

	// set on methods
	parent.button_add._onclick = function () {
		me._showOauthWizard();
	}
	parent.button_edit._onclick = function () {
		me._showOauthWizard(me.list._getSelectedList()[0]);
	}
	parent.button_delete._onclick = function () {
		me._deleteSelectedOauths();
	}
	//

	/* Init loadable grid */
	this.list._init('obj_oauth', false, function (linesPerPage, page, callback) {
		// no listing available
		me.list._setMax(false);

		com.oauth.server([function (aData) {
			log.log(['oauth-load', aData]);
			// Add items to list
			if (aData[0]) {
				for (var i = 0; i < aData.length; i++) {
					log.log(['oauth-load-item', aData[i]]);

					aData[i].auth_type = wm_oauth._AUTH_TYPES[aData[i].authtype];
					var line = me.list._drawItem(aData[i]);
					line.onclick = function() {
						me._showOauthWizard(this._item);
					};
				}
			}
			// Call callback with data if any supplied
			if (callback) {
				callback.call(me, aData);
			}
		}]);
	});

	this.list._onchange = function () {
		parent.button_delete._disabled(me.list._getSelectedCount() === 0);
		parent.button_edit._disabled(me.list._getSelectedCount() !== 1);
	};
};

obj_oauth.prototype._showOauthWizard = function (oauth) {
	var popup = gui._create('popup', 'obj_popup');
	popup._init({
		name: 'oauth_wizard',
		heading: {
			value: getLang('oauth::wizard' + (oauth ? '_edit' : ''))
		},
		iwattr: {
			width: 'medium'
		},
		fixed: false,
		footer: 'default',
		content: "obj_oauth_wizard"
	});
	popup.content._oauthList = this.list;
	popup.content._load(oauth);
};

obj_oauth.prototype._doTheDelete = function (closeCallback) {
	var me = this;
	if (me._deleteItemsList && me._deleteItemsList[0]) {
		var deleteItem = me._deleteItemsList[me._deleteItemsList.length - 1];
		log.log(['oauth-dothedelete-click', deleteItem]);
		com.oauth.delete(deleteItem.clientid, function (success) {
			try {
				if (success) {
					me._deleteItemsList.splice(me._deleteItemsList.length - 1, 1);
					me._doTheDelete(closeCallback);
				} else {
					me._deleteItemsList = [];
					me.list._emptySelectedList();
					me.list._load();
					closeCallback();
					gui.message.error(getLang("error::delete_unsuccessful"));
				}
			} catch (e) {
				log.error(['oauth-dothedelete', e]);
			}
		});
	} else {
		me._deleteItemsList = [];
		me.list._emptySelectedList();
		me.list._load();
		closeCallback();
		gui.message.toast(getLang("message::delete_successfull"));
	}
};

obj_oauth.prototype._deleteSelectedOauths = function () {
	var me = this;
	gui.message.warning(getLang('warning::delete_selected_oauths') + " (" + me.list._getSelectedCount() + ")", false, [{
			value: getLang("generic::cancel"),
			type: 'text borderless',
			method: 'close'
		},
		{
			value: getLang("generic::delete"),
			type: 'error text',
			onclick: function (closeCallback) {
				// Do the delete. Now it's confirmed by user
				me._deleteItemsList = me.list._getSelectedList();
				me._doTheDelete(closeCallback);
				//
			}
		}
	]);
};
