var global={};

global.responseErrorHandler=function(error){
	if(error=='account_invalid' || error=='domain_invalid'){
		location.hash='#';
	}else{
		log.error('e:'+error);
	}
}

global.setRight=function(me,right,elements,wrapper_type,override){
	
	if(typeof override == 'number'){
		if(right>override){
			right=override;
		}
	}
	
	if(!wrapper_type){
		wrapper_type='fi';
	}else{
		wrapper_type='fb';
	}
	
	if(typeof elements!='object' || typeof elements[0]=='undefined'){
		elements=[elements];
	}
	log.log(['global-setright',elements.length,elements]);
	for(var i=0; i<elements.length; i++)
	{
		var o=elements[i];
		log.log(['global-setright-2',o]);
			if(typeof o=='object'){
				if(o.element)
				{
					o=o.element;
					wrapper=o.wrapper;
				}
				else
				{
					o=o._name;
					var wrapper=elements[i]._name.split('_');
					wrapper[0]=wrapper_type;
					wrapper=wrapper.join('_');
				}
			}else{
				var wrapper=elements[i].split('_');
					wrapper[0]=wrapper_type;
					wrapper=wrapper.join('_');
			}
		var a = me._getAnchor(wrapper);
		var e = me[o];
		
		if(!e){
			log.error('Element "'+o+'" does not exist');
			return false;
		}
		if(a){
			if(right==RIGHTS_HIDE){
				a.setAttribute('is-hidden',1);
			}
		}
		else{
			log.error('Rights box for element "'+o+'" not found');
		}
		if(right==RIGHTS_HIDE || right==RIGHTS_READONLY){
			if(e._readonly){
				e._readonly(true);
				log.log('Element "'+o+'" set to readonly');
			}else{
				log.error('Element "'+o+'" cannot be set to readonly');
			}
		}
	}
}