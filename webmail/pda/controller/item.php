<?php

slSystem::import('controller/grid',APP_PATH);

class slControllerItem extends slControllerGrid
{
	public function check( &$action, &$data )
	{
		parent::check( $action, $data );
		$request = slRequest::instance();
		$folder = $request->get('all.container');
		@$oUser = $_SESSION['user'];
		@$this->oAccount = $oUser->getAccount($_SESSION['EMAIL']);
		if(!$this->oFolder = $this->oAccount->getFolder($folder)){
			throw new Exc('folder_invalid_id',$folder);
		}
		switch($action){
			case 'delete':
			case 'read':
			case 'unread':

			break;
			case 'whitelist':
			case 'blacklist':
				$sQuarantineFolder = ucfirst(strtolower($action));
				
				try{
					$this->oQuarantineFolder = $this->oAccount->getFolder('SPAM_QUEUE/'.$sQuarantineFolder);
				}catch(Exc $e){
					
				}
			break;
			case 'multiple_action':

			break;
		}
		return true;
	}
	
	public function read($redirect = true)
	{
		$request = slRequest::instance();
		$response = new stdClass();
		$aItems = $request->get('form.items');
		if($aItems){
			foreach($aItems as $sID => $selected){
				try{
					$oItem = $this->oFolder->getItem($sID);
					$aMarkItems[] = $oItem;
				}catch(Exc $e){
					
				}
			}
			if($aMarkItems){
				$this->oFolder->markItems(32, $aMarkItems);
			}
		}
		if($redirect){
			$response->redirect = true;
			$response->redirectURL = $this->getContainerLink($selector);
			return $response;
		}
	}
	
	public function unread($redirect = true)
	{
		$request = slRequest::instance();
		$response = new stdClass();
		$aItems = $request->get('form.items');
		$selector['type'] = $request->get('all.type');
		$selector['id'] = $request->get('all.container');
		if($aItems){
			foreach($aItems as $sID => $selected){
				try{
					$oItem = $this->oFolder->getItem($sID);
					$aMarkItems[] = $oItem;
				}catch(Exc $e){
					
				}
			}
			if($aMarkItems){
				$this->oFolder->unmarkItems(32, $aMarkItems);
			}
		}
		if($redirect){
			$response->redirect = true;
			$response->redirectURL = $this->getContainerLink($selector);
			return $response;
		}
	}
	
	public function delete($redirect = true)
	{
		
		$request = slRequest::instance();
		$response = new stdClass();
		$settingsConfig['helper'] = 'settings';
		$settings = slHelperFactory::instance($settingsConfig);
		$folderConfig['helper'] = 'folder';
		$folderHelper = slHelperFactory::instance($folderConfig);
		$predefined = $settings->get();
		$mail_settings_general = $settings->getPrivate('mail_settings_general');
		$trash_name = $folderHelper->getMappedFolderName('trash',true);
		if(isset($mail_settings_general['@childnodes']['item'][0]['@childnodes']['move_to_trash'][0]['@value'])){
			$move_to_trash =  $mail_settings_general['@childnodes']['item'][0]['@childnodes']['move_to_trash'][0]['@value'];
		}else{
			$move_to_trash = 1;
		}
		$selector = $request->get('all._s');
		if(!$selector['type']){
			$selector['type'] = $request->get('all.type');
			$selector['id'] = $request->get('all.container');
		}
		$aItems = $request->get('form.items');
		if($aItems){
			$perform_move_to_trash = false;
			if($move_to_trash && $this->oFolder->getType()=='M'){
				$oTrash = $this->oAccount->getFolderWithAutoCreate(
					$trash_name,
					'main'
				);
				if($oTrash!==$this->oFolder){
					$perform_move_to_trash = true;
				}
			}
			$aMoveTrash = array();
			foreach($aItems as $sID => $selected){
				if($perform_move_to_trash){
					try{
						$oItem = $this->oFolder->getItem($sID);
						$aMoveTrash[] = $oItem;
					}catch(Exception $e){
						
					}
				}else{
					try{
						$oItem = $this->oFolder->getItem($sID);
						$aDelete[] = $oItem;
					}catch(Exception $e){
					}
				}
			}
			if(is_array($aMoveTrash) && !empty($aMoveTrash)){
				if($oTrash!==$this->oFolder){
					$result =$this->oFolder->moveItems($oTrash,$aMoveTrash);
				}
			}
			if(is_array($aDelete) && !empty($aDelete)){
				$result = $this->oFolder->deleteItems($aDelete);
			}
		}
		if($redirect){
			$response->redirectURL = $this->getContainerLink($selector);
			$response->redirect = true;
			return $response;
		}
	}
	
	public function whitelist($redirect = true)
	{
		$request = slRequest::instance();
		$response = new stdClass();
		$aItems = $request->get('form.items');
		if($aItems){
			foreach($aItems as $sID => $selected){
				$oItem = $this->oFolder->getItem($sID);
				$aFrom = Mailparse::parseAddresses($oItem->from);
				$sFrom = $aFrom[0]['address'];
				$this->oQuarantineFolder->createItem(array('email'=>$sFrom));
			}
		}
		if($redirect){
			$response->redirect = true;
			$response->back = true;
			return $response;
		}
	}
	public function blacklist()
	{
		 		$result = $this->whitelist();
		$this->delete();
		return $result;
	}
	 	public function multiple_mail_action_top()
	{
		$request = slRequest::instance();
		return $this->multiple_action('all.multiple_mail_action_top');
	}
	 	public function multiple_mail_action_bottom()
	{
		$request = slRequest::instance();
		return $this->multiple_action('all.multiple_mail_action_bottom');
	}
	
	public function multiple_action($var = 'all.multiple_action')
	{
		$request = slRequest::instance();
		$result = new stdClass();
		$redirect = ($target = $request->get('all._n.target'))?false:true;
		$action = $request->get($var);
		$this->check($action,$this->data);
		switch($action){
			case 'read':
				$result = $this->read($redirect);
			break;
			case 'unread':
				$result = $this->unread($redirect);
			break;
			case 'delete':
				$result = $this->delete($redirect);
			break;
			case 'whitelist':
				$result = $this->whitelist($redirect);
			break;
			case 'blacklist':
				$result = $this->blacklist($redirect);
			break;
			case 'reply':
				return $this->reply($redirect);
			break;
			case 'replytoall':
				return $this->replytoall($redirect);
			break;
			case 'forward':
				return $this->forward($redirect);
			break;
			default:
				$result->redirect = true;
				$result->back = true;
				return $result;
			break;
		}
		
		if(!$redirect){
			
			$result->redirect = true;
			$result->redirectURL = $target;
			return $result;
		}else{
			return $result;
		}
	}
	
	public function reply()
	{
		
		$request = slRequest::instance();
		$request->set('all._n.w','main');
		$request->set('all._n.p.main','mail.compose');
		$params['action'] = 'reply';
		$params['id'] = $request->get('form.container');
		$params['type'] = $request->get('form.type');
		$params['item'] = reset(array_keys($request->get('form.items')));
		$request->set('all._s',$params);
		$this->index('mail.compose');
	}
	public function replytoall()
	{
		
		$request = slRequest::instance();
		$request->set('all._n.w','main');
		$request->set('all._n.p.main','mail.compose');
		$params['action'] = 'replytoall';
		$params['id'] = $request->get('form.container');
		$params['type'] = $request->get('form.type');
		$params['item'] = reset(array_keys($request->get('form.items')));
		$request->set('all._s',$params);
		$this->index('mail.compose');
	}
	
	public function forward()
	{
		
		$request = slRequest::instance();
		$request->set('all._n.w','main');
		$request->set('all._n.p.main','mail.compose');
		$params['action'] = 'forward';
		$params['id'] = $request->get('form.container');
		$params['type'] = $request->get('form.type');
		$params['item'] = reset(array_keys($request->get('form.items')));
		$request->set('all._s',$params);
		$this->index('mail.compose');
	}

	public function fast_reply()
	{
		$request = slRequest::instance();
		$result = new stdClass();
		$items = $request->get('all.items');
		$itemID = reset(array_keys($items));
		slSystem::import('controller/message',APP_PATH);
		$msgController= new slControllerMessage( $this->appplication );

		try{
			$item = $this->oFolder->getItem($itemID);
			$filter = array(
				'tag'=>'header_from, header_to, subject, html, text, date, reply_to'
			);
			$message['data'] = WebmailIQItems::cnvMailItem($item,$filter,1,false);
			$message['data']['date'] = date('Y/m/d H:i:d',$message['data']['date']);
			$itemHelperConstructor = array('helper'=>'item');
			$itemHelper = slHelperFactory::instance($itemHelperConstructor);
			$itemHelper->createMessageEnvelope('reply',$message);
			$settingsHelperConstructor = array('helper'=>'settings');
			$settingsHelper = slHelperFactory::instance($settingsHelperConstructor);
			$mail_settings_default = $settingsHelper->getPrivate('mail_settings_default');
			$mail_settings_default = $mail_settings_default['@childnodes']['item'][0]['@childnodes'];
			if(isset($mail_settings_default['save_sent_message'])){
				$save_sent_message = $mail_settings_default['save_sent_message'][0]['@value'];
			}else{
				$save_sent_message = 1;
			}
			if(isset($mail_settings_default['read_confirmation'])){
				$read_confirmation = $mail_settings_default['read_confirmation'][0]['@value'];
			}else{
				$read_confirmation = 0;
			}
			if(isset($mail_settings_default['priority'])){
				$priority = $mail_settings_default['priority'][0]['@value'];
			}else{
				$priority = 3;
			}
			$text = $request->get('all._frm.html');
			
			$mail = new Mail($_SESSION['DEFAULTCHARSET']);
			$mail->XMailer.='-PDA';
			$mail->setFrom($_SESSION['EMAIL'],$this->oAccount->fullname);
			$reply_addr = $message['data']['reply_to']?$message['data']['reply_to']:$message['data']['from'];
			$reply_addr = MailParse::parseAddresses($reply_addr);
			$reply_addr=  reset($reply_addr);
			if($reply_addr['display']==$reply_addr['address']){
				$mail->addTo($reply_addr['address']);
			}else{
				$mail->addTo($reply_addr['address'],$reply_addr['display']);
			}
			if($message['data']['content-type']=='text'){
				$body = $text.$message['data']['text'];
				$mail->setBody($body);
			}else{
				$body = $text. slToolsString::removeHTML($message['data']['html']);
				$mail->setBody($body);
			}
			if($read_confirmation){
				$mail->addHeader('X-Confirm-Reading-To:'.$_SESSION['EMAIL']);
			}
			if($priority){
				$mail->Priority = $priority;
			}
			$mail->setSubject($message['data']['subject']);
			$mail->send();
			
			$this->oFolder->markItems(Item::FLAG_ANSWERED,array($item));
			
			if($save_sent_message){
				$msgController->check( $this->action, $this->data );
				$msgController->saveMessage($mail,'sent','UTF-8');
			}
		}catch(Exception $e){
			$result->redirect = true;
			$result->back = true;
			$result->error = $e;
			$id = $msgController->storeMail($mail);
			$result->errorParams = '&_s[message_id]='.$id;
			return $result;
		}
		$result->redirect = true;
		$selector['type'] = 'M';
		$selector['id'] = $request->get('all.container');
		$result->redirectURL = $this->getContainerLink($selector);
		return $result;
	}

	
	protected function getContainerLink($selector)
	{

		$router = slRouter::instance();
		$request = slRequest::instance();
		$folder['helper'] = 'folder';
		$folderHelper =slHelperFactory::instance($folder);
		$folderInfo = $folderHelper->getInfo($selector['type'],$selector['id']);
		$params = array(
			'window'=>'main',
			'target'=>'main',
			'view'=>$folderInfo['page'],
			'data'=>'item.fdr',
			'id'=>$selector['id'],
			'type'=>$selector['type']
		);
		$link = $router->getCompressedLink('folder',$params);
		$link = $request->getPath().str_replace('&amp;','&',$link);
		if($sort = $request->get('get._s.sort')){
			$link = $this->replaceURLVariable($link,'_s[sort]',$sort);
		}
		if($search = $request->get('get._s.search')){
			$link = $this->replaceURLVariable($link,'_s[search]',$search);
		}
		if($page = $request->get('get._s.page')){
			$link = $this->replaceURLVariable($link,'_s[page]',$page);
		}
		
		return $link;
	}
}

?>