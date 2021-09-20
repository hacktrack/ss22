<?php
 
slSystem::import('controller/grid',APP_PATH);

class slControllerItem extends slControllerGrid
{
	private $phones=array();
	
	public function mergeItems()
	{
		 		$selected = slSession::getPage('selected_contacts');
		if(slRequest::instance()->get('all.items')){
			foreach(slRequest::instance()->get('all.items') as $itm){
				if(is_array($itm) && $itm['selected']=='on'){
					$selected_contacts[$itm['address']] = $itm['address'];
				}
			}
		}
		if($selected_contacts || $selected){
			$selected_contacts = slToolsPHP::array_merge($selected,$selected_contacts);
			slSession::setPage('selected_contacts',$selected_contacts);
		}
		 		$selected = slSession::getPage('selected_items');
		if(slRequest::instance()->get('all.items')){
			foreach(slRequest::instance()->get('all.items') as $key => $itm){
				if($itm=='on'){
					$selected_items[$key] = $key;
				}
			}
		}
		if($selected_items || $selected){
			if($selected){
				foreach($selected as $key => $val){
					$selected_items[$key] = $key;
				}
			}
			slSession::setPage('selected_items',$selected_items);
		}
	}

	
	public function check( &$action, &$data )
	{
		if($action=='multiple_mail_action_top'){
			$checkAction = $data['all']['multiple_mail_action_top'];
		}
		if($action=='multiple_mail_action_bottom'){
			$checkAction = $data['all']['multiple_mail_action_bottom'];
		}
		$this->actionMethod = $checkAction?$checkAction:$action;
		parent::check( $checkAction, $data );
		$request = slRequest::instance();
		 		if($action=='cancel_select'){
			return true;
		}
		try{
			if($_SESSION['PUBLIC_CALENDAR']){
				return true;
			}
			$folder = $request->get('all.container');
			
			$oUser = $_SESSION['user'];
			if(!$oUser){
				throw new Exc('Unauthorized');
			}
			$oAccount = $oUser->getAccount($_SESSION['EMAIL']);
			if(strpos($folder,'__@@VIRTUAL@@__')!==false){
				$oAccount = $oAccount->virtualAccount;
			}
			$this->oAccount = &$oAccount;
			if(!$this->oFolder = $oAccount->getFolder($folder)){
				throw new Exc('folder_invalid_id',$folder);
			}
			if(!$checkAction){
				$checkAction = $action;
			}
			$mergeItems = false;
			switch($checkAction){
				case 'first':
				case 'last':
				case 'prev':
				case 'prev_five':
				case 'next':
				case 'next_five':
				case 'prev_top':
				case 'next_top':
				case 'prev_bottom':
				case 'next_bottom':
					$mergeItems = true;
					break;
				case 'delete':
				case 'mark_read':
				case 'mark_unread':
	
				break;
				case 'whitelist':
				case 'blacklist':
					$sQuarantineFolder = ucfirst(strtolower($checkAction));
					
					try{
						$this->oQuarantineFolder = $oAccount->getFolder('SPAM_QUEUE/'.$sQuarantineFolder);
					}catch(Exc $e){
					}
				break;
				case 'multiple_action':
	
				break;
				case 'accept':
				case 'accept_counter':
				case 'decline':
				case 'decline_counter':
					$this->part_id = $data['all']['part_id']?$data['all']['part_id']:'1.1.2';
					if($checkAction == 'accept' || $checkAction == 'accept_counter'){
						$this->accept_folder = $data['all']['accept_folder']?$data['all']['accept_folder']:$_SESSION['user']->getDefaultFolder('E');
						$oAcceptFolder = $this->oAccount->getFolder($this->accept_folder);
						Folder::checkRights($oAcceptFolder,Folder::RIGHT_WRITE);
					}
				break;
			}
			if ($selected = slSession::getPage('selected_items')) foreach($selected as $itm){
				slRequest::instance()->set('form.items.'.$itm,'on');
			}
			if($mergeItems){
				$this->mergeItems();
			}else{
				slSession::delPage('selected_items');
			}
			
		}catch(Exception $e){
			$result = new stdClass();
			$result->error = $e;
			$result->redirect = true;
			$result->redirectURL = $request->getPath().'?_n[p][main]=win.login';
			slApplication::instance()->finish($result);
		}
		
		return true;
	}
	public function getContinueLink()
	{
		$request = slRequest::instance();
		
		$session = slSession::instance();
		$aItem = $this->prepareItem();
		$aItem = array_change_key_case($aItem,CASE_UPPER);
		$id = $this->storeItem($aItem);
		$folder = $request->get('form.container');
		$result = 'index.html?_n[p][content]=contact.distribution&_n[p][main]=win.main.tree&_n[w]=main&_s[action]=session&_s[distrib_id]='.$id.'&_s[type]=C&_s[id]='.$folder;
		$request->set('all._s.distrib_id',$id);
		return $result;
	}
	
	public function prepareItem()
	{
		$request = slRequest::instance();
		$item_type = $request->get('all.type');
		$item_data = $request->get('all.item');
		$item_data = $this->prepareFormItem($item_data,$item_type);
		$aTreeItem = $this->formToTreeItem($item_data,$item_type);
		$aItem = $this->formToItem($item_data,$item_type);
		return $aItem;
	}
	public function cancel_select()
	{
		$request = slRequest::instance();
		$session = slSession::instance();
		$this->loadSentData('contact_select');
		$aItem = $this->prepareItem();
		$aItem = array_change_key_case($aItem,CASE_UPPER);
		$id = $this->storeItem($aItem);
		$folder = $request->get('all._s.id');
		return $this->loadDistributionListFromSession($id,$folder);
	}
	
	public function cancel_view()
	{
		$request = slRequest::instance();
		$session = slSession::instance();
		$aItem = $this->prepareItem();
		$aItem = array_change_key_case($aItem,CASE_UPPER);
		$id = $this->storeItem($aItem);
		$folder = $request->get('all._s.id');
		
	}
	
	public function cancel_distrib()
	{
		$result = new stdClass();
		$result->redirect = true;
		$result->redirectURL = $this->getContainerLink(slRequest::instance()->get('all._s'));
		return $result;
	}
	
	public function contacts_distrib($param)
	{
		$selected = slSession::getPage('selected_contacts');
		foreach($selected as $cnt){
			$param['all']['items'][$cnt]['address'] = $cnt;
			$param['all']['items'][$cnt]['selected'] = 'on';
		}
		$request = slRequest::instance();
		$items = $param['all']['items'];
		$folder = $request->get('all._s.id');
		$aItem = $this->prepareItem();
		$i = 0;
		if($items) foreach($items as $itm => $item){
			if($item['selected']){
				$address = Mailparse::parseAddresses($item['address']);
				$address = reset($address);
				$lct['LCTDESCRIPTION'] = $address['display'];
				$lct['LCTEMAIL1'] = $address['address'];
				$lct['LCTTYPE'] = 'O';
				$lct['LCT_ID'] = Tools::my_uniqid();
				$lct['_ACTION'] = 'add';
				$lct['_SELECTED'] = $item['_SELECTED'];
				$aItem['ADDONS']['LOCATION'][$lct['LCT_ID']] = $lct;
			}
		}
		$aItem = array_change_key_case($aItem,CASE_UPPER);
		$id = $this->storeItem($aItem);
		return $this->loadDistributionListFromSession($id,$folder);
	}
	
	public function contact_add()
	{
		return $this->contact_view('add');
	}
	
	public function contact_edit()
	{
		return $this->contact_view('edit');
	}
	
	
	public function contact_view($action)
	{
		$request = slRequest::instance();
		$folder = $request->get('all._s.id');
		$aItem = $this->prepareItem();
				
		$aItem = array_change_key_case($aItem,CASE_UPPER);
		$id = $this->storeItem($aItem,$edit_items);
		return $this->loadDistributionListFromSession($id,$folder,'distribution_contact',$action);
	}
	
	
	public function contact_delete()
	{
		$request = slRequest::instance();
		$folder = $request->get('all._s.id');
		$items = $request->get('all.contacts');
		$aItem = $this->prepareItem();
		if($items) foreach($items as $itm => $item){
			if($item['_SELECTED']){
				if($aItem['ADDONS']['LOCATION'][$itm]['_ACTION']!='add'){
					$aItem['ADDONS']['LOCATION'][$itm]['_ACTION'] = 'delete';
					$aItem['ADDONS']['LOCATION'][$itm]['_HIDDEN'] = true;
				}else{
					unset($aItem['ADDONS']['LOCATION'][$itm]);
				}
			}
		}
		$aItem = array_change_key_case($aItem,CASE_UPPER);
		$id = $this->storeItem($aItem);
		return $this->loadDistributionListFromSession($id,$folder);
	}
	
	public function contact_save()
	{
		$request = slRequest::instance();
		$folder = $request->get('all._s.id');
		$items = $request->get('all.edit');
		$aItem = $this->prepareItem();
		 		if($items) foreach($items as $itm => $item){
			if(!isset($aItem['ADDONS']['LOCATION'][$itm])){
				$itm = Tools::my_uniqid();
				$aItem['ADDONS']['LOCATION'][$itm]['_ACTION'] = 'add';
				$aItem['ADDONS']['LOCATION'][$itm]['LCT_ID'] = $itm;
			}else{
				if($aItem['ADDONS']['LOCATION'][$itm]['_ACTION'] != 'add'){
					$aItem['ADDONS']['LOCATION'][$itm]['_ACTION'] = 'edit';
				}
			}
			$aItem['ADDONS']['LOCATION'][$itm]['LCTEMAIL1'] = $item['email'];
			$aItem['ADDONS']['LOCATION'][$itm]['LCTDESCRIPTION'] = $item['description'];
			
		}
		$aItem = array_change_key_case($aItem,CASE_UPPER);
		$id = $this->storeItem($aItem);
		return $this->loadDistributionListFromSession($id,$folder);
	}
	
	public function contact_cancel()
	{
		$request = slRequest::instance();
		$folder = $request->get('all._s.id');
		$items = $request->get('all.edit');
		$aItem = $this->prepareItem();
		$aItem = array_change_key_case($aItem,CASE_UPPER);
		$id = $this->storeItem($aItem);
		return $this->loadDistributionListFromSession($id,$folder);
	}
	
	
	protected function storeItem($aItem)
	{
		$id = slSystem::uniqueID();
		$session = slSession::instance();
		$request = slRequest::instance();
		$session->setMain('["item"]["'.$id.'"]["item"]',$aItem);
		$session->setMain('["item"]["'.$id.'"]["form"]',$request->get('all._frm'));
		return $id;
	}
	
	static public function loadDistributionListFromSession($item_id,$folder_id,$view ='',$action='')
	{
		$result = new stdClass();
		$result->redirect = true;
		$result->redirectURL = 'index.html?_n[p][content]=contact.distribution&_n[p][main]=win.main.tree&_n[w]=main&_s[action]=session&_s[distrib_id]='.$item_id.'&_s[type]=C&_s[id]='.$folder_id.($view?('&'.$view.'=1'):'').($action?('&action='.$action):'');
		return $result;
	}

	public function account()
	{
		$request = slRequest::instance();
		$email = $request->get('all.accountPublic');
		$result = new stdClass();
		$result->redirect = true;
		$uri = $request->getURI(false);
		$uri = $this->getResultLink(
			array(
				'id'=>$request->get('all.container'),
				'type'=>$request->get('all.type')
			),
			'',
			false,
			false,
			false,
			$email
		);
		$uri = $this->removeErrorAndMessage($uri);
		$result->redirectURL = $uri;
		return $result;
	}
	
	public function mark_read($redirect = true)
	{
		$request = slRequest::instance();
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
			$response = new stdClass();
			$response->redirect = true;
			$response->back = true;
			return $response;
		}
	}
	
	public function mark_unread($redirect = true)
	{
		$request = slRequest::instance();
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
				$this->oFolder->unmarkItems(32, $aMarkItems);
			}
		}
		if($redirect){
			$response = new stdClass();
			$response->redirect = true;
			$response->back = true;
			return $response;
		}
	}

	public function whitelist($redirect = true)
	{
		$request = slRequest::instance();
		$aItems = $request->get('form.items');
		if($this->oFolder->type=='Q' || $this->oFolder->type=='QL'){
			if ($this->oFolder->type=='Q' && $this->actionMethod == 'whitelist') {
				$deliver = true;
			} else {
				$deliver = false;
			}
			$action = $this->actionMethod.'Item';
			
			if($aItems){
				$result = true;
				foreach($aItems as $sID => $selected){
					$subresult = $this->oFolder->$action($sID,false,$deliver);
					$result  = $result && $subresult;
				}
			}else{
				$noitems = true;
			}
		}else{
			if($aItems){
				$result = true;
				foreach($aItems as $sID => $selected){
					$oItem = $this->oFolder->getItem($sID);
					$aItemsToMove[] = $oItem;
					$aFrom = Mailparse::parseAddresses($oItem->from);
					$sFrom = $aFrom[0]['address'];
					$subresult = $this->oQuarantineFolder->createItem(array('email'=>$sFrom));
					$result = $result && $subresult;
				}
				if($this->oFolder->isSPAM() && !empty($aItemsToMove) && $this->actionMethod=='whitelist'){
					$oInbox = $this->oAccount->getFolder('INBOX');
					$result = $this->oFolder->moveItems($oInbox,$aItemsToMove);
				}
			}else{
				$noitems = true;
			}
		}
		if($redirect){
			$response = new stdClass();
			if($result){
				$response->message = 'item_'.$this->actionMethod.'_ok';
			}
			if(!$result && !$noitems){
				try{ 
					throw new Exc('item_'.$this->actionMethod.'_error');
				}catch(Exc $e){
					$response->error = $e;
				}
			}
			$response->redirect = true;
			$response->redirectURL = $this->getContainerLink(
				array(
					'id'=>$this->oFolder->name,
					'type'=>$this->oFolder->getType()
				)
			);
			return $response;
		}
		
	}
	
	public function deliver($redirect = true)
	{
		$request = slRequest::instance();
		$aItems = $request->get('form.items');
		foreach($aItems as $sID => $selected){
			$this->oFolder->deliverItem($sID);
		}
		if($redirect){
			$response = new stdClass();
			$response->redirect = true;
			$response->redirectURL = $this->getContainerLink(array('id'=>'Quarantine','type'=>'Q'));
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
		return $this->multiple_action('all.multiple_mail_action_top','top');
	}
	 	public function multiple_mail_action_bottom()
	{
		$request = slRequest::instance();
		return $this->multiple_action('all.multiple_mail_action_bottom','bottom');
	}
	
	public function multiple_action($var = 'all.multiple_action',$suffix = '')
	{
		$request = slRequest::instance();
		$redirect = ($target = $request->get('all._n.target'))?false:true;
		$value = $request->get($var);
		switch($value){
			case 'read':
				$result = $this->mark_read($redirect,$suffix);
			break;
			case 'unread':
				$result = $this->mark_unread($redirect,$suffix);
			break;
			case 'delete':
				$result = $this->delete($redirect,$suffix);
			break;
			case 'whitelist':
				$result = $this->whitelist($redirect,$suffix);
			break;
			case 'blacklist':
				$result = $this->blacklist($redirect,$suffix);
			break;
			case 'copy':
				return $this->copy($redirect,$suffix);
			break;
			case 'move':
				return $this->move($redirect,$suffix);
			break;
			default:
				$result = new stdClass();
				$result->redirect = true;
				$result->back = true;
				return $result;
			break;
		}
		
		if(!$redirect){
			$result = new stdClass();
			$result->redirect = true;
			$result->redirectURL = $target;
			$result->message = 'item_'.$value.'_ok';
			return $result;
		}else{
			return $result;
		}
	}
	public function fast_reply()
	{
		$request = slRequest::instance();
		$items = $request->get('all.items');
		$itemID = reset(array_keys($items));
		$result = new stdClass();
		try{
			slSystem::import('controller/message',APP_PATH);
			$msgController= new slControllerMessage( $this->appplication );
			$msgController->check( $this->actionMethod, $this->data );
			$item = $this->oFolder->getItem($itemID);
			$filter = array(
				'tag'=>'header_from, header_to, subject, html, text, date, reply_to'
			);
			$message['data'] = WebmailIQItems::cnvMailItem($item,$filter,1,false);
			$message['data']['date'] = date('Y/m/d H:i:d',$message['data']['date']);
			$itemHelperConstructor = array('helper'=>'item');
			$itemHelper = slHelperFactory::instance($itemHelperConstructor);
			$itemHelper->createMessageEnvelope('reply',$message,false);
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
			if($read_confirmation){
				$mail->addHeader('X-Confirm-Reading-To:'.$_SESSION['EMAIL']);
			}
			if($priority){
				$mail->Priority = $priority;
			}
			if($request->get('all._frm.rfc_time')){
				$mail->RFCDate = $request->get('all._frm.rfc_time');
			}
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
				$body = slToolsString::text2html($text,true).$message['data']['html'];
				$altBody = slToolsString::removeHTML($body);
				$mail->setBody($altBody,$body);
			}
			$mail->setSubject($message['data']['subject']);
			$msgController->processEmbeddedAttachments($mail,true);
			$mail->send();
			
			$this->oFolder->markItems(Item::FLAG_ANSWERED,array($item));
			
			if($save_sent_message){
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
		$result->message = 'message_send_ok';
		return $result;
	}
	
	public function create()
	{
		$request = slRequest::instance();
		$result = new stdClass();
		$selector = $request->get('all._s');
		$item_type = $request->get('all.type');
		$item_data = $request->get('all.item');
		try{
			switch($item_type){
				case 'HIPAA':
					$param = $request->get('all.item');
					$param['type'] = 'hipaa';
					$this->oFolder->createItem($param);
					break;
				case 'QL':
					$aItem['email'] = $request->get('all.email');
					$this->oFolder->createItem($aItem);
				break;
				case 'M':
				break;
				case 'C':
				case 'E':
				case 'T':
				case 'N':
				case 'F':
					$item_data = $this->prepareFormItem($item_data,$item_type,true);
					$aTreeItem = $this->formToTreeItem($item_data,$item_type,true);
					$aTreeItem['@attributes']['action'] = 'add';
					$aItem = $this->formToItem($item_data,$item_type);
					if ($item_type=='C')
					{
						if (empty($aItem['itmclassifyas']))
						{
							$aItem['itmclassifyas']='';
							if (!empty($aItem['itmsurname'])){$aItem['itmclassifyas'].=$aItem['itmsurname'].' ';}
							if (!empty($aItem['itmfirstname'])){$aItem['itmclassifyas'].=$aItem['itmfirstname'];}
						}
					}
					$oItem = $this->oFolder->createItem($aItem,$aTreeItem);
					 					 					if ($this->oFolder->getType()=='E' 
						|| $this->oFolder->getType()=='T'
						|| $this->oFolder->getType()=='N'
						|| $this->oFolder->getType()=='J'
						) {
							$oUser = &$_SESSION['user'];
							 							if ($oItem->isOrganizator($oItem->item['EVNFLAGS']) 
							|| $oItem->isOrganizator($aItem['EVNFLAGS'])) {
								$imip = iMIP::load($this->oFolder->account);
								$imip->iMIP_Email($oItem,'invite');
							}
					}
				break;
			}
		}catch(Exception $e){
			$result->redirect = true;
			$result->back = true;
			$result->error = $e;
			return $result;
		}
		$result->redirect = true;
		$result->redirectURL = $this->getContainerLink($selector);
		return $result;
	}
	
	public function edit()
	{
		$result = new stdClass();
		try{
			$request = slRequest::instance();
			$selector = $request->get('all._s');
			$item_type = $request->get('all.type');
			$item_data = $request->get('all.item');
			if($_SESSION['PUBLIC_CALENDAR']){
				$redirect = true;
				throw new Exc('folder_insufficient_rights');
			}
			switch($item_type){
				case 'HIPAA':
					$param = $request->get('all.item');
					$param['type'] = 'hipaa';
					$oItem = $this->oFolder->getItem($selector['item']);
					$oItem->edit($param);
					break;
				case 'M':
				break;
				case 'C':
					$item_data = $this->prepareFormItem($item_data,$item_type,true);
					$aTreeItem = $this->formToTreeItem($item_data,$item_type,true);
					$aItem = $this->formToItem($item_data,$item_type);
					$oItem = $this->oFolder->getItem($aItem['itm_id']);
					
					$oItem->edit($aItem,$aTreeItem);
				break;
				case 'T':
				case 'N':
				case 'E':
				case 'F':
					$item_data = $this->prepareFormItem($item_data,$item_type,true);
					 					$aTreeItem = $this->formToTreeItem($item_data,$item_type,true);
					$aItem = $this->formToItem($item_data,$item_type);
					
					if($item_type=='F' && isset($aTreeItem['@childnodes']['values'][0]['@childnodes']['evncomplete'][0]['@value'])){
						$aItem['evncomplete'] = $aTreeItem['@childnodes']['values'][0]['@childnodes']['evncomplete'][0]['@value'];
						$aItem['evnlocation'] = $aTreeItem['@childnodes']['values'][0]['@childnodes']['evnlocation'][0]['@value'];
						$aItem['evntitle'] = $aTreeItem['@childnodes']['values'][0]['@childnodes']['evntitle'][0]['@value'];
						$aItem['evnrid'] = $aTreeItem['@childnodes']['values'][0]['@childnodes']['evnrid'][0]['@value'];
					}
					
					$oItem = $this->oFolder->getItem($aItem['evn_id']);

					$oItem->edit($aItem,$aTreeItem);
				break;
			}
		}catch(Exception $e){
			$result->redirect = true;
			$result->back = true;
			$result->error = $e;
			return $result;
		}
		$result->redirect = true;
		$result->redirectURL = $this->getContainerLink($selector);
		return $result;
	}
	
	public function set_flags()
	{
		$request = slRequest::instance();
		$response = new stdClass();
		$selector['id'] = $request->get('all.container');
		$selector['type'] = $request->get('all.type');
		$destination = $request->get('form.select_folder_'.$suffix);
		try{
			$result = false;
			$items = $request->get('form.items');
			if(is_array($items) && !empty($items)){
				$result = true;
				$destFolder = $this->oAccount->getFolder($destination);
				foreach($items as $id => $selected){
					$toCopy[$id] = $this->oFolder->getItem($id);
				}
				$result = $result && $this->oFolder->copyItems($destFolder,$toCopy);
			}
		}catch(Exception $e){
			$response->redirect = true;
			$response->back = true;
			$response->error = $e;
			return $response;
		}
		if($redirect){
			$response->redirectURL = $this->getContainerLink($selector);
			$response->redirect = true;
			if($result){
				$response->message = 'item_copy_ok';
			}
			return $response;
		}
	}
	
	public function delete($redirect = true)
	{
		$request = slRequest::instance();
		$response = new stdClass();
		try{
			if($_SESSION['PUBLIC_CALENDAR']){
				$redirect = true;
				$selector['id'] = $_SESSION['PUBLIC_CALENDAR']->name;
				$selector['type'] = 'E';
				throw new Exc('folder_insufficient_rights');
			}
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
			 			$selector['id'] = $this->oFolder->name;
			$selector['type'] = $this->oFolder->getType();
			$aItems = $request->get('form.items');
			$result = false;
			if($aItems){
				$result = true;
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
						$result = $result && $this->oFolder->moveItems($oTrash,$aMoveTrash);
					}
				}
				if(is_array($aDelete) && !empty($aDelete)){
					$result = $result && $this->oFolder->deleteItems($aDelete, false, 'auto',' ');
					if(!$result){
						throw new Exc('item_delete');
					}
				}
			}else{
				$result = false;
			}
		}catch(Exc $e){
			$response->error = $e;
			$result = false;
		}
		if($redirect){
			$redirectRequestUrl = $request->get('form.redirectRequestUrl');
			if(isset($redirectRequestUrl) && !empty($redirectRequestUrl))
			{
				$response->redirectURL = $redirectRequestUrl;
			}
			else
			{
				$response->redirectURL = $this->getContainerLink($selector);
			}
			$response->redirect = true;
			if($result){
				$response->message = 'item_delete_ok';
			}
			return $response;
		}
	}
	
	public function move($redirect = false,$suffix = '')
	{
		$request = slRequest::instance();
		$response = new stdClass();
		$selector['id'] = $request->get('all.container');
		$selector['type'] = $request->get('all.type');
		$destination = $request->get('form.select_folder_'.$suffix);
		$response = new stdClass();
		try{
			$result = false;
			$items = $request->get('form.items');
			if(is_array($items) && !empty($items)){
				$result = true;
				$destFolder = $this->oAccount->getFolder($destination);
				foreach($items as $id => $selected){
					$toMove[$id] = $this->oFolder->getItem($id);
				}
				if($this->oFolder!=$destFolder){
					$result = $result && $this->oFolder->moveItems($destFolder,$toMove);
				}else{
					$result = false;
				}
			}
		}catch(Exception $e){
			$response->redirect = true;
			$response->back = true;
			$response->error = $e;
			return $response;
		}
		if($redirect){
			$response->redirectURL = $this->getContainerLink($selector);
			$response->redirect = true;
			if($result){
				$response->message = 'item_move_ok';
			}
			return $response;
		}
	}
	
	public function copy($redirect = false,$suffix = '')
	{
		
		$request = slRequest::instance();
		$response = new stdClass();
		$selector['id'] = $request->get('all.container');
		$selector['type'] = $request->get('all.type');
		$destination = $request->get('form.select_folder_'.$suffix);
		
		try{
			$result = false;
			$items = $request->get('form.items');
			if(is_array($items) && !empty($items)){
				$result = true;
				$destFolder = $this->oAccount->getFolder($destination);
				foreach($items as $id => $selected){
					$toCopy[$id] = $this->oFolder->getItem($id);
				}
				$result = $result && $this->oFolder->copyItems($destFolder,$toCopy);
			}
		}catch(Exception $e){
			$response->redirect = true;
			$response->back = true;
			$response->error = $e;
			return $response;
		}
		if($redirect){
			$response->redirectURL = $this->getContainerLink($selector);
			$response->redirect = true;
			if($result){
				$response->message = 'item_copy_ok';
			}
			return $response;
		}
	}
	
	public function request_read()
	{
		$request = slRequest::instance();
		$result = new stdClass();
		$selector = $request->get('all._s');
		$itemID = $selector['item'];
		$oItem = $this->oFolder->getItem($itemID);
		
		$settingsConstructor = array('helper'=>'settings');
		$settings = slHelperFactory::instance($settingsConstructor);
		$read_confirmation = $settings->getPrivate('read_confirmation');
		$read_confirmation = $read_confirmation['@childnodes']['item'][0]['@childnodes'];
		$read_confirmation_subject = $read_confirmation['subject'][0]['@value'];
		$read_confirmation_text = $read_confirmation['text'][0]['@value'];
		$language = slLanguage::instance();
		if(!$read_confirmation_subject){
			$read_confirmation_subject = $language->get('mail_compose','read_confirmation_subject');
		}
		if(!$read_confirmation_text){
			$read_confirmation_text = $language->get('mail_compose','read_confirmation_text');
		}
		
		$data['SUBJECT'] = $oItem->subject;
		$data['FROM'] = $oItem->from;
		$data['TO'] = $oItem->to;
		if($request->get('all._frm.rfc_time')){
			$mail->RFCDate = $request->get('all._frm.rfc_time');
			$data['DATE'] = $request->get('all._frm.rfc_time');
		}else{
			$data['DATE'] = date("Y/m/d H:i:s O",$oItem->date);
		}
		$aItem = WebmailIQItems::cnvMailItem($oItem,array('tag'=>'subject,header_from,header_to,confirm_addr,date,size'));
		
		$read_confirmation_subject = $this->replaceVar($read_confirmation_subject,$data);
		$read_confirmation_text = $this->replaceVar($read_confirmation_text,$data);
		
		$mail = new Mail('UTF-8');
		$mail->XMailer.='-Tablet';
		$mail->setSMTPAuth($_SESSION['SMTP_AUTH']);
		$mail->setSMTPUsername($this->oAccount->username);
		$mail->setSMTPPassword($this->oAccount->getPassword());
		
		$mail->setFrom(
			$_SESSION['EMAIL'],
			$this->oAccount->fullname,
			true
		);
		
		$info = MailParse::parseAddresses(Tools::unhtmlspecialchars($aItem['confirm_addr']));
		$mail->addTo($info[0]['address'],$info[0]['display']);
		$mail->setBody($read_confirmation_text);
		$mail->setSubject($read_confirmation_subject);
		try{
			$mail->send();
			$result->message = 'message_send_ok';
		}catch(Exc $e){
			$result->error = $e;
		}
		$result->redirect = true;
		$result->redirectURL = str_replace('&unread=unread','',$request->getURI(false));
		
		return $result;
	}
	
	public function public_calendar_action()
	{
		$r = slRequest::instance();
		$old_search = $r->get('all.search');
		$search = $r->get('all.searchOld');
		$old_email = $r->get('all.accountPublicOld');
		$email = $r->get('all.accountPublic');
		if($email != $old_email){
			return $this->account();
		}
		if($search != $old_search){
			return $this->search();
		}
		$s = $r->get('all._s');
		return $this->getContainerLink($s);
	}
	
	public function accept($counter = false)
	{
		$request = slRequest::instance();
		$response = new stdClass();
		$selector['id'] = $request->get('all._s.id');
		$selector['type'] = $request->get('all._s.type');
		try{
			$result = false;
			$items = $request->get('form.items');
			foreach($items as $id => $selected){
				if($selected){
					$oItem = $this->oFolder->getItem($id);
					$owner = MerakGWAPI::getFolderOwner($this->oFolder);
					$owner = $owner==$_SESSION['EMAIL']?false:$oItem->to;
					$action = $counter?'acceptCounterInvitation':'acceptInvitation';
					
					$aAttachment = $oItem->$action($this->part_id,$this->accept_folder,$owner);
					
					 					$imip = iMIP::load($this->oFolder->account->gwAccount);
					if($counter){
						$imip->iMIP_Email($oItem,'counter',$aAttachment,false,false,$oItem->from);
					}else{
						$imip->iMIP_Email($oItem,'accept',$aAttachment);
					}
					$oItem->delete();
				}
			}
			
		}catch(Exception $e){
			$response->redirect = true;
			$response->back = true;
			$response->error = $e;
			return $response;
		}
		$response->redirect = true;
		 		$response->redirectURL = $this->getContainerLink(slRequest::instance()->get('all._s'));
		$response->message = 'item_accept_ok';
		return $response;
	}
	public function acceptCounter()
	{
		$this->accept(true);
	}
	
	public function decline($counter = false)
	{
		$request = slRequest::instance();
		$response = new stdClass();
		$selector['id'] = $request->get('all._s.id');
		$selector['type'] =  $request->get('all._s.type');
		try{
			$result = false;
			$items = $request->get('form.items');
			foreach($items as $id => $selected){
				if($selected){
					$oItem = $this->oFolder->getItem($id);
					$owner = MerakGWAPI::getFolderOwner($this->oFolder);
					$owner = $owner==$_SESSION['EMAIL']?false:$oItem->to;
					$action = $counter?'declineCounterInvitation':'declineInvitation';
					$aAttachment = $oItem->$action($this->part_id,$owner);
					 					$imip = iMIP::load($this->oFolder->account->gwAccount);
					if($counter){
						$imip->iMIP_Email($oItem,'declinecounter',$aAttachment,false,false,$oItem->from);
					}else{
						$imip->iMIP_Email($oItem,'decline',$aAttachment);
					}
					$oItem->delete();
				}
			}
		
		}catch(Exception $e){
			$response->redirect = true;
			$response->back = true;
			$response->error = $e;
			return $response;
		}
		
		$response->redirect = true;
		 		$response->redirectURL = $this->getContainerLink(slRequest::instance()->get('all._s'));
		$response->message = 'item_decline_ok';
		return $response;
	}
	
	public function declineCounter()
	{
		$this->decline(true);
	}
	
	public function subscribe_account()
	{
		$request = slRequest::instance();
		$response = new stdClass();
		$selector['type'] = 'M';
		$selector['id'] = $request->get('all.container');
		$account = $request->get('all.subscribe_account');
	
		 		if($this->oAccount->gwAccount && $this->oAccount->gwAccount->bLogged){
			try{
				$this->oAccount->gwAccount->subscribe(array($account));
			}catch(Exc $e){
				$gwError = $e;
			}
		}
	
		 		if($this->oAccount->protocol=='IMAP'){
			try{
				$this->oAccount->subscribe(array($account));
			}catch(Exc $e){
				$imapError = $e;
			}
			$this->oAccount->sync();
		}
		$response->redirectURL = $this->getContainerLink($selector);
		$response->redirect = true;
		if($imapError && $gwError){
			$response->error = new Exc($imapError->getMessage());
		}else{
			$response->message = 'subscribe_account_ok';
		}
		return $response;
	}
	
	public function subscribe_folder()
	{
		$request = slRequest::instance();
		$response = new stdClass();
		$selector['type'] = 'M';
		$selector['id'] = $request->get('all.container');
		$folder = $_SESSION['SHARED_PREFIX'].$request->get('all.subscribe_account').'/'.$request->get('all.subscribe_folder');
		 		if($this->oAccount->protocol=='IMAP'){
			try{
				$this->oAccount->subscribeFolder($folder);
			}catch(Exc $e){
				$imapError = $e;
			}
		}
		if($this->oAccount->gwAccount && $this->oAccount->gwAccount->bLogged){
			try{
				$this->oAccount->gwAccount->subscribeFolder($folder);
			}catch(Exc $e){
				$gwError = $e;
			}
		}
		$response->redirectURL = $this->getContainerLink($selector);
		$response->redirect = true;
	
		if($imapError && $gwError){
			$response->error = new Exc($imapError->getMessage());
		}else{
			$response->message = 'subscribe_folder_ok';
		}
		return $response;
	}
	
	
	public function cancel()
	{
		$result = new stdClass();
		$result->redirect = true;
		$result->redirectURL = $this->getContainerLink(slRequest::instance()->get('all._s'));
		return $result;
	}
	
	 	protected function replaceVar($var,$data)
	{
		foreach($data as $key => $val){
			$var = str_ireplace('%'.$key.'%',$data[strtoupper($key)],$var);
		}
		return $var;
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
			'target'=>'content',
			'view'=>$folderInfo['page'],
			'data'=>'item.fdr',
			'id'=>$selector['id'],
			'type'=>$selector['type']
		);
		$link = $router->getCompressedLink('folder',$params);
		$link = $request->getPath().str_replace('&amp;','&',$link);
		if(($sort = $request->get('get._s.sort'))!=false){
			$link.='&_s[sort]='.rawurlencode($sort);
		}
		if(($search = $request->get('get._s.search'))!=false){
			$link.='&_s[search]='.rawurlencode($search);
		}
		if(($page = $request->get('get._s.page'))!=false){
			$link.='&_s[page]='.rawurlencode($page);
		}
		if(($view = $request->get('get.view'))!=false){
			$link.='&view='.rawurlencode($view);
		}
		return $link;
	}
	
	protected function prepareFormItem($data,$type,$finalize = false)
	{
		switch($type){
			case 'C':
				$request = slRequest::instance();
				 				$this->phones=$request->get('all.item.phones');
				$list = $request->get('all.distribution');
				if($list){
					$contacts = $request->get('all.contacts');
					 					
					if($data['values'][0]['ITMSHARETYPE']){
						$data['values'][0]['ITMSHARETYPE'] = 'P';
					}else{
						$data['values'][0]['ITMSHARETYPE'] = 'U';
					}
					if(is_array($contacts) && !empty($contacts))foreach($contacts as $contact){
						if($finalize){
							$item = &$data['locations'][0]['location'][$contact['id']]['values'][0];
						}else{
							$item = &$data['locations'][0]['location'][$contact['id']];
						}
						$item['LCT_ID'] = $contact['id'];
						$item['LCTEMAIL1'] = $contact['email'];
						$item['LCTDESCRIPTION'] = $contact['description'];
						$item['LCT_TYPE'] = 'O';
						if(!$finalize){
							$item['_ACTION'] = $contact['_ACTION'];
							$item['_SELECTED'] = $contact['_SELECTED'];
						}else{
							if($contact['_ACTION']=='add'){
								unset($item['LCT_ID']);
							}
							if($contact['_ACTION']=='delete'){
								unset($data['locations'][0]['location'][$contact['id']]['values']);
							}
						}
					}
				}else{
					 					if($data['values'][0]['ITMSHARETYPE']){
						$data['values'][0]['ITMSHARETYPE'] = 'P';
					}else{
						$data['values'][0]['ITMSHARETYPE'] = 'U';
					}
					$homeLocation = $data['locations'][0]['location']['H'];
					unset($data['locations'][0]['location']['H']);
					if(isset($homeLocation['values'][0]['LCT_ID'])){
						$lctID = $homeLocation['values'][0]['LCT_ID'];
					}else{
						$lctID = 0;
					}
					$data['locations'][0]['location'][$lctID]=$homeLocation;
					$phn_count = 0;
					 
				}
			break;
			case 'E':
				$request = slRequest::instance();
				$all=$request->get('all');
				 
				 				 
				 				$repetition=false;
				if (isset($data['recurrences'][0]['recurrence'][0]['type']))
				{
					$repetition=true;
					 
					switch ($data['recurrences'][0]['recurrence'][0]['type'])
					{
						case 0:  							$data['recurrences'][0]['recurrence'][0]['values']=array();
							$repetition=false;
							break;
						case 1:  							if($data['recurrencesvalues']['daily']['type']==1)
							{
								 								unset($data['recurrencesvalues']['daily']['rcrdayrepetition']);
								$data['recurrencesvalues']['daily']['rcrweekrepetition']=1;
								$data['recurrencesvalues']['daily']['rcrdayofweeknumber']=$this->getBitVal(array(1,2,3,4,5));
								 							}
							unset($data['recurrencesvalues']['daily']['type']);
							$data['recurrences'][0]['recurrence'][0]['values']=$data['recurrencesvalues']['daily'];
							break;
						case 2:  							$data['recurrencesvalues']['weekly']['rcrdayofweeknumber']=$this->getBitVal($data['recurrencesvalues']['weekly']['rcrdayofweeknumber']);
							$data['recurrences'][0]['recurrence'][0]['values']=$data['recurrencesvalues']['weekly'];
							break;
						case 3:  							unset($data['recurrencesvalues']['monthly']['type']);
							$data['recurrences'][0]['recurrence'][0]['values']=$data['recurrencesvalues']['monthly'];
							break;
						case 4:  							unset($data['recurrencesvalues']['yearly']['type']);
							if (!isset($data['recurrencesvalues']['yearly']['rcryearrepetition'])){$data['recurrencesvalues']['yearly']['rcryearrepetition']=1;}
							$data['recurrences'][0]['recurrence'][0]['values']=$data['recurrencesvalues']['yearly'];
							break;
					}
					 
					$endDateDatePicker=$request->get('all.datePicker_endDate');
					switch ($data['recurrencesvalues']['enddate']['type'])
					{
						case 0:  							break;
						case 1:  							
							$endDate=explode('/',$endDateDatePicker);
							$data['recurrencesvalues']['enddate']['rcrenddate']=gregoriantojd ($endDate[1],$endDate[0],$endDate[2]);
							
							$data['recurrences'][0]['recurrence'][0]['values']['rcrenddate']=$data['recurrencesvalues']['enddate']['rcrenddate'];
							break;
						case 2:  							foreach($data['recurrencesvalues']['enddate'] as $key=>$val)
							{
								$data['recurrences'][0]['recurrence'][0]['values'][$key]=$val;
							}
							break;
					}
					if ($repetition)
					{
						$data['recurrences'][0]['recurrence'][0]['values']=array($data['recurrences'][0]['recurrence'][0]['values']);
					}
					else
					{
						unset($data['recurrences']);
					}
					
					 
					
					unset($data['recurrences'][0]['recurrence'][0]['type']);
					unset($data['recurrencesvalues']);
				 
				 				}
				 
			
				 				$data['values'][0]['CTZ'] = $_SESSION['CTZ'];
				
				 				if($data['values'][0]['EVNSHARETYPE']){
					$data['values'][0]['EVNSHARETYPE'] = 'P';
				}else{
					$data['values'][0]['EVNSHARETYPE'] = 'U';
				}
				 				$year = $data['values'][0]['EVNSTARTYEAR'];
				$month = $data['values'][0]['EVNSTARTMONTH'];
				$day = $data['values'][0]['EVNSTARTDAY'];
				$hour = $data['values'][0]['EVNSTARTHOUR'];
				$minute = $data['values'][0]['EVNSTARTMINUTE'];
				
				if (isset($all['datePicker_fromDate']))
				{
					$d=explode('/',$all['datePicker_fromDate']);
					$year = $d[2];
					$month = $d[1];
					$day = $d[0];
				}

				unset($data['values'][0]['EVNSTARTYEAR']);
				unset($data['values'][0]['EVNSTARTMONTH']);
				unset($data['values'][0]['EVNSTARTDAY']);
				unset($data['values'][0]['EVNSTARTHOUR']);
				unset($data['values'][0]['EVNSTARTMINUTE']);
				$date = cal_to_jd(CAL_GREGORIAN,$month,$day,$year);
				$data['values'][0]['EVNSTARTDATE'] = $date;
				$data['values'][0]['EVNSTARTTIME'] = $hour*60 + $minute;

				 				$year = $data['values'][0]['EVNENDYEAR'];
				$month = $data['values'][0]['EVNENDMONTH'];
				$day = $data['values'][0]['EVNENDDAY'];
				$hour = $data['values'][0]['EVNENDHOUR'];
				$minute = $data['values'][0]['EVNENDMINUTE'];
				
				if (isset($all['datePicker_toDate']))
				{
					$d=explode('/',$all['datePicker_toDate']);
					$year = $d[2];
					$month = $d[1];
					$day = $d[0];
				}
				
				unset($data['values'][0]['EVNENDYEAR']);
				unset($data['values'][0]['EVNENDMONTH']);
				unset($data['values'][0]['EVNENDDAY']);
				unset($data['values'][0]['EVNENDHOUR']);
				unset($data['values'][0]['EVNENDMINUTE']);
				$date = cal_to_jd(CAL_GREGORIAN,$month,$day,$year);
				$data['values'][0]['EVNENDDATE'] =$date;
				$data['values'][0]['EVNENDTIME'] = $hour*60 + $minute;

				if ($data['values'][0]['EVNALLDAY']){
					$data['values'][0]['EVNSTARTTIME'] = -1;
					$data['values'][0]['EVNENDTIME'] = -1;
					 						$data['values'][0]['EVNENDDATE'] += 1;
					 				}
				 				if($data['values'][0]['EVNENDDATE'] < $data['values'][0]['EVNSTARTDATE']){
					$data['values'][0]['EVNENDDATE'] = $data['values'][0]['EVNSTARTDATE'];
				}
				if($data['values'][0]['EVNENDDATE'] == $data['values'][0]['EVNSTARTDATE']
				&& $data['values'][0]['EVNENDTIME'] < $data['values'][0]['EVNSTARTTIME'] ){
					$data['values'][0]['EVNENDTIME'] = $data['values'][0]['EVNSTARTTIME']+30;
				}
				
				unset($data['values'][0]['EVNALLDAY']);
				if(is_array($data['reminders'])){
					foreach($data['reminders'][0]['reminder'] as $key => $reminder){
						
						$remove = false;
						$id = '';
						if($reminder['values'][0]['ID']){
							$id = $reminder['values'][0]['ID'];
							$data['reminders'][0]['reminder'][$key]['values'][0]['RMN_ID'] = $reminder['values'][0]['ID'];
						}
						$data['reminders'][0]['reminder'][$key]['values'][0]['RMNMINUTESBEFORE'] = 0;
						$data['reminders'][0]['reminder'][$key]['values'][0]['RMNHOURSBEFORE'] = 0;
						$data['reminders'][0]['reminder'][$key]['values'][0]['RMNDAYSBEFORE'] = 0;
						
						switch($reminder['values'][0]['UNIT']){
							case 'm':
								$variable = 'MINUTES';
							break;
							case 'h':
								$variable = 'HOURS';
							break;
							case 'd':
								$variable = 'DAYS';
							break;
						}
						$data['reminders'][0]['reminder'][$key]['values'][0]['RMN'.$variable.'BEFORE'] = $reminder['values'][0]['BEFORE'];
						if(!$reminder['values'][0]['ACTIVE']){
							if($id){
								$remove = true;
							}
							unset($data['reminders'][0]['reminder'][$key]['values']);
						}else{
							unset($data['reminders'][0]['reminder'][$key]['values'][0]['ID']);
							unset($data['reminders'][0]['reminder'][$key]['values'][0]['ACTIVE']);
							unset($data['reminders'][0]['reminder'][$key]['values'][0]['UNIT']);
							unset($data['reminders'][0]['reminder'][$key]['values'][0]['BEFORE']);
						}
						if($id){
							$data['reminders'][0]['reminder'][$id] = $data['reminders'][0]['reminder'][$key];
							unset($data['reminders'][0]['reminder'][$key]);
							if($remove){
								
								foreach($data['reminders'][0]['reminder'][$key] as $subkey => $subval){
									unset($data['reminders'][0]['reminder'][$key][$subkey]);
								}
							}
						}else{
							if(!$remove && empty($data['reminders'][0]['reminder'][$key]['values'])){
								unset($data['reminders'][0]['reminder'][$key]);
							}
						}
					}
				}
				$folder = $request->get('all._s.id');
				if(strpos($folder,$_SESSION['RESOURCES_FOLDER'])===0){
					 					if($data['values'][0]['EVN_ID']){
						$flags = 2;
					 					}else{
						$flags = 1;
						$data['contacts'][0]['contact'][0]['values'][0]['cntemail'] = $_SESSION['EMAIL'];
						$data['contacts'][0]['contact'][0]['values'][0]['cntrole'] = 'Q';
						
					}
					$data['values'][0]['EVNFLAGS'] = $flags;	
				}
			break;
			case 'T':
			case 'N':
				
				 				$data['values'][0]['CTZ'] = $_SESSION['CTZ'];
				
				 				if($data['values'][0]['EVNSHARETYPE']){
					$data['values'][0]['EVNSHARETYPE'] = 'P';
				}else{
					$data['values'][0]['EVNSHARETYPE'] = 'U';
				}
				 				if($type=='T'){
					if($data['reminders']){
						foreach($data['reminders'][0]['reminder'] as $key => $reminder){
							$remove = false;
							$id = '';
							if($reminder['values'][0]['ID']){
								$id = $reminder['values'][0]['ID'];
								$data['reminders'][0]['reminder'][$key]['values'][0]['RMN_ID'] = $reminder['values'][0]['ID'];
							}
							if(!$reminder['values'][0]['ACTIVE']){
								unset($data['reminders'][0]['reminder'][$key]);
								$remove = true;
								if(!$id){
									continue;
								}
								
							}
							$date = explode('/',slRequest::instance()->get('all.datePicker_reminder'));
							$timestamp = mktime(
								intval($reminder['values'][0]['HOURS']),
								intval($reminder['values'][0]['MINUTES']),
								0,
								intval($date[1]),
								intval($date[0]),
								intval($date[2])
							);
							unset($data['reminders'][0]['reminder'][$key]['values'][0]['HOURS']);
							unset($data['reminders'][0]['reminder'][$key]['values'][0]['MINUTES']);
							$data['reminders'][0]['reminder'][$key]['values'][0]['RMNTIME'] = $timestamp;
							unset($data['reminders'][0]['reminder'][$key]['values'][0]['ID']);
							unset($data['reminders'][0]['reminder'][$key]['values'][0]['ACTIVE']);
							
							if($id){
								$data['reminders'][0]['reminder'][$id] = $data['reminders'][0]['reminder'][$key];
								unset($data['reminders'][0]['reminder'][$key]);
								if($remove){
									unset($data['reminders'][0]['reminder'][$id]['values']);
								}
							}else{
								if(!$remove && empty($data['reminders'][0]['reminder'][$key]['values'])){
									unset($data['reminders'][0]['reminder'][$key]);
								}
							}	
						}
					}
					if($data['values'][0]['EVNSTARTCHECK']){
						$year = $data['values'][0]['EVNSTARTYEAR'];
						$month = $data['values'][0]['EVNSTARTMONTH'];
						$day = $data['values'][0]['EVNSTARTDAY'];
						
						 						if (isset($_REQUEST['datePicker_fromDate']))
						{
							$d=explode('/',$_REQUEST['datePicker_fromDate']);
							$year = $d[2];
							$month = $d[1];
							$day = $d[0];
						}
						 						
						if($month && $year && $day){
							$date = cal_to_jd(CAL_GREGORIAN,$month,$day,$year);
							$data['values'][0]['EVNSTARTDATE'] = $date;
						}
						 					}
					else
					{
						$data['values'][0]['EVNSTARTDATE'] = 0;
					}
					
					unset($data['values'][0]['EVNSTARTCHECK']);
					unset($data['values'][0]['EVNSTARTYEAR']);
					unset($data['values'][0]['EVNSTARTMONTH']);
					unset($data['values'][0]['EVNSTARTDAY']);
						
					 					if($data['values'][0]['EVNENDCHECK']){
						$year = $data['values'][0]['EVNENDYEAR'];
						$month = $data['values'][0]['EVNENDMONTH'];
						$day = $data['values'][0]['EVNENDDAY'];
						
						 						if (isset($_REQUEST['datePicker_toDate']))
						{
							$d=explode('/',$_REQUEST['datePicker_toDate']);
							$year = $d[2];
							$month = $d[1];
							$day = $d[0];
						}
						 						
						if($month && $year && $day){
							$date = cal_to_jd(CAL_GREGORIAN,$month,$day,$year);
							$data['values'][0]['EVNENDDATE'] = $date;
						}
					}
					else
					{
						$data['values'][0]['EVNENDDATE'] = 0;
					}
					 					unset($data['values'][0]['EVNENDCHECK']);
					unset($data['values'][0]['EVNENDYEAR']);
					unset($data['values'][0]['EVNENDMONTH']);
					unset($data['values'][0]['EVNENDDAY']);
					 					 					 					 					 
					if(is_array($data['reminders'][0]['reminder'][0]))
					{
						$rmnd['RMNTIME'] = $data['reminders'][0]['reminder'][0]['values'][0]['RMNTIME'];
						 						if (isset($data['reminders'][0]['reminder'][0]['values'][0]['ID']) && !empty($data['reminders'][0]['reminder'][0]['values'][0]['ID']))
						{
							$rmnd['RMN_ID']=$data['reminders'][0]['reminder'][0]['values'][0]['ID'];
						}
						
						unset($data['reminders'][0]['reminder'][0]['values'][0]);
						$data['reminders'][0]['reminder'][0]['values'][0]=$rmnd;
						
					
						
					}
					 
					 					 
					 				}
			break;
			case 'J':
			break;
		
			case 'F':
				if($data['values'][0]['EVNSHARETYPE']){
					$data['values'][0]['EVNSHARETYPE'] = 'P';
				}else{
					$data['values'][0]['EVNSHARETYPE'] = 'U';
				}
				
				$attachments = $this->processAttachments();

				if (trim($data['values'][0]['EVNLOCATION'])=='' && isset($attachments[0]['values'][0]['name']) && trim($attachments[0]['values'][0]['name'])!='')
				{
					$data['values'][0]['EVNLOCATION']=$attachments[0]['values'][0]['name'];
					$data['values'][0]['EVNTITLE']=$attachments[0]['values'][0]['name'];
					$data['values'][0]['EVNRID']=$attachments[0]['values'][0]['name'];
					$data['values'][0]['EVNCOMPLETE']=$attachments[0]['values'][0]['size'];
				}
				else
				{
					$data['values'][0]['EVNTITLE']=$data['values'][0]['EVNLOCATION'];
					$data['values'][0]['EVNRID']=$data['values'][0]['EVNLOCATION'];
					 				}
				if($attachments){
					$data['attachments'][0]['attachment'] = $attachments;
				}
				break;
		}
		return $data;
	}
	protected function processAttachments($attachments = array())
	{
		$user = $_SESSION['user'];
		if($files = slRequest::instance()->get('files')){
			foreach($files['item']['attachments'][0]['attachment'] as $id => $file){
				$id = str_replace("*",".",$id);
				$folderName = Tools::my_uniqid();
				 
				$dir = $user->getUploadDir($folderName);
				
				$fileName =  Tools::randomFileName($dir.'/');
				 
				if (!move_uploaded_file($file['tmp_name'], $fileName)) {
					return false;
				}
				$itemID = Tools::my_uniqid();
				$user->addFileAttachment(
					$fileName,
					$file['name'],
					$file['type'],
					$folderName,
					$itemID
				);
				$attachment['values'][0]['name'] = $file['name'];
				$attachment['values'][0]['class'] = 'file';
				$attachment['values'][0]['size'] = $file['size'];
				$attachment['values'][0]['fullpath'] = $folderName.'/'.$itemID;
				$attachments[$id] = $attachment;
			}
		}
		return $attachments;
	}
	
	
	protected function formToTreeItem($data,$type)
	{
		
		$result['@childnodes'] = $this->formToTreeItem_r($data,$type);
		 		 		return $result;
	}
	
	protected function formToTreeItem_r($data,$type)
	{
		if(is_array($data) && !empty($data)){
			foreach($data as $index =>$value){
				if(is_array($data[$index])){
					foreach($data[$index] as $subKey => $subVal){
						$result[strtolower($index)][$subKey]['@childnodes'] = $this->formToTreeItem_r($subVal,$type);
					}
				}
				if(!is_array($data[$index])){
					$result[strtolower($index)][0]['@value'] = $value;
				}
			}
						
			 			 			if($loc = $data['locations'][0]['location']){
				foreach($loc as $id=>$val){
					$lctID = $data['locations'][0]['location'][$id]['values'][0]['LCT_ID'];
					if($lctID){
						$result['locations'][0]['@childnodes']['location'][$lctID]['@attributes']['uid'] = $lctID;
					}
					if($id && !isset($data['locations'][0]['location'][$id]['values'])){
						$result['locations'][0]['@childnodes']['location'][$id]['@attributes']['uid'] = $id;
					}
				}
			}
			 			if($rem = $data['reminders'][0]['reminder']){
				foreach($rem as $id=>$val){
					$rmnID = $data['reminders'][0]['reminder'][$id]['values'][0]['RMN_ID'];
					unset($result['reminders'][0]['@childnodes']['reminder'][$id]['@childnodes']['values'][0]['@childnodes']['rmn_id']);
					unset($data['reminders'][0]['reminder'][$id]['values'][0]['RMN_ID']);
					if($rmnID){
						$result['reminders'][0]['@childnodes']['reminder'][$rmnID]['@attributes']['uid'] = $rmnID;
					}
					if($id && !isset($data['reminders'][0]['reminder'][$id]['values'])){
						$result['reminders'][0]['@childnodes']['reminder'][$id]['@attributes']['uid'] = $id;
					}
				}
			}
			
			 			if($rec = $data['recurrences'][0]['recurrence']){
				foreach($rec as $id=>$val){
					$rcrID = $data['recurrences'][0]['recurrence'][$id]['values'][0]['RCR_ID'];
					unset($result['recurrences'][0]['@childnodes']['recurrence'][$id]['@childnodes']['values'][0]['@childnodes']['rcr_id']);
					unset($data['recurrences'][0]['recurrence'][$id]['values'][0]['RCR_ID']);
					if($rcrID){
						$result['recurrences'][0]['@childnodes']['recurrence'][$rcrID]['@attributes']['uid'] = $rcrID;
					}
					if($id && !isset($data['recurrences'][0]['recurrence'][$id]['values'])){
						$result['recurrences'][0]['@childnodes']['recurrence'][$id]['@attributes']['uid'] = $id;
					}
				}
			}
			 			 
			
			if($attachments = $data['attachments'][0]['attachment']){
				foreach($attachments as $id=>$val){
					if(is_array($data['attachments'][0]['attachment'][$id])){
						$attID =   $id;
						 						$name = $data['attachments'][0]['attachment'][$id]['values'][0]['ATTNAME'];
						unset($data['attachments'][0]['attachment'][$id]['values'][0]['ATTNAME']);
						if(count($data['attachments'][0]['attachment'][$id]['values'][0])==0){
							unset($result['attachments'][0]['@childnodes']['attachment'][$id]['@childnodes']);
							unset($data['attachments'][0]['attachment'][$id]['values']);
						}
					}
					if($attID){
						$result['attachments'][0]['@childnodes']['attachment'][$id]['@attributes']['uid'] = $attID;
					}
					$result['attachments'][0]['@childnodes']['attachment'][$id]['@childnodes']['values'][0]['@childnodes']['description'][0]['@value'] = $data['attachments'][0]['attachment'][$id]['values'][0]['name'];
					if($id && !isset($data['attachments'][0]['attachment'][$id]['@childnodes']['values'])){
						$result['attachments'][0]['@childnodes']['attachment'][$id]['@attributes']['uid'] = $id;
					}
					if(is_array($data['attachments'][0]['attachment'][$id])){
						
						if($type=='F' && $data['attachments'][0]['attachment'][$id]['values'][0]['size']){
							
							$result['values'][0]['@childnodes']['evncomplete'][0]['@value'] = $data['attachments'][0]['attachment'][$id]['values'][0]['size'];					
							$result['values'][0]['@childnodes']['evnlocation'][0]['@value'] = $data['attachments'][0]['attachment'][$id]['values'][0]['name'];	
							$result['values'][0]['@childnodes']['evntitle'][0]['@value'] = $data['attachments'][0]['attachment'][$id]['values'][0]['name'];
							$result['values'][0]['@childnodes']['evnrid'][0]['@value'] = $data['attachments'][0]['attachment'][$id]['values'][0]['name'];
						}
					}
				}
			}
			
			
			if(isset($data['LCTTYPE']))
			{
				if(isset($this->phones['var']))
				{
					foreach($this->phones['var'] as $key=>$val)
					{
						$data[strtoupper($val)]=$this->phones['val'][$key];
						$result[strtolower($val)]=array(array('@value'=>$this->phones['val'][$key]));
					}
				}
			}
			
			 			 
			 			 
			 			 		}
		 		return $result;
	}
	
	private function getBitVal($vars)
	{
		$val = 0;
		foreach($vars as $flag)
		{
			if (!empty($flag))
			{
				$val = $val | pow(2,$flag);
			}
		}
		return $val;
	}
	
	protected function formToItem($data,$type)
	{
		
		if(is_array($data['values'][0]) && !empty($data['values'][0])){
			foreach($data['values'][0] as $key => $val){
				$result[strtolower($key)] = $val;
			}
		}
		
		if(is_array($data['locations'][0]['location'])){
			foreach($data['locations'][0]['location'] as $id => $lct){
				$result['ADDONS']['LOCATION'][strtolower($id)] = $lct;
			}
		}
		
		 		if(isset($data['phones']) && isset($result['ADDONS']['LOCATION']))
		{
			foreach($data['phones']['var'] as $key=>$val)
			{
				foreach($result['ADDONS']['LOCATION'] as $key2=>$val2)
				{
					$result['ADDONS']['LOCATION'][$key2]['values'][0][strtoupper($val)]=$data['phones']['val'][$key];
				}
			}
		}
		 		
		
		return $result;
	}
	
	public function clear_selected()
	{
		slSession::delPage('selected_items');
		slSession::delPage('selected_contacts');
		$response = new stdClass();
		$response->redirect = true;
		$response->back = true;
		$response->message = 'item_selection_cleared';
		return $response;
	}
	
}

?>
