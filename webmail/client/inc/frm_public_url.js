_me = frm_public_url.prototype;
function frm_public_url() {}

_me.__sendAsEmail = function (sEmail, aIds) {
	var email = MailAddress.splitEmailsAndNames(sEmail);
	if (email && (email = email[0]) && (email = email.email)) {

		WMItems.action({aid: aIds[0], fid: aIds[1], iid: aIds[2][0].replace('*', ''), values: {EMAIL: email}}, 'notify_item', [
			function (bOK) {
				if (bOK) {
					gui.notifier._value({type: 'message_sent'});
					this._destruct();
				} else {
					this.search && this.search.__eIN && this.search.__eIN.select();
				}
			}.bind(this)
		]);
	}
};

/**
 * Sharing public url for gw items
 * @param {Array} aIds
 * @param {String} sURL
 */
_me.__constructor = function (aIds, sURL) {
	this._title('MAIN_MENU::SHARE');
	this._size(680, 170, true);
	this._resizable(false);
	this._dockable(false);

	var sURL = sURL || Item.getPublicUrl([aIds[0], aIds[1], aIds[2][0]]);

	var send_as_email = !~['C', 'E', 'N', 'T'].indexOf(WMFolders.getType(aIds)) && (!TeamChatAPI || !TeamChatAPI.teamChatOnly()) && !sPrimaryAccountGUEST;

	if (send_as_email) {
		var label1 = document.createElement('div');
		label1.textContent = getLang('popup_items::send_as_email');
		label1.classList.add('label');

		this._create('search', 'obj_suggest_mail', 'main', 'obj_input_100');

		this.search._single = true;

		var input1_cell = document.createElement('div');
		input1_cell.classList.add('cell');
		input1_cell.classList.add('stretch');
		input1_cell.appendChild(this.search._main);

		var button1 = document.createElement('button');
		button1.classList.add('email_address_send');
		button1.textContent = getLang('compose::send');
		button1.addEventListener('click', function () {
			this.__sendAsEmail(this.search.__eIN.value, aIds);
		}.bind(this));

		var button1_cell = document.createElement('div');
		button1_cell.classList.add('cell');
		button1_cell.appendChild(button1);

		var inner_table1 = document.createElement('div');
		inner_table1.classList.add('table');
		inner_table1.appendChild(input1_cell);
		inner_table1.appendChild(button1_cell);

		var column1 = document.createElement('div');
		column1.classList.add('cell');
		column1.classList.add('stretch_half');
		column1.appendChild(label1);
		column1.appendChild(inner_table1);

		var label2 = document.createElement('div');
		label2.classList.add('or');
		label2.textContent = getLang('common::or');

		var column2 = document.createElement('div');
		column2.classList.add('cell');
		column2.classList.add('separator');
		column2.appendChild(label2);
	}

	var label3 = document.createElement('div');
	label3.textContent = getLang('item::share');
	label3.classList.add('label');

	var input2 = document.createElement('input');
	input2.value = sURL;
	input2.setAttribute('readonly', 'readonly');
	input2.classList.add('link');
	input2.classList.add('stretch');
	input2.addEventListener('click', function () {
		input2.select();
	});

	var input2_cell = document.createElement('div');
	input2_cell.classList.add('cell');
	input2_cell.classList.add('stretch');
	input2_cell.appendChild(input2);

	var button2 = document.createElement('button');
	button2.classList.add('link_copy');
	button2.textContent = getLang('popup_items::copy');
	button2.addEventListener('click', function () {
		input2.select();
		try {
			if (!document.queryCommandSupported('copy')) {
				throw new Error('Unsupported command "copy"');
			}
			if (!document.queryCommandEnabled('copy')) {
				throw new Error('Command "copy" disabled');
			}
			if (!document.execCommand('copy')) {
				throw new Error('Unable to copy mail to clipboard. Press CTRL + C to copy');
			}
		} catch (err) {
			console.log(err);
		}
		gui.notifier && gui.notifier._value({type: 'clipboard_link'});
		this._destruct();
	}.bind(this));

	var button2_cell = document.createElement('div');
	button2_cell.classList.add('cell');
	button2_cell.appendChild(button2);

	var inner_table2 = document.createElement('div');
	inner_table2.classList.add('table');
	inner_table2.appendChild(input2_cell);
	inner_table2.appendChild(button2_cell);

	var column3 = document.createElement('div');
	column3.classList.add('cell');
	column3.classList.add('stretch_half');
	column3.appendChild(label3);
	column3.appendChild(inner_table2);

	var table = document.createElement('div');
	table.classList.add('table');
	if(send_as_email) {
		table.appendChild(column1);
		table.appendChild(column2);
	}
	table.appendChild(column3);

	this.__eMain.appendChild(table);
};
