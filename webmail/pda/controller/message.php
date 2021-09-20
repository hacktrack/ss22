<?php
require_once('inc/mail.php');
slSystem::import('tools/php');

function fullpath_basic_sort($a,$b)
{
	$a1 = substr($a[2]['fullpath'],strrpos($a[2]['fullpath'],'.')+1);
	$b1 = substr($b[2]['fullpath'],strrpos($b[2]['fullpath'],'.')+1);
	return $a1 > $b1;
}

class slControllerMessage extends slControllerDefault
{
	public $smimeRecipients;
	public $bccDlAddrList;
	public $errors;
	public $info;
	public $files;
	public $data;
	public $js;
	
	 	public function check( &$action , &$data )
	{
		$request = slRequest::instance();
		parent::check( $action, $data );
		if (isset($data['all']['_n']) && isset($data['all']['_n']['js']))
		{
			if ($data['all']['_n']['js']!='')
			{
				$this->js=$data['all']['_n']['js'];
			}
		}
		$this->data = &$data;
		switch($action){
			case 'send':
			break;
		}
		
		$this->info = $data['form']['_frm'];
		$this->files = $data['files']['_frm'];
	}
	 	 	public function send()
	{	
		$request = slRequest::instance();
		$result = new stdClass();
		$session = slSession::instance();
		$router = slRouter::instance();
		try{
			$mail = $this->createMessage(true,$failedAttachments);
			$this->processDistributionLists($mail);
			$this->processEmbeddedAttachments($mail,true);
			
			$this->autoAddRecipientsToAddressbook($mail);
			
			$this->setOriginalMessageFlags();
			if($this->errors['no_recipient_certificate']){
				throw new Exception(
					'no_recipient_certificate'
				);
			}
			$oUser = $_SESSION['user'];
			$oPrimaryAccount = $oUser->getAccount($_SESSION['EMAIL']);
			$mail->setSMTPAuth($_SESSION['SMTP_AUTH']);
			$mail->setSMTPUsername($oPrimaryAccount->username);
			$mail->setSMTPPassword($oPrimaryAccount->getPassword());
			
			if($failedAttachments){
				throw new Exception();
			}
			 			$preparedFile = $mail->prepareMessageTempFile($this->sCharset);
			if($this->info['options']['encrypt']){
				
				$gwmanage = new GroupWareManagement();
				$mail->encrypt();
				foreach($this->smimeRecipients as $rcp){
					if($this->info['options']['sign']){
						$mail->sign();
					}
					$mail->overrideRecipient($rcp);
					$recipientCert = $gwmanage->getEmailCertificates($rcp);
					$mail->publicCertificates[strtoupper($rcp)] = $recipientCert;
					if (!($msg = $mail->sendFromPreparedFile($preparedFile))){
						throw new Exception($msg);
					}
				}
			}else{
				if($this->info['options']['sign']){
					$mail->sign();
				}
				if (!($msg = $mail->sendFromPreparedFile($preparedFile))){
					throw new Exception($msg);
				}
			}
		}catch(Exception $e){
			 			$result->redirect = true;
			$result->redirectURL = $request->getPath().'?_n[p][main]=mail.compose';
			try{
				$mail = $this->createMessage(false,$failedAttachments);
			}catch(Exception $e2){
				$e->WMCode = 'limit_exceeded';
				$result->error = $e;
			}
			if($failedAttachments){
				$e = new Exc('attachment_too_large',implode(',',$failedAttachments));
			}
			$id = $this->storeMail($mail);
			$result->errorParams = '&_s[message_id]='.$id;
			$result->error = $e;
			return $result;
		}
		
		try{
			
			if($this->data['form']['_frm']['options']['save_sent_message']){
				$this->saveMessage($mail,'sent','UTF-8',true,$preparedFile,$mail->last_message_id);
			}
			
			if(($sItem = $this->data['form']['_frm']['draftid']) && $this->data['form']['_frm']['mail_action']=='draft'){
				
				$helperConstructor['helper'] = 'folder';
				$helper = slHelperFactory::instance($helperConstructor);
				$sFolder = $helper->getMappedFolderName('drafts',true);
				if(!$sFolder){
					$sFolder = $_SESSION['user']->getDefaultFolder('D');
				}
				$this->deleteMessage($_SESSION['EMAIL'],$sFolder,$sItem);
			}
		
		}catch(Exception $e){
			 			$result->redirect = true;
			$result->redirectURL = $request->getPath().'?_n[p][main]=mail.compose';
			$id = $this->storeMail($mail);
			$result->errorParams = '&_s[message_id]='.$id;
			$result->error = $e;
			return $result;
		}
		
		if($stored = $request->get('all._s.message_id')){
			$session->setMain('["compose"]["'.$id.'"]',array());
		};
		$param['window'] = 'main';
		$param['target'] = 'main';
		$param['view'] = 'grid.mail';
		$param['data'] = 'item.fdr';
		$param['id'] = 'INBOX';
		$param['type'] = 'M';
		$url = $router->getCompressedLink('folder',$param);
		$url = str_replace('&amp;','&',$url);
		
		$result->redirect = true;
		$result->redirectURL = $url;
		$result->message = 'message_send_ok';
		if($failedAttachments){
			$result->error = new Exc('attachment_too_large',implode(',',$failedAttachments));
		}
		return $result;
	}
	
	 	public function save()
	{
		
		$request = slRequest::instance();
		$result = new stdClass();
		try{
			 			$mail = $this->createMessage(false,$failedAttachments,true);
			$action = $request->get('all._frm.mail_action');
			if($action=='reply' || $action=='forward'){
				$fullpath = $request->get('all._frm.sourceaccount').'/'.
						$request->get('all._frm.sourcefolder').'/'.
						$request->get('all._frm.sourceid');
				$mail->addCustomHeader('X-'.ucfirst($action).'-Fullpath: '.$fullpath);
			}
			$mail->setAllowEmptyRecipient(true);
			 			$this->processEmbeddedAttachments($mail);
			$location = $this->saveMessage($mail,'drafts','UTF-8',false);
			 			$folder = $location['folder']->name;
			$item = $location['item']->itemID;
			 			$router = slRouter::instance();
			$path = $request->getPath();
			$link = str_replace('&amp;','&',$router->getLink('main','main','mail.compose'));
			$link .= '&_s[item]='.$item.'&_s[id]='.$folder.'&_s[type]=M&_s[action]=continue';
			if($request->get('all._frm.sourceid')){
				$link.='&_s[sourceid]='.$request->get('all._frm.sourceid');
				$link.='&_s[sourcefolder]='.$request->get('all._frm.sourcefolder');
				$link.='&_s[sourceaccount]='.$request->get('all._frm.sourceaccount');
			}
			$result->redirect = true;
			$result->redirectURL = $path.$link;
			$result->message = 'message_save_ok';
			return $result;
		}catch(Exc $e){
			 			$id = $this->storeMail($mail);
			$result->errorParams = '&_s[message_id]='.$id;
			$result->error = $e;
		}catch(Exception $e){
			 			$id = $this->storeMail($mail);
			$result->errorParams = '&_s[message_id]='.$id;
			$result->error = $e;
		}
		 		$result->redirect = true;
		$result->back = true;
		$result->message = 'message_save_ok';
		if($failedAttachments){
			$result->error = new Exc('attachment_too_large',implode(',',$failedAttachments));
		}
		return $result;
	}
	 	public function contacts_to($param)
	{
		$items = $param['all']['items'];
		$message = $this->createMessage();
		$this->appendAdressesFromDialog($items,$message->to);
		$id = $this->storeMail($message);
		return $this->loadComposeFromSession($id);
	}
	 	public function contacts_cc($param)
	{
		$items = $param['all']['items'];
		$message = $this->createMessage();
		$this->appendAdressesFromDialog($items,$message->cc);
		$id = $this->storeMail($message);
		return $this->loadComposeFromSession($id);
	}
	 	public function contacts_bcc($param)
	{
		$items = $param['all']['items'];
		$message = $this->createMessage();
		$this->appendAdressesFromDialog($items,$message->bcc);
		$id = $this->storeMail($message);
		return $this->loadComposeFromSession($id);
	}
	 	public function add_item($param)
	{
		$items = $param['all']['items'];
		$message = $this->createMessage();
		$this->appendItemAttachmentsFromDialog($items,$message);
		$id = $this->storeMail($message);
		return $this->loadComposeFromSession($id);
	}
	 	 
	 	public function cancel()
	{
		return $this->go_to_main_page();
	}
	
	 	public function go_to_main_page()
	{
		$result = new stdclass();
		$result->redirect = true;
		$result->redirectURL = 'index.html?_n[w]=main&_n[p][main]=grid.mail';
		return $result;
	}
	
	public function cancel_select()
	{
		$request = slRequest::instance();
		$session = slSession::instance();
		$this->loadSentData('grid_contact_select');
		$id = $request->get('all._s.message_id');
		$this->info = $request->get('form._frm');
		$mail = $this->createMessage();
		$id = $this->storeMail($mail);
		return $this->loadComposeFromSession($id);
	}
	
	 	private function loadMessageData()
	{
		$this->loadSentData('contact_select');
		$request = slRequest::instance();
		$messageData = $request->get('all._frm');
		 		return $messageData;
	}
	
	public function storeMail($mail)
	{
		$id = slSystem::uniqueID();
		$session = slSession::instance();
		$request = slRequest::instance();
		$session->setMain('["compose"]["'.$id.'"]["mail"]',$mail);
		$session->setMain('["compose"]["'.$id.'"]["form"]',$request->get('all._frm'));
		return $id;
	}
	
	private function loadComposeFromSession($id)
	{
		$result = new stdClass();
		$result->redirect = true;
		$result->redirectURL = 'index.html?_n[p][main]=mail.compose&_n[w]=main&_s[action]=session&_s[message_id]='.$id;
		return $result;
		 
	}
	
	 
	
	private function appendAdressesFromDialog($contacts,&$variable)
	{
		@$contacts = implode(',',array_keys($contacts));
		$contacts = MailParse::parseAddresses($contacts);
		if ($contacts) foreach($contacts as $contact){
			$var[0] = $contact['address'];
			if($contact['display'] && $contact['display']!=$contact['address']){
				$var[1] = $contact['display'];
			}
			$variable[] = $var;
		}
	}
	
	private function appendItemAttachmentsFromDialog($items,&$variable)
	{
		foreach($items as $id => $item){
			if($item['selected']){
				$class = $item['class'];
				$fullpath = $item['fullpath'];
				$this->addAttachment($variable,$class,'normal',$item);
			}
		}
	}
	
	private function autoAddRecipientsToAddressbook($mail)
	{
		$sett['helper'] = 'settings';
		$settings = slHelperFactory::instance($sett);
		$general = $settings->getPrivate('mail_settings_general');
		$general = $general['@childnodes']['item'][0]['@childnodes'];
		$add_recipients = $general['auto_recipient_to_addressbook'][0]['@value'];
		if($add_recipients){
			@$recipients = slToolsPHP::array_merge($mail->to,$mail->cc,$mail->bcc);
			if($recipients){
				foreach($recipients as $rcp){
					$r['display'] = $rcp[1]?$rcp[1]:$rcp[0];
					$r['address'] = $rcp[0];
					$r['is_group'] = false;
					$to_addressbook[] = $r;
				}
				require_once ('inc/gw/gwmanage.php');
				$gw = new GroupWareManagement();
				$gw->addRecipientsToAddressBook($to_addressbook);
			}
		}
	}
	
	private function createMessage($send = false,&$failedAttachments = array(),$isDraft = false)
	{
		$this->charset = 'UTF-8';
		$mail=new Mail($this->charset);
		$mail->XMailer.='-PDA';
		$oUser = $_SESSION['user'];
		$oAccount = $oUser->getAccount($_SESSION['EMAIL']);
		$mail->charSet=$_SESSION['DEFAULTCHARSET'];
		if ($this->info['options']['charset']!='') {
			$mail->charSet=$this->info['options']['charset'];
		}
		if (isset($this->info['options']['readConfirmation'])) {
			$mail->addHeader('X-Confirm-Reading-To:'.$_SESSION['EMAIL']);
		}
		if ($this->info['options']['reply']!='') {
			$info['reply']=MailParse::parseAddresses($this->info['options']['reply']);
			$mail->addReplyTo($this->info['reply'][0]['address'], $this->info['reply'][0]['display']);
		}
		$mail->setPriority($this->info['options']['priority']);
		if(isset($this->info['options']['smartAttach']) && !$isDraft){
			$folder = $_SESSION['user']->getDefaultFolder('F');
			$mail->SmartAttach = true;
			$mail->SmartAttachAccount = $_SESSION['EMAIL'].'/'.$folder;
			$mail->SmartAttachExpiration = 7;
		}
		 		if($this->info['options']['alias']!=''){
			$from = $this->info['options']['alias'];
			$from =reset(MailParse::parseAddresses($from));
			$address = $from['address'];
			$name = $from['address']!=$from['display']?$from['display']:'';
		} else {
			$address = $_SESSION['EMAIL'];
			$name = $oAccount->fullname;
		}
		$mail->setFrom(
			$address,
			$name,
			true
		);
		
		if($this->info['options']['request_read_confirmation']){
			$mail->addHeader('X-Confirm-Reading-To: '.$address);
		}
		 		if($this->info['to']){
			$this->processAddrList($mail,'to',$this->info['to'],!$send);
		}
		if($this->info['cc']){
			$this->processAddrList($mail,'cc',$this->info['cc'],!$send);
		}
		if($this->info['bcc']){
			$this->processAddrList($mail,'bcc',$this->info['bcc'],!$send);
		}
		$mail->setSubject($this->info['subject']);
		if ($this->info['options']['type']=='html'){
			$mail->setBody(slToolsString::removeHTML($this->info['html']),$this->info['html']);
		} else {
			$mail->setBody($this->info['html']);
		}
		
		if($this->info['in-reply-to']){
			$mail->addHeader('In-reply-to: '.$this->info['in-reply-to']);
		}
		if($this->info['references']){
			$mail->addHeader('References: '.$this->info['references']);
		}
		
		
		$request = slRequest::instance();
		$attachments = $request->get('files._frm.attachment');
		if($attachments){
			foreach($attachments as $key => $attachment){
				if(!$attachment['error']){
					$folder = slSystem::uniqueID();
					$itemID = slSystem::uniqueID();
					$dir = $_SESSION['user']->getUploadDir($folder);
					$file =  Tools::randomFileName($dir.'/');
					 					$request->moveUploadedFile($attachment,$file);
					 					$request->set('files._frm.attachment.'.$key.'.tmp_name',$file);
					$_SESSION['user']->attachments[$folder][$itemID] = array(
						'file' => $file,
						'name' => $attachment['name'],
						'type' => $attachment['type']
					);
					
					$attData['folder'] = $folder;
					$attData['item'] = $itemID;
					$attData['type'] = $attachment['type'];
					$attData['name'] = $attachment['name'];
					$this->addAttachment($mail, 'uploaded', 'normal', $attData);
				}else{
					if($attachment['error']!=4){
						$failedAttachments[] = $attachment;
					}
				}
			}
		}
		if($storedAttachments = $request->get('all._frm.attachment_s')){
			$att['account'] = $_SESSION['EMAIL'];
			$att['folder'] = $request->get('all._s.id');
			$att['item'] = $request->get('all._frm.draftid');
			foreach($storedAttachments as $storedAttachment){
				if($storedAttachment['process']){
					$this->addAttachment($mail,$storedAttachment['class'],'normal',$storedAttachment);
				}
			}
		}
		
		return $mail;
	}
	
	public function saveMessage(&$mail,$folder = 'drafts',$charset = 'UTF-8',$fix_address = true,$preparedFile = false, $message_id = false)
	{
		$request = slRequest::instance();
		$sSaveItem = $request->get('all._frm.draftid');
		$sSaveAccount= $_SESSION['EMAIL'];
		 		$oUser = $_SESSION['user'];
		$oAccount = $oUser->getAccount($sSaveAccount);
		if (!is_object($oAccount))
			throw new Exc('message_invalid_account', $_SESSION['EMAIL']);
		try{
			$helperConstructor['helper'] = 'folder';
			$helper = slHelperFactory::instance($helperConstructor);
			$oFolder = $helper->getMappedFolder($folder,true);
		}catch(Exception $e){
		}
		if (!is_object($oFolder)){
			throw new Exc('message_invalid_folder', $folder);
		}
		
		 		$bcc = $request->get('all._frm.bcc');
		if ($bcc || $this->bccDlAddrList){
			$bcc = Mailparse::parseAddresses($bcc);
			$bccCount = 0;
			if($bcc) foreach($bcc as $bccAddress){
				if(!$bccAddress['display'] || $bccAddress['display']==$bccAddress['address']){
					$aFixedBCC[] = $bccAddress['address'];
				}else{
					$aFixedBCC[] = '"'.$bccAddress['display'].'" <'.$bccAddress['address'].'>';
				}
			}
			if($this->bccDlAddrList){
				foreach($this->bccDlAddrList as $address){
					$aFixedBCC[] = $oMail->AddrFormat(
						array(
							$address['address'],
							$address['display']
						)
					);
				}
			}
			if($aFixedBCC && $folder!='drafts'){
				$sentHeaders[] = 'Bcc: ' . implode(',',$aFixedBCC);
			}
		}
		if($message_id){
			if($folder!='drafts'){
				$sentHeaders[] = 'X-Message-ID: '.$message_id;
			}
		}
		
		if($this->info['options']['encrypt']){
			$mail->encrypt();
		}
		if($this->info['options']['sign']){
			$mail->sign();
		}
		if(!$preparedFile){
			$filename = $mail->prepareMessageTempFile($charset);
		}else{
			$filename = $preparedFile;
		}
		
		
		if($sentHeaders){
			 			$mail->addHeadersIntoFile($filename,$sentHeaders);
		}
		
		if($this->info['options']['encrypt'] || $this->info['options']['sign']){
			$mail->publicCertificates = slSMIME::personalToPublic($mail->personalCertificates);
			$mail->overrideRecipient($_SESSION['EMAIL']);
			$fp = fopen($preparedFile,'r+');
			$mail->encryptAndSign($fp,$filename);
			@fclose($fp);
		}
		
		 		if ($folder=='drafts' && $sSaveItem){
			 			try{
				$oItem = $oFolder->getItem($sSaveItem);
				$itemid = $sSaveItem;
				$oItem->edit($filename);
				$oItem->markAsRead();
				 			}catch (Exc $e){
				$itemid = $oFolder->createItem(false, $filename);
				$oItem = $oFolder->getItem($itemid);
				$oItem->markAsRead();
			}
			$itemid = $oItem->itemID;
		} else {				
			$itemid = $oFolder->createItem(false, $filename);
			$oItem = $oFolder->getItem($itemid);
			$oItem->markAsRead();
		}
		
		$settings = slApplication::instance()->getModel()->settings;
		$settings->clearCache('default_folders');
		$settings->clearCache('mail_settings_general');
		$result['item'] = &$oItem;
		$result['folder'] = &$oFolder;
		$result['account'] = $oAccount;
		
		return $result;
	}
	
	private function deleteMessage($account,$folder,$item)
	{
		$oUser = &$_SESSION['user'];
		$oAccount = $oUser->getAccount($account);
		$oFolder = $oAccount->getFolder($folder);
		$oItem = $oFolder->getItem($item);
		$oFolder->deleteItems(array(0=>$oItem));
	}
	
	private function processAddrList( &$oMail, $type, $value,$save = true )
	{
		$type = strtolower($type);
		$func = 'add'.ucfirst($type);
		if ($value){
			$aArray = MailParse::parseAddresses($value);
			foreach ($aArray as $key => $aItm){
				$is_distrib = preg_match('/\[(.+)\]/si',rawurldecode($aItm['address']),$matches);
				if(!$save && $is_distrib){
					if(strpos($matches[1],'/')!==false){
						$distrib['folder'] = substr($matches[1],0,strrpos($matches[1],'/'));
						$distrib['item'] = substr($matches[1],strrpos($matches[1],'/')+1);
					}else{
						$distrib['folder'] = '__@@ADDRESSBOOK@@__';
						$distrib['item'] = $matches[1];
					}
					$distrib['dest'] = ucfirst($type);
					$oMail->distributionList[] = $distrib;
				}else{
					 					if ($_SESSION['PRIMARY_DOMAIN_AUTOFILL'] && strpos($aItm['address'], '@') === false && !$save ){
						if ($aArray[$key]['address'])
							$aArray[$key]['address'] .= '@' . $_SESSION['PRIMARY_DOMAIN'];
					}
					if($aItm['display'] == $aItm['address']){
						$aItm['display'] = '';
					}
					if($aArray[$key]['address']){
						if($this->info['options']['encrypt']){
							slSystem::import('mail/smime');
							$rcp = $aArray[$key]['address'];
							$gwmanage = new GroupWareManagement();
							if($gwmanage->getEmailCertificates($rcp)){
								$oMail->$func($rcp, $aItm['display']);
								$this->smimeRecipients[] = $rcp;
							}else{
								$this->errors['no_recipient_certificate'][] = $rcp;
							}
						}else{
							$oMail->$func($aArray[$key]['address'], $aItm['display']);
						}
					}
					
				}
			}
			if($type == 'bcc'){
				$this->bcc = $aArray;
			}
		}
	}
	
	private function processDistributionLists(&$oMail)
	{
		$oAccount = &$_SESSION['user']->getAccount($_SESSION['EMAIL']);
		if(is_array($oMail->distributionList) && !empty($oMail->distributionList)){
			foreach($oMail->distributionList as $dl){
				$value = $dl['item'];
				$folder = $dl['folder'];
				$dest = $dl['dest'];
				
				$oFolder = &$oAccount->getFolder($folder);
				$aFilter['tag'] = 'itmclassifyas,itmtitle,itmclass';
				$aFilter['sql'] = "(itmclassifyas = '" . str_replace("'", "''", $value) . "' OR itmtitle = '".str_replace("'", "''", $value)."') AND itmclass = 'L'";
				$aFilter['limit'] = "0,1";
				$contacts = $oFolder->getItems($aFilter);
				$oDL = reset($contacts);
				$sDLID = $oDL->item['ITM_ID'];
				$oDL = $oFolder->getItem($sDLID);
				$aAddons = $oDL->getAddons();
				$aLocations = $aAddons['location']->getData();
				foreach ($aLocations as $location)
				{
					$email = $location['LCTEMAIL1'];
					$name =  $location['LCTDESCRIPTION'];
					$methodName = 'add' . $dest;
					if (strtolower($email) != 'undefined'){
						$error = false;
						if($this->info['options']['encrypt']){
							slSystem::import('mail/smime');
							$gwmanage = new GroupWareManagement();
							if($gwmanage->getEmailCertificates($email)){
								$this->smimeRecipients[] = $email;
							}else{
								$error = true;
								$this->errors['no_recipient_certificate'][] = $email;
							}
						}
						if(!$error){
							$oMail->$methodName($email,$name!=$email?$name:'');
							if(strtoupper($dest) == 'BCC'){
								$iq->bccDlAddrList[] = array(
									'address'=>$email,
									'display'=>$name
								);
							}
						}
					}
				}
			}
		}
	}
	
	 

	public function processEmbeddedAttachments(&$oMail,$send = false)
	{
		$oMail->Body = preg_replace('/-.._._.--.._[0-9]{0,}\//si','',$oMail->Body);
		$this->aEmbeddedAttachments = array();
		$this->replaceEmbeddedAttachments($oMail,$send);
	}
	
	private function replaceEmbeddedAttachments(&$oMail,$send = false)
	{
		$script = $_SERVER['SCRIPT_NAME'];
		$script = str_replace(WEBMAIL_PHP, DOWNLOAD_PHP, $script);
		$script = preg_replace('/-.._._.--.._[0-9]{0,}\//si','',$script);
		$absolute = 'http' . (($_SERVER['HTTPS'] == 'ON' || ($_SESSION['ALWAYSHTTPS'] ?? false)) ? 's' : '') . '://' . $_SERVER['HTTP_HOST'] .
			$script;
		$prefixmatch = '('.preg_quote(DOWNLOAD_PHP).
						'|'.preg_quote($absolute).
						'|'.preg_quote($this->getDottedURI()).')';
		$urlmatch = 'src\="('.$prefixmatch. preg_quote('?sid=' . urlencode($this->aAttrs['sid'])).')';
		$pos = 0;
		while(preg_match('#'.$urlmatch.'#si',$oMail->Body,$matches,PREG_OFFSET_CAPTURE,$pos)){
			$start = $matches[1][1];
			$end = strpos($oMail->Body, '"', $start);
			if ($end === false)
				break;
			$start2 = $start + strlen($matches[1][0]);
			$sUrl = str_replace("&amp;", "&", substr($oMail->Body, $start2, $end - $start2));
			$data = Tools::parseURL($sUrl);
			if ($data['class'] && $data['fullpath'])
			{
				$uid = $data['class'].'#'.$data['fullpath'];
				if(!$this->EA[$uid]){
					if($data['class']=='cid'){
						$pathData = Tools::parseFullPath($data['fullpath'],$data['class']);
						$cid = $pathData['part'];
					}else{
						$cid = strval(Tools::my_uniqid(rand(), true));
					}
					$addAttachments[] = array('cid','embedded', array('class'=>$data['class'],'fullpath'=>$data['fullpath']), $cid);
					$this->EA[$uid] = $cid;
				}else{
					$cid = $this->EA[$uid];
				}
				$oMail->Body = substr_replace($oMail->Body, 'cid:' . $cid, $start, $end - $start);
			}
			$pos = $start + strlen('cid:'.$cid);
		}
		
		 		$last = 1;
		if(is_array($addAttachments)){
			uasort($addAttachments,'fullpath_basic_sort');
			foreach($addAttachments as $attach)
			{
				$this->addAttachment($oMail,$attach[0],$attach[1],$attach[2],$attach[3]);
			}
		}
		unset($_SESSION['mail']['cache']);
	}
	
	private function getDottedURI()
	{
		$host = $_SERVER['HTTP_HOST'];
		$uri = $_SERVER['REQUEST_URI'];
		if(strpos($uri,'?')!==false){
			$uri = substr($uri,0,strpos($uri,'?'));
		}
		$uri = str_replace('/'.WEBMAIL_PHP,'',$uri);
		
		$slashes = substr_count($uri,'/');
		$result = '';
		for($i = 0; $i < $slashes; $i++){
			$result .= '../';
		}
		
		$result.=ltrim($uri.'/'.DOWNLOAD_PHP,'/');
		return $result;
	}
	
 
	static public function addAttachment(&$oMail, $class, $type, $data, $cid = false)
	{
		$oUser = &$_SESSION['user'];
		if($cid!==false){
			$data['cid'] = $cid;
		}
		switch ($class){
			 				 			case 'session':
				$session = slSession::instance();
				$path = explode('/',$data['fullpath']);
				$mail = $session->getMain('["compose"]["'.$path[0].'"]["mail"]');
				$attachment = $mail->attachment[$path[1]];
				$oMail->addAttachment(
					$attachment[0], 
					$attachment[4], 
					$attachment[2]
				);
			break;
			 			case 'file':
			case 'uploaded':
				$aAttachments = $_SESSION['user']->getAttachments();
				if (!isset($aAttachments[$data['folder']][$data['item']]))
					throw new Exc('message_attachment_existence');

				$aAttachData = $aAttachments[$data['folder']][$data['item']];
				Tools::overrideContentType($aAttachData['name'], $aAttachData['type']);
				if(filesize($aAttachData['file'])>$_SESSION['UPLOAD_LIMIT']*1024*1024){
					if(!$this->info['options']['smartAttach']){
						throw new Exc('attachment_too_large');
					}
				}
				switch ($type)
				{
					case 'normal':
						$oMail->addAttachment(
							$aAttachData['file'], 
							$aAttachData['type'], 
							$aAttachData['name']
						);
						break;
					case 'embedded':
						if(!$aAttachData['cid']){
							$aAttachData['cid'] = $cid;
						}
						$oMail->addEmbededAttachment(
							$aAttachData['file'], 
							$aAttachData['type'], 
							$aAttachData['cid'],
							$aAttachData['name']);
						break;
					default:
						throw new Exc('message_attachment_type', $type);
				}
				break;  			case 'cid':
				$attData = Tools::parseFullPath(urldecode($data['fullpath']),$data['class']);
				$oAccount = $oUser->getAccount($attData['account']);
				$oFolder = $oAccount->getFolder($attData['folder']);
				$oItem = $oFolder->getItem($attData['item']);
				$cid = $attData['part'];
				$file = $oItem->getAttachmentDataFileCID($attData['part'], $info);
				if ($info['encoding'] == 'uu'){
					$info['encoding'] = 'base64';
					$part = base64_encode($part);
				}
				switch ($type)
				{
					case 'normal':
						$oMail->addAttachment(
							$file, 
							$info['mimetype'], 
							$info['name'], 
							'base64',
							$info['encoding']
						);
						break;
					case 'embedded':
					
						$oMail->addEmbededAttachment(
							$file, 
							$info['mimetype'],
							$cid, 
							$info['name']
						);
						break;
					default:
						throw new Exc('message_attachment_type', $type);
				}
				break;
			break;
			case 'attachment':
				$attData = Tools::parseFullPath(urldecode($data['fullpath']),$data['class']);
				$oAccount = $oUser->getAccount($attData['account']);
				$oFolder = $oAccount->getFolder($attData['folder']);
				$oItem = $oFolder->getItem($attData['item']);
				
				$file = $oItem->getAttachmentDataFile($attData['part'], $info);
				if ($info['encoding'] == 'uu'){
					$info['encoding'] = 'base64';
					$part = base64_encode($part);
				}
				switch ($type)
				{
					case 'normal':
						$oMail->addAttachment(
							$file, 
							$info['mimetype'], 
							$info['name'],
							'base64', 
							$info['encoding']
						);
						break;
					case 'embedded':
					
						$oMail->addEmbededAttachment(
							$file, 
							$info['mimetype'],
							$cid, 
							$info['name']
						);
						break;
					default:
						throw new Exc('message_attachment_type', $type);
				}
				break;
		}
		
	}
	
	private function setOriginalMessageFlags()
	{
		try{
			$request = slRequest::instance();
			$action = $request->get('form._frm.mail_action');
			if($action=='draft'){
				$action = $request->get('form._frm.sourceaction');
			}
			switch($action){
				case 'reply':
					$oAccount = $_SESSION['user']->getAccount($request->get('form._frm.sourceaccount'));
					$oFolder = $oAccount->getFolder($request->get('form._frm.sourcefolder'));
					$oItem = $oFolder->getItem($request->get('form._frm.sourceid'));
					$oFolder->markItems(Item::FLAG_ANSWERED,array($oItem));
				break;
				case 'forward':
					$oAccount = $_SESSION['user']->getAccount($request->get('form._frm.sourceaccount'));
					$oFolder = $oAccount->getFolder($request->get('form._frm.sourcefolder'));
					$oItem = $oFolder->getItem($request->get('form._frm.sourceid'));
					$oFolder->markItems(Item::FLAG_FORWARDED,array($oItem));
				break;
			}
		}catch(Exc $e){
			 		}
		 	}
}
?>