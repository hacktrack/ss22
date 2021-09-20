<?php

 
class WebmailIqItems extends XMLRequestInterface 
{
	public  $sAction;
	public  $isError = false;
	 
	public  $oFolder;
	 	private $aActions = array(
		'edit' => 1,
		'delete' => 1,
		'add' => 1,
		'attachments' => 1,
		'move' => 1,
		'copy' => 1,
		'blacklist' => 1,
		'whitelist' => 1,
		'deliver' => 1,
		'redirect' => 1,
		'search' => 1,
		'accept' => 1,
		'decline' => 1,
		'tentative' => 1,
		'propose' => 1,
		'accept_counter' => 1,
		'decline_counter' => 1,
		'process' => 1,
		'dismiss' => 1,
		'snooze' => 1,
		'certificate' => 1,
		'save_items' => 1,
		'subscribe' => 1,
		'unsubscribe' => 1,
		'recover' => 1,
		'setwipe' => 1,
		'resetwipe' => 1,
		'importattachment' => 1,
		'lock' => 1,
		'unlock' => 1,
		'notify' => 1,
		'revert_to_revision' => 1,
		'notify_groupchat' => 1,
		'notify_item' => 1,
		'add_pin' => 1,
		'add_global_pin' => 1,
		'delete_pin' => 1,
		'delete_global_pin' => 1,
		'resend' => 1,
		'document_invite'=>1,
		'document_uninvite'=>1,
		'document_link'=>1,
        'collaboration_reset' => 1,
	);
	private $sPartID = '';
	private $bGetAttach = false;

	public $oDOMAccount;
	public $oDOMQuery;
	public $sTargetAID;
	public $sSpamFolder;
	public $oDOMSkipTrash;
	public $oDOMReason;
	public $oDOMGWParams;
	public $oDOMContact;
	public $oDOMTargetAccount;
	public $oDOMTargetFolder;
	public $oDOMTargetItem;
	public $oDOMMinutes;
	public $oDOMCTZ;
	public $oDOMTimestamp;
	public $oDOMAll;
	public $oDOMCopyTo;
	public $oDOMComment;
	public $oDOMRevID;
	public $oDOMEmail;
	public $sCleanupDays;
	public $sRID;
	public $bKeepSeen;
	public $fullID;
	public $gwDate;
	public $sAttId;
	public $bBlocked;
	public $bGetSingleItem;
	public $oDOMDate;
	public $oDOMFollowing;
	public $oDOMValues;
	public $bSkipTrash;
	public $oAccount;
	public $sAcceptFolder;
	public $bIgnoreReason;
	public $sDeclineReason;
	public $sAttachmentID;
	public $sGWParams;
	public $oUser;
	public $sTargetAccount;
	public $sTargetFolder;
	public $sTargetItem;
	public $sCTZ;
	public $sTimestamp;
	public $sMinutes;
	public $bDeleteAfterImport;
	public $sPassPhrase;
	 
	public $oDOMItems;
	public $sCopyTo;
	public $bAll;
	public $sComment;
	public $sRevision;
	public $sNotifyEmail;
	public $sIID;
	public $oDOMFolder;
	public $oDOMItem;
	public $bBlockExternal;
	 
	public $oDOMDoc;
	public $sAID;
	public $sFID;
	public $getPartID;
	public $sDestAccount;
	public $sDestFolder;
	public $oDOMPassPhrase;
	public $oDOMKeepSeen;
    protected $evnDocPassPlain = false;

     
	public function __construct($oDOMQuery,&$oDOMDoc,&$attrs)
	{
		$this->oDOMQuery = $oDOMQuery;
		$this->oDOMDoc = &$oDOMDoc;
		$this->aAttrs = &$attrs;
		 		$this->bGetSingleItem = false;
		
		$this->checkInputXML();
		$this->exeInputXML();
	}

     
	private function checkInputXML()
	{
		 		 		if (!$this->oDOMAccount = $this->oDOMDoc->getNode("items:account", $this->oDOMQuery)) {
			throw new Exc('item_missing_tag','account');
		}
		 		if (!$this->sAID = $this->oDOMAccount->getAttribute("uid")) {
			throw new Exc('item_missing_account_id');
		}
		
		 		if (!$this->oDOMFolder = $this->oDOMDoc->getNode("items:folder", $this->oDOMAccount)) {
			throw new Exc('item_missing_tag','folder');
		}
		 		if (!$this->sFID = $this->oDOMFolder->getAttribute("uid")) {
			throw new Exc('item_missing_folder_id');
		}
		$this->oUser = $oUser = User::load($this->aAttrs['sid']);
		if($gwAccount = $oUser->getAccount($_SESSION['EMAIL'])->gwAccount){
			if(!$gwAccount->isConnected()){
				$gwAccount->gwAPI->OpenGroup('*');
			}
			$this->aData['teamchat_token'] = $_SESSION['TEAMCHAT_TOKEN'];
		}
		
		if (!($this->oAccount = $oUser->getAccount($this->sAID))) {
			throw new Exc('account_invalid_id');
		}
		 
		$this->oFolder = $this->checkFolder($this->oAccount,$this->sFID);
		 		
		 		$this->sCleanupDays = $this->oDOMDoc->getNodeValue("items:cleanup",$this->oDOMFolder);
		 
		 		$this->oDOMItems = array();
		$this->sAttId = false;
		$this->oDOMItems = array();
		foreach($this->oDOMDoc->query('/iq/items:query/items:account/items:folder/items:item') as $item) {
			$this->oDOMItems[] = $item;
		}

		 		if ( isset($this->oDOMItems[0]) && ($oDOMItem = $this->oDOMItems[0]) ) {
			if ($this->sIID = $oDOMItem->getAttribute("uid")) {
				$this->fullID = $this->sIID;
				if (($pos = strpos($this->sIID,'|')) !== false && $this->oFolder->type !== 'DEVICES') {
					$this->getPartID = true;
					$this->sPartID = substr($this->sIID,$pos+1);
					$this->sIID = substr($this->sIID,0,$pos);
					$this->aData['partid'] = $this->sPartID;
				}
				$this->sPartID = $this->sPartID?$this->sPartID:1;
				$this->bGetSingleItem = true;
				if ($this->sAttId = $oDOMItem->getAttribute("atid")) {
					$this->bGetAttach = true;
				}
				if($date =$oDOMItem->getAttribute('date')){
					$this->gwDate = $date;
				}
				if($this->oDOMDoc->getNode("items:account",$oDOMItem)){
					$this->sDestAccount = $this->oDOMDoc->getNodeValue("items:account",$oDOMItem);
				}
				if($this->oDOMDoc->getNode("items:folder",$oDOMItem)){
					$this->sDestFolder = $this->oDOMDoc->getNodeValue("items:folder",$oDOMItem);
				}
				if($oDOMValues = $this->oDOMDoc->getNode("items:values",$oDOMItem)){
				    if(!\server\inc\xml\Validator::validateValues($this->oFolder, $oDOMValues)){
				        throw new Exc('Request XML values validation failed.');
                    }
					if($this->oDOMPassPhrase = $this->oDOMDoc->getNode("items:passphrase",$oDOMValues)){
						$this->sPassPhrase = $this->oDOMDoc->getNodeValue(
							"items:passphrase",
							$oDOMValues
						);
					}
					if($this->oDOMKeepSeen = $this->oDOMDoc->getNode("items:keep_seen",$oDOMValues)){
						$this->bKeepSeen = $this->oDOMDoc->getNodeValue(
							"items:keep_seen",
							$oDOMValues
						);
						$this->bKeepSeen = $this->bKeepSeen==1 || $this->bKeepSeen=='true';
					}
                    if($this->oDOMDoc->getNode("items:evndocpass_plain", $oDOMValues)){
                        $evnDocPassPlain = $this->oDOMDoc->getNodeValue("items:evndocpass_plain", $oDOMValues);
                        $this->evnDocPassPlain = true;
                        if($evnDocPassPlain != '') $this->evnDocPassPlain = filter_var($evnDocPassPlain, FILTER_VALIDATE_BOOLEAN);
                    }
				}
			}
			if (!$this->sRID = $oDOMItem->getAttribute("rid")) {
				$this->sRID = false;
			}else{
				$this->bGetSingleItem = true;
			}
		}
		if ($this->aAttrs['type'] == 'set') {
			 
			if (!$this->oDOMItem = $this->oDOMItems[0]) {
				throw new Exc('item_missing_tag','item');
			}
			 
			if (!$this->sAction = $this->oDOMItem->getAttribute("action")) {
				throw new Exc('item_missing_tag','action');
			}
			$this->aAttrs['action'] = $this->sAction;
			if ($this->sTargetAID = $this->oDOMDoc->getNodeValue("items:account",$this->oDOMItem)) {
				 				 				if ($this->oFolder->itemClassName=="POP3Item"){
					if ($this->sAction=='move' && $this->sAID == $this->sTargetAID) $this->sAction = 'delete';
				}
			}
			
			 
			if (!isset($this->aActions[$this->sAction])) {
				throw new Exc('item_invalid_action',$this->sAction);
			}
			 			switch($this->sAction) {
				case 'add':
				case 'edit':
				case 'delete':
					 
					if (!$this->oDOMValues = $this->oDOMDoc->getNode("items:values",$this->oDOMItem)) {
						if (!($this->sAction=='delete')) {
							throw new Exc('item_missing_tag','values');
						}
					}
					if ($pom = $this->oDOMDoc->getNode("items:folder",$this->oDOMValues)) {
						$this->sSpamFolder = $pom;
					}
					if($this->oDOMReason = $this->oDOMDoc->getNode("items:reason",$this->oDOMValues)){
						$this->sDeclineReason = $this->oDOMReason->nodeValue;
						if($this->sDeclineReason === ''){
							$this->bIgnoreReason = true;
						}
					}
					if($this->oDOMReason = $this->oDOMDoc->getNode("items:reason",$this->oDOMItem)){
						$this->sDeclineReason = $this->oDOMReason->nodeValue;
						if($this->sDeclineReason === ''){
							$this->bIgnoreReason = true;
						}
					}

					if($this->oDOMSkipTrash = $this->oDOMDoc->getNode("items:skip_trash",$this->oDOMValues)){
						$this->bSkipTrash = $this->oDOMSkipTrash->nodeValue=='1'?true:false;
					}else{
						$this->bSkipTrash = false;
					}
					if($this->oDOMSkipTrash = $this->oDOMDoc->getNode("items:skip_trash",$this->oDOMItem)){
						$this->bSkipTrash = $this->oDOMSkipTrash->nodeValue=='1'?true:false;
					}

					break;
				case 'move':
				case 'copy':
				case 'attachments':
					if (!$this->sIID = $this->oDOMItem->getAttribute("uid")) {
						throw new Exc('item_missing_item_id');
					}
					break;
				case 'accept_counter':
				case 'accept':
				    $this->sAcceptFolder = $this->oDOMDoc->getNodeValue("items:folder",$this->oDOMItem);
				case 'propose':
				case 'tentative':
				case 'decline':
				case 'decline_counter':
					$this->sAttachmentID = $this->oDOMDoc->getNodeValue("items:partid",$this->oDOMItem);
					$this->oDOMValues = $this->oDOMDoc->getNode("items:values",$this->oDOMItem);
					
					if($this->oDOMReason = $this->oDOMDoc->getNode("items:reason",$this->oDOMValues)){
						$this->sDeclineReason = $this->oDOMReason->nodeValue;
						if($this->sDeclineReason === ''){
							$this->bIgnoreReason = true;
						}
					}
					if($this->oDOMReason = $this->oDOMDoc->getNode("items:reason",$this->oDOMItem)){
						$this->sDeclineReason = $this->oDOMReason->nodeValue;
						if($this->sDeclineReason === ''){
							$this->bIgnoreReason = true;
						}
					}
					if($this->oDOMGWParams = $this->oDOMDoc->getNode("items:gwparams",$this->oDOMItem)){
						$this->sGWParams = '';
						$gwparams = array();
						foreach( $this->oDOMDoc->query('items:*',$this->oDOMGWParams) as $node){
							$gwparams[] = $node->tagName.'='.urlencode($node->nodeValue);
						}
						$this->sGWParams = join('&',$gwparams);
					}
					break;
				
				case 'certificate':
					if($this->oDOMContact = $this->oDOMDoc->getNode("items:contact",$this->oDOMItem)){
						if($this->oDOMTargetAccount = $this->oDOMDoc->getNode("items:account",$this->oDOMContact)){
							$this->sTargetAccount = $this->oDOMTargetAccount->nodeValue;
						}
						if($this->oDOMTargetFolder = $this->oDOMDoc->getNode("items:folder",$this->oDOMContact)){
							$this->sTargetFolder = $this->oDOMTargetFolder->nodeValue;
						}
						if($this->oDOMTargetItem = $this->oDOMDoc->getNode("items:item",$this->oDOMContact)){
							$this->sTargetItem = $this->oDOMTargetItem->nodeValue;
						}
					}
				break;
				case 'snooze':
				case 'dismiss':
					if (!$this->oDOMValues = $this->oDOMDoc->getNode("items:values",$this->oDOMItem)) {
						if (!($this->sAction=='delete')) {
							throw new Exc('item_missing_tag','values');
						}
					}
					if($this->oDOMMinutes = $this->oDOMDoc->getNode("items:minutes",$this->oDOMValues)){
						$this->sMinutes = $this->oDOMDoc->getNodeValue(
							"items:minutes",
							$this->oDOMValues
						);
					}
					if($this->oDOMCTZ = $this->oDOMDoc->getNode("items:ctz",$this->oDOMValues)){
						$this->sCTZ = $this->oDOMDoc->getNodeValue(
							"items:ctz",
							$this->oDOMValues
						);
					}
					if($this->oDOMTimestamp = $this->oDOMDoc->getNode("items:timestamp",$this->oDOMValues)){
						$this->sTimestamp = $this->oDOMDoc->getNodeValue(
								"items:timestamp",
								$this->oDOMValues
						);
					}
				break;
				case 'notify':
					if (!$this->oDOMValues = $this->oDOMDoc->getNode("items:values",$this->oDOMItem)) {
						throw new Exc('item_missing_tag','values');
					}
					if($this->oDOMAll = $this->oDOMDoc->getNode("items:all",$this->oDOMValues)){
						$this->bAll = $this->oDOMDoc->getNodeValue(
								"items:all",
								$this->oDOMValues
						);
					}
					if($this->oDOMCopyTo = $this->oDOMDoc->getNode("items:copy_to",$this->oDOMValues)){
						$this->sCopyTo = $this->oDOMDoc->getNodeValue(
								"items:copy_to",
								$this->oDOMValues
						);
					}
					if($this->oDOMComment = $this->oDOMDoc->getNode("items:comment",$this->oDOMValues)){
						$this->sComment = $this->oDOMDoc->getNodeValue(
								"items:comment",
								$this->oDOMValues
						);
					}
					break;
				case 'revert_to_revision':
					if (!$this->oDOMValues = $this->oDOMDoc->getNode("items:values",$this->oDOMItem)) {
						throw new Exc('item_missing_tag','values');
					}
					if($this->oDOMRevID = $this->oDOMDoc->getNode("items:revision",$this->oDOMValues)){
						$this->sRevision = $this->oDOMDoc->getNodeValue(
								"items:revision",
								$this->oDOMValues
						);
					}else{
						throw new Exc('item_missing_tag','revision');
					}
					break;
				case 'notify_item':
				case 'notify_groupchat':
					if (!$this->oDOMValues = $this->oDOMDoc->getNode("items:values",$this->oDOMItem)) {
						throw new Exc('item_missing_tag','values');
					}
					if($this->oDOMEmail = $this->oDOMDoc->getNode("items:email",$this->oDOMValues)){
						$this->sNotifyEmail = $this->oDOMDoc->getNodeValue(
								"items:email",
								$this->oDOMValues
						);
					}else{
						throw new Exc('item_missing_tag','email');
					}
					break;
				case 'importattachment':
					$this->bDeleteAfterImport = $this->oDOMDoc->getNodeValue("items:delete",$this->oDOMItem)!='0'?true:false;
				break;
				case 'document_invite':
					$this->sDocExpire = $this->oDOMDoc->getNodeValue("items:expire",$this->oDOMItem);
					$this->sDocPass = $this->oDOMDoc->getNodeValue("items:password",$this->oDOMItem);
					$this->sDocEditable = $this->oDOMDoc->getNodeValue("items:editable",$this->oDOMItem);
				break;
				case 'document_link':
					$this->sTeamChatFolder = $this->oDOMDoc->getNodeValue("items:folder",$this->oDOMItem);
					$this->sNote = $this->oDOMDoc->getNodeValue("items:note",$this->oDOMItem);
				break;
			}
		}
		return true;
	}
	
	 
	protected function getHTMLKeyName(array $aFilterTag)
	{
	    if (ini_get('session.save_handler') == 'files' && file_exists(ini_get('session.save_path') . 'use-old-parser.mark')){
		    return 'clean_html';
	    }elseif(strpos($aFilterTag['tag'],'raw_html') !== false){
		    return 'raw_html';
	    }elseif(strpos($aFilterTag['tag'],'sanitized_html') !== false){
		    return 'sanitized_html';
	    }
	    return ($this->bBlockExternal && $this->bBlocked) ? 'clean_html' : 'html';
	}

	static public function &checkFolder( &$oAccount, $sFID )
	{
		 
		try{
			$oFolder = $oAccount->getFolder($sFID);
		} catch(Exc $e){
			 			$oFolder = $oAccount->getFolderWithAutoCreate($sFID);
		}
		if(strpos($sFID,'__@@GROUP@@__')===0 ||  $sFID=='__@@ADDRESSBOOK@@__' || $sFID=='__@@SHARED@@__' || strtolower($sFID)=='@@mycard@@'){
			return $oFolder;
		}
		if (!$oFolder && $oFolder->type!='M' && $oFolder->type!='R' && $oAccount->gwAccount->bLogged == false) {
			throw new Exc('gw_init_error');
		}
		 
		if (!$oFolder && $_SESSION['RESTRICTIONS'][$sFID][0]) {
			throw new Exc('gw_init_error');
		}

		                  if (!$oFolder->gw && (!isset($oFolder->sync) || !$oFolder->sync) && (!isset($oAccount->aSyncedFolders[$oFolder->folderID]) || !$oAccount->aSyncedFolders[$oFolder->folderID])) {
			if ($oFolder) {
				 				if(get_class($oFolder) == 'IMAPFolder' && $oAccount->isDelayed() && !$oAccount->syncDelayedFolders()){
				    return $oFolder;
				}
				$oFolder->sync();
			}
			$oAccount->aSyncedFolders[$oFolder->folderID] = true;
		}
		return $oFolder;
	}

     
	private function exeInputXML()
    {
        if($this->aAttrs['type'] == 'get') return $this->exeGetInputXML();
        if($this->aAttrs['type'] == 'set') return $this->exeSetInputXML();
    }

    protected function exeGetInputXML()
    {
        $folderType = $this->oFolder->getType();
        $iItemCount = -1;
        if ($this->sCleanupDays) {              $this->oFolder->deleteOlder($this->sCleanupDays);
        }
        $this->sTemplateFile = 'webmailiqitems_get';
        $aFilterTag = $this->filterAndTags();
        $countFilter = $aFilterTag['sql'];

        if ($aFilterTag['search']) {               if($folderType == 'M' && $_SESSION['FULLTEXT_SUPPORT']){
                $imapSearch = new \server\inc\imap\Search($this->oFolder, $aFilterTag['search']);
            }
            if(!$imapSearch instanceof \server\inc\imap\Search || !$imapSearch->isSearchEnabled() || !($aFilterTag['sql'] = $imapSearch->getSearchSql())){
                require_once(SHAREDLIB_PATH . 'tools/search.php');
                $search = new SearchTool();
                $search->setType($folderType);
                $search->setAccount($this->oAccount);
                $search->setFolder($this->oFolder);
                $search->setTimeZone($_SESSION['CLIENT_TIMEZONE'] ? $_SESSION['CLIENT_TIMEZONE'] : $_SESSION['SERVER_TIMEZONE']);

                if($folderType == 'M'){
                    $aFilterTag['search'] = str_replace('fulltext:', '', $aFilterTag['search']);
                    $aFilterTag['search'] = str_replace('tag:', 'taglist:', $aFilterTag['search']);
                }
                $searchString = $search->parse($aFilterTag['search'], $aFilterTag);
                $originalSql = $aFilterTag['sql'];
                $aFilterTag['sql'] = $searchString ? '(' . $searchString . ')' : '';
                if($folderType == 'M'){
                    if(isset($aFilterTag['sql'])) $aFilterTag['sql'] = preg_replace('/(?:\\s(?:OR|AND)[\\s]+)?(?\'bracket1\'\\()?{(FULLTEXT|TAG)}.*?{\\/\\2}(?(\'bracket1\')\\))/i', '', $aFilterTag['sql']);
                }
            }
        }
        if ($this->oFolder->name == '__@@SHARED@@__') {
            $this->oFolder->sync();
        }

        if ($this->bGetSingleItem) {              if ($folderType == "M") {
                if ($this->sRID) {
                    $this->oFolder->sync();
                }
                $oItem = $this->oFolder->getItem($this->sIID, array(), $this->sRID);
                if (!$this->bKeepSeen) {
                    $oItem->markAsRead();
                }
            } else {
                $_SESSION['clientSettings'] = array('show_inline_images' => false);
                if ('show_inline_images' === $aFilterTag['tag']) {
                    $_SESSION['clientSettings'] = array('show_inline_images' => true);                      $aFilterTag['tag'] = '*';                  }
                $oItem = $this->oFolder->getItem($this->fullID, WITH_ADDONS, $aFilterTag['timezone'], $this->gwDate, $aFilterTag['tag'] ? $aFilterTag['tag'] : '*', $this->sPartID);
                if($this->evnDocPassPlain){
                    $api = createobject('API');
                    $decrypted = htmlentities($api->ManageConfig("dbpassword",0, $oItem->item['EVNDOCPASS']));
                    $oItem->sFields = str_replace('<evndocpass>' . $oItem->item['EVNDOCPASS'] . '</evndocpass>','<evndocpass>' . $decrypted . '</evndocpass>', $oItem->sFields);
                    $oItem->item['EVNDOCPASS'] = $decrypted;
                }
            }

                         if ($this->bGetAttach) {
                $attachment = new GroupWareAddon($oItem, 'attachment');
                $value = $attachment->getAttachment($this->sAttId);
                $value = explode(':', $value);
                $value = $attachment->getGroupAttachment($value[0], $value[1], $value[2]);
                $this->sAID = $value['account'];
                $this->sFID = $value['folder'];
                $this->sIID = $value['item'];
                $oAccount = $_SESSION['user']->getAccount($this->sAID);
                $oFolder = $oAccount->getFolder($this->sFID);
                $oItem = $oFolder->getItem($this->sIID);
            }
            $aItems = array(0 => $oItem);
            $iItemCount = 1;
        } else {
            $groupBy = ($folderType == 'C' && isset($aFilterTag['contactGroupBy']) && $aFilterTag['contactGroupBy']);
            if($groupBy){
                $aFilterTag['groupBy'] = 'lctemail1, lctemail2, lctemail3';
            }
            $aItems = $this->oFolder->getItems($aFilterTag);
            if ($folderType == 'I') {
                $this->aData["last_pinned_item"] = $this->oFolder->lastPinnedItem;
            }

            if($groupBy || $this->oFolder->name == '__@@ADDRESSBOOK@@__') $iItemCount = count($aItems);
        }
        if ($this->oFolder->type == 'V' && !$this->oFolder->isEmpty()) {
            $primary = $this->oFolder->getPrimary();
            $this->aData['primary'] = slToolsPHP::htmlspecialchars($primary->name);
        }
                  
        $this->aData['items']['num'] = $this->cnvItems($aItems, $aFilterTag, false, $this->bGetSingleItem, $this->sPartID, true, $this->bBlockExternal, $this->bBlocked, false, $this->sPassPhrase);
        $this->aData['html_name'] = self::getHTMLKeyName($aFilterTag);
        $this->aData["values"] = !(isset($this->oFolder->gw) && $this->oFolder->gw);
        $this->aData['aid'] = slToolsPHP::htmlspecialchars($this->sAID);
        $this->aData['fid'] = slToolsPHP::htmlspecialchars($this->sFID);
        if ($iItemCount != -1) {
            $this->aData['counter'] = $iItemCount;
        } else {
            $this->aData['counter'] = $this->oFolder->countItems(0, true, $aFilterTag['sql'], $aFilterTag['fulltext'] ?? '', $aFilterTag['tag'], $this->oFolder->folderID, $aFilterTag['folder'] ?? null, true);
        }
        $rights = $this->oFolder->rights ? $this->oFolder->rights : $this->oFolder->getMyRights();
        $this->aData['rights'] = Folder::rightsToString($rights, $this->oFolder->name);
                 $alreadySearched = true;
        if ($folderType == 'M') {
            if ($this->oFolder->type != 'V') {
                $aFilterTag['sql'] = $countFilter;
                if ($this->bGetSingleItem) {
                    $aFilterTag['sql'] = '';
                }
            } else {
                if ($this->bGetSingleItem) {
                    $aFilterTag['sql'] = '';
                    $alreadySearched = false;
                } else {
                    $aFilterTag['sql'] = $originalSql;
                    $alreadySearched = false;
                }
            }
            $this->aData['recent'] = $this->oFolder->countItems(Item::FLAG_SEEN, false, $aFilterTag['sql'] ?? '', $aFilterTag['fulltext'] ?? '', false, false, $aFilterTag['folder'] ?? '', $alreadySearched);
                     } else {
            $this->aData['recent'] = '0';
            if ($folderType == 'I' && $aFilterTag['groupchat_type'] != 'main') {
                $this->aData['hide_recent'] = true;
            }
        }
        $this->aData['offset'] = $aFilterTag['offset'];
        if ($folderType != 'I') {
            $this->aData['offset'] = intval($aFilterTag['offset']);
        }
        if ($this->aData['counter'] > 0 && $this->aData['offset'] < $this->aData['counter'] && count($this->aData['items']['num'] ?? []) == 0) {
            $this->aData['counter'] = 0;
        }
    }

     
    protected function exeSetInputXML()
    {
                          $cache['cache'] = Cache::instance($this->oAccount->user);
                 $cache['api'] = createobject('API');
                 if ($this->sAction == 'add') return $this->setActionAdd();          if ($this->sAction == 'edit') return $this->setActionEdit();          if ($this->sAction == 'delete') return $this->setActionDelete($cache);          if ($this->sAction == 'move') return $this->setActionMove($cache);
        if ($this->sAction == 'copy') return $this->setActionCopy($cache);
        if ($this->sAction == 'redirect') return $this->setActionRedirect();
        if ($this->sAction == 'resend') return $this->setActionResend();
                 if ($this->sAction == 'deliver') return $this->setActionDeliver();
        if ($this->sAction == 'whitelist') return $this->setActionWhiteList();
        if ($this->sAction == 'blacklist') return $this->setActionBlackList();
                 if ($this->sAction == 'accept') return $this->setActionAccept();          if ($this->sAction == 'accept_counter') return $this->setActionAcceptCounter();

        if ($this->sAction == 'decline') return $this->setActionDecline($cache);          if ($this->sAction == 'decline_counter') return $this->setActionDeclineCounter();
        if ($this->sAction == 'tentative') return $this->setActionTentative();
        if ($this->sAction == 'propose') return $this->setActionPropose();
        if ($this->sAction == 'certificate') return $this->setActionCertificate();
        if ($this->sAction == 'dismiss') return $this->setActionDismiss();
        if ($this->sAction == 'snooze') return $this->setActionSnooze();
        if ($this->sAction == 'save_items') return $this->setActionSaveItems();
        if ($this->sAction == 'subscribe') return $this->setActionSubscribe();
        if ($this->sAction == 'unsubscribe') return $this->setActionUnsubscribe();
        if ($this->sAction == 'recover') return $this->setActionRecover();
        if ($this->sAction == 'setwipe') return $this->setActionSetWipe();
        if ($this->sAction == 'resetwipe') return $this->setActionResetWipe();
        if ($this->sAction == 'importattachment') return $this->setActionImportAttachment();
        if ($this->sAction == 'lock') return $this->setActionLock();
        if ($this->sAction == 'unlock') return $this->setActionUnlock();
        if ($this->sAction == 'notify') return $this->setActionNotify();
        if ($this->sAction == 'revert_to_revision') return $this->setActionRevertToRevision();
        if ($this->sAction == 'notify_item') return $this->setActionNotifyItem();
        if ($this->sAction == 'notify_groupchat') return $this->setActionNotifyGroupChat();
        if ($this->sAction == 'add_pin') return $this->setActionAddPin();
        if ($this->sAction == 'add_global_pin') $this->setActionAddGlobalPin();
        if ($this->sAction == 'delete_pin') return $this->setActionDeletePin();
        if ($this->sAction == 'delete_global_pin') return $this->setActionDeleteGlobalPin();
        if ($this->sAction == 'document_invite') return $this->setActionDocumentInvite();
        if ($this->sAction == 'document_uninvite') return $this->setActionDocumentUninvite();
        if ($this->sAction == 'document_link') return $this->setActionDocumentLink();
        if ($this->sAction == 'collaboration_reset') return $this->setActionCollaborationReset();
    }

     
    protected function setActionAdd()
    {
        $this->sTemplateFile = 'webmailiqitems_set';
        if (!$this->oFolder->gw && !in_array($this->oFolder->type, ['Q', 'QL', 'V', 'K']) && !$this->oFolder instanceof AlfrescoFolder) {
            throw new Exc('item_create');          }
        $aItems = array();
        Folder::checkRights($this->oFolder,Folder::RIGHT_WRITE);
        foreach($this->oDOMItems as $oDOMItem) {
            $oDOMValues = $this->oDOMDoc->getNode("items:values",$oDOMItem);
            $aItem = Tools::makeArrayFromXML($oDOMValues);
            $skipInvitation = $aItem['skip_invitation'];
            $autoSave = $aItem['auto_save'];
            unset($aItem['auto_save']);
            $aTreeItem = Tools::makeTreeFromXML($oDOMItem,false);
            if ($autoSave){
                unset($aTreeItem['@childnodes']['reminders'], $aTreeItem['@childnodes']['attachments'], $aTreeItem['@childnodes']['contacts']);
            }
            $aItem['duplicity'] = $oDOMItem->getAttribute('duplicity');
            try{
                $oItem = $this->oFolder->createItem($aItem, $aTreeItem);
                if(is_array($oItem)){
                    $aItems = array_merge($aItems, array_values($oItem));
                }else{
                    $aItems[] = $oItem;
                }
            }catch(Exc $e){
                $this->handleItemError($e);
            }
                                      if(!$skipInvitation && in_array($this->oFolder->getType(), ['E', 'T', 'N', 'I', 'Y']) && is_object($oItem) && ($oItem->isOrganizator($oItem->item['EVNFLAGS']) || $oItem->isOrganizator($aItem['EVNFLAGS']))){
                                 $imip = iMIP::load($this->oFolder->account);
                $imip->iMIP_Email($oItem,'invite');
            }
        }
        if(!is_array($aItems)) return;
        foreach($aItems as $oItem){
            $this->aData['items'][$oItem->itemID]['id'] = $oItem->itemID;
            $this->aData['items'][$oItem->itemID]['created'] = $oItem->item['EVN_CREATED'];
            $this->aData['items'][$oItem->itemID]['name'] = $oItem->item['EVNRID'];
            $this->aData['items'][$oItem->itemID]['reactions_metadata'] = $oItem->reactions_metadata;
            $this->aData['items'][$oItem->itemID]['att_webdav_link'] = $oItem->att_webdav_link;
            $this->aData['items'][$oItem->itemID]['att_size'] = $oItem->att_size;
            $this->aData['items'][$oItem->itemID]['teamchat_link_id'] = $oItem->linkID;
        }
    }

    protected function setActionEdit()
    {
                 $this->sTemplateFile = 'webmailiqitems_set';
        if($this->oDOMItems) foreach($this->oDOMItems as $oDOMItem) {
                         if ($this->oFolder->getType() == 'M' || $this->oFolder->getType() == 'R') {
                                                  if ($oFlag = $this->oDOMDoc->getNode("items:values/items:flags", $oDOMItem)) {
                    $flags = $oFlag->nodeValue;
                    $oItem = $this->oFolder->getItem($oDOMItem->getAttribute('uid'));
                    $oItem->setFullFlags($flags);
                } elseif( $oFlag = $this->oDOMDoc->getNode("items:values/items:set_flag", $oDOMItem) ){
                    $flags = $oFlag->nodeValue;
                    $f = self::separateFlags($flags);
                    $oItem = $this->oFolder->getItem($oDOMItem->getAttribute('uid'));
                    if ($f) foreach ($f as $flag) {
                        $aFlagsToSet[$flag][] = $oItem;
                    }
                } elseif ($oFlag = $this->oDOMDoc->getNode("items:values/items:clear_flag", $oDOMItem)) {
                    $flags = $oFlag->nodeValue;
                    $f = self::separateFlags($flags);
                    $oItem = $this->oFolder->getItem($oDOMItem->getAttribute('uid'));
                    foreach ($f as $flag) {
                        $aFlagsToClear[$flag][] = $oItem;
                    }
                } elseif ($oColor = $this->oDOMDoc->getNode("items:values/items:color", $oDOMItem)) {
                    $sColor = $oColor->nodeValue;
                    $oItem = $this->oFolder->getItem($oDOMItem->getAttribute('uid'));
                    $oItem->changeColor($sColor);
                }
                if ($oTags = $this->oDOMDoc->getNode("items:values/items:tags",$oDOMItem)) {
                    if($tags = $this->oDOMDoc->getNodeValue("items:values/items:tags",$oDOMItem)){
                        $tags = explode(",", $tags);
                        if(is_array($tags)){
                            foreach($tags as $k => $t){
                                $tags[$k] = trim($t);
                            }
                        }
                    }
                    $oItem = $this->oFolder->getItem($oDOMItem->getAttribute('uid'));
                    $oItem->setTagList($tags);
                }
                             } else {
                                 $this->oDOMValues = $this->oDOMDoc->getNode("items:values", $oDOMItem);
                                 $sExpdate = false;
                if ($this->oDOMDate = $this->oDOMDoc->getNode("items:expdate", $this->oDOMValues)) {
                    $sExpdate = $this->oDOMDate->nodeValue;
                }
                $ctz = 0;
                $sExpDate = 0;
                $oItem = $this->oFolder->getItem($oDOMItem->getAttribute('uid'), WITH_ADDONS, $ctz, $sExpDate);
                                 $bFollowing = false;
                if ($this->oDOMFollowing = $this->oDOMDoc->getNode("items:expfollowing",$this->oDOMValues)) {
                    $bFollowing = ($this->oDOMFollowing->nodeValue == 'true');
                }

                $aItem = Tools::makeArrayFromXML($this->oDOMValues, true);
                $aItem['duplicity'] = $oDOMItem->getAttribute('duplicity');

                $aTreeItem = Tools::makeTreeFromXML($this->oDOMItem, false);
                try {
                    $id = false;
                    $id = $oItem->edit($aItem, $aTreeItem, $sExpdate, $bFollowing);
                } catch (Exc $e) {
                    $this->handleItemError($e, true);
                }
                $this->aData['id'] = $id ? $id : $oItem->itemID;
                $this->aData['reactions_metadata'] = $oItem->reactions_metadata;
            }
        }
                 if (is_array($aFlagsToSet) && !empty($aFlagsToSet)) {
            foreach ($aFlagsToSet as $flag => $items) {
                $this->oFolder->markItems($flag, $items);
            }
        }
                 if (is_array($aFlagsToClear) && !empty($aFlagsToClear)) {
            foreach ($aFlagsToClear as $flag => $items) {
                $this->oFolder->unmarkItems($flag, $items);
            }
        }
    }

     
    protected function setActionDelete(array $cache)
    {
        $aItemsToDelete = [];
        foreach($this->oDOMItems as $oDOMItem) {
            $sUID = $oDOMItem->getAttribute('uid');
                         if ($oDOMExpdate = $this->oDOMDoc->getNode("items:expdate", $this->oDOMValues)) {
                $sExpdate = $oDOMExpdate->nodeValue;
                $bFollowing = false;
                                 if ($this->oDOMFollowing = $this->oDOMDoc->getNode("items:expfollowing", $this->oDOMValues)) {
                    $bFollowing = $this->oDOMFollowing->nodeValue == 'true' ? true : false;
                }
                                 try {
                    $oItem = $this->oFolder->getItem($sUID, NO_ADDONS);
                    $oItem->delete($sExpdate, $bFollowing, $this->sDeclineReason, $this->bIgnoreReason, $this->bSkipTrash);
                } catch(Exc $e){
                    if($e->wmcode != 'item_decline_failed_id') throw $e;
                    $this->sTemplateFile = 'error_failed_ids';
                    $this->isError = true;
                    $this->aData['error_uid'] = 'item_decline_reason';
                    $this->aData['failed_id'] = explode("|",$e->message);
                }
                             } else {
                try{
                    $oItem = $this->oFolder->getItem($sUID, $cache);
                    $aItemsToDelete[] = $oItem;
                }catch(Exc $e){}
            }
        }
        if (empty($aItemsToDelete)) return;
                 try {
            $result = $this->oFolder->deleteItems($aItemsToDelete, false, 'auto', $this->sDeclineReason, $this->bIgnoreReason, $this->bSkipTrash);
        }catch (Exc $e){
            if($e->wmcode != 'item_decline_failed_id') throw $e;
            $this->sTemplateFile = 'error_failed_ids';
            $this->isError = true;
            $this->aData['error_uid'] = 'item_decline_reason';
            $this->aData['failed_id'] = explode("|",$e->message);
        }
        if(!$this->isError && !$result) throw new Exc('item_delete');
    }

     
    protected function setActionMove(array $cache)
    {
        return $this->setActionCopy($cache);
    }

     
    protected function setActionCopy(array $cache)
    {
        $this->sTemplateFile = 'webmailiqitems_set';
        $aItemsToMove = [];
        foreach($this->oDOMItems as $oDOMItem) {
            $sUID = $oDOMItem->getAttribute('uid');
            if (!$sFolderName = $this->oDOMDoc->getNodeValue("items:folder", $oDOMItem)) {
                throw new Exc('item_copy_destination');
            }
                         $sAccountName = $this->oDOMDoc->getNodeValue("items:account", $oDOMItem);
            $oDestAccount = $this->oUser->getAccount($sAccountName);

            $type = 'gw';
            if($this->oFolder->type == 'M' || $this->oFolder->type == 'R') $type = 'main';
            if($this->oFolder->type == 'V' && $this->oFolder->contentType == 'M') $type = 'main';
                         $destination = &$oDestAccount->getFolderWithAutoCreate($sFolderName, $type);
            $destinationType = isset($destination->contentType) ? $destination->contentType : $destination->type;
            $sourceType = isset($this->oFolder->contentType) ? $this->oFolder->contentType : $this->oFolder->type;

            if ($sourceType != $destinationType && ($destinationType != 'F'  || ($sourceType != 'I' && $sourceType != 'Y')) && !(preg_match('/^@@.*$/', $this->oAccount->accountID) || preg_match('/^@@.*$/', $oDestAccount->accountID))) {
                throw new Exc('item_copy_destination_type');
            }
            try {
                $oItem = $this->oFolder->getItem($sUID, $cache);
                if ($duplicity = $oDOMItem->getAttribute('duplicity')) {
                    if ($duplicity == 'rename') {
                        $rename = $oDOMItem->getAttribute('rename');
                        if(!$oDOMItem->hasAttribute('rename')){
                            $oItem->rename = GroupWareItem::proposeFreeFileName($this->oFolder, $oItem->item['EVNRID']);
                        }else{
                            $oItem->rename = $rename;
                        }
                    }
                    $oItem->duplicity = $duplicity;
                }
                $aItemsToMove[] = $oItem;
            }catch(Exc $e){}
        }
                 if ($aItemsToMove) {
            if ($this->sAction == 'move') {
                $result = $this->oFolder->moveItems($destination, $aItemsToMove, $cache);
            } else {
                $result = $this->oFolder->copyItems($destination, $aItemsToMove, $cache);
            }
        }
        if (is_array($result) && !empty($result)) {
            foreach ($result as $id => $item) {
                $this->aData['items'][$item]['id'] = $item;
            }
        }
    }

    protected function setActionRedirect()
    {
        foreach ($this->oDOMItems as $oDOMItem) {
             
            $uid = $oDOMItem->getAttribute('uid');
                         if ($this->oFolder->gw) {
                $ids = explode('|', $uid, 2);
                $oItem = $this->oFolder->getItem($ids[0]);
                $startPartId = $ids[1];
                $pid = null;
                $oMailItem = $oItem->getEML(false, $pid, $startPartId);
                $ids2 = explode('|', $ids[1]);
                if ($ids2[1]) {
                    $message = $oMailItem->getPart($ids2[1]);
                } else {
                    $message = $oMailItem->getMessage();
                }
            } else {
                if (strpos($uid, '|') !== false) {
                    $id = explode('|', $uid);
                    $uid = $id[0];
                    $part_id = $id[1];
                    $oItem = $this->oFolder->getItem($uid);

                    $parser = new MailParse($oItem->getMessageFile());
                    $message = $parser->getPart($part_id, $info);
                } else {
                    $oItem = $this->oFolder->getItem($uid);
                    $message = $oItem->getMessage();
                }
                $this->oFolder->markItems(Item::FLAG_FORWARDED, array($oItem));
            }
                         if (substr($message, strlen($message) - 2, 2) != CRLF) {
                $message .= CRLF . CRLF;
            }
            $message = explode(CRLF . CRLF, $message, 2);
            $mail = new Mail();
            $mail->XMailer .= '-Desktop';
            $mail->SetFrom($_SESSION['EMAIL']);
                         $sTo = $this->oDOMDoc->getNodeValue('items:to', $oDOMItem);
            $aTo = MailParse::parseAddresses($sTo);
            foreach ($aTo as $to) {
                $mail->AddTo($to['address'], $to['display']);
            }
                         foreach ($this->oDOMDoc->query('items:distrib', $oDOMItem) as $distrib) {
                foreach ($this->oDOMDoc->query('items:account', $distrib) as $account) {
                    foreach ($this->oDOMDoc->query('items:folder', $account) as $folder) {
                        WebmailIqMessage::processDistributedList('items', $_SESSION['user'], $this->oDOMDoc,
                            $account->getAttribute('uid'), $folder->getAttribute('uid'), $folder, $mail, $iq);
                    }
                }
            }
            $mail->Send($message[0] . CRLF, $message[1]);

            $user = Storage::getUserData('mail_settings_default');
            $domain = Storage::getDomainDefaults('mail_settings_default');
            $global = Storage::getDefaults('mail_settings_default');

            $mail_settings_default = WebmailIqPrivate::get('mail_settings_default', $global, $domain, $user);

            $save_to_sent = 1;
            if(isset($mail_settings_default['@childnodes']['item'][0]['@childnodes']['save_sent_message'])){
                $save_to_sent = $mail_settings_default['@childnodes']['item'][0]['@childnodes']['save_sent_message'][0]['@value'];
            }
            if ($save_to_sent) {
                $sent_name = User::getDefaultFolder('S');
                $oUser = $_SESSION['user'];
                $oAccount = $oUser->getAccount($_SESSION['EMAIL']);
                $oSent = $oAccount->getFolderWithAutocreate($sent_name);
                $id = $oSent->createItem($message[0] . CRLF . CRLF . $message[1]);
                $oSentItem = $oSent->getItem($id);
                $oSentItem->markAsRead(true);
            }
        }
    }

    protected function setActionResend()
    {
        foreach ($this->oDOMItems as $oDOMItem) {
             
            $uid = $oDOMItem->getAttribute('uid');
            if (strpos($uid, '|') !== false) {
                $id = explode('|', $uid);
                $uid = $id[0];
                $part_id = $id[1];
                $oItem = $this->oFolder->getItem($uid);
                $parser = new MailParse($oItem->getMessageFile());
                $message = $parser->getPart($part_id, $info);
                $structure = $parser->parse($part_id);
            } else {
                $oItem = $this->oFolder->getItem($uid);
                $message = $oItem->getMessage();
                $structure = $oItem->parseMessage();
            }
                         if (substr($message, strlen($message) - 2, 2) != CRLF) {
                $message .= CRLF . CRLF;
            }
            $message = explode(CRLF . CRLF, $message, 2);
            $mail = new Mail();
            $mail->XMailer .= '-Desktop';
                         $mail->SetFrom($structure['headers']['from']);
                         $aTo = MailParse::parseAddresses($structure['headers']['to']);
            foreach ($aTo as $to) {
                $mail->AddTo($to['address'], $to['display']);
            }
            $aCC = MailParse::parseAddresses($structure['headers']['cc']);
            foreach ($aCC as $cc) {
                $mail->AddCC($cc['address'], $cc['display']);
            }
            $aBCC = MailParse::parseAddresses($structure['headers']['bcc']);
            foreach ($aBCC as $bcc) {
                $mail->AddBCC($bcc['address'], $bcc['display']);
            }
                         foreach ($this->oDOMDoc->query('items:distrib', $oDOMItem) as $distrib) {
                foreach ($this->oDOMDoc->query('items:account', $distrib) as $account) {
                    foreach ($this->oDOMDoc->query('items:folder', $account) as $folder) {
                        WebmailIqMessage::processDistributedList('items', $_SESSION['user'], $this->oDOMDoc, $account->getAttribute('uid'), $folder->getAttribute('uid'), $folder, $mail, $iq);
                    }
                }
            }
                         $message[0] = preg_replace('/Deferred-delivery:(.*?)(\r|\n|\t)(\r|\n|\t)?(\r|\n|\t)?/si', '', $message[0]);

                         $mail->Send($message[0] . CRLF, $message[1]);

            $user = Storage::getUserData('mail_settings_default');
            $domain = Storage::getDomainDefaults('mail_settings_default');
            $global = Storage::getDefaults('mail_settings_default');

            $mail_settings_default = WebmailIqPrivate::get('mail_settings_default', $global, $domain, $user);

            $save_to_sent = 1;
            if(isset($mail_settings_default['@childnodes']['item'][0]['@childnodes']['save_sent_message'])){
                $save_to_sent = $mail_settings_default['@childnodes']['item'][0]['@childnodes']['save_sent_message'][0]['@value'];
            }
            if ($save_to_sent) {
                $sent_name = User::getDefaultFolder('S');
                $oUser = $_SESSION['user'];
                $oAccount = $oUser->getAccount($_SESSION['EMAIL']);
                $oSent = $oAccount->getFolderWithAutocreate($sent_name);
                $id = $oSent->createItem($message[0] . CRLF . CRLF . $message[1]);
                $oSentItem = $oSent->getItem($id);
                $oSentItem->markAsRead(true);
            }
        }
    }

    protected function setActionDeliver()
    {
        if ($this->oFolder->type != 'Q') return;
        foreach ($this->oDOMItems as $oDOMItem) {
            $this->oFolder->deliverItem($oDOMItem->getAttribute('uid'));
        }
    }

    protected function  setActionWhiteList()
    {
        if ($this->oFolder->type != 'Q' && $this->oFolder->type != 'QL') return;
        foreach ($this->oDOMItems as $oDOMItem) {
            $deliver = ($this->oFolder->type == 'Q');
            $this->oFolder->whitelistItem($oDOMItem->getAttribute('uid'), $deliver);
        }
    }

    protected function setActionBlackList()
    {
        if ($this->oFolder->type != 'Q' && $this->oFolder->type != 'QL') return;
        foreach ($this->oDOMItems as $oDOMItem) {
            $this->oFolder->blacklistItem($oDOMItem->getAttribute('uid'));
        }
    }

    protected function initFolderItemAndOwner(& $owner, & $oItem, & $hasPublicRoot)
    {
        $owner = MerakGWAPI::getFolderOwner($this->oFolder,$dummy,$hasPublicRoot);
        $oItem = $this->oFolder->getItem($this->sIID);
        $owner = ($owner == $_SESSION['EMAIL']) ? false : $owner;
    }

    protected function setActionAccept()
    {
        $this->initFolderItemAndOwner($owner, $oItem, $hasPublicRoot);
        if ($oItem->wmclass == 'GW') {
            return $oItem->accept();
        }
        $oAcceptFolder = $this->oAccount->getFolder($this->sAcceptFolder);
        Folder::checkRights($oAcceptFolder, Folder::RIGHT_WRITE);
        try {
            $aAttachment = $oItem->acceptInvitation($this->sAttachmentID, $this->sAcceptFolder, $owner, $hasPublicRoot);
                         $imip = iMIP::load($this->oFolder->account->gwAccount);
            $imip->iMIP_Email($oItem, 'accept', $aAttachment);
        } catch (Exc $e) {
            throw $e;
        }
    }

    protected function setActionAcceptCounter()
    {
        $this->initFolderItemAndOwner($owner, $oItem, $hasPublicRoot);
        $oAcceptFolder = $this->oAccount->getFolder($this->sAcceptFolder);
        Folder::checkRights($oAcceptFolder, Folder::RIGHT_WRITE);
        $aAttachment = $oItem->acceptCounterInvitation($this->sAttachmentID, $this->sAcceptFolder, $owner, $hasPublicRoot);
                 $imip = iMIP::load($this->oFolder->account->gwAccount);
        $imip->iMIP_Email($oItem, 'counter', $aAttachment, false, false, $oItem->from);
    }

     
    protected function setActionDecline(array $cache)
    {
        $owner = MerakGWAPI::getFolderOwner($this->oFolder, $dummy, $hasPublicRoot);
 
        foreach($this->oDOMItems as $oDOMItem) {
            $sUID = $oDOMItem->getAttribute('uid');
                         if ($oDOMExpdate = $this->oDOMDoc->getNode("items:expdate",$this->oDOMValues)) {
                $sExpdate = $oDOMExpdate->nodeValue;
                                 $bFollowing = false;
                if ($this->oDOMFollowing = $this->oDOMDoc->getNode("items:expfollowing",$this->oDOMValues)) {
                    $bFollowing = ($this->oDOMFollowing->nodeValue == 'true');
                }
                                 try{
                    if(strpos($this->oFolder->folderID, 'TeamChat') === false) {
                        $oItem = $this->oFolder->getItem($sUID,NO_ADDONS);
                    }else{
                        $sql = ['sql' => 'evnuid = "' . $sUID . '"', 'tag' => 'evnuid,evnlinkid'];
                        $oItems = $this->oAccount->getFolder($_SESSION['user']->getDefaultFolder('E'))->getItems($sql);
                        if(! current($oItems) instanceof GroupWareItem){
                            throw new Exc('item_decline_failed_id', $this->itemID);
                        }
                         
                        $oItem = current($oItems);
                    }
                    $oItem->delete($sExpdate,$bFollowing,$this->sDeclineReason,$this->bIgnoreReason,$this->bSkipTrash, false, $this->oFolder);
                }catch(Exc $e){
                    if($e->wmcode != 'item_decline_failed_id') throw $e;
                    $this->sTemplateFile = 'error_failed_ids';
                    $this->isError = true;
                    $this->aData['error_uid'] = 'item_decline_reason';
                    $this->aData['failed_id'] = explode("|",$e->message);
                }
                             } else {
                $oItem = $this->oFolder->getItem($sUID,$cache);
                if($oItem->wmclass == 'GW'){
                    return $oItem->decline($this->sDeclineReason,$this->bIgnoreReason);
                }
                $aAttachment = $oItem->declineInvitation($this->sAttachmentID,$owner,$this->sDeclineReason);
                                 $imip = iMIP::load($this->oFolder->account->gwAccount);
                $imip->iMIP_Email($oItem,'decline',$aAttachment);
            }
        }
    }

    protected function setActionDeclineCounter()
    {
        $this->initFolderItemAndOwner($owner, $oItem, $hasPublicRoot);
        $aAttachment = $oItem->declineCounterInvitation($this->sAttachmentID,$owner,$this->sDeclineReason,$this->bIgnoreReason);
        $imip = iMIP::load($this->oFolder->account->gwAccount);
        $imip->iMIP_Email($oItem, 'declinecounter', $aAttachment, false, false, $oItem->from);
    }

    protected function setActionTentative()
    {
        $this->initFolderItemAndOwner($owner, $oItem, $hasPublicRoot);
        if ($oItem->wmclass == 'GW') {
             
            return $oItem->tentative();
        }
        $aAttachment = $oItem->tentativeInvitation($this->sAttachmentID,$owner);
        $imip = iMIP::load($this->oFolder->account->gwAccount);
        $imip->iMIP_Email($oItem, 'tentative', $aAttachment);
    }

    protected function setActionPropose()
    {
        $this->initFolderItemAndOwner($owner, $oItem, $hasPublicRoot);
        $aAttachment = $oItem->proposeInvitation($this->sAttachmentID,$owner,$this->sGWParams,$hasPublicRoot);
        $imip = iMIP::load($this->oFolder->account->gwAccount);
        $imip->iMIP_Email($oItem, 'propose', $aAttachment);
    }

    protected function setActionCertificate()
    {
        $oItem = $this->oFolder->getItem($this->sIID);
        $cert = $oItem->getCertificate(false, $this->sPassPhrase);        $aData['data'] = trim($cert['cert']);
        $oTargetAccount = $this->oUser->getAccount($this->sTargetAccount);
        if (!$oTargetAccount) {
            throw new Exc('account_invalid_id');
        }
        $oTargetFolder = $oTargetAccount->getFolder($this->sTargetFolder);
        if (!$oTargetFolder) {
            throw new Exc('folder_invalid_id');
        }
        $oTargetItem = $oTargetFolder->getItem($this->sTargetItem, NO_ADDONS);
        if (!$oTargetItem) {
            throw new Exc('item_invalid_id');
        }
        $certificate = new GroupWareAddon($oTargetItem, 'certificate');
        $certificate->create($aData);
    }

    protected function setActionDismiss()
    {
        foreach ($this->oDOMItems as $oDOMItem) {
            $sUID = $oDOMItem->getAttribute('uid');
            $oItem = $this->oFolder->getItem($sUID, NO_ADDONS);
            $oItem->setTimezone($this->sCTZ);
            $oItem->setTimestamp($this->sTimestamp);
            $oItem->dismiss();
        }
    }

    protected function setActionSnooze()
    {
        foreach ($this->oDOMItems as $oDOMItem) {
            $sUID = $oDOMItem->getAttribute('uid');
            $oItem = $this->oFolder->getItem($sUID, NO_ADDONS);
            $oItem->setTimezone($this->sCTZ);
            $oItem->setTimestamp($this->sTimestamp);
            $oItem->snooze($this->sMinutes);
        }
    }

    protected function setActionSaveItems()
    {
        $oItems = [];
        foreach($this->oDOMItems as $oDOMItem) {
            $oItems[] = $this->oFolder->getItem($oDOMItem->getAttribute('uid'));
        }
        $download = $this->oFolder->saveItems($oItems);
        $fullpath = $download['fullpath'];
        $class = $download['class'];
        $_SESSION['user']->closeSession();
        $this->aData['class'] = $class;
        $this->aData['fullpath'] = $fullpath;
        $this->aData['aid'] = slToolsPHP::htmlspecialchars($this->sAID);
        $this->aData['fid'] = slToolsPHP::htmlspecialchars($this->sFID);
        $this->aData['save_items'] = true;
        $this->sTemplateFile = 'webmailiqitems_set';
    }

    protected function setActionSubscribe()
    {
        foreach($this->oDOMItems as $oDOMItem) {
            $sUID = $oDOMItem->getAttribute('uid');
            $oItem = $this->oFolder->getItem($sUID);
            $oItem->subscribe();
        }
    }

    protected function setActionUnsubscribe()
    {
        foreach($this->oDOMItems as $oDOMItem) {
            $sUID = $oDOMItem->getAttribute('uid');
            $oItem = $this->oFolder->getItem($sUID);
            $oItem->unsubscribe();
        }
    }

    protected function setActionRecover()
    {
        if ($this->oFolder->type != 'G') {
            throw new Exc('not_supported');
        }

                 $aMapping = [];
        foreach ($this->oDOMDoc->query('/iq/items:query/items:account/items:folder/items:foldermapping') as $oFoldermapping) {
            $aMapping[$oFoldermapping->getAttribute('source')] = $oFoldermapping->getAttribute('destination');
        }

        if ($this->oDOMItems) foreach ($this->oDOMItems as $oDOMItem) {
            $sUID = $oDOMItem->getAttribute('uid');
            $oItem = $this->oFolder->getItem($sUID, NO_ADDONS);
            $oItem->recover($aMapping);
        }
    }

    protected function setActionSetWipe()
    {
        foreach($this->oDOMItems as $oDOMItem){
            $sUID = $oDOMItem->getAttribute('uid');
            $oItem = $this->oFolder->getItem($sUID,NO_ADDONS);
            $oItem->setwipe();
        }
    }

    protected function setActionResetWipe()
    {
        foreach($this->oDOMItems as $oDOMItem){
            $sUID = $oDOMItem->getAttribute('uid');
            $oItem = $this->oFolder->getItem($sUID,NO_ADDONS);
            $oItem->resetwipe();
        }
    }

    protected function setActionImportAttachment()
    {
                 $oItem = $this->oFolder->getItem($this->sIID);
        $result = $oItem->importAttachment($this->sPartID, $this->bDeleteAfterImport);
        $oFolder = $result['folder'];
        $oItem = $result['item'];
        $items = $this->cnvItems(array($oItem), array(), false, true, '1', false, false, $blocked, false, $this->sPassPhrase);

                 $this->sTemplateFile = 'webmailiqitems_get';
        $this->aData = array();
        $this->aData['aid'] = slToolsPHP::htmlspecialchars($_SESSION['EMAIL']);
        $this->aData['fid'] = slToolsPHP::htmlspecialchars($oFolder->name);
        $this->aData['items'] = $items;
        $this->aData['rights'] = Folder::rightsToString($oFolder->getMyRights());
        $this->aData['counter'] = 1;
        $this->aData['recent'] = 0;
        $this->aData['offset'] = 0;
    }

    protected function setActionLock()
    {
        if($this->oFolder->getType() != 'F' && $this->oFolder->getType() != 'I'){
            throw new Exc('item_invalid_type');
        }
        foreach($this->oDOMItems as $oDOMItem) {
            $sUID = $oDOMItem->getAttribute('uid');
            $oItem = $this->oFolder->getItem($sUID,NO_ADDONS);
            $oItem->lock();
        }
    }

    protected function setActionUnlock()
    {
        if ($this->oFolder->getType() != 'F' && $this->oFolder->getType() != 'I') {
            throw new Exc('item_invalid_type');
        }
        foreach ($this->oDOMItems as $oDOMItem) {
            $sUID = $oDOMItem->getAttribute('uid');
            $oItem = $this->oFolder->getItem($sUID, NO_ADDONS);
            $oItem->unlock();
        }
    }

    protected function setActionNotify()
    {
        $oItem = $this->oFolder->getItem($this->sIID, NO_ADDONS);
        if ($this->oFolder->getType() != 'F' && $this->oFolder->getType() != 'I') {
            throw new Exc('item_invalid_type');
        }
        $this->sCopyTo = MailParse::parseAddresses($this->sCopyTo);
        if (is_array($this->sCopyTo) && !empty($this->sCopyTo)) {
            foreach ($this->sCopyTo as $copy) {
                if (trim($copy['address'])) {
                    $copyTo[] = $copy['address'];
                }
            }
        }
        @$this->sCopyTo = join(';', $copyTo);
        $oItem->notify($this->sCopyTo, $this->bAll, $this->sComment);
    }

    protected function setActionRevertToRevision()
    {
        if ($this->oFolder->getType() != 'F' && $this->oFolder->getType() != 'I') {
            throw new Exc('item_invalid_type');
        }
        $oItem = $this->oFolder->getItem($this->sIID, NO_ADDONS);
        $oItem->revertToRevision($this->sRevision);
    }

    protected function setActionNotifyItem()
    {
        if ($this->oFolder->getType() != 'I' && $this->sAction != 'notify_item') {
            throw new Exc('folder_invalid_type');
        }
        $oItem = $this->oFolder->getItem($this->sIID, NO_ADDONS);
        $oItem->notifyGroupChat($this->sNotifyEmail);
    }

    protected function setActionNotifyGroupChat()
    {
        return $this->setActionNotifyItem();
    }

    protected function setActionAddPin()
    {
        $oItem = $this->oFolder->getItem($this->sIID, NO_ADDONS);
        $this->aData['items'][0]['last_pinned_item'] = $oItem->addPin($this->sAction == 'add_global_pin');
        $this->sTemplateFile = 'webmailiqitems_set';
    }

    protected function setActionAddGlobalPin()
    {
        return $this->setActionAddPin();
    }

    protected function setActionDeletePin()
    {
        $oItem = $this->oFolder->getItem($this->sIID, NO_ADDONS);
        $oItem->deletePin($this->sAction == 'delete_global_pin');
    }

    protected function setActionDeleteGlobalPin()
    {
        return $this->setActionDeletePin();
	}

	protected function setActionDocumentInvite()
    {
        $oItem = $this->oFolder->getItem($this->sIID, NO_ADDONS);
        $oItem->documentInvite($this->sDocExpire,$this->sDocEditable == '1',$this->sDocPass);
	}

	protected function setActionDocumentUninvite()
    {
        $oItem = $this->oFolder->getItem($this->sIID, NO_ADDONS);
        $oItem->documentUnInvite();
	}

	protected function setActionDocumentLink()
    {
        $oItem = $this->oFolder->getItem($this->sIID, NO_ADDONS);
        $oItem->documentLink($this->sTeamChatFolder, $this->sNote);
	}

	static public function separateFlags($flags)
	{
		$bin = decbin($flags);
		$len = strlen($bin);
		for($i = 0; $i < $len;$i++){
			if($bin[$i] == 1){
				$f[] = pow(2,$len - $i - 1);
			}
		}
		return $f;
	}

	 	 	 	 
	private function filterAndTags(){
		global $oDOMItem,$oDOMDoc;
		$oDOMDoc = $this->oDOMDoc;
		 		$aFilterTags = array();
		$aFilterTags['offset'] = 0;
		$aFilterTags['limit'] = '';
		$aFilterTags['sql'] = '';
		$aFilterTags['interval'] = '';
		$aFilterTags['tag'] = '';
		$aFilterTags['orderby'] = '';
		$aFilterTags['gwAddons'] = array();
		$aFilterTags['search'] = false;
		$aFilterTags['group'] = '';
		$aFilterTags['passphrase'] = '';
        $aFilterTags['contactGroupBy'] = false;
        $aFilterTags['meeting'] = false;
		 
		if ($this->oDOMItem = $this->oDOMDoc->getNode('items:item',$this->oDOMFolder)) {
			 			if ($oDOMFilter = $this->oDOMDoc->getNode('items:filter',$this->oDOMItem)){
				 				if ($oDOMLimit = $this->oDOMDoc->getNode("items:limit",$oDOMFilter)) {
					$aFilterTags['limit'] = intval($this->oDOMDoc->getNodeValue('items:limit',$oDOMFilter));
				}
				if ($oDOMOffset = $this->oDOMDoc->getNode("items:offset",$oDOMFilter)) {
					$this->aData['offset'] = $aFilterTags['offset'] = $this->oDOMDoc->getNodeValue('items:offset',$oDOMFilter);
				}
                if ($groupByEmail = $this->oDOMDoc->getNode("items:groupbyemail",$oDOMFilter)) {
                    $aFilterTags['contactGroupBy'] = ($groupByEmail->nodeValue == 'true');
                }
				 				if ($oDOMOrderBy = $this->oDOMDoc->getNode("items:order_by",$oDOMFilter)) {
					log_buffer("WARNING : usage of <order_by> tag is deprecated","EXTENDED");
					 				}
				 				if ($oSQL = $this->oDOMDoc->getNode('items:sql',$oDOMFilter)) {
					log_buffer("WARNING : usage of <sql> tag is deprecated","EXTENDED");
					 				}
				if ($oDOMInterval = $this->oDOMDoc->getNode('items:interval',$oDOMFilter)) {
					$aFilterTags['interval'] = $this->oDOMDoc->getNodeValue("items:interval",$oDOMFilter);
				}
				if ($oDOMFulltext = $this->oDOMDoc->getNode('items:fulltext',$oDOMFilter)) {
					$aFilterTags['fulltext'] = $this->oDOMDoc->getNodeValue("items:fulltext",$oDOMFilter);
				}
				if ($oDOMTimezone = $this->oDOMDoc->getNode('items:timezone',$oDOMFilter)) {
					$aFilterTags['timezone'] = $this->oDOMDoc->getNodeValue("items:timezone",$oDOMFilter);
				}
				if ($oDOMStarts = $this->oDOMDoc->getNode('items:startswith',$oDOMFilter)) {
					$aFilterTags['startswith'] = $this->oDOMDoc->getNodeValue("items:startswith",$oDOMFilter);
				}
				if ($oDOMTags = $this->oDOMDoc->getNode('items:tags',$this->oDOMItem)) {
					$aFilterTags['tags'] = true;
				}
				if ($oDOMSearch = $this->oDOMDoc->getNode('items:search',$oDOMFilter)) {
					$aFilterTags['search'] = $this->oDOMDoc->getNodeValue("items:search",$oDOMFilter);
				}
				if ($oDOMResetUnread = $this->oDOMDoc->getNode('items:reset_unread',$oDOMFilter)) {
					$aFilterTags['reset_unread'] = $this->oDOMDoc->getNodeValue("items:reset_unread",$oDOMFilter);
				}
				if ($oDOMFolder = $this->oDOMDoc->getNode('items:folder',$oDOMFilter)) {
					$aFilterTags['folder'] = $this->oDOMDoc->getNodeValue("items:folder",$oDOMFilter);
				}
                $this->setBoolValFromDOMDoc($aFilterTags['meeting'], 'items:meeting', $oDOMFilter);
				if ($oDOMSort = $this->oDOMDoc->getNode('items:sort',$oDOMFilter)) {
					$order_by = '';
					foreach($this->oDOMDoc->query("items:on",$oDOMSort) as $element){
						$order[] = $element->nodeValue.($element->getAttribute('reverse')?' ASC':' DESC');
					}
					if(empty($order)){
						foreach($this->oDOMDoc->query("items:*",$oDOMSort) as $element){
							$ad = strtolower($element->nodeValue)=='asc'?' ASC':' DESC';
							if(strtolower($element->tagName)=='lctphone'){
								$order[] = "CAST(COALESCE(NULLIF(lctphnmobile,'') ,NULLIF(lctphnwork1,'') ,NULLIF(lctphnfaxwork,''), NULLIF(lctphnhome1,'')) as {INTEGER})$ad";
							}else{
								$order[] = $element->tagName.$ad;
							}
						}
					}
					@$aFilterTags['orderby'] = join(',',$order);
				}
				if ($oDOMList = $this->oDOMDoc->getNode('items:show',$oDOMFilter)) {
					$offset = $oDOMList->getAttribute('from')?intval($oDOMList->getAttribute('from')):0;
					$limit = intval($oDOMList->nodeValue);
					$aFilterTags['offset'] = $offset;
					$aFilterTags['limit'] = $limit;
				}
			}
			 			if ($sIID = $this->oDOMItem->getAttribute('uid')) {
				if (strlen($aFilterTags['sql'])) {
					$aFilterTags['sql'] = '(' . $aFilterTags['sql'] . ') AND ';
				}
				$aFilterTags['sql'] .= "item_id='".$sIID."'";
			}
			 			if ($oDOMValues = $this->oDOMDoc->getNode('items:values',$this->oDOMItem)){
				$tagvalues = Tools::makeArrayFromXML($oDOMValues,true);
				$tags = @array_keys(Tools::makeArrayFromXML($oDOMValues,true));
				foreach ($tags as $key=>$tag){
					 					switch (strtolower($tag)) {
						case 'from':
							$tags[$key] = 'header_from';
							break;
						case 'tags':
							$tags[$key] = 'taglist';
							break;
						case 'to':
							$tags[$key] = 'header_to';
							break;
						case 'sms':
							$tags[$key] = 'header_sms';
							break;
						case 'ctz':
							unset($tags[$key]);
							$aFilterTags['timezone'] = $tagvalues[strtolower($tag)];
							break;
						 						 						 						case '#text':
							unset($tags[$key]);
							 							break;
						case 'clean_html':
							$tags[$key] = 'html';
							$this->bBlockExternal = true;
							break;
						case 'raw_html':
							$tags[$key] = 'html';
							$tags[-1] = 'raw_html';
							$this->bBlockExternal = false;
							break;
						default:
							 							break;
					}
				}
				 				$aFilterTags['tag'] = @implode(',',$tags);
			}
			 			if ($aFilterTags['tag'] == "#text") {
				$aFilterTags['tag']=false;
			}
			if (isset($this->oFolder->gw) && $this->oFolder->gw) {
				$aAddons = array(
					'recurrence'=>'recurrence',
					'reminders'=>'reminder',
					'contacts'=>'contact',
					'note'=>'note',
					'locations'=>'location',
				);
				
				foreach ($aAddons as $key => $addon) {
					if ($subnode = $this->oDOMDoc->getNode("items:".$key,$this->oDOMItem)) {
						$aFilterTags['gwAddons'][] = $addon;
					}
				}
				 				if ($sIID) {
					$sPrefix = (isset($this->type) && $this->type == 'C') ? 'ITM' : 'EVN';
					$aFilterTags['sql'] = $sPrefix."_ID='".$sIID."'";
				}
			}
			$oDOMItem = $this->oDOMItem;
		}
		return $aFilterTags;
	}
	
	 	 	 
     
	public static function cnvItems($items,$aFilterTag = array(),$callback = false,$bSingle = false,$partID = 1,$htmlspecialchars = true,$block_external = false,&$blocked = false,$download = false, $passphrase = '')
	{
		slSystem::import('tools/php');
		if (!is_array($items)) {
			return;
		}
		$rssDoc = false;
		$api = createobject('api');
        $aItems = [];
		foreach ($items as $oItem) {
			$aItem = array();
			$aItem["id"] = slToolsPHP::htmlspecialchars($oItem->itemID);
			switch($oItem->wmclass) {	
				 				case 'A':
					$aItem["gw"] = 1;
					$aItem["sFields"] = '<values>'.
											'<folder>'.slToolsPHP::htmlspecialchars($oItem->itemID).'</folder>'.
											'<display>'.slToolsPHP::htmlspecialchars($oItem->display).'</display>'.
											'<size>'.$oItem->size.'</size>'.
											'<responsible>'.slToolsPHP::htmlspecialchars($oItem->responsibleUsers).'</responsible>'.
										'</values>';	
					break;
				 				case 'Z':
					$aItem["gw"] = 1;
					$aItem["sFields"] = '<values>'.
											'<frtemail>'.slToolsPHP::htmlspecialchars($oItem->itemID).'</frtemail>'.
											'<frtname>'.slToolsPHP::htmlspecialchars($oItem->name).'</frtname>'.
											'<frtright>'.Folder::rightsToString($oItem->rights).'</frtright>'.
											'<frtisguest>'.$oItem->isGuest.'</frtisguest>'.
											'<frtisadmin>'.$oItem->isAdmin.'</frtisadmin>'.
											'<frtownerid>'.$oItem->item['OWNERID'].'</frtownerid>'.
										'</values>';					
					break;	
				 				case 'K':
					$aItem["id"] = $oItem->uid;
					$aItem["gw"] = 1;
					$aItem["sFields"] = '<values>'.
											'<tagname>'.slToolsPHP::htmlspecialchars($oItem->subject).'</tagname>'.
											'<tagcount>'.$oItem->size.'</tagcount>'.
											'<tagcolor>'.$oItem->from.'</tagcolor>'.
										'</values>';
					
				break;
				 				case 'M':
					$aItem = self::cnvMailItem($oItem,$aFilterTag,$partID,$htmlspecialchars,$block_external,$blocked,$download,$passphrase);
					 					$aItem["mail"] = 1;
					break;

				 				 				 				 				 				 				case 'GW':
				;
					$aItem = slToolsPHP::array_merge($aItem,$oItem->item);
					$aItem["sFields"] = $oItem->sFields;
                    if($aItem['EVNCLASS'] == 'I' && !empty($aItem['EVNURL']) && preg_match('/'.preg_quote($aItem['EVNURL'],'/').'[^\s]+/', $aItem['EVNNOTE'], $matches)){
                        $matches[0] = slToolsString::utf8_bad_replace(slToolsString::removeHTML($matches[0]));
                        $fields = preg_replace('/'.preg_quote('<evnurl>'.$aItem['EVNURL'], '/').'/','<evnurl>'.(slToolsPHP::htmlspecialchars($matches[0])), $aItem['sFields'], 1);
                        if(!empty($fields)) $aItem['sFields'] = $fields;
                        $aItem['EVNURL'] = $matches[0];
                    }
					break;
				 				 
				case 'Q':
					$aItem["owner"] = (string) Mail::addressToUTF8($oItem->owner);
					$aItem["sender"] = (string) Mail::addressToUTF8($oItem->sender);
					$oldAFilter = $aFilterTag;
					if($aFilterTag['tag'] != '*'){
						$array = explode(",",$aFilterTag['tag']);
						foreach($array as $item) {
							$array2[trim($item)] = 1;
						}
						$tags = $array2;
					}elseif(!isset($tags) || !is_array($tags)){
                        $tags = array(
                            'sndowner' => 1,
                            'sndemail' => 1,
                            'sndsubject' => 1,
                            'snddate' => 1,
                            'qdate' => 1
                        );
					}
					if ($tags['sndowner']) {
						$aItem['tag']['header_to'] = true;
						$aItem["to"] = $aItem["owner"];
					}
					if ($tags['sndemail']) {
						$aItem['tag']['header_from'] = true;
						$aItem["from"] = $aItem["sender"];
					}
					if ($tags['sndsubject']) {
						$aItem['tag']['header_subject'] = true;
						$aItem["subject"] = (string) $oItem->subject;
					}
					$aItem["domain"] = (string) $oItem->domain;
					$aItem["createdat"] = (string) $oItem->createdAt;
					$aItem["createdon"] = (string) $oItem->createdOn;
					$value = jdtounix($oItem->createdOn) + $oItem->createdAt -$_SESSION['TIMEZONE'];
					if($tags['qdate']){
						$aItem['tag']['qdate'] = true;
						$aItem["date"] = (string) $value;
					}
					$aItem['id'] = base64_encode($aItem['id']);
					if ($bSingle && $oItem->folder->type=='Q') {
						$aItem = slToolsPHP::array_merge(self::cnvMailItem($oItem,$oldAFilter,$partID,$htmlspecialchars,$block_external,$blocked,false,$passphrase),$aItem);
						$aItem["mail"] = 1;
						$aItem["quarantine"] = 0;
					}else{
						$aItem = Tools::htmlspecialchars_array($aItem);
						$aItem["quarantine"] = 1;
						$aItem["mail"] = 0;
					}
					break;
				 				case 'SL':
					$aItem["gw"] = 1;
					$aItem['sFields'] = '<values><lctemail1>'.slToolsPHP::htmlspecialchars($oItem->subject).'</lctemail1>'.
												'<itmtitle>'.slToolsPHP::htmlspecialchars($oItem->from).'</itmtitle>'.
												'<flags>'.$oItem->flags.'</flags></values>';
				break;
				case 'D':
					$aItem["gw"] = 1;
					$aItem['sFields'] ='<values><rmn_id>'.$oItem->rmn_id.'</rmn_id>'.
						'<evn_id>'.$oItem->evn_id.'</evn_id>'.
						'<evnrcr_id>'.$oItem->evnrcr_id.'</evnrcr_id>'.
						'<evntitle>'.slToolsPHP::htmlspecialchars($oItem->evntitle).'</evntitle>'.
						'<evnfolder>'.slToolsPHP::htmlspecialchars($oItem->evnfolder).'</evnfolder>'.
						'<evnclass>'.$oItem->evnclass.'</evnclass>'.
						'<evnstarttime>'.$oItem->evnstarttime.'</evnstarttime>'.
						'<evnstartdate>'.$oItem->evnstartdate.'</evnstartdate>'.
						'<evnendtime>'.$oItem->evnendtime.'</evnendtime>'.
						'<evnenddate>'.$oItem->evnenddate.'</evnenddate>'.
						'<evnmeetingid>'.$oItem->evnmeetingid.'</evnmeetingid>'.
						'<evnorganizer>'.slToolsPHP::htmlspecialchars($oItem->evnorganizer).'</evnorganizer>'.
						'<rmnlastack>'.$oItem->rmnlastack.'</rmnlastack>'.
						'<rmnminutesbefore>'.$oItem->rmnminutesbefore.'</rmnminutesbefore>'.
						'<reminderunixtime>'.$oItem->reminderunixtime.'</reminderunixtime>'.
						'<rmntime>'.$oItem->rmntime.'</rmntime></values>';
				break;
				case 'DEVICES':
					$aItem['gw'] = 1;
					$oItem->item = Tools::htmlspecialchars_array($oItem->item);
					if($oItem->settings_xml){
						$oItem->item['xml'] = slToolsPHP::htmlspecialchars($oItem->settings_xml);
					}
					$aItem['sFields'] = template('inc/templates/eas_devices.tpl',$oItem->item);
				
				break;
                default:
                    if(isset($oItem->sFields)) $aItem['sFields'] = $oItem->sFields;
			}
			
			if($callback){
				$cls = $callback['class'];
				$method = $callback['method'];
				
				$cls->$method($oItem,$aItem);
			}
			
			$aItems[] = $aItem;
			unset($aItem);
		}
		return $aItems;
	}
	
	protected static function getCnvMailItemBody(& $message, & $oItem, & $sBodyToIndex, & $aItem)
	{
	    $aItem['show_html_tag'] = true;
	    if ($message['html_body'] && $message['html_body'] != "<head><title></title></head>\n<body></body>") {
            $aItem['content-type'] = 'html';
                         $value = $message['html_body'];
                         if ($_SESSION['FULLTEXT'] && $value) {
                $sBodyToIndex = icewarp_get_message_content($oItem->getMessageFile(), '', DB_BODY_LIMIT, 0);
            }
            if (isset($message['html_base']) && $message['html_base']) {
                $aItem["base"] = $message['html_base'];
            }
	    } else {
            $value = '';
            if ($message['plain_body']) {
                if (strlen($message['plain_body']) > 1024000) {
                    $message['plain_body'] = substr($message['plain_body'], 0, 1024000) . '--- Truncated ---';
                }
                $aItem['plain'] = $message['plain_body'];

                $value = slToolsString::text2html(trim($message['plain_body']), true);
                $sBodyToIndex = $value;
            }
	    }
	    return $value;
	}


	static public function cnvMailItem($oItem,$aFilterTag = array(),$partID = 1,$htmlSpecial = true,$block_external = false,&$blocked = false,$download = false, $passphrase = '')
	{
		 		if ($aFilterTag['tag'] == '*') {
			$aFilterTag['tag'] = 'item_id, rid, size, date, flags, priority, static_flags, header_from, header_to, subject, html, text, color, bcc, cc, smime_status, deferred_delivery, has_attachment, attachments, confirm_addr,reply_to,in_reply_to,references,message_id, all_headers, x_message_id, tags, item_moved, certificate';
		}
		if(!$partID){
			$partID = 1;
		}
		$array = explode(",",$aFilterTag['tag']);
		foreach($array as $item) {
			$array2[trim($item)] = 1;
		}
		$aFilterTag['tag'] = $array2;
		$aItems = array();
		 		if (
			isset($aFilterTag['tag']['html'])
		||
			isset($aFilterTag['tag']['sanitized_html'])
		||
			isset($aFilterTag['tag']['attachments'])
		||
			isset($aFilterTag['tag']['text'])
		||
			isset($aFilterTag['tag']['raw_html'])
		||
			isset($aFilterTag['tag']['source'])
		||
			isset($aFilterTag['tag']['confirm_addr'])
		||
			isset($aFilterTag['tag']['all_headers']) 
		||
			isset($aFilterTag['tag']['x_message_id']) 
		||
			isset($aFilterTag['tag']['deferred_delivery']) 
		||
			isset($aFilterTag['tag']['sender']) 
		) {
            $newMessage = false;
			$message = $oItem->parseMessage(true,$partID,$newMessage,$block_external,$blocked,$download,isset($aFilterTag['tag']['source']),isset($aFilterTag['tag']['raw_html']),$passphrase, isset($aFilterTag['tag']['sanitized_html']));
 			 
			if (isset($aFilterTag['tag']['certificate'])) {
				$cert = $oItem->getCertificate($message,$passphrase);
				if($cert){
					$aItem['has_certificate'] = true;
					$aItem['certificate']['data'] = $cert['cert'];
					if(isset($cert['xmlinfo'])){
						$aItem['certificate']['info'] = $cert['xmlinfo'];
					}else{
						$aItem['certificate']['info'] = Storage::certInfo2XML( $cert['rawinfo'] );
					}
					$aItem['arrayinfo'] = $cert['rawinfo'];
				}
			}

			if (isset($message['headers']['custom-headers']['list-unsubscribe'])) {
				$aItem["list_unsubscribe"] = $message['headers']['custom-headers']['list-unsubscribe'];
			}

			if (isset($message['headers']['custom-headers']['list-unsubscribe-post'])) {
				$aItem["list_unsubscribe_post"] = $message['headers']['custom-headers']['list-unsubscribe-post'];
			}

			if (isset($aFilterTag['tag']['reply_to'])) {
				$aItem["reply_to"] = (string) ($message['headers']['reply-to']);
			}
			if (isset($aFilterTag['tag']['sender'])) {
				$aItem["sender"] = (string) ($message['headers']['sender'] ?? '');
			}
			if (isset($aFilterTag['tag']['all_headers'])) {
				$aItem["all_headers"] = $message['headers_plain'];
			}
			if(isset($aFilterTag['tag']['forward_fullpath']) &&  ($message['headers']['custom-headers']['x-forward-fullpath'] ?? false)){
				$aItem['forward_fullpath'] = $message['headers']['custom-headers']['x-forward-fullpath'];
			}
			if(isset($aFilterTag['tag']['reply_fullpath']) && ($message['headers']['custom-headers']['x-reply-fullpath'] ?? false)){
				$aItem['reply_fullpath'] = $message['headers']['custom-headers']['x-reply-fullpath'];
			}
			
			 			if (isset($aFilterTag['tag']['text']) && $aFilterTag['tag']['text']) {
				if (isset($message['plain_body'])) {
					if(strlen($message['plain_body']) > 1024000){
						$message['plain_body'] = substr($message['plain_body'],0,1024000).'--- Truncated ---';
					}
					$aItem['content-type'] = 'text';
					$sBodyToIndex = $aItem["text"] = rtrim($message['plain_body']);
				} else {
					if(isset($message['html_body'])){
						slSystem::import('tools/string');
						$aItem['text'] = slToolsString::removeHTML($message['html_body']);
					}else{
						$aItem["text"] = '';
					}
				}
			}
			if (isset($aFilterTag['tag']['source']) && $aFilterTag['tag']['source']) {
				$aItem['source'] = $message['source'];
			}
			 			$aItem['show_html_tag'] = false;
			if ((isset($aFilterTag['tag']['html']) && $aFilterTag['tag']['html']) || (isset($aFilterTag['tag']['sanitized_html']) && $aFilterTag['tag']['sanitized_html'])) {
			    $aItem["html"] = self::getCnvMailItemBody($message, $oItem, $sBodyToIndex, $aItem);
			}
			
			$aItem['content-type'] = $message['content-type'];
			if ($_SESSION['FULLTEXT'] && $sBodyToIndex && strtolower($oItem->wmclass) == 'm'){
				$oItem->updateItem(array('body' => substr($sBodyToIndex,0,32000)));
			}
			 			if (isset($aFilterTag['tag']['attachments'], $message['attachments']) && 	$aFilterTag['tag']['attachments'] && 	$message['attachments']) {
				foreach($message['attachments'] as $attachment){
					$attachment['size'] = (int) $attachment['size'];
					$aItem['attachments']['num'][] = $attachment;
				}
			}
			if(isset($aFilterTag['tag']['has_embedded_attachment']) && $message['has_embedded_attachment']){
				$aItem['has_embedded_attachment'] = true;
			}

			 			 			if (isset($aFilterTag['tag']['confirm_addr'])
				&& 	$aFilterTag['tag']['confirm_addr']
				&& 	(isset($message['headers']['custom-headers']['x-confirm-reading-to']) || isset($message['headers']['custom-headers']['disposition-notification-to']))
            ) {
				$aItem['confirm_addr'] = (string) ($message['headers']['custom-headers']['x-confirm-reading-to']);
				if (!$aItem['confirm_addr']) {
					$aItem['confirm_addr'] = (string) ($message['headers']['custom-headers']['disposition-notification-to']);
				}
			}
			if (isset($message['headers']['subject'])) {
				$oItem->subject = $message['headers']['subject'];
			}
			
			if (isset($message['headers']['from'])) {
				$oItem->from = $message['headers']['from']; 
			}
			if (isset($message['headers']['to'])) {
				$oItem->to = $message['headers']['to'];
			}

			if (isset($message['headers']['custom-headers']['deferred-delivery'])) {
				$oItem->deferred_delivery = $message['headers']['custom-headers']['deferred-delivery'];
			}

			 			if (isset($aFilterTag['tag']['cc']) && $aFilterTag['tag']['cc'] && $message['headers']['cc']) {
				$aItem['cc'] = (string) ($message['headers']['cc']);
			}
			 			if (isset($aFilterTag['tag']['bcc']) && $aFilterTag['tag']['bcc'] && $message['headers']['bcc']) {
				$aItem['bcc'] = (string) ($message['headers']['bcc']);
			}
			if (isset($message['headers']['size'])) {
				$oItem->size =  $message['headers']['size'];
			}
			if (isset($message['headers']['date'])) { 
				$oItem->formattedDate = $message['headers']['date'];
			}
			if (isset($message['headers']['x-message-id'])) { 
				$oItem->x_message_id = $message['headers']['x-message-id'];
			}
			if (isset($message['headers']['x-icewarp-server-request'])) {
				$oItem->x_icewarp_server_request = $oItem->parseIceWarpServerRequest($message['headers']['x-icewarp-server-request']);
			}
			if (isset($message['headers']['x-icewarp-server-teamchat-notifications'])) {
				$oItem->x_icewarp_server_teamchat_notifications = $oItem->parseIceWarpTeamchatNotifications($message['headers']['x-icewarp-server-teamchat-notifications']);
			}
			if (isset($message['headers']['x-icewarp-server-invite-request'])) {
				$oItem->x_icewarp_server_invite_request = $oItem->parseIceWarpServerRequest($message['headers']['x-icewarp-server-invite-request']);
			}
			if (isset($message['headers']['x-icewarp-personality-request'])) {
				$val = $message['headers']['x-icewarp-personality-request'];
				$val = str_replace(" ","",$val);
				preg_match("#user(\s|\t)?+=(\s|\t)?(\")?([^\"^\s^\r^\n^;]{1,})(;)?(\")?(;)?#i",$val,$matches);
				$user = $matches[4];
				preg_match("#email(\s|\t)?+=(\s|\t)?(\")?([^\"^\r^\n^;]{1,})(;)?(\")?(;)?#i",$val,$matches);
				$email = $matches[4];
				preg_match("#hash(\s|\t)?+=(\s|\t)?(\")?([^\"^\s^\r^\n^;]{1,})(;)?(\")?(;)?#sui",$val,$matches);
				$hash = $matches[4];
				$oItem->x_icewarp_personality_request['user'] = urldecode($user);
				$oItem->x_icewarp_personality_request['email'] = urldecode($email);
				$oItem->x_icewarp_personality_request['hash'] = urldecode($hash);
			}
			if (isset($message['headers']['x-icewarp-smartattach'])) {
				$smartAttachments = MailParse::parseSmartAttachments($message);
				if(is_array($smartAttachments) && !empty($smartAttachments)){
					foreach($smartAttachments as $attach){
						$attach['part_id'] = $message['headers']['x-icewarp-smartattach-prefix'].$attach['part_id'];
						$aItem['attachments']['num'][] = $attach;
					}
					$oItem->hasAttachments = true;
					$aItem['smart_attach'] = true;
				}
			}
			if (isset($message['headers']['x-icewarp-conference'])) {
				$oItem->x_icewarp_conference = $message['headers']['x-icewarp-conference'];
			}
			if (isset($message['headers']['x-icewarp-voicemail'])) {
				$oItem->x_icewarp_voicemail = $message['headers']['x-icewarp-voicemail'];
			}
			if (isset($message['headers']['custom-headers']['x-icewarp-teamchatroom'])) {
				$oItem->x_icewarp_teamchat = $message['headers']['custom-headers']['x-icewarp-teamchatroom'];
			}
			if (isset($message['headers']['custom-headers']['x-icewarp-teamchatcomment'])) {
				$oItem->x_icewarp_teamchatcomment = $message['headers']['custom-headers']['x-icewarp-teamchatcomment'];
			}
			if (isset($message['headers']['sender'])) {
				$oItem->sender = $message['headers']['sender'];
			}
		}
		if(isset($aFilterTag['tag']['tags']) || isset($aFilterTag['tag']['taglist'])){
			 			@$tags = explode(" ",$oItem->taglist);
			if(is_array($tags) && !empty($tags)){
				foreach($tags as $key => $val){
					$tags[$key] = slToolsString::urldequote($val);
				}
			}
			$tags = join(', ',$tags);
			$aItem['tags'] = $tags;
		}
	
		if (isset($oItem->x_icewarp_server_request)) {
			$aItem["x_icewarp_server_request"] =$oItem->x_icewarp_server_request;
		}
		if (isset($oItem->x_icewarp_server_invite_request)) {
			$aItem["x_icewarp_server_invite_request"] =$oItem->x_icewarp_server_invite_request;
		}
		if (isset($oItem->x_icewarp_server_teamchat_notifications)) {
			$aItem["x_icewarp_server_teamchat_notifications"] =$oItem->x_icewarp_server_teamchat_notifications;
		}
		if (isset($oItem->x_icewarp_personality_request)) {
			$aItem["x_icewarp_personality_request"] =$oItem->x_icewarp_personality_request;
		}
		if (isset($oItem->x_icewarp_voicemail)) {
			$aItem["x_icewarp_voicemail"] =$oItem->x_icewarp_voicemail;
		}
		if (isset($oItem->x_icewarp_conference)) {
			$aItem["x_icewarp_conference"] =$oItem->x_icewarp_conference;
		}
		if (isset($oItem->x_icewarp_teamchat)) {
			$aItem["x_icewarp_teamchat"] =$oItem->x_icewarp_teamchat;
		}
		if (isset($oItem->x_icewarp_teamchatcomment)) {
			$aItem["x_icewarp_teamchatcomment"] =base64_decode($oItem->x_icewarp_teamchatcomment);
		}
		if (isset($aFilterTag['tag']['static_flags'])) {
			$aItem["static_flags"] = (string) $oItem->staticFlags;$aItem["has_st_flags"] = true;
		}
		if (isset($aFilterTag['tag']['smime_status'])) {
			$aItem["smime_status"] = (string) $oItem->sMimeStatus;$aItem["has_smime"] = true;
		}
		if (isset($aFilterTag['tag']['color'])) {
			$aItem["color"] = (string) $oItem->color;$aItem["has_color"] = true;
		}
		if (isset($aFilterTag['tag']['has_attachment'])) {
			$aItem["has_attachment"] = $oItem->hasAttachments ? 'true' : 'false';
		}
		if (isset($aFilterTag['tag']['flags'])) {
			$aItem["flags"] = (string) $oItem->flags;
			$aItem["has_flags"] = true;
			if(!((int) $aItem["flags"] & Item::FLAG_SEEN)){
				$aItem['recent'] = true;
			}
		}
		if (isset($aFilterTag['tag']['size'])) {
			$aItem["size"] = (string) $oItem->size;
		}
		if (isset($aFilterTag['tag']['reply_to'])) {
			$aItem["reply_to"] = (string) ($message['headers']['reply-to']);
		}
		if (isset($aFilterTag['tag']['priority'])) {
			$aItem["priority"] = (string) $oItem->priority;
		}
		if (isset($aFilterTag['tag']['date'])) {
			$aItem["timestamp"] = $oItem->date;
			$aItem["date"] = $oItem->date;
			if(!isset($oItem->formattedDate) && $partID == 1){
				$oItem->formattedDate = $oItem->date;
			}
			if($partID != 1 && $date = strtotime($oItem->formattedDate)){
			    $aItem["date"] = $date;
			}
		}
		if (isset($aFilterTag['tag']['subject'])) {
			$aItem["subject"] = (string) ($oItem->subject); $aItem["has_subject"] = true;
			$aItem["subject"] = slToolsString::utf8_bad_replace($aItem['subject'],' ',true);
		}

		if (isset($aFilterTag['tag']['header_sms']) && (isset($message['headers']['sms']) || $oItem->sms)) {
			$aItem['sms'] = $oItem->sms ? $oItem->sms : (string) $message['headers']['sms'];
			$aItem['html'] = $message['plain_body'];
		}

		if (isset($aFilterTag['tag']['header_from'])) {
			$aItem["from"] = (string) iconv_substr($oItem->from,0,2000,'UTF-8');
			
			$aItem["from"] = slToolsString::utf8_bad_replace($aItem['from'],' ',true);
		}
		if (isset($aFilterTag['tag']['header_to']) && $oItem->to) {
		    $aItem["to"] = (string) $oItem->to;
		    $aItem["to"] = slToolsString::utf8_bad_replace($aItem['to'],' ',true);
		}
		if (isset($aFilterTag['tag']['in_reply_to']) && isset($message['headers']['in-reply-to']) && $message['headers']['in-reply-to']) {
		    $aItem["in-reply-to"] = (string) $message['headers']['in-reply-to'];
		}
		if (isset($aFilterTag['tag']['references']) && isset($message['headers']['references']) && $message['headers']['references']) {
		    $aItem["references"] = (string) $message['headers']['references'];
		}
		if (isset($aFilterTag['tag']['message_id']) && $oItem->message_id) {
		    $aItem["message_id"] = (string) $oItem->message_id;
		}
		if (isset($aFilterTag['tag']['x_message_id']) && $oItem->x_message_id) {
		    $aItem["x_message_id"] = (string) $oItem->x_message_id;
		}
		if (isset($aFilterTag['tag']['deferred_delivery']) && isset($oItem->deferred_delivery) && $oItem->deferred_delivery) {
			$aItem["deferred_delivery"] = (string) $oItem->deferred_delivery;
		}
		if (isset($aFilterTag['tag']['item_moved']) && $oItem->item_moved) {
			$aItem["item_moved"] = (int) $oItem->item_moved;
		}
		$aItem['id'] = $oItem->itemID;
		if($htmlSpecial){
			$aItem = Tools::htmlspecialchars_array($aItem);
		}
		return $aItem;
	}
	public static function cnvRSSItem($oItem,$aFilterTag = array(),$partID = 1,&$account = false,&$folder = false,&$rssDoc = false)
	{
		 		if ($aFilterTag['tag'] == '*') {
			$aFilterTag['tag'] = 'item_id, rid, size, date, flags, priority, static_flags, header_from, header_to, subject, html, text, color, bcc, cc, smime_status, has_attachment, attachments, confirm_addr, taglist';
		}
		$array = explode(",",$aFilterTag['tag']);
		foreach($array as $item) {
			$array2[trim($item)] = 1;
		}
		$aFilterTag['tag'] = $array2;
		$aItems = array();
		 		if (isset($aFilterTag['tag']['html']) || isset($aFilterTag['tag']['text'])) {
			$rss = RSS::instance($account);
			 			if (isset($aFilterTag['tag']['text']) && $aFilterTag['tag']['text']) {
				$sBodyToIndex = $aItem["text"] = $oItem->getText();
			}
			 			if (isset($aFilterTag['tag']['html']) && $aFilterTag['tag']['html']) {
                $base = null;
				$aItem["html"] = $oItem->getHTML($aItem,$base);
				if (!$sBodyToIndex) {
					$sBodyToIndex = $aItem["html"];
				}
				if ($base) {
				    $aItem["base"] = $base;
				}
			}
		}
		if (isset($aFilterTag['tag']['static_flags'])) {
			$aItem["static_flags"] = (string) $oItem->staticFlags;
			$aItem["has_st_flags"] = true;
		}
		if (isset($aFilterTag['tag']['smime_status'])) {
			$aItem["smime_status"] = (string) $oItem->sMimeStatus;
			$aItem["has_smime"] = true;
		}
		if (isset($aFilterTag['tag']['color'])) {
			$aItem["color"] = (string) $oItem->color;
			$aItem["has_color"] = true;
		}
		if (isset($aFilterTag['tag']['has_attachment'])) {
			$aItem["has_attachment"] = $oItem->hasAttachments ? 'true' : 'false';
		}
		if (isset($aFilterTag['tag']['flags'])) {
			$aItem["flags"] = (string) $oItem->flags;
			$aItem["has_flags"] = true;
		}
		if (isset($aFilterTag['tag']['size'])) {
			$aItem["size"] = (string) $oItem->size;
		}
		if (isset($aFilterTag['tag']['reply_to'])) {
			$aItem["reply_to"] = (string) $oItem->reply_to;
		}
		if (isset($aFilterTag['tag']['priority'])) {
			$aItem["priority"] = (string) $oItem->priority;
		}
		if (isset($aFilterTag['tag']['date'])) {
			$aItem["date"] = (string) $oItem->date;
		}
		if (isset($aFilterTag['tag']['subject'])) {
			$aItem["subject"] = (string) slToolsPHP::htmlspecialchars($oItem->subject);
			$aItem["has_subject"] = true;
		}
		if (isset($aFilterTag['tag']['header_from'])) {
			$aItem["from"] = (string) ($oItem->from);
		}
		 		$aItem['id'] = $oItem->itemID;
		return $aItem;
	}
	
	public function handleItemError($e,$edit = false)
	{
		switch($e->wmcode){
			case 'attachment_add':
				
				$i = explode('|',$e->message);
				$reason = $i[0];
				$this->sTemplateFile = 'error_attachment_size';
				switch($reason){
					 					case 8:
					 					case 34:
						$this->aData['error_uid'] = 'mailbox_quota_limit';
						break;
					 					case 9:
						$this->aData['error_uid'] = 'attachment_virus';
						break;
					case 36:
						$this->aData['error_uid'] = 'attachment_blocked_by_filters';
						break;
					default:
						$this->aData['error_uid'] = 'attachment_add';
					break;
				}
				$this->isError = true;
				$this->aData['account'] = $this->sAID;
				$this->aData['folder'] = $this->sFID;
				$this->aData['reason'] = $reason;
				$this->aData['item'] = $i[1];
				$this->aData['attachment'] = $i[2];
				if(!$edit){
					$this->oFolder->deleteItem($this->aData['item'],false,false,false,false,' ',true,true,true);
				}
				return;
				break;
			case 'attachment_file_not_found':
				switch($this->oFolder->getType()){
					case 'F':
					case 'I':
						$i = explode('|',$e->message);
						$reason = $i[0];						
						$this->isError = true;
						$this->aData['account'] = $this->sAID;
						$this->aData['folder'] = $this->sFID;
						$this->aData['reason'] = 'attachment_is_missing';
						$this->aData['item'] = $i[1];
						$this->aData['attachment'] = $i[2];
						if(!$edit){
							$this->oFolder->deleteItem($this->aData['item'],false,false,false,false,' ',true);
						}
						throw $e;
					break;
				}
				break;
			case 'attendee_email_invalid':
				$i = explode('|',$e->message);
				if(!$edit){
					$this->oFolder->deleteItem($i[1], false, false, false, false, ' ', true , true);
				}
				throw new Exc('attendee_email_invalid',$i[0]);
				break;
			default:
				throw $e;
			break;
		}
	}

	protected function setActionCollaborationReset()
    {
        $this->sTemplateFile = 'webmailiqitems_set';
        $this->sIID = $this->oFolder->account->gwAPI->FunctionCall('ResetItemID', $this->oFolder->sFID, $this->sIID);
        $this->aData['id'] = $this->sIID;
    }
}
?>