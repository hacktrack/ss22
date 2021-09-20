_me = obj_demo.prototype;
function obj_demo(){};

/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;

	storage.library('obj_accountpicker');

	this._leftMenu=[
		{
			isdefault:true,
			name:'demo',
			icon:'user',
			value:'other::demo'
		}
	];
	this._menuHashTemplate='#menu=/MENU/';

	this._leftMenu_other=[
		{
			isdefault:true,
			name:'other',
			icon:'user',
			value:'other::other'
		}
	];

	this._actionselect1_menu=[
		{
			name:'demo0',
			icon:false,
			onclick:function(){return false;},
			value:'Add to group'
		},
		{
			name:'demo1',
			icon:false,
			onclick:function(){return false;},
			value:'Delete'
		},
		{
			name:'demo2',
			icon:false,
			onclick:function(){return false;},
			value:'Something something something looong'
		}

	];

	this._menuHashTemplate_other='#menu=/MENU/';

	//gui.frm_main.main._isFixed(false);
	/*
	if(!gui.frm_main.testbox){
		gui.frm_main._create('testbox','frm_box','main_box');
	}
	*/

};

_me.__onclick = function(e){

};

_me._hash_handler = function(e,aData)
{
	var that=this;
	var me=this;
	log.log('Demo should be loaded');
	try
	{
		gui.frm_main.main._init({
			name:'demo',
			menu:{
				hashTemplate:this._menuHashTemplate,
				items:this._leftMenu
			},
			heading:{
				value:getLang('other::demo'),
				button:{
					value:"Open modal",
					onclick:function(){
						me._openPopup();
					},
					class:'text success'
				}
			}
		});

		that._draw('obj_demo', '', {items:{}});

		// ERROR, WARNING AND SUCCESS EXAMPLES
		this.button_show_error._onclick=function(){
			gui.message.error('This error is not unique. More of them can exist. That means, that other error popups will open in another popup. The same is for other message types per type. This is default behavior.','Not unique error popup',[
				{
					value:getLang("generic::cancel"),
					method:'close'
				},
				{
					value:getLang("Open other error popup"),
					onclick:function(closeCallback){
						gui.message.error('This is standalone error popup not rewriting previous error. (it\'s defined in the previous error popup)','Some error');
					}
				}
			],true);
		}

		this.button_show_error_unique._onclick=function(){
			gui.message.error('This error is unique. Only one can exist. That means, that any other error popup will overwrite it. The same is for other message types per type.','Unique error popup',[
				{
					value:getLang("generic::cancel"),
					method:'close'
				},
				{
					value:getLang("Open other error popup"),
					onclick:function(closeCallback){
						gui.message.error('This error popup rewrited previous error popup. Previous popup does not exist anymore. (it\'s defined in the previous error popup)','Some error');
					}
				}
			]);
		}

		this.button_show_warning._onclick=function(){
			gui.message.warning('Warning test Morbi justo enim, rutrum scelerisque consectetur quis, rhoncus vel leo. Etiam vehicula, tellus non aliquam luctus, justo risus faucibus arcu, sed ullamcorper libero metus nec tortor. In hac habitasse platea ');
		}
		this.button_show_success._onclick=function(){
			gui.message.success('Success test Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus ac elit suscipit mollis. Maecenas varius nibh non posuere feugiat. Mauris quis orci non nisi dapibus');
		}
		this.button_show_toast._onclick=function(){
			gui.message.toast('Success test Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus ac elit suscipit mollis. Maecenas varius nibh non posuere feugiat. Mauris quis orci non nisi dapibus');
		}
		//

		//
		this.actionselect_1._fill(this._actionselect1_menu);
		//

		// ACCOUNTPICKER DEMO
		this.button__9._onclick=function(){
			gui.accountpicker(function(items,type){
				log.info(['RESULT OF ACCOUNT PICKER',items,type]);
			});
		}

		this.button_create_new_account._onclick=function(){
			me._newAccount();
		}

		that.dropdown_demo_normal._fill({'key1':'val1','key2':'val2'});
		that.dropdown_demo_editable._fill([500,1000,5931]);
		//that.checkbox_demo2._checked(true);
		//that.checkbox_demo3._checked(true);
		setInterval(function(){

			if(location.parsed_query && location.parsed_query.menu && location.parsed_query.menu=='demo' && me.bar_demo1)
			{
				if(!this.inc){this.inc=0;}
				me.bar_demo1._value(this.inc);
				me.bar_demo1._label(this.inc+" of 100");

				this.inc+=10;
				if(this.inc>100){this.inc=0;}
			}
			else
			{
				clearInterval(this);
			}

		},500);
	}
	catch(e){
		log.error(e);
	}
}

_me._openPopup=function(){
	var popup=gui._create('popup','obj_popup');
	popup.main._init({
		name:'demo',
		menu:{
			hashTemplate:this._menuHashTemplate,
			items:this._leftMenu
		},
		heading:{
			value:getLang('other::demo')/*,
			button:{
				value:"Empty",
				onclick:function(){
					alert('clicked');
				},
				class:'text success'
			}*/
		}
	});
}

_me._newAccount=function()
{
	var popup=gui._create('popup','obj_popup');
	popup._init({
		fixed:false,
		name:'newaccount',
		heading:{
			value:getLang('generic::create_new_account')
		},
		footer:'default',
		content:'obj_newaccount'
	});

	popup.content._load(location.parsed_query.domain);
}
