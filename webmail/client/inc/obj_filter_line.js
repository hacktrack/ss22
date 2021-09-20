_me = obj_filter_line.prototype;
function obj_filter_line() {
	storage.library('obj_filter_line_value');
	this.__aFilterLineValue = new obj_filter_line_value;
}

_me.__constructor = function(sHeaderType) {
	var me = this;

	this.__logicalOperators = false;

	this._showLogicalOperators();

	this.header._fillLang({
		"from": 'FILTERS::FROM', "to": 'FILTERS::TO', "subject": 'FILTERS::SUBJECT', "cc": 'FILTERS::CC',
		"reply_to": 'FILTERS::REPLY_TO', "date": 'FILTERS::DATE', "message": 'FILTERS::MESSAGE',
		"message_body": 'FILTERS::MESSAGE_BODY', "custom_message_header": 'FILTERS::CUSTOM_MESSAGE_HEADER',
		"message_to_me": 'FILTERS::MESSAGE_TO_ME',
		"any_message_header": 'FILTERS::ANY_MESSAGE_HEADER', "attachment_name": 'FILTERS::ATTACHMENT_NAME',
		"sender": 'FILTERS::SENDER', "recipient": 'FILTERS::RECIPIENT', "senders_ip": 'FILTERS::SENDERS_IP',
		"rdns": 'FILTERS::RDNS', "spam_score": 'FILTERS::SPAM_SCORE',"smtp_auth": 'FILTERS::SMTP_AUTH', "ip": 'FILTERS::IP',
		"all_messages": 'FILTERS::ALL_MESSAGES',
		"local_time_meets_criteria": 'FILTERS::LOCAL_TIME_MEETS_CRITERIA'
	});
	this.header._onchange = function() {
		me.local_time_meets_criteria._main.style.display = this._value() === 'local_time_meets_criteria'? 'block' : 'none';
		me.value && (me.value._main.style.display = this._value() === 'local_time_meets_criteria' ? 'none' : 'block');

		me.func._value('');

		switch (this._value()) {
			case 'from':
			case 'to':
			case 'subject':
			case 'cc':
			case 'reply_to':
			case 'date':
			case 'message_body':
			case 'custom_message_header':
			case 'any_message_header':
			case 'attachment_name':
			case 'sender':
			case 'recipient':
			case 'senders_ip':
			case 'rdns':
				me.func._main.style.display = 'block';
				me.func._fillLang({
					"starts_with": 'FILTERS::STRING_STARTS_WITH',
					"doesnt_start_with": 'FILTERS::DOESNT_START_WITH',
					"ends_with": 'FILTERS::STRING_ENDS_WITH',
					"doesnt_end_with": 'FILTERS::DOESNT_END_WITH',
					"contains_string": 'FILTERS::CONTAINS_STRING',
					"doesnt_contain_string": 'FILTERS::DOESNT_CONTAIN_STRING',
					"is_string": 'FILTERS::IS_STRING',
					"isnt_string": 'FILTERS::ISNT_STRING',
					"matches_regex": 'FILTERS::MATCHES_REGEX',
					"doesnt_match_regex": 'FILTERS::DOESNT_MATCH_REGEX'
				});
				me.func._value('contains_string');
				break;
			case 'message':
				me.func._main.style.display = 'block';
				// This defines allowed "functions" (values in second combobox in filter row) for "Message" selected in first combobox
				me.func._fillLang({
					"priority_is": 'FILTERS::PRIORITY_IS',
					"priority_isnt": 'FILTERS::PRIORITY_ISNT',
					"is_spam": 'FILTERS::IS_SPAM',
					"isnt_spam": 'FILTERS::ISNT_SPAM',
					"is_greater_than": 'FILTERS::IS_GREATER_THAN',
					"is_lower_than": 'FILTERS::IS_LOWER_THAN',
					"contains_attachment": 'FILTERS::CONTAINS_ATTACHMENT',
					"doesnt_contain_attachment": 'FILTERS::DOESNT_CONTAIN_ATTACHMENT'
				});
				me.func._value('priority_is');
				break;
			case 'ip':
				me.func._main.style.display = 'block';
				me.func._fillLang({
					"matches": 'FILTERS::MATCHES',
					"doesnt_match": 'FILTERS::DOESNT_MATCH'
				});
				me.func._value('matches');
				break;
			case 'spam_score':
				me.func._main.style.display = 'block';
				me.func._fillLang({
					"spam_is_greater_than": 'FILTERS::SPAM_IS_GREATER_THAN',
					"spam_is_lower_than": 'FILTERS::SPAM_IS_LOWER_THAN'
				});
				me.func._value('spam_is_greater_than');
				break;
			case 'smtp_auth':
				me.func._main.style.display = 'block';
				me.func._fillLang({
					"authorized": 'FILTERS::AUTHORIZED',
					"unauthorized": 'FILTERS::UNAUTHORIZED'
				});
				me.func._value('authorized');
				break;
			case 'all_messages':
				me.func._main.style.display = 'none';
				me.func._fillLang({'none': ''});
				me.func._value('none');
				break;
			case 'local_time_meets_criteria':
				me.func._main.style.display = 'none';
				break;
			case 'message_to_me':
				me.func._main.style.display = 'none';
				me.func._value('contains_string');

				if (me.value)
					me.value._destruct();

				me._create('value', 'obj_filter_line_value', 'value', '', 'message_to_me');
				break;
		}
	};

	this.func._onchange = function() {
		if (me.value) {
			if (me.value._isCompatibleTypeWith(this._value()) == false) {
				me.value._destruct();
				me._create('value', 'obj_filter_line_value', 'value', '', this._value());
			}
		}
		else
			me._create('value', 'obj_filter_line_value', 'value', '', this._value());
		me.value && (me.value._main.style.display = me.header._value() === 'local_time_meets_criteria' ? 'none' : 'block');
	};

	this.local_time_meets_criteria._onclick = function(e) {
		if(me.local_time_meets_criteria_popup && !me.local_time_meets_criteria_popup._destructed) {
			me.local_time_meets_criteria_popup._destruct();
		}
		me.local_time_meets_criteria_popup = gui._create('local_time_meets_criteria_popup', 'frm_time_criteria', '', '', ((me._value() || {}).XML || [])[0] || false, [me, '__updateTimeCriteria']);
	};

	this.operator._value('AND');
	if (sHeaderType)
		this.header._value(sHeaderType);
};

_me.__updateTimeCriteria = function(new_time_criteria) {
	var value = this._value();
	value.XML = new_time_criteria;
	this._value(value);
};

_me._showLogicalOperators = function() {
	if (this.__logicalOperators == false) {
		this.operator._fillLang({'AND': 'FILTERS::AND', 'OR': 'FILTERS::OR'});
		this.operator._value('AND');

		this.__logicalOperators = true;
		this.operator._main.style.visibility = 'visible';
	}
};

_me._hideLogicalOperators = function() {
	if (this.__logicalOperators == true) {
		this.operator._main.style.visibility = 'hidden';
		this.operator._fillLang({'AND': 'FILTERS::EMPTY_OPERATOR'});
		this.operator._value('AND');

		this.__logicalOperators = false;
	}
};

_me._getText = function(aValues) {
	for (var i in aValues['CONDITION']) {
		var sHeader = this.__getHeaderType(aValues['CONDITION'][i]);
		var sFunction = this.__getSubtype(aValues['CONDITION'][i]);

		var sLastPartOfText = '';
		if (sFunction && (sHeader !== 'local_time_meets_criteria')) {
			var sValue = this.__aFilterLineValue._getText(sFunction, aValues['CONDITION'][i]);
    		if (aValues['CONDITION'][i].HEADERTYPE && aValues['CONDITION'][i].HEADERTYPE[0].VALUE == 31 && sValue<0)
    		    sValue*=-1;

			sLastPartOfText = ' '+getLang('FILTERS::'+sFunction.toUpperCase())+((Is.Defined(sValue)) ? ' \''+sValue+'\'' : '');
		}

		return getLang('FILTERS::'+sHeader.toUpperCase())+sLastPartOfText;
	}

	return '';
};

/**
 * Sets/gets filter value
 *
 * @param {undefined|object} aValues Present when setting filter. Contains filter paramters ("AND", "CONTAIN" ...)
 *
 * @returns {undefined|object} Present only when aValues argument is undefined. Has same format as aValues argument
 */
_me._value = function(aValues) {

	if (Is.Defined(aValues)) {

		if (this.__logicalOperators == true)
			this.operator._value((aValues['AND'][0]['VALUE'] == '1') ? 'AND' : 'OR');

		// Set header
		var headerType = this.__getHeaderType(aValues);
		if (headerType == '') return;
		this.header._value(headerType);

		var sSubtype = this.__getSubtype(aValues);
		if (sSubtype) this.func._value(sSubtype);

		this.value._value(aValues);
	}
	else {
		var aValues = this.value._value();

		this.__setOrRemoveTag(aValues, 'AND', (this.operator._value() == 'AND') ? '1' : '0');

		var aNot = [];
		this.__setOrRemoveTag(aValues, 'HEADERTYPE', this.__getRawHeaderType(this.header._value(), this.func._value(), aNot));
		this.__setOrRemoveTag(aValues, 'CONTAINTYPE', this.__getRawContainType(aValues, this.func._value(), aNot));
		this.__setOrRemoveTag(aValues, 'LOGICALNOT', aNot[0] ? '1' : '0');
		var expression = this.__getRawExpression(this.header._value());
		expression && this.__setOrRemoveTag(aValues, 'EXPRESSION', expression);

		return aValues;
	}
};

/**
 * Gets value of first combobox in filter row by aValues['HEADERTYPE']. Used when displaying filter
 *
 * @param {object} aValues Filter params
 *
 * @returns {string} Value of first combobox in filter row
 */
_me.__getHeaderType = function(aValues) {
	var sHeaderType = (Is.Defined(aValues['HEADERTYPE'])) ? aValues['HEADERTYPE'][0]['VALUE'] : '0';
	var aTable = {
		'0': 'from', '1': 'to', '2': 'subject', '3': 'cc', '7': 'reply_to', '5': 'date',
		'6': 'message_body','11': 'custom_message_header', '12': 'any_message_header',
		'8': 'attachment_name', '10': 'sender', '9': 'recipient', '15': 'senders_ip',
		'19': 'rdns', '30': 'message', '20': 'message', '27': 'message', '26': 'message',
		'29': 'ip', '23': 'smtp_auth', '31': 'spam_score', '33': 'local_time_meets_criteria',
		'25': 'all_messages', '35':'message_to_me',
		'14': 'message',
	};

	return sHeaderType?aTable[sHeaderType] || '':'';
};

/**
 * Gets value of second combobox in filter row by aValues['HEADERTYPE'] and aValues['LOGICALNOT']. Used when displaying filter
 *
 * @param {object} aValues Filter params
 *
 * @returns {string} Value of second combobox in filter row
 */
_me.__getSubtype = function(aValues) {
	var sHeaderType = Is.Defined(aValues['HEADERTYPE']) ? aValues['HEADERTYPE'][0]['VALUE'].toString() : '0';
	var bNot = (Is.Defined(aValues['LOGICALNOT']) && aValues['LOGICALNOT'][0]['VALUE'] == '1') ? true : false;

	switch (sHeaderType) {
		case '30': return (!bNot) ? 'priority_is' : 'priority_isnt';
		case '20': return (!bNot) ? 'is_spam' : 'isnt_spam';
		case '27': return (!bNot) ? 'is_greater_than' : 'is_lower_than';
		case '26': return (!bNot) ? 'is_lower_than' : 'is_greater_than';
		case '29': return (!bNot) ? 'matches' : 'doesnt_match';
		case '31':
			if ((aValues.CONTAIN && aValues.CONTAIN[0].VALUE<0) || (aValues.MESSAGESIZESMALLER && aValues.MESSAGESIZESMALLER[0].VALUE == 1))
				return 'spam_is_lower_than';
		    else
				return 'spam_is_greater_than';

		case '23': return (!bNot) ? 'authorized' : 'unauthorized';
		case '25':
		case '35':
			return '';
		case '14': return (bNot) ? 'doesnt_contain_attachment' : 'contains_attachment';
		default: return this.__getContainType(aValues, bNot);
	}
};

_me.__getContainType = function(aValues, bNot) {

	if (!Is.Defined(aValues['CONTAINTYPE']))
		return (!bNot) ? 'is_string' : 'isnt_string';

	switch (aValues['CONTAINTYPE'][0]['VALUE'].toString()) {
		case '1': return (!bNot) ? 'isnt_string' : 'is_string';
		case '2': return bNot ? 'doesnt_start_with' : 'starts_with';
		case '3': return bNot ? 'doesnt_end_with' : 'ends_with';
		case '6': return 'doesnt_start_with';
		case '7': return 'doesnt_end_with';
		case '8': return (!bNot) ? 'contains_string' : 'doesnt_contain_string';
		case '9': return (!bNot) ? 'doesnt_contain_string' : 'contains_string';
		case '10': return (!bNot) ? 'matches_regex' : 'doesnt_match_regex';
		case '11': return (!bNot) ? 'doesnt_match_regex' : 'matches_regex';
	}
};

// aOutNot removed
_me.__getRawContainType = function(aValues, sFunction, aOutNot) {
	switch (sFunction) {
		case 'starts_with': return '2';
		case 'ends_with': return '3';
		case 'doesnt_start_with': return '6';
		case 'doesnt_end_with': return '7';
		case 'contains_string': return '8';
		case 'doesnt_contain_string': return '9';
		case 'matches_regex': return '10';
		case 'doesnt_match_regex': return '11';
		case 'is_string': return '';
		case 'isnt_string': return '';
		default:
			return '';
	}
};

_me.__getRawExpression = function(sType) {
	switch(sType) {
		case 'local_time_meets_criteria':
			return '10';
	}
	return '';
};

/**
 * Returns HEADERTYPE value (for filter params object) by values of filter comboboxes. Also sets LOGICALNOT to aOutNot[0] argument
 *
 * @param {string} sType     Value of first filter combobox
 * @param {string} sFunction Value of second filter combobox
 * @param {array}  aOutNot   Array with LOGICALNOT filter param in first item
 *
 * @returns {string} Filters HEADERTYPE value
 */
_me.__getRawHeaderType = function(sType, sFunction, aOutNot) {
	if(sFunction === 'isnt_string'){
		aOutNot[0] = true;
	}
	switch (sType) {
		case 'message':
			switch (sFunction) {
				case 'priority_is': aOutNot[0] = false; return '30';
				case 'priority_isnt': aOutNot[0] = true; return '30';
				case 'is_spam': aOutNot[0] = false; return '20';
				case 'isnt_spam': aOutNot[0] = true; return '20';
				case 'is_greater_than': aOutNot[0] = false; return '27';
				case 'is_lower_than': aOutNot[0] = false; return '26';
				case 'doesnt_contain_attachment':
					aOutNot[0] = true; // sets LOGICALNOT in return value to true
					return '14';
				case 'contains_attachment':
					aOutNot[0] = false; // sets LOGICALNOT in return value to false
					return '14';
			}
			break;
		case 'smtp_auth':
			switch (sFunction) {
				case 'authorized': aOutNot[0] = false; return '23';
				case 'unauthorized': aOutNot[0] = true; return '23';
			}
			break;
		case 'all_messages': aOutNot[0] = false; return '25';
		default:
			var table = {
				'from': '', 'to': '1', 'subject': '2', 'cc': '3', 'reply_to': '7', 'date': '5', 'message_body': '6',
				'custom_message_header': '11', 'any_message_header': '12', 'attachment_name': '8',
				'sender': '10', 'recipient': '9', 'senders_ip': '15', 'rdns': '19', 'ip': '29',
				'spam_score': '31', 'local_time_meets_criteria': '33', 'message_to_me': '35'
			};

			return table[sType];
	}
};

_me.__setOrRemoveTag = function(aValues, sTagName, sValue) {
	if (Is.Defined(aValues[sTagName])) {
		if (sValue != '') {
			aValues[sTagName][0]['VALUE'] = sValue;
		} else {
			delete aValues[sTagName];
		}
	} else {
		if (sValue != '') {
			aValues[sTagName] = [{'VALUE': sValue}];
		}
	}
};
