_me = obj_tabs.prototype;
function obj_tabs(){};

_me.__constructor = function(){
	addcss(this._main,'tabs');
	this.__items={};
	
	/* use IW attributes */
	for(var key in this.__attributes){
		if(key.substr(0,3)=='iw-'){
			this._main.setAttribute(key,this.__attributes[key]);
		}
	}
	/* */
};

_me.__createItem=function(id,label,content,templateData){
	try
	{
		if(!templateData){templateData={};}
		var template=false;
		if(content && content.substr(content.length-4,4)=='.tpl'){
			template=content;
		}

		var oInput = mkElement('input',{id:this._pathName+'#_'+id,className:"tabs-radio",type:"radio",name:'group_'+this._name});
		var oLabel = mkElement('label',{className:'tabs-label','for':this._pathName+'#_'+id});
			oLabel.innerHTML=helper.htmlspecialchars(label);
		var oDiv = mkElement('div',{id:this._pathName+'#content_'+id,className:'tabs-content'});

		this._main.appendChild(oInput);
		this._main.appendChild(oLabel);
		this._main.appendChild(oDiv);

		if(template){
			this._draw(template.substr(0,template.length-4),'content_'+id,templateData);
		}else if(content){
			oDiv.innerHTML=helper.htmlspecialchars(content);
		}

		this.__items[id]={
			id:id,
			label:label,
			content:content,
			template:template,
			templateData:templateData,
			oContent:oDiv,
			oLabel:oLabel,
			oRadio:oInput,
			contentAnchor:'content_'+id
		};
		
		if(helper.associativeArrayLength(this.__items)==1){
			oInput.checked=true;
		}

		log.log(['tabs-createitem',this.__items[id]]);

		return this.__items[id];
	}
	catch(e)
	{
		log.error(e);
	}
}

_me._template=function(id,template){
	this._draw(template,this._getTab(id).contentAnchor);
}

_me._content=function(id,content){
	this.__items[id].oContent.innerHTML=helper.htmlspecialchars(content);
}

_me._label=function(id,label){
	this.__items[id].oLabel.innerHTML=helper.htmlspecialchars(label);
}

_me._getTab=function(id){
	return  this.__items[id];
}

_me._fill=function(aData){
	for(var i=0; i<aData.length; i++){
		this.__createItem(aData[i].id,aData[i].label,(aData[i].template?aData[i].template:aData[i].content));
	}
}

_me._show = function(agent) {
	this._main.style.display='';
	this._ishidden=false;
};

_me._hide = function(agent) {
	this._main.style.display='none';
	this._ishidden=true;
};
