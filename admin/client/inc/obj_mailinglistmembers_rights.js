function obj_mailinglistmembers_rights(){};
var _me = obj_mailinglistmembers_rights.prototype;
/**
 * @brief:
 **/
_me.__constructor = function(s){
	var me = this;
	storage.library('wm_user');
};

_me._load = function(account,list) {
	var me=this;

	this.__list = list;
	this.__account = account || location.parsed_query.account;

	this._draw('obj_mailinglistmembers_rights', '', {items:{}});

	if(list!='all') {
		this.checkbox_right_default._checked(!list.some(function(user) {
			return !+user.default;
		}));

		this.checkbox_right_post._checked(!list.some(function(user) {
			return !+user.post;
		}));
		this.checkbox_right_receive._checked(!list.some(function(user) {
			return !+user.recieve;
		}));
		this.checkbox_right_digest._checked(!list.some(function(user) {
			return !+user.digest;
		}));

		this.checkbox_right_post._onclick =
		this.checkbox_right_receive._onclick =
		this.checkbox_right_digest._onclick = function() {
			me.checkbox_right_default._checked(
				!me.checkbox_right_post._checked() &&
				!me.checkbox_right_receive._checked() &&
				!me.checkbox_right_digest._checked()
			);
		}
	}
}

_me._save=function(){
	var me = this;

	var rights = {
		default: +this.checkbox_right_default._checked(),
		post: +this.checkbox_right_post._checked(),
		receive: +this.checkbox_right_receive._checked(),
		digest: +this.checkbox_right_digest._checked()
	};

	var finish = function(result) {
		if(result.error) {
			gui.message.error(getLang("error::save_unsuccessful"));
		} else {
			gui.message.toast(getLang("message::save_successfull"));
			me._close();
		}
	}

	if(this.__list=="all") {
		com.members.editAll(this.__account,rights,finish);
	} else {
		com.members.edit(this.__account,this.__list.map(function(user) {
			return user.email.toString();
		}),rights,finish);
	}

}
