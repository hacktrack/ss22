<?php
 
class GroupWareAddon
{
	public $sParentID;
	public $aFolderList;
	public $ticket;
	public $sAddonType;
	public $AddonTypeID;
	public $item;

	protected static $aAddonTypes = array(
		'recurrence' => 0, 
		'reminder' => 1,
		'contact' => 2, 
		'note' => 3, 
		'location' => 4, 
		'phone' => 5, 
		'certificate' => 6,
		'attachment' => 7,
		'xattribute'=>8,
		'revision'=>9,
		'reaction'=>10
	);

	protected static $aAddonTags = array(
		0 => 'recurrences', 
		1 => 'reminders', 
		2 => 'contacts',
		3 => 'notes',
		4 => 'locations',
		5 => 'phones',
		6 => 'certificates',
		7 => 'attachments',
		8=>  'xattributes',
		9=>  'revisions',
		10=> 'reactions'
	);

	protected static $aPrefixes = array(
		0 => 'RCR', 
		1 => 'RMN', 
		2 => 'CNT', 
		3 => 'NOTNOTE',
		4 => 'LCT',
		5 => 'PHN',
		6 => 'CRT',
		7 => '',
		8=>'ATR',
		9=>'RevID',
		10=>'REAOWN'
	);

	protected static $aGetFunctions = array(
		0 => 'GetEventRecurrence', 
		1 => 'geteventreminders', 
		2 => 'geteventcontacts', 
		3 => 'geteventnotetext', 
		4 => 'getcontactlocations', 
		5 => 'getcontactlocationphones', 
		6 => 'getcontactcertificate', 
		7 => 'getattachmentlist',
		8 => 'getitemattributes',
		9 => 'getitemrevisionlist',
		10 => 'geteventreactions'
	);

	protected static $aSetFunctions = array(
		0 => 'addeventrecurrence', 
		1 => 'addeventreminder', 
		2 => 'addeventcontact', 
		3 => 'seteventnotetext', 
		4 => 'addcontactlocation', 
		5 => 'addcontactlocationphone',
		6 => 'setcontactcertificate', 
		7 => 'addattachment',
		8 => 'additemattribute',
		9 => 'additemrevision',
		10=> 'addeventreaction'
	);

	protected static $aRemoveFunctions = array(
		0 => 'deleteeventrecurrence', 
		1 => 'deleteeventreminders', 
		2 => 'deleteeventcontacts', 
		3 => 'seteventnotetext', 
		4 => 'deletecontactlocations',
		5 => 'deletecontactlocationphones',
		6 => 'setcontactcertificate', 
		7 => 'deleteattachments',
		8 => 'deleteitemattribute',
		9 => 'deleteitemrevision',
		10 => 'addeventreaction'
	);

	protected $convertNote = false;

	public function __construct(GroupWareItem &$oItem, $sAddonType, $sParentID = false)
	{
		$this->sParentID = $sParentID;
		$this->sAddonType = $sAddonType;
		$this->AddonTypeID = self::$aAddonTypes[$sAddonType];
		$this->item = &$oItem;
		$this->convertNote = false;
	}

	public function getData($param = null,$ctz = 0)
	{
		
		$oAccount = &$this->item->folder->account;
		
		$sFID = $this->item->folder->openAccess();

		if ($this->sParentID)
			$itemID = $this->sParentID;
		else
			$itemID = $this->item->itemID;
		
		if($this->sAddonType=='revision'){
			$result = $oAccount->gwAPI->FunctionCall(self::$aGetFunctions[$this->AddonTypeID], $sFID, $itemID, true);	
		}else{
			$result = $oAccount->gwAPI->FunctionCall(self::$aGetFunctions[$this->AddonTypeID], $sFID, $itemID, $param);
			
		}

		switch ($this->AddonTypeID) {
			case 3:
				if ($result)
					return array(array('note_text' => $result));
				break;
			case 6:
				if ($result) {
					$array = Storage::parseCertificates($result);
					return $array;
				}
				break;
			default:
				$result = $oAccount->gwAPI->ParseParamLine($result);
				if (isset($result[0])){
					return $result;
				}
				break;

		}

		return false;
	}

	 
	public function create($aData, $sParentID = false,&$currentData = false,$ctz = false)
	{
		if (!$sParentID)
			$sParentID = $this->item->itemID;

		$oAccount = &$this->item->folder->account;

		 		switch ($this->sAddonType) {
			case 'revision':
				$this->createRevision($aData);
                $result = true;
				break;
			case 'attachment':
				return $this->processAttachments($aData);
			case 'note':
				$sParam = Tools::convertLFtoCRLF($aData['note_text']);
				$sFID = $this->item->openAccess();
				$result = $oAccount->gwAPI->FunctionCall(self::$aSetFunctions[$this->AddonTypeID], $sFID, $sParentID, $sParam);
				break;
			case 'certificate':
				$data = true;
				if($currentData===false){
					$data = false;
					$currentData = $this->getData(false,$ctz);
				}
				$cert = Storage::getCertificateData( $oAccount->account->user, $aData );
				unset($cert['pkey']);
				unset($cert['extracerts']);
				$currentData[] = $cert;
				if(!$data){
					$sParam = Storage::certificateListToString($currentData);
					$sFID = $this->item->openAccess();
					if(!($this->item->folder->rights & Folder::RIGHT_WRITE)){
						throw new Exc('E_RIGHTS', MerakGWAPI::getGwErrorMessage(MerakGWAPI::E_RIGHTS));
					}

					$result = $oAccount->gwAPI->FunctionCall(
						self::$aSetFunctions[$this->AddonTypeID], 
						$sFID, 
						$sParentID, 
						$sParam
					);
				}else{
                    $result = false;
                }
				if(empty($result)){
					$error = $oAccount->gwAPI->FunctionCall("GetLastError", $oAccount->sGWSessionID);
					throw new Exc(MerakGWAPI::getGwError($error), MerakGWAPI::getGwErrorMessage($error));
				}
				break;
			case 'recurrence':
				$sParam = $oAccount->gwAPI->CreateParamLine($aData);
				$sFID = $this->item->openAccess();
				$result = $oAccount->gwAPI->FunctionCall(
					self::$aSetFunctions[$this->AddonTypeID], 
					$sFID, 
					$sParentID, 
					$sParam
				);
				if($result){
					$this->item->item['EVNRCR_ID'] = $result;
				}
				break;
			case 'contact':
				 				$email = $aData['cntemail'];
				if($email && $email!='__@@groupchat@@__' && !slIOVariable::isEmail($email)){
					throw new Exc('attendee_email_invalid',$email.'|'.$this->item->itemID);
				}
				$sParam = $oAccount->gwAPI->CreateParamLine($aData);
				$sFID = $this->item->openAccess();
				$result = $oAccount->gwAPI->FunctionCall(
					self::$aSetFunctions[$this->AddonTypeID], 
					$sFID, 
					$sParentID, 
					$sParam
				);
				break;
			case 'xattribute':
				$atrValue = null;
				$atrType = null;
				if(isset($aData['atrtype'])){
					$atrType = $aData['atrtype'];
					unset($aData['atrtype']);
				}
				if(isset($aData['atrvalue'])){
					$atrValue = $aData['atrvalue'];
					unset($aData['atrvalue']);
				}
				$sParam = $oAccount->gwAPI->CreateParamLine($aData);
				$sFID = $this->item->openAccess();
				$result = $oAccount->gwAPI->FunctionCall(
					self::$aSetFunctions[$this->AddonTypeID], 
					$sFID, 
					$sParentID, 
					$atrValue,
					'AtrType='.urlencode($atrType)
				);
				break;
			default:
				$sParam = $oAccount->gwAPI->CreateParamLine($aData);
				$sFID = $this->item->openAccess();
				$result = $oAccount->gwAPI->FunctionCall(
					self::$aSetFunctions[$this->AddonTypeID], 
					$sFID, 
					$sParentID, 
					$sParam
				);
				break;
		}
		return $result;

	}


	 
	protected function processAttachments($aData)
	{
		$result = [];
		$attData = Tools::parseFullPath($aData['fullpath'], $aData['class']);
		$attID = null;
		 		switch ($aData['class']) {
			case 'file':
				$attachItems = $_SESSION['user']->getAttachments($attData['folder']);
				$attachItem = $attachItems[$attData['item']];
				$attID = $this->attachFile(
					$attachItem['file'], 
					$attachItem['name'], 
					$attachItem['type'],
					'', 
					isset($aData['AttType'])?$aData['AttType']:'F',
					$aData['description']
				);
				$result['size'] = filesize($attachItem['file']);
				$result['type'] = $attachItem['type'];
				 				$this->aFolderList[$attData['folder']] = 1;
				break;
			case 'item':
				$attID = $this->attachItem($attData['account'], $attData['folder'], $attData['item'], $aData['description'],$result['type'],$result['size']);
				break;
			case 'file_attachment':
				$attID = $this->attachFileAttachment($attData['account'], $attData['folder'], $attData['item'],
					$aData['description'], $result['type'], $result['size']);
				break;
			case 'attachment':
				 
				$attID = $this->attachAttachment($attData['account'], $attData['folder'], $attData['item'],
					$attData['part'], $aData['description'], $result['type'],$result['size']);
				break;
			case 'itemlink':
				$attID = $this->attachItemLink($attData['account'], $attData['folder'], $attData['item'],
					$aData['description']);
				break;
			case 'image':
				$attachItems = $_SESSION['user']->getAttachments($attData['folder']);
				$attachItem = $attachItems[$attData['item']];
				$attID = $this->attachFile($attachItem['file'], $attachItem['name'], $attachItem['type'],
					'', 'P',$aData['description']);

				 				$this->aFolderList[$attData['folder']] = 1;
				break;
			case 'document':
				$mimetypes = array(
				'txt'=>'text/plain',
				'html'=>'text/html',
				'htm'=>'text/html',
				'pptx'=>'application/vnd.openxmlformats-officedocument.presentationml.presentation',
				'xlsx'=>'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'docx'=>'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
				);
				$attachItem['AttDesc'] = $aData['description'];
				$attachItem['AttName'] = $aData['description'];
				$attachItem['AttType'] = 'F';
				$attachItem['AttTime'] = time();
				$ext = substr($aData['description'],strrpos($aData['description'],'.')+1);
				$ext = strtolower($ext);
				$mimetype = $mimetypes[$ext];
				$attachItem['AttParams'] = Tools::createURL(array('mimetype' => $mimetype));
				switch($ext){
					case 'pptx':
					case 'xlsx':
					case 'docx':
						$template = $this->getBlankDocumentFile($_SESSION['LANGUAGE'],$ext);
						$size = filesize($template);
						$attachItem['AttSize'] = $size;
						$attID = $this->addAttachment($attachItem, false,false,'',$template);
						$this->item->edit(array('evncomplete'=>$size),array(),false,false,false);
						break;
					default:
						$attachItem['AttSize'] = 0;
						
						$attID = $this->addAttachment($attachItem,'');
						$this->item->edit(array('evncomplete'=>0),array(),false,false,false);
						break;
				}
				$result['size'] = $attachItem['AttSize'];
				$result['type'] = $mimetype;
				break;
			case 'url':
				$attID = $this->attachURL($aData['description'],$aData['fullpath'],$aData['size']);
				break;
		}
		if(isset($result['size']) && ($this->item->folder->getType()=='I' || $this->item->folder->getType()=='F')) {
			$this->item->edit(array('evncomplete'=>$result['size']),array(),false,false,false);
		}
		$result['id'] = $attID;
		return $result;
	}

	public function getBlankDocumentFile($language, $ext)
	{
		$root = getcwd().'/inc/templates/document/';
		if(file_exists($root.$language.'/new.'.$ext)){
			$template = $root.$language.'/new.'.$ext;
		}else{
			$template = $root.'default/new.'.$ext;
		}
		return $template;
	}

	 
	public function delete($sAID, $sParentID = false,&$currentData = false)
	{
		if (!$sParentID){
			$sParentID = $this->item->itemID;
		}
		$oAccount = &$this->item->folder->account;
		switch ($this->sAddonType) {
			case 'certificate':
				$data = true;
				if($currentData===false){
					$data = false;
					$currentData = $this->getData();
				}
				unset($currentData[$sAID]);
				if(!$data){
                    $sFID = $this->item->openAccess();
					$sParam = Storage::certificateListToString($currentData);
					$result = $oAccount->gwAPI->FunctionCall(self::$aSetFunctions[$this->AddonTypeID], $sFID, $sParentID, $sParam);
				}else{
                    $result = false;
                }

			break;
				 			case 'note':
			case 'recurrence':
				$sAID = '';
				$sFID = $this->item->openAccess();
				$result = $oAccount->gwAPI->FunctionCall(
					self::$aRemoveFunctions[$this->AddonTypeID],
					$sFID,
					$sParentID,
					$sAID
				);
			break;
			case 'reaction':
				$sFID = $this->item->openAccess();
				$result = $oAccount->gwAPI->FunctionCall(
					'AddEventReaction',
					$sFID,
					$sParentID,
					'reaction='
				);				
				break;
			case 'attachment':
                $data = array();
				if($currentData){
					foreach($currentData as $attachment){
						if($attachment['ATTNAME']==$sAID){
							$data = $attachment;
						}
					}
				}
				if($data['ATTTYPE']=='P'){
					$avatarFile = $_SESSION['CONFIGPATH'].'_webmail/photo/'.$_SESSION['EMAIL'].'.jpg';
					$avatarFileXML = $_SESSION['CONFIGPATH'].'_webmail/photo/'.$_SESSION['EMAIL'].'.xml';
					if(file_exists($avatarFile)){
						unlink($avatarFile);
					}
					if(file_exists($avatarFileXML)){
						unlink($avatarFileXML);
					}
				}

			default:
				$sFID = $this->item->openAccess();
				$result = $oAccount->gwAPI->FunctionCall(
					self::$aRemoveFunctions[$this->AddonTypeID],
					$sFID,
					$sParentID,
					$sAID
				);
			break;
		}
		return $result;
	}

	 
	public function edit($aData, $sAid, $sParentID = false,&$aCurrentData = false,$ctz = false)
	{
		if (!$sParentID)
			$sParentID = $this->item->itemID;
		$oAccount = &$this->item->folder->account;
		switch($this->sAddonType){
			case 'revision':
				$result = $this->editRevision($aData,$sAid);
				break;
			case 'certificate':
                $sFID = $this->item->openAccess();
				$data = true;
				if($aCurrentData===false){
					$data = false;
					$aCurrentData = $this->getData(false,$ctz);
				}
				$cert = Storage::getCertificateData( $oAccount->account->user, $aData );
				unset($cert['pkey']);
				unset($cert['extracerts']);
				$aCurrentData[$sAid] = $cert;
				if(!$data){
					$sParam = Storage::certificateListToString($aCurrentData);
					$result = $oAccount->gwAPI->FunctionCall(
						self::$aSetFunctions[$this->AddonTypeID], 
						$sFID, 
						$sParentID, 
						$sParam
					);
				}else{
                    $result = false;
                }
			break;
			case 'attachment':
				$result = $this->editAttachment($sAid,$aData);
			break;
			case 'reminder':
				$oAccount->gwAPI->TZClearCache();
				$sFID = $this->item->openAccess();
				$result = true;
				if ($aData) {
					$aData = $oAccount->gwAPI->CreateParamLine($aData);
					$result = $oAccount->gwAPI->FunctionCall(
						self::$aSetFunctions[$this->AddonTypeID], 
						$sFID, 
						$sParentID, 
						$aData, 
						$sAid
					);
				}
			break;
			case 'contact':
				 				$email = $aData['cntemail'];
				if($email && !slIOVariable::isEmail($email)){
					throw new Exc('attendee_email_invalid',$email.'|'.$this->item->itemID);
				}
				$sFID = $this->item->openAccess();
				$result = true;
				if ($aData) {
					$aData = $oAccount->gwAPI->CreateParamLine($aData);
					$result = $oAccount->gwAPI->FunctionCall(
						self::$aSetFunctions[$this->AddonTypeID], 
						$sFID, 
						$sParentID, 
						$aData, 
						$sAid
					);
				}
				break;
			default:
				$sFID = $this->item->openAccess();
				$result = true;
				if ($aData) {
					$aData = $oAccount->gwAPI->CreateParamLine($aData);
					$result = $oAccount->gwAPI->FunctionCall(
						self::$aSetFunctions[$this->AddonTypeID], 
						$sFID, 
						$sParentID, 
						$aData, 
						$sAid
					);
				}
			break;
		}
		return $result;
	}


	public function process($aTreeItem)
	{
		$fileDataSet = false;
		$fileData = '';
		if(($this->item->folder->getType()=='F' || $this->item->folder->getType()=='I') && isset($aTreeItem['@childnodes']['values'][0]['@childnodes']['data'][0]['@value'])){
			$fileData = $aTreeItem['@childnodes']['values'][0]['@childnodes']['data'][0]['@value'];
			$fileData = slToolsString::lf2crlf($fileData);
			$fileDataSet = true;
		}
		 		$this->aFolderList = array();

		$aSentData = $this->getSentData($aTreeItem);
		
		 		$dl = $this->sAddonType == 'location' && ($this->item->item['ITMCLASS'] == 'L');
		$counter = 0;
		$ctz = $aTreeItem['@childnodes']['values'][0]['@childnodes']['ctz'][0]['@value'];
        $result = false;
		if ($aSentData){
			if($this->sAddonType=='certificate'){
				$currentData = $this->getData();
			}else{
				$currentData = false;
			}
			foreach ($aSentData as $aData) {
				switch ($aData['action']) {
					 					case 'add':
						 						if ($dl) {
							if ($counter)
								$aData['data']['lcttype'] = 'L';
							$counter++;
						}
						$result = $this->create($aData['data'],false,$currentData,$ctz);
						break;
						
					 					case 'edit':
						$result = $this->edit( $aData['data'], $aData['id'], false, $currentData, $ctz );
						break;

					 					case 'delete':
						if($this->item->folder->name=='@@mycard@@'){
							$currentData = $this->getData();							
						}
						$result = $this->delete( $aData['id'],false, $currentData );
						break;
				}

			}
		}else{
            $currentData = false;
        }

		 		if ($dl) {
			 			$aLocations = $this->getData('LCTTYPE=\'O\'');
			 			if (!$aLocations)
				$aLocations = $this->getData();
			$counter = 0;
			if ($aLocations)
				foreach ($aLocations as $location) {
					 					if (!$counter)
						$lcttype = 'O';
					else
						$lcttype = 'L';
					 					if ($location['LCTTYPE'] != $lcttype) {
						$location['LCTTYPE'] = $lcttype;
						$this->edit($location, $location['LCT_ID']);
					}
					$counter++;
				}
		}
		if($fileDataSet && ($this->item->folder->getType()=='F' || $this->item->folder->getType()=='I') && $this->sAddonType=='attachment'){
			$data = $this->getData();
			if(is_array($data) && !empty($data)){
                $attachment = reset($data);
                $name =  $attachment['ATTDESC']? $attachment['ATTDESC']:$attachment['ATTNAME'];
                $ext = substr($name,strrpos($name,'.')+1);
                $newData['class'] = 'raw';
                $newData['fullpath'] = $fileData;
                $result = true;
                switch(strtolower($ext)){
                    case 'txt':
                    case 'htm':
                    case 'html':
                    	$result = $this->editAttachment($attachment['ATTNAME'],$newData);
                        break;
                }
            }
		}
		if($this->sAddonType=='certificate' && $aSentData){
			$data = Storage::certificateListToString($currentData);
			$sParentID = $this->item->itemID;
			$oAccount = &$this->item->folder->account;
			$sFID = $this->item->openAccess();
			$result = $oAccount->gwAPI->FunctionCall(
				self::$aSetFunctions[$this->AddonTypeID], 
				$sFID, 
				$sParentID, 
				$data
			);
		}
        return $result;
	}

	 
	public function load()
	{

	}

	 
	public function getSentData($aTreeItem)
	{
		$result = array();
		$node = $aTreeItem['@childnodes'][self::$aAddonTags[$this->AddonTypeID]][0]['@childnodes'][$this->sAddonType];
		if ($node)
			foreach ($node as $key => $addon) {
				$addondata = array();
				 				if ($sAddonID = $addon['@attributes']['uid']) {
					 					if ($addon['@childnodes']['values'])
						$result[$key]['action'] = 'edit';
					 					else
						$result[$key]['action'] = 'delete';

					$result[$key]['id'] = $sAddonID;
					 				} else {
					$result[$key]['action'] = 'add';
				}

				if ($addon['@childnodes']['values']) {
					foreach ($addon['@childnodes']['values'][0]['@childnodes'] as $variable => $value)
						$addondata[$variable] = $value[0]['@value'];
					$result[$key]['data'] = $addondata;
				}

			}
		 

		return $result;
	}


	 
	public function getXML($ctz = 0)
	{
		$data = $this->getData(null,$ctz);

		 		if (($data[0]['note_text'] ?? false) && true === $this->convertNote) {
			if ($this->isFormatHtml($this->item->item['EVNDESCFORMAT'])) {
				$data[0]['note_text'] = slToolsString::purifyHTML($data[0]['note_text'], Tools::externalResourcesEnabled());
			}
			elseif ($this->isFormatPlainText($this->item->item['EVNDESCFORMAT'])) {
				$data[0]['note_text'] = slToolsString::textLinksToHTML($data[0]['note_text']);
			}
		}

		 		if (false === $data && true === $this->convertNote) {
			if ($this->isFormatHtml($this->item->item['EVNDESCFORMAT'])) {
				$this->item->item['EVNNOTE'] = slToolsString::purifyHTML($this->item->item['EVNNOTE'], Tools::externalResourcesEnabled());
			}
		}

		 		if (false === $data && true === $this->convertNote) {
			if ($this->isFormatHtml($this->item->item['ITMDESCFORMAT'])) {
				$this->item->item['ITMDESCRIPTION'] = slToolsString::purifyHTML($this->item->item['ITMDESCRIPTION'], Tools::externalResourcesEnabled());
			}
		}

		$sReturn = '';
		if ($data)
			foreach ($data as $item) {
				 				if ($this->sAddonType == 'attachment') {
					switch ($item['ATTTYPE']) {
						case 'T':
							$item['ATTTYPE'] = 'thumbnail';
							break;
						case 'D':
							$item['ATTTYPE'] = 'pdf';
							break;
						case 'I':
							$item['ATTTYPE'] = 'itemlink';
							break;
						case 'U':
							$item['ATTTYPE'] = 'url';
							break;
						case 'P':
							$item['ATTTYPE'] = 'P';
							break;
						case 'F':
						default:
							$item['ATTTYPE'] = 'attachment';
							break;
					}
					$item['TICKET'] = $this->getAttachmentFile($item['ATTNAME'],'TICKET');
					if(!$this->ticket){
						$this->ticket = $item['TICKET'];
					}
					if(!$this->inviteTicket){
						$item['INVITETICKET'] = $this->getAttachmentFile($item['ATTNAME'],'INVITETICKET');
						$this->inviteTicket = $item['INVITETICKET'];
					}	
					if($this->item->folder->getType()=='F' && $this->item->item['EVNCOMPLETE']==0){
						$this->item->edit(array('evncomplete'=>$item['ATTSIZE']),array(),false,false,false);
					}
					@$sID = slToolsPHP::htmlspecialchars($item['ATTNAME']);
				} else if ($this->sAddonType=='revision'){
					$sID = $item['REVID'];
				} else {
					$sID = $item[self::$aPrefixes[$this->AddonTypeID] . '_ID'];
				}
				if($this->sAddonType == 'certificate'){
					$sID = $item['id'];
				}
				$sStart = '<' . $this->sAddonType . '' . ($sID ? (' uid="' . $sID . '"') : ('')) .'>';
				if($this->sAddonType == 'certificate'){
					$sValue = '<info>'.slToolsPHP::htmlspecialchars(Storage::certInfo2XML($item['ainfo'])).'</info>';
				}else{
					$sValue = Tools::makeXMLTags($item);
				}
				$sEnd = '</' . $this->sAddonType . '>';
				$sValue = '<values>' . $sValue . '</values>';
				$sReturn .= $sStart . $sValue . $sEnd;
			}

		if ($sReturn !== '') {
			$sReturn = '<' . self::$aAddonTags[$this->AddonTypeID] . '>' . $sReturn . '</' .
				self::$aAddonTags[$this->AddonTypeID] . '>';
		}

		return $sReturn;
	}

	 
	protected function isExternalResourceEnabled() {
		if (isset($_SESSION['clientSettings']) && isset($_SESSION['clientSettings']['show_inline_images']) && true === $_SESSION['clientSettings']['show_inline_images']) {
			return true;
		}
		return false;
	}

	 
	protected function isFormatPlainText($evnDescFormat) {
		return strtolower($evnDescFormat) === 'text/plain';
	}

	 
	protected function isFormatHtml($evnDescFormat) {
		return strtolower($evnDescFormat) === 'text/html';
	}

	 
	public function enableConvertNote() {
		$this->convertNote = true;
	}

	public function getAttachment($name)
	{
		$oFolder = &$this->item->folder;
		$oAccount = &$oFolder->account;

		$sFID = $this->item->openAccess();
		
		$result = $oAccount->gwAPI->FunctionCall("GetAttachment", $sFID, $this->item->
			itemID, $name);
			
		return $result;

	}

	public function getAttachmentFile($name,$method = '',$atttype='')
	{
		$oFolder = &$this->item->folder;
		$oAccount = &$oFolder->account;
		$sFID = $this->item->openAccess();
		if($atttype){
			$name = '';
			$method.='&AttType='.$atttype;
		}
		$result = $oAccount->gwAPI->FunctionCall("GetAttachmentPathLocal", $sFID, $this->
			item->itemID, $name, $method );

		return $result;
	}

	public function getGroupAttachment($class, $folderName, $id)
	{
		$oFolder = &$this->item->folder;
		$oAccount = &$oFolder->account;
		$oAttachFolder = $oAccount->getFolder($folderName);
		$fid = $oAttachFolder->openAccess();

		if ($class == 'C') {
			$item = $oAccount->gwAPI->FunctionCall("getcontactinfo", $fid, $id);
		} else {
			$item = $oAccount->gwAPI->FunctionCall("geteventinfo", $fid, $id);
		}
		$item = $oAccount->gwAPI->ParseParamLine($item);
		$item = $item[0];

		$owner = $_SESSION['EMAIL'];

		$return['account'] = $owner;
		$return['folder'] = $folderName;
		$return['item'] = $id;

		return $return;
	}

	public function addAttachment($param, $value, $objectID = false, $sFID = '', $file = false)
	{
		$oFolder = &$this->item->folder;
		$oAccount = &$oFolder->account;

		if (!$sFID)
			$sFID = $this->item->openAccess();
		if (!$objectID)
			$objectID = $this->item->itemID;

		 		$attName = $param['AttDesc']?$param['AttDesc']:$param['AttName'];
		 		if($file || !$value){
			$param['AttSkipValue'] = 1;
		}
		$param = $oAccount->gwAPI->CreateParamLine($param);
		
		if ($sNewId = $oAccount->gwAPI->FunctionCall("AddAttachment", $sFID, $objectID,
			$param, $value ? $value : '')) {
			if ($file) {
				$path = $oAccount->gwAPI->FunctionCall("GetAttachmentPathLocal", $sFID, $objectID, $sNewId, 'LOCK');
				slSystem::import('tools/icewarp');
				log_buffer("Copying $file to $path size: ".filesize($file),"EXTENDED");
				slToolsIcewarp::iw_copy($file, $path);
				if(!$oAccount->gwAPI->FunctionCall("GetAttachmentPathLocal", $sFID, $objectID, $sNewId, 'UNLOCK')){
					$lastError = $oAccount->gwAPI->FunctionCall("GetLastError",$oAccount->gwAPI->sessid);
					$oAccount->gwAPI->FunctionCall("DeleteAttachments",$sFID, $objectID, $sNewId);
					throw new Exc('attachment_add', $lastError.'|'.$objectID.'|'.$attName);
				}
			}
		} else {
			$lastError = $oAccount->gwAPI->FunctionCall("GetLastError",$oAccount->gwAPI->sessid);
			throw new Exc('attachment_add',$lastError.'|'.$objectID.'|'.$attName);
		}
        return $sNewId;
	}

	public function editAttachment($addonID, $aData, $objectID = false,$sFID = '')
	{
		$oFolder = &$this->item->folder;
		$oAccount = &$oFolder->account;
		if (!$sFID)
			$sFID = $this->item->openAccess();
		if (!$objectID)
			$objectID = $this->item->itemID;

		if((isset($aData['fullpath']) && $aData['class']) || $aData['class']=='document'){
			$attData = Tools::parseFullPath($aData['fullpath'], $aData['class']);
			switch($aData['class']){
				case 'document':
					 					$this->delete("");
					$attachItem['AttName'] = $aData['description'];
					$attachItem['AttDesc'] = $aData['description'];
					$attachItem['AttType'] = 'F';
					$attachItem['AttTime'] = time();
					$ext = substr($aData['description'],strrpos($aData['description'],'.')+1);
					$size = 0;
					switch($ext){
						case 'pptx':
						case 'xlsx':
						case 'docx':
							$template = $template = $this->getBlankDocumentFile($_SESSION['LANGUAGE'],$ext);
							$size = filesize($template);
							$attachItem['AttSize'] = $size;
							$result = $this->addAttachment($attachItem, false,false,'',$template);
							
							break;
						case 'html':
						case 'htm':
							$attachItem['AttParams'] = Tools::createURL(array('mimetype' => 'text/html'));
							$attachItem['AttSize'] = 0;
							$result = $this->addAttachment($attachItem,false);
							$size = 0;
							break;
						case 'text':
							$attachItem['AttParams'] = Tools::createURL(array('mimetype' => 'text/plain'));
							$attachItem['AttSize'] = 0;
							$result = $this->addAttachment($attachItem,false);
							$size = 0;
							break;
					}
					$result = $this->item->edit(array('evncomplete'=>$size),array(),false,false,false);
					break;
				case 'raw':
					$param['AttName'] = $addonID;
					$content = $aData['fullpath'];
					$param['AttSize'] = strlen($content);
					$param['AttTime'] = time();
					if($aData['description']){
						$param['AttDesc'] = $aData['description'];
					}
					$result = $this->addAttachment($param,$content,$objectID,$sFID);
					break;
				case 'file':
					$this->delete("");
					 					$param['AttName'] = $aData['description'];
					$attachItems = $_SESSION['user']->getAttachments($attData['folder']);
					$attachItem = $attachItems[$attData['item']];
					$file = $attachItem['file'];
					$param['AttType'] = 'F';
					$param['AttDesc'] = $aData['description'];
					$param['AttSize'] = filesize($file);
					$param['AttTime'] = time();
					$param['AttParams'] = Tools::createURL(array('mimetype' => $attachItem['type']));
					if (!is_file($file)) {
						throw new Exc('attachment_file_not_found', 'file_missing|'.$this->item->itemID);
					}
					$result = $this->addAttachment($param,false,$objectID,$sFID,$file);
				break;
                default:
                    $result = false;
                    break;
			}
		}else if ($aData['description'] || $aData['convert']){
			
			$param['AttName'] = $addonID;
			$param['AttSkipValue'] = 1;
			
			if($aData['description']){
				$param['AttRename'] = $aData['description'];
				$param['AttDesc'] = $aData['description'];
			}
			if($aData['convert']){
				$current = $this->getData();
                $convertName = '';
				foreach($current as $val){
					if($val['ATTNAME'] == $addonID){
						$convertName = $val['ATTDESC'].'.html';
					}
				}
				$param['AttConvertName'] =$convertName;
			}
			$result = $this->addAttachment($param,false,$objectID,$sFID,false);
		}else{
            $result = false;
        }
		return $result;
	}

	public function attachFile($path, $filename, $mimeType, $fcontent = '', $attType =
		'F',$description = '')
	{
		$oAccount = &$this->item->folder->account;
		if ($fcontent) {
			$path = false;
		} else {
			if (!is_file($path)) {
				throw new Exc('attachment_file_not_found', 'file_missing|'.$this->item->itemID);
			}
		}
		$now = time();
		$dot = strrpos($filename, '.');
		$md5 = '~' . substr(md5(mt_rand() . $now), 0, 4);
		if ($dot === false) {
			$attName = $filename . $md5;
		} else {
			$attName = substr($filename, 0, $dot) . $md5 . substr($filename, $dot);
		}
		$attName = $filename;
		$param['AttName'] = $description?$description:$attName;
		$param['AttType'] = $attType;
		$param['AttDesc'] = $description?$description:$filename;
		$param['AttSize'] = filesize($path);
		$param['AttTime'] = $now;
		$param['AttParams'] = Tools::createURL(array('mimetype' => $mimeType));

		return $this->addAttachment($param, false, false, '', $path);
	}

	
	public function attachURL($description, $link, $size = 0)
	{
		
		$attachItem['AttDesc'] = $description;
		$attachItem['AttName'] = $description;
		$attachItem['AttType'] = 'U';
		$attachItem['AttTime'] = time();
		if($size){
			$attachItem['AttSize'] = $size;
		}
		return $this->addAttachment($attachItem,$link);
	}

	public function attachItemLink($account, $folder, $item, $description)
	{
		$oAccount = &$this->item->folder->account;
		$attAccount = $_SESSION['user']->getAccount($account);
		$attFolder = $attAccount->getFolder($folder);
		$attItem = $attFolder->getItem($item);

		 		if ($attFolder->gw) {
			$value = $attFolder->getType() . ':' . $attFolder->name . ':' . $attItem->itemID;
			 		} else {
			 			throw new Exc('not_implemented');
		}

		$now = time();
		$param = array();
		$info = [];
		 		if ($attFolder->gw) {
			if((string) $attItem->item['EVNCLASS'] == 'F' || (string) $attItem->item['EVNCLASS'] == 'M'){
				$addons  = $attItem->getAddons();
				$attachment = $addons['attachment'];
				$data = $attachment->getData();
				@$data = reset($data);
				$file = $attachment->getAttachmentFile($data['ATTNAME']);
				$size = filesize($file);
				$ext = substr($data['ATTNAME'],strrpos($data['ATTNAME'],'.'));
				$mimeType = Tools::parseURL($data['ATTPARAMS']);
				$mimeType = (string) $mimeType['mimetype'];
			}else{
				$value = $attItem->getVersitObject($info);
				$size = strlen($value);
				$file = Tools::randomFilename();
				slSystem::import('tools/icewarp');
				slToolsIcewarp::iw_file_put_contents($file,$value);
				$ext = (string) $info['fileext'];
				$mimeType = (string) $info['mimetype'];
			}
		 		} else {
			$file = $attItem->getMessageFile();
			if(!file_exists($file)){
				$attItem->autoCreateMessage($file);
			}
			$size = filesize($file);
			$ext = '.eml';
			$mimeType =  'message/rfc822';
		}
		$param['AttName'] = $description ? $description . $ext : md5($attItem->itemID . $now);
		$param['AttType'] = 'I';
		$param['AttDesc'] = $description;
		$param['AttSize'] = 0;
		$param['AttTime'] = $now;
		$param['AttParams'] = Tools::createURL(array('mimetype' => $mimeType));

		return $this->addAttachment($param, $value);
	}

	public function attachItem($account, $folder, $item, $description, &$mimeType = '',&$size = '')
	{
		$oAccount = &$this->item->folder->account;
		$attAccount = $_SESSION['user']->getAccount($account);
		$attFolder = $attAccount->getFolder($folder);
		$attItem = $attFolder->getItem($item);
        $info = array();
		 		if ($attFolder->gw) {
			if((string) $attItem->item['EVNCLASS'] == 'F' || (string) $attItem->item['EVNCLASS'] == 'M'){
				$addons  = $attItem->getAddons();
				$attachment = $addons['attachment'];
				$data = $attachment->getData();
				@$data = reset($data);
				$file = $attachment->getAttachmentFile($data['ATTNAME']);
				$size = filesize($file);
				$ext = substr($data['ATTNAME'],strrpos($data['ATTNAME'],'.'));
				$mimeType = Tools::parseURL($data['ATTPARAMS']);
				$mimeType = (string) $mimeType['mimetype'];
			}else{
				$value = $attItem->getVersitObject($info);
				$size = strlen($value);
				$file = Tools::randomFilename();
				slSystem::import('tools/icewarp');
				slToolsIcewarp::iw_file_put_contents($file,$value);
				$ext = (string) $info['fileext'];
				$mimeType = (string) $info['mimetype'];
			}
		 		} else {
			$file = $attItem->getMessageFile();
			if(!file_exists($file)){
				$attItem->autoCreateMessage($file);
			}
			$size = filesize($file);
			$ext = '.eml';
			$mimeType =  'message/rfc822';
		}

		 		if(preg_match("/\\".$ext."$/i",$description)){
			$ext = '';
		}
		$now = time();
		$param = array();
		$param['AttName'] = $description ? $description . $ext : md5($attItem->itemID . $now);
		$param['AttType'] = 'F';
		$param['AttDesc'] = $description . $ext;
		$param['AttSize'] = $size;
		$param['AttTime'] = $now;
		$param['AttParams'] = Tools::createURL(array('mimetype' => $mimeType));

		return $this->addAttachment($param, false,false,'',$file);
	}

	public function attachAttachment($account, $folder, $item, $partid, $description = false, &$mimeType = '',&$size = '')
	{
		$oAccount = &$this->item->folder->account;
		$attAccount = $_SESSION['user']->getAccount($account);
		$attFolder = $attAccount->getFolder($folder);
		$attItem = $attFolder->getItem($item);
        $info = array();
		$file = $attItem->getAttachmentDataFile($partid, $info);
		$now = time();
		$param = array();
		$param['AttName'] = $info['name'];
		$param['AttType'] = 'F';
		$param['AttSize'] = filesize($file);
		$param['AttTime'] = $now;
		$param['AttParams'] = Tools::createURL(array('mimetype' => $info['mimetype']));
		$mimeType = $info['mimetype'];
		$size = $param['AttSize'];

		if ($description)
			$param['AttDesc'] = $description;

		return $this->addAttachment($param, false,false,'',$file);
	}

	public function attachFileAttachment($account, $folder, $item, $description = '', &$mimeType = '',&$size = '')
	{
		$oAccount = &$this->item->folder->account;
		$attAccount = $_SESSION['user']->getAccount($account);
		$attFolder = $attAccount->getFolder($folder);
		$attItem = $attFolder->getItem($item);
		$partid = $attItem->getFileAttachmentID();
        $info = array();
		$file = $attItem->getAttachmentDataFile($partid, $info);
		$now = time();
		$param = array();
		$param['AttName'] = $info['name'];
		$param['AttType'] = 'F';
		$size = $param['AttSize'] = filesize($file);
		$param['AttTime'] = $now;
		$param['AttParams'] = Tools::createURL(array('mimetype' => $info['mimetype']));
		$mimeType = $info['mimetype'];

		if ($description)
			$param['AttDesc'] = $description;

		return $this->addAttachment($param, false,false,'',$file);
	}


	 
	public function createRevision($params)
	{
		$sFID = $this->item->openAccess();
		$oGWAPI = &$this->item->folder->account->gwAPI;
		
		$params = $oGWAPI->CreateURLLIne($params);
		if(($revisionId = $oGWAPI->FunctionCall('CreateRevision', $sFID, $this->item->itemID, $params)) == ''){
			throw new Exc('item_add_revision');
		}
		return $revisionId;
	}

	public function editRevision($params,$revID = false)
	{
		$sFID = $this->item->openAccess();
		$oGWAPI = &$this->item->folder->account->gwAPI;
		
		$params = $oGWAPI->CreateURLLIne($params);
		if(!$result = $oGWAPI->FunctionCall(
				'EditItemRevision',
				$sFID,
				$this->item->itemID, 
				$revID, 
				$params)){
			throw new Exc('item_edit_revision');
		}
        return $result;
		
	}
	
	protected function addGroupChatContacts($data,$ctz)
	{
		$oFolder = $this->item->folder->account->account->GetFolder('__@@GROUP@@__/'.MerakGWAPI::decode($this->item->folder->name));
		$oItems = $oFolder->getItems(array('noexpand'=>true));
		
		         $aContacts = array();
		if($oItems){
			foreach($oItems as $oItem){
				if($oItem->rights & Folder::RIGHT_READ){
					$aContacts[$oItem->email]['email'] = $oItem->email; 
					$aContacts[$oItem->email]['name'] = $oItem->name;
				}
			}
		}
		 		if(!empty($aContacts)){
			foreach($aContacts as $aContact){
				$data['cntemail'] = trim($aContact['email'],'[]');
				$data['cntcontactname'] = $aContact['name'];
				$this->create($data,false,$currentData,$ctz);
			}
		}
	}

}
?>
