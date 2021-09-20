_me = obj_filter_line_value.prototype;
function obj_filter_line_value(){};

_me.__constructor = function(sType) {
	var me = this;
	this.__sType = sType;
	this.__value = {};

	switch (sType) {
		case 'starts_with':
		case 'doesnt_start_with':
		case 'ends_with':
		case 'doesnt_end_with':
		case 'contains_string':
		case 'doesnt_contain_string':
		case 'matches_regex':
		case 'doesnt_match_regex':
		case 'is_string':
		case 'isnt_string':
			me._create('value', 'obj_input', 'td1');
			me._create('match_case', 'obj_checkbox', 'td2', '', 'FILTERS::MATCH_CASE');
			me._create('whole_word', 'obj_checkbox', 'td3', '', 'FILTERS::WHOLE_WORD');
			break;
		case 'matches':
		case 'doesnt_match':
			me._create('value', 'obj_input', 'td1');
			break;
		case 'priority_is':
		case 'priority_isnt':
			me._create('priority', 'obj_select', 'td1');
			me.priority._fillLang({'1': 'FILTERS::HIGHEST', '2': 'FILTERS::HIGH', '^3$|^$': 'FILTERS::NORMAL', '4': 'FILTERS::LOW', '5': 'FILTERS::LOWEST'});
			me.priority._value('^3$|^$');
			break;
		case 'is_spam':
		case 'isnt_spam':
			break;
		case 'is_greater_than':
		case 'is_lower_than':
			me._create('value', 'obj_input', 'td1');
			me._create('digit_place', 'obj_select', 'td2');
			me.digit_place._fill({'KB':getLang('UNITS::KB'), 'MB':getLang('UNITS::MB'), 'GB':getLang('UNITS::GB')});
			me.digit_place._value('KB');
			break;
		case 'spam_is_lower_than':
		case 'spam_is_greater_than':
			me._create('value', 'obj_input', 'td1');
			break;

		case 'message_to_me':
			me._create('message_to_me_only', 'obj_checkbox', 'td1', '', 'FILTERS::MESSAGE_TO_ME_ONLY');
			me.message_to_me_only._onchange = function(){
				if (this._value()){
					me.message_to_me_to._value(0, true);
					me.message_to_me_cc._value(0, true);
					me.message_to_me_bcc._value(0, true);
				}
			};
			me._create('message_to_me_to', 'obj_checkbox', 'td2', '', 'FILTERS::MESSAGE_TO_ME_TO');
			me._create('message_to_me_cc', 'obj_checkbox', 'td3', '', 'FILTERS::MESSAGE_TO_ME_CC');
			me._create('message_to_me_bcc', 'obj_checkbox', 'td4', '', 'FILTERS::MESSAGE_TO_ME_BCC');
			me.message_to_me_to._onchange = me.message_to_me_cc._onchange = me.message_to_me_bcc._onchange = function(){
				if (this._value())
					me.message_to_me_only._value(0, true);
			};
	}
};

_me._getText = function(sType, aValues) {
	if (!Is.Defined(aValues['CONTAIN'])) return undefined;

	switch (sType) {
		case 'starts_with':
		case 'doesnt_start_with':
		case 'ends_with':
		case 'doesnt_end_with':
		case 'contains_string':
		case 'doesnt_contain_string':
		case 'matches_regex':
		case 'doesnt_match_regex':
		case 'is_string':
		case 'isnt_string':
		case 'matches':
		case 'doesnt_match':
			return aValues['CONTAIN'][0]['VALUE'];
		case 'priority_is':
		case 'priority_isnt':
			switch (aValues['CONTAIN'][0]['VALUE'].toString()) {
				case '1': return getLang('FILTERS::HIGHEST');
				case '2': return getLang('FILTERS::HIGH');
				case '^3$|^$': return getLang('FILTERS::NORMAL');
				case '4': return getLang('FILTERS::LOW');
				case '5': return getLang('FILTERS::LOWEST');
			}
			break;
		case 'is_greater_than':
		case 'is_lower_than':
			var nBytes = parseInt(aValues['CONTAIN'][0]['VALUE']);

			if ((nBytes/(1024*1024)) < 1) {
				return (nBytes/1024).toString()+' KB';
			} else {
				if (nBytes/(1024*1024*1024) < 1) {
					return (nBytes/(1024*1024)).toString()+' MB';
				} else {
					return (nBytes/(1024*1024*1024)).toString()+' GB';
				}
			}
			break;
		case 'spam_is_lower_than':
			//return (aValues['CONTAIN'][0]['VALUE']/100)*-1;
		case 'spam_is_greater_than':
			return aValues['CONTAIN'][0]['VALUE']/100;
	}

	return undefined;
}

_me._isCompatibleTypeWith = function(sType) {
	var aGroups = [
		['starts_with','doesnt_start_with','ends_with','doesnt_end_with','contains_string', 'doesnt_contain_string', 'matches_regex', 'doesnt_match_regex', 'is_string', 'isnt_string'],
		['matches', 'doesnt_match'],
		['is_spam', 'isnt_spam'],
		['priority_is', 'priority_isnt'],
		['is_greater_than', 'is_lower_than'],
		['spam_is_lower_than', 'spam_is_greater_than'],
		['none'],
		['message_to_me']
	];

	for (var group1 in aGroups) {
		for (var i in aGroups[group1]) {
			if (aGroups[group1][i] == sType) {
				for (var group2 in aGroups) {
					for (var i in aGroups[group2]) {
						if (aGroups[group2][i] == this.__sType) {
							return (group1 == group2);
						}
					}
				}
			}
		}
	}
	return false;
}

/**
 * Sets/gets filter value
 *
 * @param {undefined|object} aValues Present when setting filter. Contains filter paramters ("AND", "CONTAIN" ...)
 *
 * @returns {undefined|object} Present only when aValues argument is undefined. Has same format as aValues argument
 */
_me._value = function(aValues) {
	if (Is.Defined(aValues)) {
		this.__value = aValues;

		switch (this.__sType) {
			case 'starts_with':
			case 'doesnt_start_with':
			case 'ends_with':
			case 'doesnt_end_with':
			case 'contains_string':
			case 'doesnt_contain_string':
			case 'matches_regex':
			case 'doesnt_match_regex':
			case 'is_string':
			case 'isnt_string':
				this.__setTextFilter(aValues);
				break;
			case 'matches':
			case 'doesnt_match':
				this.__setIPFilter(aValues);
				break;
			case 'priority_is':
			case 'priority_isnt':
				this.__setPriority(aValues);
				break;
			case 'is_spam':
			case 'isnt_spam':
				break;
			case 'is_greater_than':
			case 'is_lower_than':
				this.__setSize(aValues);
				break;
			case 'spam_is_lower_than':
			case 'spam_is_greater_than':
				this.__setSpamScore(aValues);
				break;
			case 'message_to_me':
				this.__setMessageMe(aValues);
		}
	} else {
		switch (this.__sType) {
			case 'starts_with':
			case 'doesnt_start_with':
			case 'ends_with':
			case 'doesnt_end_with':
			case 'contains_string':
			case 'doesnt_contain_string':
			case 'matches_regex':
			case 'doesnt_match_regex':
			case 'is_string':
			case 'isnt_string':
				this.__getTextFilter(this.__value);
				break;
			case 'matches':
			case 'doesnt_match':
				this.__getIPFilter(this.__value);
				break;
			case 'priority_is':
			case 'priority_isnt':
				this.__getPriority(this.__value);
				break;
			case 'is_greater_than':
			case 'is_lower_than':
				this.__getSize(this.__value);
				break;
			case 'spam_is_lower_than':
			case 'spam_is_greater_than':
				this.__getSpamScore(this.__value);
				break;
			case 'message_to_me':
				this.__getMessageMe(this.__value);
		}
		return this.__value;
	}
};

_me.__setMessageMe = function(aValues){

	var sContain = (Is.Defined(aValues['CONTAIN'])) ? aValues['CONTAIN'][0]['VALUE'] : 0,
		aContain = base64.decode(sContain).split('').map(function(v){ return v.codePointAt()});

	if (aContain[0]){
		this.message_to_me_only._value(1, true);
		this.message_to_me_to._value(0, true);
		this.message_to_me_cc._value(0, true);
		this.message_to_me_bcc._value(0, true);
	}
	else{
		this.message_to_me_only._value(0, true);
		this.message_to_me_to._value(aContain[1], true);
		this.message_to_me_cc._value(aContain[2], true);
		this.message_to_me_bcc._value(aContain[3], true);
	}
};
_me.__getMessageMe = function(aValues){
	this.__setOrRemoveTag(aValues, 'CONTAIN',  base64.encode([
		this.message_to_me_only._value()?'\u0001':'\u0000',
		this.message_to_me_to._value()?'\u0001':'\u0000',
		this.message_to_me_cc._value()?'\u0001':'\u0000',
		this.message_to_me_bcc._value()?'\u0001':'\u0000'
	].join('')));
};

_me.__setTextFilter = function(aValues) {
	var sContain = (Is.Defined(aValues['CONTAIN'])) ? aValues['CONTAIN'][0]['VALUE'] : '';
	this.value._value(sContain);

	// Set case sensitivity / whole world match
	if (Is.Defined(aValues['CASE'])) {
		var nCase = parseInt(aValues['CASE'][0]['VALUE']);

		this.match_case._value((nCase & 0x01) ? true : false);
		this.whole_word._value((nCase & 0x04) ? true : false);
	}
}

_me.__getTextFilter = function(aValues) {
	this.__setOrRemoveTag(aValues, 'CONTAIN', this.value._value());
	var nCase = 0;
	if (this.match_case._value()) nCase |= 0x01;
	if (this.whole_word._value()) nCase |= 0x04;

	this.__setOrRemoveTag(aValues, 'CASE', (nCase != 0) ? nCase.toString() : '');
}

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
}

_me.__setPriority = function(aValues) {
	this.priority._value(aValues['CONTAIN'][0]['VALUE']);
}

_me.__getPriority = function(aValues) {
	this.__setOrRemoveTag(aValues, 'CONTAIN', this.priority._value());
}

_me.__getSize = function(aValues) {
	var nSize = this.value._value();
	switch (this.digit_place._value()) {
		case 'KB': nSize *= 1024; break;
		case 'MB': nSize *= 1024*1024; break;
		case 'GB': nSize *= 1024*1024*1024; break;
	}
	nSize = Math.round(nSize);

	this.__setOrRemoveTag(aValues, 'CONTAIN', nSize);
	this.__setOrRemoveTag(aValues, 'MESSAGESIZE', nSize);
}

_me.__setSize = function(aValues) {
	var nBytes = parseInt(aValues['CONTAIN'][0]['VALUE']);

	if ((nBytes/(1024*1024)) < 1) {
		this.value._value(nBytes/1024);
		this.digit_place._value('KB');
	} else {
		if (nBytes/(1024*1024*1024) < 1) {
			this.value._value(nBytes/(1024*1024));
			this.digit_place._value('MB');
		} else {
			this.value._value(nBytes/(1024*1024*1024));
			this.digit_place._value('GB');
		}
	}
}

_me.__setSpamScore = function(aValues) {
	var nSize = aValues['CONTAIN'][0]['VALUE']/100;
	this.value._value(Math.abs(nSize));
};

_me.__getSpamScore = function(aValues) {
	var nSize = Math.round(this.value._value()*100);

	if (this._parent.func._value() == 'spam_is_lower_than'){
		this.__setOrRemoveTag(aValues, 'CONTAIN', nSize*-1);
		this.__setOrRemoveTag(aValues, 'MESSAGESIZESMALLER', 1);
	}
	else{
		this.__setOrRemoveTag(aValues, 'CONTAIN', nSize);
		this.__setOrRemoveTag(aValues, 'MESSAGESIZESMALLER', 0);
	}
	this.__setOrRemoveTag(aValues, 'MESSAGESIZE', Math.abs(nSize));
}

_me.__setIPFilter = function(aValues) {
	var sContain = (Is.Defined(aValues['CONTAIN'])) ? aValues['CONTAIN'][0]['VALUE'] : '';
	this.value._value(sContain);
}

_me.__getIPFilter = function(aValues) {
	this.__setOrRemoveTag(aValues, 'CONTAIN', this.value._value());
}
