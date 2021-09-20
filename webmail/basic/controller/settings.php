<?php

 


class slControllerSettings extends slControllerDefault
{
	public static $settingsURI = '?_n[p][main]=win.main.tree&_n[w]=main&_n[p][content]=settings';
	public function check(&$action,&$data)
	{
		 		parent::check($action,$data);
		$helperSettings['helper'] = 'settings';
		$this->settings = slHelperFactory::instance($helperSettings);
	}
	public function save()
	{
		try{
			$request = slRequest::instance();
			$result = new stdClass();
			$this->level = $request->get('all.level');
			$domain = $request->get('all.domain');
			if($domain=='__new'){
				$domain = $request->get('all.navigate');
			}
			if($domain){
				$this->domain = $domain;
				if($level=='admin'){
					$this->adminAsDomain = true;
				}
			}
			$data = $request->get('all.settings');
			$force = $request->get('all.force');
			if(is_array($force)) foreach($force as $level => $levelForce){
				if(is_array($levelForce)) foreach($levelForce as $list => $value){
					$options = explode('|',$list);
					foreach($options as $option){
						$info = explode('#',$option);
						$forceChange[$info[0]][$info[1]][$level] = intval($value)?'view':'full';
					}
				}
			}
			
			if(is_array($data)) foreach($data as $resource => $val){
				$aActions[$resource] = $this->getSentData($resource,$forceChange[$resource]);
			}
			$this->settings->clearCache('available_domains');
			slSession::instance()->setMain('["cache"]["helper"]["settings"]',array());
			if($this->level=='user'){
				$this->settings->setPrivate($aActions);
			}else{
				$this->settings->setPublic($aActions,$this->domain);
			}
			if(is_array($data)) foreach($data as $resource => $val){
				$this->settings->clearCache($resource,'public');
				$this->settings->clearCache($resource,'private');
			}
		}catch(Exc $e){
			$linkAdd = '';
			switch($e->wmcode){
				case 'account_signup_error':
					$linkAdd = '&pwpolicy=1';
					break;
			}
			$result->redirect = true;
			$result->back = true;
			$result->errorParams = $linkAdd;
			$result->error = $e;
			return $result;
		}
		return $this->navigate(false,'settings_save_ok');
	}
	public function getSentData($sResourceName,$force)
	{
		$resource = slRequest::instance()->get('all.settings.'.$sResourceName);
		foreach ($resource as $item) {
			foreach($item as $key => $val){
				$itemID = false;
				$itemValues = false;
				if($key == '__uid'){
					$itemID = $val;
				}else{
					$itemValues = true;
					$val['value'] = $val['value']=='on'?1:$val['value'];
					if($val['function']){
						$value = $this->settings->storage_function(
							false,
							$val['value'],
							$val['function'],
							$key,
							$set
							);
						if($set['set']){
							foreach($set['values'] as $functionKey => $functionVal){
								$aItem['data'][$functionKey] = $functionVal;
								$aItem['dataTree']['@childnodes'][$functionKey][0]['@value'] = $functionVal;
							}
						}
					}else{
						if( $val['value']!=$val['oldvalue']
						|| isset($force[$key]['user'])
						|| isset($force[$key]['domain']) ){
							$aItem['data'][$key] = $val['value'];
							$aItem['dataTree']['@childnodes'][$key][0]['@value'] = $val['value'];
						}
					}
					if(isset($force[$key]['user'])){
						$aItem['dataTree']['@childnodes'][$key][0]['@attributes']['useraccess'] = $force[$key]['user'];
					}
					if(isset($force[$key]['domain'])){
						if($force[$key]['domain']=='view'){
							$aItem['dataTree']['@childnodes'][$key][0]['@attributes']['useraccess'] = 'view';
							$aItem['dataTree']['@childnodes'][$key][0]['@attributes']['domainadminaccess'] = $force[$key]['domain'];
						}else{
							$aItem['dataTree']['@childnodes'][$key][0]['@attributes']['useraccess'] = $force[$key]['user']?$force[$key]['user']:$force[$key]['domain'];
							$aItem['dataTree']['@childnodes'][$key][0]['@attributes']['domainadminaccess'] = $force[$key]['domain'];
						}
					}
				}
			}
			 			if ($aItem['uid'] = $itemID) {
				 				if ($itemValues){
					$aItem['action'] = 'edit';
				}else{
					$aItem['action'] = 'delete';
				}
			} else {
				$aItem['action'] = 'add';
			}
			$aResult[] = $aItem;
		}
		return $aResult;
	}
	
	public function cancel()
	{
		return $this->navigate(true);
	}
	
	public function convertArray($storage,$array,$columns)
	{
		if($array) foreach($array as $key => $val){
			if($val['columns']) foreach($val['columns'] as $index=>$column){
				$value = slToolsPHP::htmlspecialchars($column['value']);
				if($value){
					$aAction[$key]['data'][$columns[$index]] = $value;
					$aAction[$key]['dataTree']['@childnodes'][$columns[$index]][0]['@value'] =$value;
					$aAction[$key]['uid'] = '';
					$aAction[$key]['action'] = 'add';
				}
			}
		}
		return $aAction;
		
	}
	
	public function showDialog($storage,$dialog,$type,$indexes = false)
	{
		$this->save();
		$request = slRequest::instance();
		
		$source_uri = $request->getPath().'?'.$request->getQueryString();
		$dialog_uri = $request->getPath().self::$settingsURI;
		$dialog_uri.='&storage='.$storage.'&section='.$request->get('all.section').'&view=dialog&dialog='.$dialog.'&dlg_type='.$type;
		
		if($type=='edit' && !$indexes && $indexes!==0 && $indexes!=='0'){
			$dialog_uri = $source_uri;
		}else{
			$dialog_uri.='&index='.$indexes;
		}
		$session = slSession::instance();
		$id = slSystem::uniqueID();
		$session->setMain('["settings"]["dialog"]["'.$id.'"]["data"]',$request->data());
		$session->setMain('["settings"]["dialog"]["'.$id.'"]["source"]',$source_uri);
		
		$result = new stdClass();
		$result->redirect = true;
		$result->redirectURL = $dialog_uri.'&dlg_id='.$id;
		
		return $result;
	}
	
	public function navigate($cancel = false,$message = false)
	{
		$request = slRequest::instance();
		$result = new stdClass();
		$url = $request->getPath().self::$settingsURI;
		if($view = $request->get('all.view')){
			if($view=='dialog' && $cancel){
				$view='section';
			}
			$url.= '&view='.$view;
		}
		if($section = $request->get('all.section')){
			$url.= '&section='.$section;
		}

		if($navigate = $request->get('all.navigate')){
			switch($navigate){
				case '__user':
					$url.= '&level=user';
				break;
				case '__admin':
					$url.= '&level=admin';
				break;
				default:
					$url.= '&level=domain';
					$url.= '&domain='.$navigate;
				break;
			}
		}else{
			if($level = $request->get('all.level')){
				$url.= '&level='.$level;
			}
			if($domain = $request->get('all.domain')){
				$url.= '&domain='.$domain;
			}
		}
		
		$url.= '&_s[type]=S';
		
		$result = new stdClass();
		if($message){
			$result->message = $message;
		}
		$result->redirect = true;
		$result->redirectURL = $url;
		return $result;
	}
	
	public function remove_domain()
	{
		$request = slRequest::instance();
		$response = new stdClass();
		$domain = $request->get('all.navigate');
		$domains = $this->settings->getPrivate('domains_settings');
		if($domains){
			foreach($domains as $index=>$value){
				if($domain != $value['domain'] && $value['set']){
					$aAction['data']['domain'] = $value['domain'];
					$aActions[] = $aAction;
				}
			}
		}
		Storage::removeAvailableDomains($aActions);
		$this->settings->clearCache('domains_settings');
		$response->redirect = true;
		$response->redirectURL = $request->getPath().self::$settingsURI;
		return $response;
	}
	 	
	
	 	 	 	public function personality_save()
	{
		$request = slRequest::instance();
		$response = new stdClass();
		$new = $request->get('all.personalities');
		$session = slSession::instance();
		$id = $request->get('all.dlg_id');
		$data = $session->getMain('["settings"]["dialog"]["'.$id.'"]');
		if($request->get('all.type')=='add'){
			$personalities = $data['data']['all']['personalities'];
			$personalities[] = $new[0];
			
		}else{
			$personalities = $new;
		}
		
		$aActions['personalities'] = $this->convertArray('personalities',$personalities,array('person'));
		$this->settings->setPrivate($aActions);
		$this->settings->clearCache('personalities');
		
		$response->redirect = true;
		$response->redirectURL = $data['source'];
		return $response;
	}
	
	public function personality_add()
	{
		return $this->showDialog('personalities','settings.personality','add');
	}
	
	public function personality_edit()
	{
		$request = slRequest::instance();
		$personalities = $request->get('all.personalities');
		if($personalities){
			foreach($personalities as $index => $personality){
				if($personality['selected']){
					$indexes[] = $index;
				}
			}
			return $this->showDialog('personalities','settings.personality','edit',join('|',$indexes));
		}else{
			return $this->navigate();
		}
		
	}
	
	public function personality_delete()
	{
		$request = slRequest::instance();
		$response = new stdClass();
		$personalities = $request->get('all.personalities');
		if($personalities){
			foreach($personalities as $index => $personality){
				if(!$personality['selected']){
					$new[] = $personality;
				}
			}
		}
		$aActions['personalities'] = $this->convertArray('personalities',$new,array('person'));
		$this->settings->setPrivate($aActions);
		$this->settings->clearCache('personalities');
		
		$response->redirect = true;
		$response->back = true;
		return $response;
	}
	 	 	 	public function norespond_save()
	{
		$request = slRequest::instance();
		$response = new stdClass();
		$new = $request->get('all.autoresponder');
		$session = slSession::instance();
		$id = $request->get('all.dlg_id');
		$data = $session->getMain('["settings"]["dialog"]["'.$id.'"]');
		if($request->get('all.type')=='add'){
			$responder = $data['data']['all']['autoresponder'];
			$responder[] = $new[0];
			
		}else{
			$responder = $new;
		}
		if($request->get('all.function.autoresponder')){
			foreach($responder as $key=>$val){
				if($val['columns'][0]['value']){
					$values[]=$val['columns'][0]['value'];
				}
			}
			$value = join("\n",$values);
			$action['data']['u_norespondfor'] = $value?$value:"";
			$action['dataTree']['@childnodes']['item'][0]['u_norespondfor'] = $value?$value:"";
			$action['uid'] = '';
			$action['action'] = 'add';
			$aActions['autoresponder'][0] = $action;
		}else{
			$aActions['autoresponder'] = $this->convertArray('autoresponder',$responder,array('email'));
		}
		$this->settings->setPrivate($aActions);
		$this->settings->clearCache('autoresponder');
		
		$response->redirect = true;
		$response->redirectURL = $data['source'];
		return $response;
	}
	
	public function norespond_add()
	{
		return $this->showDialog('autoresponder','settings.responder','add');
	}
	
	public function norespond_edit()
	{
		$request = slRequest::instance();
		$responder = $request->get('all.autoresponder');
		if($responder){
			foreach($responder as $index => $respond){
				if($respond['selected']){
					$indexes[] = $index;
				}
			}
			return $this->showDialog('autoresponder','settings.responder','edit',join('|',$indexes));
		}else{
			return $this->navigate();
		}
		
	}
	
	public function norespond_delete()
	{
		$request = slRequest::instance();
		$responder = $request->get('all.autoresponder');
		if($responder){
			foreach($responder as $index => $respond){
				if(!$respond['selected']){
					$new[] = $respond;
				}
			}
		}
		
		if($request->get('all.function.autoresponder')){
			foreach($new as $key=>$val){
				if($val['columns'][0]['value']){
					$values[]=$val['columns'][0]['value'];
				}
			}
			$value = join("\n",$values);
			
			$action['data']['u_norespondfor'] = $value?$value:"";
			$action['dataTree']['@childnodes']['item'][0]['u_norespondfor'] = $value?$value:"";
			$action['uid'] = '';
			$action['action'] = 'add';
			$aActions['autoresponder'][0] = $action;
		}else{
			$aActions['autoresponder'] = $this->convertArray('autoresponder',$new,array('email'));
		}
		$this->settings->setPrivate($aActions);
		$this->settings->clearCache('autoresponder');
		$response = new stdClass();
		$response->redirect = true;
		$response->back = true;
		return $response;
	}
}


?>