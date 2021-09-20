<?php
 

function fullpath_sort($a,$b)
{
	$a1 = substr($a[2],strrpos($a[2],'.')+1);
	$b1 = substr($b[2],strrpos($b[2],'.')+1);
	return $a1 > $b1;
}

class WebmailIqMessage extends XMLRequestInterface
{
	public $sCharset = 'UTF-8';
	public $addrList;
	public $aAttrs;
	public $queryType;
	public $sAID;
	public $sFID;
	public $sIID;
	
	public $sFrom;
	public $sTO;
	public $sCC;
	public $sBCC;
	public $sSubject;
	public $sBody;
	
	public $bHTML;

	public $sSave;
	public $sSaveAccount;
	public $sSaveFolder;
	public $sSaveItem;

	public $bSaveToTeamChat;
	
	
	public $sSEmail;
	public $sSIM;
	
	public $sKA;
	
	public $bAutobook;
	public $bEncrypt;
	public $bSign;
	public $bRelay;
	public $bSmartAttach;

	public $sPhoneNumber;
	public $sExternalDevice;

	protected static $errors;

	public $oDOMQuery;
	public $bSmartAttachFolder;
	public $bSmartAttachAccount;
	public $bPassPhrase;
	public $oTeamChatRoom;
	public $oTeamchatComment;
	public $session_user;
	public $bAllowEmptyRecipient;
	public $sDeferred;
	public $SmartAttachAccount;
	public $SmartAttachFolder;
	public $oDOMMessage;
	public $sText;
	public $sAttachments;
	public $oDistrib;
	public $aEmbeddedAttachments;
	public $EA;
	public $oDOMAttachments;
	public $oDOMDoc;
	public $sPassPhrase;
	public $sRFCDate;
	public $aSMS;
	public $oDistribVal;
	public $smimeRecipients;
	public $bAutoABook;
	public $sSaveTeamchatAccount;
	public $sSaveTeamChatItem;
	public $sSaveTeamchatItem;
	public $sSaveTeamchatFolder;
	public $aBcc;
	public $bccDlAddrList;
	public $sSMS;
	public $isDraft;
	public $sEncrypt;
	public $sSign;
	public $sTeamChatRoom;
	public $sTeamChatComment;
	public $aFolderList;


	 
	public function __construct($oDOMQuery, &$oDOMDoc, &$attrs)
	{
		 		$this->oDOMQuery = $oDOMQuery;
		$this->oDOMDoc = &$oDOMDoc;
		$this->aAttrs = &$attrs;
		$this->addrList = array();
		$this->loadUser();
		$this->checkInputXML();
		$this->exeInputXML();
	}
	 
	private function checkInputXML()
	{
		 		if ($this->oDOMMessage = $this->oDOMDoc->getNode(
			'message:message', 
			$this->oDOMQuery
		)){
			$this->queryType = 'regular';
			$result = $this->checkMessageXML();
			 		} else {
			if ($this->oDOMMessage = $this->oDOMDoc->getNode(
				'message:dial', 
				$this->oDOMQuery
			)){
				$this->queryType = 'phonecall';
				$result = $this->checkDialXML();
			} else {
				throw new Exc('message_missing_tag', 'message');
			}
		}
	}

	private function checkDialXML()
	{
		if (!$oDOMAction = $this->oDOMDoc->getNode(
			'message:phone',
			$this->oDOMMessage
		)){
			throw new Exc('message_missing_tag', 'phone');
		}
		$this->sPhoneNumber = $this->oDOMDoc->getNodeValue(
			'message:phone', 
			$this->oDOMMessage
		);
		$userSettings = Storage::getUserData('sip');
		$domainSettings = Storage::getDomainDefaults('sip');
		$serverSettings = Storage::getDefaults('sip');
		$sipSettings = WebmailIqPrivate::get(
			'sip',
			$userSettings,
			$domainSettings,
			$serverSettings
		);
		$this->sExternalDevice = false;
		if($sipSettings['@childnodes']['item'][0]['@childnodes']['mode'][0]['@value']=='external'){	
			if(isset($sipSettings['@childnodes']['item'][0]['@childnodes']['dial'][0]['@value'])
			){
				$dial = $sipSettings['@childnodes']['item'][0]['@childnodes']['dial'][0]['@value'];
				if($dial){
					$this->sExternalDevice = $dial;
				}
			}
		}
		
		return true;
	}

	private function checkMessageXML()
	{
		$this->bAllowEmptyRecipient = false;
		if ($this->aAttrs['type'] == 'get') {
			$this->sAID = $this->oDOMMessage->getAttribute('account');
			$this->sFID = $this->oDOMMessage->getAttribute('folder');
			$this->sIID = $this->oDOMMessage->getAttribute('uid');
			if (!isset($this->sAID)){
				throw new Exc('message_missing_account_id');
			}
			if (!isset($this->sFID)){
				throw new Exc('message_missing_folder_id');
			}
			if (!isset($this->sIID)){
				throw new Exc('message_missing_item_id');
			}
			$this->aData['mid'] = $this->sIID;
		}
		if ($this->aAttrs['type'] == 'set')
		{
			 			if (!$oDOMAction = $this->oDOMDoc->getNode('message:action', $this->oDOMMessage))
				throw new Exc('message_missing_tag', 'action');
			 			if ($this->sSEmail = $this->oDOMDoc->getNode('message:send_as_email', $oDOMAction))
				$this->sSEmail = $this->oDOMDoc->getNodeValue('message:send_as_email', $oDOMAction) =='true' ? true : false;
			 			if ($this->sSIM = $this->oDOMDoc->getNode('message:send_as_im', $oDOMAction))
				$this->sSIM = $this->oDOMDoc->getNodeValue('message:send_as_im', $oDOMAction) ==
					'true' ? true : false;
			 			if ($this->sKA = $this->oDOMDoc->getNode('message:keep_attachments', $oDOMAction))
				$this->sKA = $this->oDOMDoc->getNodeValue('message:keep_attachments', $oDOMAction) ==
					'true' ? true : false;

			 			if ($this->bHTML = $this->oDOMDoc->getNode('message:html_body', $oDOMAction))
				$this->bHTML = $this->oDOMDoc->getNodeValue('message:html_body', $oDOMAction) ==
					'true' ? true : false;
			 			if ($this->bAutoABook = $this->oDOMDoc->getNode('message:auto_addressbook', $oDOMAction))
				$this->bAutoABook = $this->oDOMDoc->getNodeValue('message:auto_addressbook', $oDOMAction) ==
					'true' ? true : false;
			 			if ($oDOMSave = $this->oDOMDoc->getNode('message:save_to_folder', $oDOMAction)){
				$this->sSave = true;
			}else{
				$this->sSave = false;
			}
			 			if ($oDOMSaveToTeamchat = $this->oDOMDoc->getNode('message:save_to_teamchat', $oDOMAction)){
				$this->bSaveToTeamChat = true;
			}else{
				$this->bSaveToTeamChat = false;
			}
			 			if ($this->sEncrypt = $this->oDOMDoc->getNode('message:encrypt', $oDOMAction))
				$this->sEncrypt = $this->oDOMDoc->getNodeValue('message:encrypt', $oDOMAction) ==
					'true' ? true : false;
			 			if ($this->sSign = $this->oDOMDoc->getNode('message:sign', $oDOMAction))
				$this->sSign = $this->oDOMDoc->getNodeValue('message:sign', $oDOMAction) ==
					'true' ? true : false;
			 			if ($this->bRelay = $this->oDOMDoc->getNode('message:smtp_relay', $oDOMAction))
				$this->bRelay = $this->oDOMDoc->getNodeValue('message:smtp_relay', $oDOMAction) ==
					'true' ? true : false;
			 			if ($this->bSmartAttach = $this->oDOMDoc->getNode('message:smart_attach', $oDOMAction))
				$this->bSmartAttach = $this->oDOMDoc->getNodeValue('message:smart_attach', $oDOMAction) ==
					'true' ? true : false;
			 			if ($this->bSmartAttachFolder = $this->oDOMDoc->getNode('message:smart_attach_folder', $oDOMAction)){
				$this->SmartAttachFolder = $this->oDOMDoc->getNodeValue('message:smart_attach_folder', $oDOMAction);
			}
			 			if ($this->bSmartAttachAccount = $this->oDOMDoc->getNode('message:smart_attach_account', $oDOMAction)){
				$this->SmartAttachAccount = $this->oDOMDoc->getNodeValue('message:smart_attach_account', $oDOMAction);
			}
			if($this->SmartAttachFolder && !$this->SmartAttachAccount){
				$this->SmartAttachAccount = $_SESSION['EMAIL'];
			}
			 			if ($this->sRFCDate = $this->oDOMDoc->getNode('message:rfc_date', $this->oDOMMessage))
				$this->sRFCDate = $this->oDOMDoc->getNodeValue('message:rfc_date', $this->oDOMMessage);
			 			if ($this->oDOMDoc->getNode('message:deferred_date', $this->oDOMMessage)){
				$this->sDeferred = $this->oDOMDoc->getNodeValue('message:deferred_date', $this->oDOMMessage);
			}
			 			if ($this->bPassPhrase = $this->oDOMDoc->getNode('message:passphrase', $this->oDOMMessage)){
				$sPassword = $this->oDOMDoc->getNodeValue('message:passphrase', $this->oDOMMessage);
				 				 				 				 				$this->sPassPhrase = $sPassword;
			}
			 			if (!$this->sSEmail && !$this->sSIM && !$this->sSave && !$this->bSaveToTeamChat)
				throw new Exc('message_invalid_action');
			 
			if ($this->sSMS = $this->oDOMDoc->getNode('message:sms', $this->oDOMMessage)){
				$this->sSMS = $this->oDOMDoc->getNodeValue('message:sms', $this->oDOMMessage);
				$this->bAllowEmptyRecipient = true;
			}
			$this->sSubject = $this->oDOMDoc->getNodeValue('message:subject', $this->oDOMMessage);
			$this->sBody = $this->oDOMDoc->getNodeValue('message:body', $this->oDOMMessage);
			$this->sText = $this->oDOMDoc->getNodeValue('message:text', $this->oDOMMessage);
			$this->sTO = $this->oDOMDoc->getNodeValue('message:to', $this->oDOMMessage);
			$this->sCC = $this->oDOMDoc->getNodeValue('message:cc', $this->oDOMMessage);
			$this->sBCC = $this->oDOMDoc->getNodeValue('message:bcc', $this->oDOMMessage);
			if($this->oDistrib = $this->oDOMDoc->getNode('message:distrib', $this->oDOMMessage)){
				$this->oDistribVal = $this->oDOMDoc->getNodeValue('message:distrib', $this->oDOMMessage);
			}
			if($this->oTeamChatRoom = $this->oDOMDoc->getNode('message:teamchat', $this->oDOMMessage)){
				$this->sTeamChatRoom = $this->oDOMDoc->getNodeValue('message:teamchat', $this->oDOMMessage);
			}
			 			if ($this->oTeamchatComment = $this->oDOMDoc->getNode('message:teamchat_comment', $this->oDOMMessage)){
				$this->sTeamChatComment = $this->oDOMDoc->getNodeValue('message:teamchat_comment', $this->oDOMMessage);
			}
			if (!$this->sFrom = $this->oDOMDoc->getNodeValue('message:from', $this->oDOMMessage))
				throw new Exc('message_missing_tag', 'from');
			 			if ($this->sSEmail && !$this->sTO && !$this->sCC && !$this->sBCC && !$this->oDistribVal && !$this->sSMS)
				throw new Exc('message_missing_tag', 'recipient(to,cc,bcc..)');
			
			if ($this->sSIM && !$this->sTO)
				throw new Exc('message_missing_tag', 'to');

			if ($this->oDOMAttachments = $this->oDOMDoc->getNode('message:attachments', $this->
				oDOMMessage))
				$this->sAttachments = true;
			else
				$this->sAttachments = false;
			 			if ($this->sSave){
				
				 				if (!$this->sSaveAccount = $this->oDOMDoc->getNode('message:account', $oDOMSave))
					throw new Exc('message_missing_tag', 'account');
				$this->sSaveAccount = $this->oDOMDoc->getNodeValue('message:account', $oDOMSave);
				 				if (!$this->sSaveFolder = $this->oDOMDoc->getNode('message:folder', $oDOMSave))
					throw new Exc('message_missing_tag', 'folder');
				$this->sSaveFolder = $this->oDOMDoc->getNodeValue('message:folder', $oDOMSave);
				$oAccount = $_SESSION['user']->getAccount($this->sSaveAccount);
				$oFolder = $oAccount->getFolderWithAutoCreate($this->sSaveFolder, 'main');
				if($oFolder->isDraft()){
					$this->bSmartAttach = false;
					$this->bAllowEmptyRecipient = true;
					$this->isDraft = true;
				}
				 				if ($this->sSaveItem = $this->oDOMDoc->getNode('message:item', $oDOMSave)){
					$this->sSaveItem = $this->oDOMDoc->getNodeValue('message:item', $oDOMSave);
				}
			}
			 			if ($this->bSaveToTeamChat){
				 				if (!$this->sSaveTeamchatAccount = $this->oDOMDoc->getNode('message:account', $oDOMSaveToTeamchat))
					throw new Exc('message_missing_tag', 'account');
				$this->sSaveTeamchatAccount = $this->oDOMDoc->getNodeValue('message:account', $oDOMSaveToTeamchat);
				 				if (!$this->sSaveTeamchatFolder = $this->oDOMDoc->getNode('message:folder', $oDOMSaveToTeamchat))
					throw new Exc('message_missing_tag', 'folder');
				$this->sSaveTeamchatFolder = $this->oDOMDoc->getNodeValue('message:folder', $oDOMSaveToTeamchat);
				 				if ($this->sSaveTeamchatItem = $this->oDOMDoc->getNode('message:item', $oDOMSaveToTeamchat))
					$this->sSaveTeamchatItem = $this->oDOMDoc->getNodeValue('message:item', $oDOMSaveToTeamchat);
			}
		}

		return true;
	}
	 
	private function exeInputXML()
	{
		 		$oUser = &$_SESSION['user'];
		$this->session_user = $oUser;
		switch ($this->aAttrs['type'])
		{
			 			case 'get':
				if ($this->queryType !== 'regular')
					throw new Exc('message_get_not_allowed');
				$this->parseMessage($this->sPassPhrase);
				break;
			case 'set':
				switch ($this->queryType)
				{
					case 'regular':
						$this->sendMessage();
						break;
					case 'phonecall':
						$this->dialPhone();
						break;
				}
				break;
		}
	}

	 
	private function parseMessage($passphrase = '')
	{
		$oUser = &$this->session_user;
		 		$this->sTemplateFile = 'webmailiqmessage_get';
		 		$oAccount = $oUser->getAccount($this->sAID);
		$oFolder = $oAccount->getFolder($this->sFID);
		$oItem = $oFolder->getItem($this->sIID);
		 		$newMessage = false;
		$blocked = false;
		$aMessage = $oItem->parseMessage(true, '1', $newMessage, false, $blocked, false, false, false, $passphrase);
		 		$this->aData['body'] = $aMessage['plain_body'];
		if ($aMessage['attachments'][0])
			$this->aData['attachments']['num'] = $aMessage['attachments'];
		if ($aMessage['cc'])
			$this->aData['cc'] = $aMessage['cc'];
		if ($aMessage['bcc'])
			$this->aData['bcc'] = $aMessage['bcc'];
		if ($aMessage['reply_to'])
			$this->aData['reply_to'] = $aMessage['reply_to'];
		if ($aMessage['html_body'])
			$this->aData['html'] = $aMessage['html_body'];
		$this->aData['to'] = $oItem->to;
		$this->aData['from'] = $oItem->from;
		$this->aData['subject'] = $oItem->subject;
	}


	 
	private function sendMessage()
	{
		$oUser = &$this->session_user;
		$this->sTemplateFile = 'webmailiqmessage_set';
		$oMail = new Mail($this->sCharset, $this->bRelay, $this->bAllowEmptyRecipient);
		$oMail->PassPhrase = $this->sPassPhrase;
		$oMail->XMailer.='-Desktop';
		$oMail->DeferredDelivery = $this->sDeferred;
		$oMail->CipherStrength = $_SESSION['SMIME_CIPHER'];
		if($this->bSmartAttach){
			$oMail->SmartAttach = $this->bSmartAttach;
			 			if($this->SmartAttachAccount && $this->SmartAttachFolder){
				$folder = $this->SmartAttachAccount.'/'.$this->SmartAttachFolder;
				$account = $this->SmartAttachAccount;
			}else{
				$folder = $_SESSION['EMAIL'].'/'.User::getDefaultFolder('F');
				$account = $_SESSION['EMAIL'];
			}
			$oAccount = $oUser->getAccount($account);
			$name = preg_replace('#'.preg_quote($account).'/#i','',$folder,1);
			 			try{
				$oFolder = $oAccount->getFolderWithAutocreate($name,'gw');
			}catch(Exc $e){
				throw new Exc('default_folder_missing', 'F');
			}
			Folder::checkRights($oFolder,Folder::RIGHT_FOLDER_WRITE);
			$oMail->SmartAttachAccount = $folder;
			$oMail->SmartAttachExpiration = 0;  		}
		$aFrom = MailParse::parseAddresses($this->sFrom);
		$oMail->setFrom($aFrom[0]['address'], $aFrom[0]['display'], true);
		 		$this->aFolderList = array();
		 		if ($this->sSubject)
			$oMail->setSubject($this->sSubject);
		 		if ($oDOMXHeader = $this->oDOMDoc->getNode('message:custom_headers', $this->
			oDOMMessage))
		{
			foreach ($this->oDOMDoc->query('//message:header', $oDOMXHeader) as $oDOMXHeaderNode)
			{
				$aHeaderArr = Tools::makeArrayFromXML($oDOMXHeaderNode);
				$aHeaderArr['#text'] = Tools::cr2crlf($aHeaderArr['#text']);
				$headerName = explode(':',$aHeaderArr['#text']);
				$headerName = strtolower(trim($headerName[0]));
				switch($headerName){
					case 'x-reply-fullpath':
					case 'x-forward-fullpath':
						break;
					default:
						$oMail->addHeader($aHeaderArr['#text']);
						break;
				}
			}
		}
		 		if (isset($this->sBody))
		{
			slSystem::import('tools/string');
			$plainBody = slToolsString::removeHTML($this->sBody);
			if ($this->bHTML){
				$this->processEmbeddedAttachments($oMail,$this->sSEmail);
				$oMail->SetBody($plainBody, $this->sBody);
			} else {
				$oMail->SetBody($plainBody);
			}
			unset($plainBody);
			unset($this->sBody);
		}
		
		if($this->sText){
			$plainBody = $this->sText;
			if($this->bHTML){
				slSystem::import('tools/string');
				$altBody = slToolsString::text2html($this->sText,true);
				$oMail->SetBody($plainBody,$altBody);
			}else{
				$oMail->SetBody($plainBody);	
			}
			unset($plainBody);
			unset($altBody);
			unset($this->sText);
		}
		
		 		if ($this->sAttachments)
			$this->processAttachments($oMail);

		 		$this->processAddrList( $oMail, 'to' );
		 		$this->processAddrList( $oMail, 'cc' );
		 		$this->processAddrList( $oMail, 'bcc' );

		 		if ($this->sSMS ){
			$this->aSMS = MailParse::parseAddresses($this->sSMS,true);
		}

		if(!$this->isDraft){
			 			foreach ($this->oDOMDoc->query('message:account', $this->oDistrib) as $dAccount)
			{
				$sAID = $dAccount->getAttribute('uid');
				 				foreach ($this->oDOMDoc->query('message:folder', $dAccount) as $dFolder)
				{
					$sFID = $dFolder->getAttribute('uid');
					self::processDistributedList('message', $oUser, $this->oDOMDoc, $sAID, $sFID, $dFolder,
						$oMail, $this);
				}
			}
		}
		 		 		if($this->sEncrypt){
			if(self::$errors['no_recipient_certificate']){
				throw new Exc(
					'no_recipient_certificate',
					implode(',',self::$errors['no_recipient_certificate'])
				);
			}
		}
		 		$this->execFinalMessageAction($oMail);
	}

	 

	public function processAddrList( &$oMail, $type )
	{
		slSystem::import('tools/php');
		$type = strtolower($type);
		$var = 's'.strtoupper($type);
		$func = 'add'.ucfirst($type);
		
		if($this->isDraft){	
			if($this->$var){
				$oMail->addHeader(ucfirst($type).': '.$this->$var);
			}
			return;
		}
		
		if ($this->$var)
		{
			$aArray = MailParse::parseAddresses($this->$var);
			
			if($aArray)foreach ($aArray as $key => $aItm)
			{
				 				if ($_SESSION['PRIMARY_DOMAIN_AUTOFILL'] && strpos($aItm['address'], '@') === false && $this->sSEmail)
				{
					if ($aArray[$key]['address'])
						$aArray[$key]['address'] .= '@' . $_SESSION['PRIMARY_DOMAIN'];
				}
				if($aItm['display'] == $aItm['address']){
					$aItm['display'] = '';
				}
				if($this->sEncrypt){
					slSystem::import('mail/smime');
					$rcp = $aArray[$key]['address'];
					$gwmanage = new GroupWareManagement();
					if($gwmanage->getEmailCertificates($rcp)){
						$oMail->$func($rcp, $aItm['display']);
						$this->smimeRecipients[] = $rcp;
					}else{
						self::$errors['no_recipient_certificate'][] = $rcp;
					} 
				}else{
					$oMail->$func($aArray[$key]['address'], $aItm['display']);
				}
			}
			@$this->addrList = slToolsPHP::array_merge($this->addrList, $aArray);
			if($type == 'bcc'){
				$this->aBcc = $aArray;
			}
		}
	}

	public static function processDistributedList($namespace, $oUser, $oDOMDoc, $accountID,
		$folderID, $oDOMFdr, &$oMail, &$iq)
	{
		$isTeamChat = false;
		$oAccount = $oUser->getAccount($accountID);
		$oFolder = $oAccount->getFolder($folderID);
		$aContactList = array();
		 		if($oFolder->getType()=='I'){
			$membersFolder = $oAccount->getFolder('__@@GROUP@@__/'.$folderID);
			$members = $membersFolder->getItems();
			$isTeamChat = true;
			foreach($members as $member){
				$aContactList[] = array(
									'email'=>$member->item['FRTEMAIL'],
									'name'=>$member->item['FRTNAME']
								);
			}
		}
		$aDest = array(0 => 'To', 1 => 'CC', 2 => 'BCC');
		$gw = new GroupWareManagement();

		foreach ($aDest as $dest)
		{
			foreach ($oDOMDoc->query($namespace . ':' . strtolower($dest), $oDOMFdr) as $dst)
			{
				
				 				if(!$isTeamChat){
					$aContactList = array();
					$value = $dst->nodeValue;
					$aLocations = $gw->getDistributionListItems($value,$oFolder);
					foreach ($aLocations as $location)
					{
						$aContactList[] = array(
											'email'=>$location['LCTEMAIL1'],
											'name'=>$location['LCTDESCRIPTION']
										);
					}
				}
				foreach ($aContactList as $contact)
				{
					$email = $contact['email'];
					$methodName = 'add' . $dest;
					if (strtolower($email) != 'undefined'){
						$error = false;
						if($iq->sEncrypt){
							slSystem::import('mail/smime');
							$gwmanage = new GroupWareManagement();
							if($gwmanage->getEmailCertificates($email)){
								$iq->smimeRecipients[] = $email;
							}else{
								$error = true;
								self::$errors['no_recipient_certificate'][] = $email;
							} 
						}
						if(!$error){
							$oMail->$methodName($email);
							$iq->dlAddrList[] = $email;
							if(strtoupper($dest) == 'BCC'){
								$iq->bccDlAddrList[] = array(
									'address'=>$email,
									'display'=>$contact['name']
								);
							}
						}
					}
				}
			}
		}
	}

	 
	private function processEmbeddedAttachments(&$oMail,$send = false)
	{
		$this->sBody = preg_replace('/-.._._.--.._[0-9]{0,}\//si','',$this->sBody);
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
		while(preg_match('#'.$urlmatch.'#si',$this->sBody,$matches,PREG_OFFSET_CAPTURE,$pos)){
			$start = $matches[1][1];
			$end = strpos($this->sBody, '"', $start);
			if ($end === false)
				break;
			$start2 = $start + strlen($matches[1][0]);
			$sUrl = str_replace("&amp;", "&", substr($this->sBody, $start2, $end - $start2));
			$data = Tools::parseURL($sUrl);
			if ($data['class'] && $data['fullpath'])
			{
				$uid = $data['class'].'#'.$data['fullpath'];
				if(!$this->EA[$uid]){
					if($data['class']=='cid'){
						$pathData = Tools::parseFullPath($data['fullpath'],$data['class']);
						$cid = urldecode($pathData['part']);
					}else{
						$cid = strval(Tools::my_uniqid(rand(), true));
					}
					$addAttachments[] = array('embedded', $data['class'], $data['fullpath'], $cid);
					$this->EA[$uid] = $cid;
				}else{
					$cid = $this->EA[$uid];
				}
				$this->sBody = substr_replace($this->sBody, 'cid:' . $cid, $start, $end - $start);
			}
			$pos = $start + strlen('cid:'.$cid);
		}

		 		$match = 'src="(\/?client\/skins\/default\/images\/smiles\/'.
				'(activity|flags|food|nature|objects|people|places|symbols)\/([^"]+))';
		$matches = array();
		$pos = 0;
		while(preg_match('#'.$match.'#si',$this->sBody,$matches,PREG_OFFSET_CAPTURE,$pos)){
			$start = $matches[1][1];
			$end = strpos($this->sBody, '"', $start);
			if ($end === false)
				break;
			$start2 = $start + strlen($matches[1][0]);
			$uid = 'smiley#'.$matches[2][0].'/'.$matches[3][0];
			if(!$this->EA[$uid]){
				$cid = strval(Tools::my_uniqid(rand(), true));
				$addAttachments[] = array('embedded', 'smiley', $matches[2][0].'/'.$matches[3][0], $cid);
				$this->EA[$uid] = $cid;
			}else{
				$cid = $this->EA[$uid];
			}
			$this->sBody = substr_replace($this->sBody, 'cid:' . $cid, $start, $end - $start);
			$pos = $start + strlen('cid:'.$cid);	
		}		
		 		$last = 1;
		if(is_array($addAttachments)){
			uasort($addAttachments,'fullpath_sort');
			foreach($addAttachments as $attach)
			{
			try{
				$this->addAttachment($oMail,$attach[0],$attach[1],$attach[2],$attach[3]);
			}catch(Exc $e){

				}
			}
			unset($_SESSION['mail']['cache']);
		}
	}
	
	private function getDottedURI()
	{
		$host = $_SERVER['HTTP_HOST'];
		$uri = $_SERVER['REQUEST_URI'];
		$uri = str_replace('/'.WEBMAIL_PHP,'',$uri);
		$slashes = substr_count($uri,'/');
		$result = '';
		for($i = 0; $i < $slashes; $i++){
			$result .= '../';
		}
		$result.=ltrim($uri.'/'.DOWNLOAD_PHP,'/');
		return $result;
	}
	
	 
	private function processAttachments(&$oMail)
	{
		foreach ($this->oDOMDoc->query('message:attachment', $this->oDOMAttachments) as
			$oDOMAttach)
		{
			if (!$oDOMAttValues = $this->oDOMDoc->getNode("message:values", $oDOMAttach))
				throw new Exc('message_missing_tag', 'values');

			$class = $this->oDOMDoc->getNodeValue("message:class", $oDOMAttValues);
			$fullpath = $this->oDOMDoc->getNodeValue("message:fullpath", $oDOMAttValues);
			$type = $this->oDOMDoc->getNodeValue("message:type", $oDOMAttValues);
			$description = $this->oDOMDoc->getNodeValue("message:description", $oDOMAttValues);

			if (!$class || !$fullpath || !$type)
				throw new Exc('message_missing_tag', 'type,class,fullpath');
		
			$this->addAttachment($oMail, $type, $class, $fullpath, '', false, $description);
		}
	}

	 
	private function addAttachment($oMail, $type, $class, $fullpath, $cid = '',$dummy = false, $description = '')
	{
		$oUser = &$this->session_user;
		$aAttachments = $oUser->getAttachments();
		$attData = Tools::parseFullPath($fullpath, $class);
		$api = createobject('API');
		$info = [];

		if($class == 'item' && $attData['account'][0] == '@') $class = 'special';
		switch ($class)
		{
			case 'cid':
				$oAccount = $oUser->getAccount($attData['account']);
				$oFolder = $oAccount->getFolder($attData['folder']);
				if(($pos = strpos($attData['item'],'|')) !== false) {
					$start_part_id = substr($attData['item'],$pos+1);
					$attData['item'] = substr($attData['item'],0,$pos);
				}else{
					$start_part_id = '';
				}
				$oItem = $oFolder->getItem($attData['item']);
				$oMail->addReferenceItem($oItem);
				$info = [];
				$file = $oItem->getAttachmentDataFileCID($attData['part'], $info);
				$cid = urldecode($attData['part']);

				switch ($type)
				{
					case 'normal':
						$oMail->addAttachment(
							$file, 
							$info['mimetype'], 
							$description?$description:$info['name'], 
							'base64'
						);
						break;
					case 'embedded':
						$oMail->AddStringAttachment(
							file_get_contents($file),
							$description?$description:$info['name'],
							'base64',
							$info['mimetype'],
							true,
							$cid
						);
						
						slSystem::import('tools/icewarp');
						@slToolsIcewarp::iw_delete($file);
						break;
					default:
						throw new Exc('message_attachment_type', $type);
				}
				break;  			break;
			 			case 'item':
			case 'message':  
				static $attachCount;
				$public_url = false;
				$sAID = $attData['account'];
				$sFID = $attData['folder'];
				$sIID = $attData['item'];
				if(($pos = strpos($sIID,'|')) !== false) {
					$start_part_id = substr($sIID,$pos+1);
					$sIID = substr($sIID,0,$pos);
				}else{
					$start_part_id = '';
				}
				$oAccount = $oUser->getAccount($sAID);
				 				$oFolder = $oAccount->getFolder($sFID);
				$oItem = $oFolder->getItem($sIID);
				$oMail->addReferenceItem($oItem);
				if($oItem->item['EVNCLASS']=='F' || $oItem->item['EVNCLASS']=='R' || $oItem->item['EVNCLASS']=='M'){

					 					$aAttachments = $oItem->aAddons['attachment']->getData();
					$gwattachment = reset($aAttachments);
					$file = $oItem->getAttachmentDataFile($gwattachment['ATTNAME'],$info);
					$attachment['name'] = $description?$description:$info['name'];
					$attachment['size'] = $gwattachment['ATTSIZE'];
					$attachment['type'] = $info['mimetype'];
					if($this->bSmartAttach){
						$smart_params['url'] = $oItem->item['TICKET'].'/'.urlencode($gwattachment['ATTNAME']);
						$smart_params['size'] = $attachment['size'];
						$smart_params['zipid'] = $oItem->itemID.'/'.$gwattachment['ATTNAME'];
						$oMail->SmartAttachSourceFolders[$oFolder->folderID] = MerakGWAPI::encode($oFolder->folderID);
					}
					$oMail->addAttachment(
						$file,
						$attachment['type'],
						$attachment['name'],
						"base64",
						false,
						true,
						false,
						$smart_params
					);
					return true;
				}else if ($oFolder->getType()!='M'){	
					if($start_part_id){
						$file = file_get_contents($oItem->getAttachmentDataFile($start_part_id,$info));
					}else{
						$file = $oItem->getItemData($info,$this->sPassPhrase);
					}
					$info['encoding']='base64';
					if($this->bSmartAttach){
						$smart_params['url'] = $oItem->item['TICKET'].'/'.urlencode($info['name']);
						$smart_params['size'] = $info['size'];
						 						$smart_params['zipid'] = $oItem->itemID.'/'.$info['name'];
						$oMail->SmartAttachSourceFolders[$oFolder->folderID] = MerakGWAPI::encode($oFolder->folderID);
					}
				}else{
					if($start_part_id){
						$file = $oItem->getAttachmentData($start_part_id,$info);
					}else{
						$file = $oItem->getItemData($info,$this->sPassPhrase);
					}
				}
				switch ($type)
				{
					case 'normal':
						$oMail->AddStringAttachment(
						  $file, 
						  $description?$description:$info['name'], 
						  'base64', 
						  $info['mimetype'],
						  true,
						  false,
						  $smart_params
						 );
						break;
					default:
						throw new Exc('message_attachment_type', $type);
				}
				break;

				 			case 'gwattachment':
				 			case 'attachment':
			case 'special':
				$public_url = false;
				$oAccount = $oUser->getAccount($attData['account']);
				$oFolder = $oAccount->getFolder($attData['folder']); 
				if(($pos = strpos($attData['item'],'|')) !== false) {
					$start_part_id = substr($attData['item'],$pos+1);
					$item_id = substr($attData['item'],0,$pos);
				}else{
					$item_id = $attData['item'];
				}
				$oItem = $oFolder->getItem($item_id);
				$oMail->addReferenceItem($oItem);
				$file = $oItem->getAttachmentDataFile($attData['part'], $info, $start_part_id);

				if(strtoupper($class)=='GWATTACHMENT' && $this->bSmartAttach){
					$smart_params['url'] = $oItem->item['TICKET'].'/'.urlencode($info['name']);
					$smart_params['size'] = $info['size'];
					$smart_params['zipid'] = $oItem->itemID.'/'.$attData['part'];
					$oMail->SmartAttachSourceFolders[$oFolder->folderID] = MerakGWAPI::encode($oFolder->folderID);
				}
				switch ($type)
				{
					case 'normal':
						$oMail->addAttachment(
							$file, 
							$info['mimetype'], 
							$description?$description:$info['name'], 
							'base64',
							false,
							true,
							false,
							$smart_params
						);
						break;
					case 'embedded':
						$oMail->AddStringAttachment(
						    file_get_contents($file), 
						    $description?$description:$info['name'], 
						    'base64',
							$info['mimetype'], 
							true, 
							$cid
						);

						if($class == 'file' && !$this->sKA){
							slSystem::import('tools/icewarp');
							@slToolsIcewarp::iw_delete($file);
						}

						break;
					default:
						throw new Exc('message_attachment_type', $type);
				}
				break;  			case 'smiley':
				$smileyPath = '../client/skins/default/images/smiles/';
				$oMail->addEmbededAttachment(
					slToolsFilesystem::truepath($smileyPath.$fullpath),
					'image/png',
					$cid,
					basename($fullpath)
				);
			break;
			 			case 'file':
				if (!isset($aAttachments[$attData['folder']][$attData['item']]))
					throw new Exc('message_attachment_existence');
				$aAttachData = $aAttachments[$attData['folder']][$attData['item']];
				Tools::overrideContentType($aAttachData['name'], $aAttachData['type']);
				if (!in_array($attData['folder'], $this->aFolderList))
					$this->aFolderList[] = $attData['folder'];
				if(@filesize($aAttachData['file'])>$_SESSION['UPLOAD_LIMIT']*1024*1024){
					if(!$this->bSmartAttach){
						throw new Exc('attachment_too_large');
					}
				}
				switch ($type)
				{
					case 'normal':
						
						$oMail->addAttachment(
							$aAttachData['file'], 
							$aAttachData['type'], 
							$description?$description:$aAttachData['name'],
							'base64',
							'',
							false,
							$dummy
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
							$description?$description:$aAttachData['name']);
						break;
					default:
						throw new Exc('message_attachment_type', $type);
				}
				break;  		}

	}


	private function addRecipientsToAddressBook()
	{
	 		$gw = new GroupWareManagement();
		$gw->addRecipientsToAddressBook($this->addrList);
	}

	private function execFinalMessageAction(&$oMail)
	{

		$oUser = &$this->session_user;
		$sPrimaryAccountEmail = $_SESSION['EMAIL'];
		$oPrimaryAccount = $oUser->getAccount($sPrimaryAccountEmail);

		$oMail->setSMTPPassword($oUser->getPassword());
		
		if($this->sRFCDate){
			$oMail->RFCDate = $this->sRFCDate;
		}
		
		 		if ($this->sSEmail){
			
			 			if($this->sSMS && !$this->sEncrypt){
				$message_id = $oMail->sendSMS( $this->aSMS, $this->bHTML );
				$this->aData['time'] = null;
				$account = new IceWarpAccount();
				$account->open($_SESSION['EMAIL']);
				$this->aData['sms_send'] = $account->GetProperty("U_SMS_SentThisMonth");
			}
			 			if($this->sTO || $this->sCC || $this->sBCC || $this->oDistribVal){
				 				 				if(strtolower($_SESSION['DBTYPE'])!='sqlite'){
					log_buffer("WebmailIQMessage->execFinalMessageAction(SEND) SESSION WRITE CLOSE","EXTENDED");
					User::closeSession();
				}
				$t = time();
				$m = microtime();
				 				$preparedFile = $oMail->prepareMessageTempFile($this->sCharset);
				
				log_buffer("Mail::prepareMessageTempFile() : lasts :".(time()-$t+microtime()-$m),"EXTENDED");
				
				if($this->sEncrypt){
					$gwManage = new GroupWareManagement();
					$oMail->encrypt();
					foreach($this->smimeRecipients as $rcp){
						
						if ($this->sSign){
							$oMail->sign();
						}
						
						$oMail->overrideRecipient($rcp);
						if($message_id){
							$oMail->message_id = $message_id;
						}
						$recipientCert = $gwManage->getEmailCertificates($rcp);
						$oMail->publicCertificates[strtoupper($rcp)] = $recipientCert;
						if (!($msg = $oMail->sendFromPreparedFile($preparedFile))){
							throw new Exc($msg);
						}
						if(!$message_id){
							$message_id = $oMail->last_message_id;
						}
						$this->aData['time'] = $oMail->time;
					}
				 				}else{
					if ($this->sSign){
						$oMail->sign();
					}
					$t = time();
					$m = microtime();
					 					if (!($msg = $oMail->sendFromPreparedFile($preparedFile))){
						throw new Exc($msg);
					}
					
					log_buffer("Mail::sendFromPreparedFile() : lasts :".(time()-$t+microtime()-$m),"EXTENDED");
					 					$message_id = $oMail->last_message_id;
					$this->aData['time'] = $oMail->time;
				}

				if ($this->bAutoABook){
					 					
					if(strtolower($_SESSION['DBTYPE'])!='sqlite'){
						log_buffer("WebmailIQMessage->execFinalMessageAction(AUTOADDRESSBOOK) RESTORE SESSION","EXTENDED");
						User::restoreSession();
					}
					$this->addRecipientsToAddressBook();
					if(strtolower($_SESSION['DBTYPE'])!='sqlite'){
						log_buffer("WebmailIQMessage->execFinalMessageAction(AUTOADDRESSBOOK) SESSION WRITE CLOSE","EXTENDED");
						User::closeSession();
					}
				}
			}
		}
		
		if($message_id){
			$this->aData['message_id'] = $message_id;
		}

		 		if ($this->bSaveToTeamChat && (!$this->sSave || !$this->isDraft ) ){

			 			$oAccount = $oUser->getAccount($this->sSaveTeamchatAccount);
			if (!is_object($oAccount))
				throw new Exc('message_invalid_account', $this->sSaveTeamchatAccount);
			$oFolder = $oAccount->getFolder($this->sSaveTeamchatFolder);

			if (!is_object($oFolder))
				throw new Exc('message_invalid_folder', $this->sSaveTeamchatFolder);
			
			 			if(!$preparedFile){
				log_buffer("WebmailIQMessage: save prepare message file ".memory_get_usage(),"EXTENDED");
				$preparedFile = $oMail->prepareMessageTempFile($this->sCharset);
			}

			try{
				$oItem = $oFolder->getItem($this->sSaveTeamchatItem);
			}catch(Exc $e){
				$this->sSaveTeamChatItem = false;
			}

			$aItem = array();
			$remove =  false;
			 			if($this->bSaveToTeamChat && (!$this->sSEmail || $this->isDraft) ){
				$aItem['EVNFLAGS'] = 128;
			}else{
				$remove = true;
			}
			
			if(!$this->sSaveTeamchatItem){
				$oItem = null;
				 				$oItem = GroupWareItem::createFromMessage($oFolder,$preparedFile,$this->sTeamChatComment, $oItem, $aItem);
				$this->aData['teamchat_id'] = $oItem->itemID;
			}else{
				$oItem = $oFolder->getItem($this->sSaveTeamchatItem);
				$mailID = $oItem->getFileAttachmentID();
				$oItem->getAddons();
				$oItem->aAddons['attachment']->delete('');
				 				if($remove){
					$aItem['EVNFLAGS'] = $oItem->item['EVNFLAGS'] & ~128;
				}
				 				$oItem = GroupWareItem::createFromMessage($oFolder,$preparedFile,$this->sTeamChatComment,$oItem,$aItem,true);
				$this->aData['teamchat_id'] = $oItem->itemID;
			}
			$this->aData['teamchat_link_id'] = $oItem->linkID;
			$this->aData['teamchat'] = $this->sSaveTeamchatFolder;
		}

		 		if ($this->sSave){
			
			$t = time();
			$m = microtime();
			 			
			if(strtolower($_SESSION['DBTYPE'])!='sqlite'){
				log_buffer("WebmailIQMessage->execFinalMessageAction(SAVE) RESTORE SESSION","EXTENDED");
				User::restoreSession();
			}
			 			 			$oAccount = $oUser->getAccount($this->sSaveAccount);
			if (!is_object($oAccount))
				throw new Exc('message_invalid_account', $this->sSaveAccount);
			$oFolder = $oAccount->getFolderWithAutoCreate($this->sSaveFolder, 'main');

			if (!is_object($oFolder))
				throw new Exc('message_invalid_folder', $this->sSaveFolder);
				
			if (strtolower($_SESSION['DBTYPE'])!='sqlite'){
				log_buffer("WebmailIQMessage->execFinalMessageAction(SAVE) SESSION WRITE CLOSE","EXTENDED");
				User::closeSession();
			}
			 			if (($this->sBCC && $this->aBcc) || $this->bccDlAddrList){
				$bccCount = 0;
				if($this->aBcc){
					foreach($this->aBcc as $bccAddress){
						$aFixedBCC[] = $oMail->AddrFormat(
							array(
								$bccAddress['address'],
								$bccAddress['display']
							)
						);
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
				 				if(!$this->isDraft && $aFixedBCC){
					$sentHeaders[] = 'Bcc: ' . implode(',',$aFixedBCC);
				}
			}
			
			if($this->sSMS){
				 				$sentHeaders[] = 'Sms:'.$this->sSMS;
			}
			
			if($message_id){
				 				if(!$this->isDraft){
					$sentHeaders[] = 'X-Message-ID: '.$message_id;
				}
			}
			
			if($this->sEncrypt){
				if(!$this->sSMS){
					$oMail->encrypt();
				}
			}
			
			if($this->sSign){
				if(!$this->sSMS){
					$oMail->sign();
				}
			}

			if($this->sTeamChatRoom){
				$sentHeaders[] = 'X-IceWarp-TeamChatRoom:'.$this->sTeamChatRoom;
			}
			if($this->sTeamChatComment){
				$sentHeaders[] = 'X-IceWarp-TeamChatComment:'.base64_encode($this->sTeamChatComment);
			}
			
			if(!$preparedFile){
				log_buffer("WebmailIQMessage: save prepare message file ".memory_get_usage(),"EXTENDED");
				$preparedFile = $oMail->prepareMessageTempFile($this->sCharset );
			}
			log_buffer("Mail::prepareMessageTempFile (SAVE)() : lasts :".(time()-$t+microtime()-$m),"EXTENDED");
			
			if($sentHeaders){
					 					$t = time();
					$m = microtime();
					$oMail->addHeadersIntoFile($preparedFile,$sentHeaders);
					log_buffer("Mail::prepareMessageTempFile (SAVE)() : lasts :".(time()-$t+microtime()-$m),"EXTENDED");
			}

			if($this->sSign || $this->sEncrypt){
				$oMail->overrideRecipient($oMail->From);
				$oMail->publicCertificates = slSMime::personalToPublic($oMail->personalCertificates);
				if(!isset($oMail->publicCertificates[strtoupper($oMail->From)])){
					throw new Exc('save_certificate_missing');
				}
				$fp = fopen($preparedFile,'r+');
				$oMail->encryptAndSign($fp,$preparedFile);
				@fclose($fp);
			}
			
			$t = time();
			$m = microtime();
			 			if ($this->sSaveItem)
			{
				 				try{
					 					$oItem = $oFolder->getItem($this->sSaveItem);
					$oItem->edit($preparedFile);
					$oItem->markAsRead(true);
					 				}catch (Exc $e){
					 					$this->aData['itemid'] = $oFolder->createItem(false, $preparedFile);
					$oItem = $oFolder->getItem($this->aData['itemid']);
					$oItem->markAsRead(true);
				}
				$this->aData['itemid'] = $oItem->itemID;
			} else {
				 				$this->aData['itemid'] = $oFolder->createItem(false, $preparedFile);
				
				$oItem = $oFolder->getItem($this->aData['itemid']);
				$oItem->markAsRead(true);
			}
			log_buffer("Mail::SAVE() : lasts :".(time()-$t+microtime()-$m),"EXTENDED");
			
			slSystem::import('tools/icewarp');
			@slToolsIcewarp::iw_delete($preparedFile);	
		}


		

		 		if (!$this->sKA && $this->aFolderList)
		{
			if(strtolower($_SESSION['DBTYPE'])!='sqlite'){
				log_buffer("WebmailIQMessage->execFinalMessageAction(REMOVE ATTACHMENTS) RESTORE SESSION","EXTENDED");
				User::restoreSession();
			}
			 			
			foreach ($this->aFolderList as $folder)
				$oUser->removeAttachments($folder);
			if(strtolower($_SESSION['DBTYPE'])!='sqlite'){
				log_buffer("WebmailIQMessage->execFinalMessageAction(REMOVE ATTACHMENTS) SESSION WRITE CLOSE","EXTENDED");
				User::closeSession();
			}
		}
		 		
	}

	private function dialPhone()
	{
		$api = createobject('api');
		$sPrimaryAccountEmail = $_SESSION['EMAIL'];
		if(!$this->sExternalDevice){
			$api->SIPReferCall($sPrimaryAccountEmail,$this->sPhoneNumber);
		}else{
			$api->SIPReferCall($sPrimaryAccountEmail,$this->sPhoneNumber,$this->sExternalDevice);
		}
	}

}

?>
