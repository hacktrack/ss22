function obj_folderpicker(){};
var _me = obj_folderpicker.prototype;
/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	storage.library('wm_user');
}

_me._init=function(callback,settings){
	var me=this;
	
	me.__callback=callback;
	me._draw('obj_folderpicker');
	
	com.user.folderList(location.parsed_query.account,false,function(result){
		var root=result.Array.IQ[0].QUERY[0].RESULT[0];
		
		try
		{
			var rootElm=me._drawFolder(root);
			
			if(rootElm)
			{
				me._getAnchor('root').appendChild(rootElm);
			}
		}
		catch(e)
		{
			log.error(e);
		}
	});
}

_me._drawFolder=function(folder,depth){
	var me=this;
	var liElm=false;
	if(!depth){depth=0;}
	
	//log.log(['folder',folder]);
	
	liElm = mkElement('li',{});
		addcss(liElm,'folders-child type_'+folder.FOLDERTYPE[0].VALUE.toLowerCase());
		if(depth==0){
			addcss(liElm,'folders-root');
		}
		if(depth==1){
			addcss(liElm,'folders-top');
		}
		
		liElm._id=folder.ID[0].VALUE;
		liElm._name=folder.NAME[0].VALUE;
		
		liElm.onclick=function(e){
			
			if(me.__callback){
				me.__callback({
					id:liElm._id,
					name:liElm._name
				});
				me._parent._parent._close();
			}
		
			e.stopPropagation();
			e.cancelBubble=true;
			return false;
		};
		
	var spanElm = mkElement('span',{});
		addcss(spanElm,'folders-name');
		spanElm.innerHTML=(folder.NAME[0]&&folder.NAME[0].VALUE?folder.NAME[0].VALUE:'');
	
	liElm.appendChild(spanElm);
	
	// SUBFOLDERS[0].ITEM[0]
	if(folder.SUBFOLDERS && folder.SUBFOLDERS[0] && folder.SUBFOLDERS[0].ITEM && folder.SUBFOLDERS[0].ITEM[0]){
		addcss(liElm,'open');
		
		var ulElm = mkElement('ul',{});
		addcss(ulElm,'folders-parent');
		
		for(var i=0; i<folder.SUBFOLDERS[0].ITEM.length; i++){
			var sub=this._drawFolder(folder.SUBFOLDERS[0].ITEM[i],depth+1);
			ulElm.appendChild(sub);
		}
		
		liElm.appendChild(ulElm);
	}
	
	return liElm;
}

/////////////

gui.folderpicker=function(callback,settings){
	var popup=gui._create('popup','obj_popup');
	popup._init({
		name:'folderpicker',
		fixed:false,
		iwattr:{
			height:'full',
			width:'medium'
		},
		heading:{
			value:getLang('accountdetail::folderpicker')
		},
		footer:'obj_folderpicker_footer',
		content:'obj_folderpicker'
	});

	popup.content._init(callback,settings);
}
