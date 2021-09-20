<?php
 
class WebmailIqFolders extends XMLRequestInterface
{

    public $aActions = array(
        'edit' => 1,
        'delete' => 1,
        'add' => 1,
        'sync' => 1,
        'empty' => 1,
        'markasread' => 1,
        'markasunread' => 1,
        'search' => 1,
        'save_items' => 1,
        'copyall' => 1,
        'moveall' => 1,
        'remove_member' => 1,
        'add_member' => 1,
        'notify_limit' => 1,
		'refresh' => 1
    );

    private $oDOMAccount;      private $oDOMFolder;       private $sAID;          private $sFID;      
	protected $oFolder;
	protected $parentFolderId;

    public $sAction;  
    public $oDOMQuery;
    public $aAccounts;
    public $rssAccount;
    public $oDOMVirtual;
    public $oDOMType;
    public $oDOMSearchString;
    public $oDOMShareString;
    public $sShareSet;
    public $oDOMFolders;
    public $sSearchSet;
    public $sSearch;
    public $sFAction;
    public $oDOMCloneRoom;
    public $oDOMAcl;
    public $oDOMName;
    public $oDOMDoc;
    public $gwFolder;
    public $sFolderName;
    public $sFType;
    public $sChannelURL;
    public $bCloneRoom;
    public $sPrivate;
    public $sCloneRoom;
    public $sNewName;
    public $sNewChannel;
    public $channels;
    public $sSubscription;
    public $sDefault;
    public $sShareType;
    public $bNotify;
    public $virtual;
    public $acl;
    public $removeAcl;
    public $sDestinationAccount;
    public $sDestinationFolder;
    public $sRemoveAccount;
    public $sTo;
    public $sComment;
    public $special;

	 
    public function __construct($oDOMQuery, &$oDOMDoc, &$attrs)
	{
		$this->oDOMQuery = $oDOMQuery;
		$this->oDOMDoc = &$oDOMDoc;
		$this->aAttrs = &$attrs;
		$this->loadUser();
		 		$this->aAccounts = $_SESSION['user']->getAccounts();
		$this->checkInputXML();
		$this->exeInputXML();
	}

	 
	private function checkInputXML()
	{
		
		         if (!$this->oDOMAccount = $this->oDOMDoc->getNode("folders:account", $this->oDOMQuery)) {
            throw new Exc('folder_missing_tag', 'account');
		}
		         if (!$this->sAID = $this->oDOMAccount->getAttribute("uid")) {
			throw new Exc('folder_missing_account_id');
		}
        switch ($this->aAttrs['type']) {
			 			 			 			case 'get':
				 				if($this->sAID[0] == '@'){
					$this->special = $this->sAID;
				}elseif (!$this->aAccounts[$this->sAID]) {
					throw new Exc('account_invalid_id', $this->sAID);
				}
				                 if ($this->oDOMFolder = $this->oDOMDoc->getNode("folders:folder", $this->oDOMAccount)) {
					$this->sFID = $this->oDOMFolder->getAttribute('uid');
				}
			break;
			 			case 'set':
				 				if (!$this->oDOMFolder = $this->oDOMDoc->getNode(
					"folders:folder",
					$this->oDOMAccount
                )) {
                    throw new Exc('folder_missing_tag', 'folder');
				}
				                 if (!$this->sAction = $this->oDOMFolder->getAttribute("action")) {
                    throw new Exc('folder_missing_tag', 'action');
				}
				$this->aAttrs['action'] = $this->sAction;
				                 if (!isset($this->aActions[$this->sAction])) {
                    throw new Exc('folder_invalid_action', $this->sAction);
				}
				
				                 if (!($this->sFType = $this->oDOMDoc->getNodeValue("folders:type", $this->oDOMFolder)) && !$this->sAction == 'add') {
                    throw new Exc('folder_missing_tag', 'type');
				}
				                 if ((!$this->sFID = $this->oDOMFolder->getAttribute("uid")) && ($this->sAction != 'add')) {
					throw new Exc('folder_missing_id');
				}
				 				                 if (!$this->aAccounts[$this->sAID]) {
					$rssAccount = false;
					                     if ($this->sFType == 'R') {
                        $this->rssAccount = new RSSAccount($_SESSION['user'], $this->sAID);
						$this->rssAccount->description = 'RSS';
						$_SESSION['user']->aAccounts[$this->sAID] = $this->rssAccount;
					}
					                     if (!$this->rssAccount) {
                        throw new Exc('account_invalid_id', $this->sAID);
					}
				}
                if ($this->oDOMDoc->getNode("folders:name", $this->oDOMFolder)) {
                    $this->sFolderName = $this->oDOMDoc->getNodeValue("folders:name", $this->oDOMFolder);
				}
				                 if ($this->oDOMDoc->getNode("folders:channel", $this->oDOMFolder)) {
                    $this->sChannelURL = trim($this->oDOMDoc->getNodeValue("folders:channel", $this->oDOMFolder));
				}
				if ($this->oDOMSearchString = $this->oDOMDoc->getNode("folders:search", $this->oDOMFolder)) {
					$this->sSearchSet = true;
					$this->sSearch = $this->oDOMSearchString->nodeValue;
				}
				if ($this->oDOMVirtual = $this->oDOMDoc->getNode("folders:virtual", $this->oDOMFolder)) {
                    if ($this->oDOMType = $this->oDOMDoc->getNode("folders:type", $this->oDOMFolder)) {
						$this->sFType = $this->oDOMType->nodeValue;
					}
                    if ($this->oDOMShareString = $this->oDOMDoc->getNode("folders:sharetype", $this->oDOMVirtual)) {
						$this->sShareSet = true;
						$this->sShareType = $this->oDOMShareString->nodeValue;
					}
					$virtualIDs = array();
                    if ($this->oDOMFolders = $this->oDOMDoc->getNode("folders:folders", $this->oDOMVirtual)) {
                        foreach ($this->oDOMDoc->query("folders:folder", $this->oDOMFolders) as $virtualFolder) {
							$virtualIDs[] = $virtualFolder->nodeValue;
							$primary = strtolower($virtualFolder->getAttribute('primary'));
                            if ($primary) {
								$this->virtual['primary'] = $virtualFolder->nodeValue;
							}
						}
					}
					$this->virtual['type'] = $this->sFType;
					$this->virtual['folders'] = $virtualIDs;
                    if ($this->sSearchSet) {
						$this->virtual['search'] = $this->sSearch;
					}
					$this->sFType = 'V';
                    if ($this->sFAction == 'add') {
						$this->sFID = VirtualHandler::decode($this->sFID);
					}
				}
                if ($bNotify = $this->oDOMDoc->getNode(
					"folders:notify",
					$this->oDOMFolder
                )) {
					$this->bNotify = $this->oDOMDoc->getNodeValue(
						"folders:notify",
						$this->oDOMFolder
					);
				}
				                 switch ($this->sAction) {
					case 'add':
                        if ($newFolderChannelsNode = $this->oDOMDoc->getNode(
							"folders:channels",
							$this->oDOMFolder
                        )) {
                            foreach ($this->oDOMDoc->query('folders:channel', $newFolderChannelsNode) as $oDOMChannel) {
							$this->channels[] = $oDOMChannel->nodeValue;
							}
						}
                        $this->sPrivate = $this->oDOMDoc->getNodeValue(
							"folders:private",
							$this->oDOMFolder
						);
                        if ($this->oDOMCloneRoom = $this->oDOMDoc->getNode("folders:clone", $this->oDOMFolder)) {
							$this->bCloneRoom = true;
							$this->sCloneRoom = $this->oDOMCloneRoom->nodeValue;
						}
					break;
					case 'edit':
						$this->removeAcl = false;
						                         if ($this->oDOMAcl = $this->oDOMDoc->getNode(
							'folders:acl',
							$this->oDOMFolder
                        )) {
                            foreach ($this->oDOMDoc->query('folders:right', $this->oDOMAcl) as $oDOMRight) {
                                $email = $oDOMRight->getAttribute('email');
								$this->acl[$email] = Folder::rightsToBitValue($oDOMRight->nodeValue);
							}
                            if (count($this->acl) == 0) {
								$this->removeAcl = true;
							}
						}
                        if ($this->oDOMName = $this->oDOMDoc->getNode(
							'folders:name',
							$this->oDOMFolder
                        )) {
							$this->sNewName = $this->oDOMDoc->getNodeValue(
								"folders:name",
								$this->oDOMFolder
							);
						}
                        if ($newFolderChannelNode = $this->oDOMDoc->getNode(
							"folders:channel",
							$this->oDOMFolder
                        )) {
							$this->sNewChannel = trim($this->oDOMDoc->getNodeValue(
								"folders:channel",
								$this->oDOMFolder
							));
						}
                        if ($newFolderChannelsNode = $this->oDOMDoc->getNode(
							"folders:channels",
							$this->oDOMFolder
                        )) {
							$this->channels = array();
                            foreach ($this->oDOMDoc->query('folders:channel', $newFolderChannelsNode) as $oDOMChannel) {
							$this->channels[] = $oDOMChannel->nodeValue;
							}
						}

							
                        if ($sSubscription = $this->oDOMDoc->getNode(
							"folders:subscribed",
							$this->oDOMFolder
                        )) {
							$this->sSubscription = $this->oDOMDoc->getNodeValue(
								"folders:subscribed",
								$this->oDOMFolder
							);
						}
                        if ($sDefault = $this->oDOMDoc->getNode(
							"folders:default",
							$this->oDOMFolder
                        )) {
							$this->sDefault = $this->oDOMDoc->getNodeValue(
								"folders:default",
								$this->oDOMFolder
							);
						}
					break;
					case 'moveall':
					case 'copyall':
					case 'empty':
                        $this->sDestinationAccount = $this->oDOMDoc->getNodeValue("folders:account", $this->oDOMFolder);
                        $this->sDestinationFolder = $this->oDOMDoc->getNodeValue("folders:folder", $this->oDOMFolder);
					break;
					case 'add_member':
					case 'notify_limit':		
                        $this->sTo = $this->oDOMDoc->getNodeValue("folders:to", $this->oDOMFolder);
                        $this->oDistrib = $this->oDOMDoc->getNode("folders:distrib", $this->oDOMFolder);
                        $this->sComment = $this->oDOMDoc->getNodeValue("folders:comment", $this->oDOMFolder);
					break;
					case 'remove_member':
                        $this->sRemoveAccount = $this->oDOMDoc->getNodeValue("folders:account", $this->oDOMFolder);
					break;
					default:
					break;
				}
			break;
		}
	}

	protected function getFolders($account)
	{
		 		if ($this->sFID) {
			$folder = $account->getFolder($this->sFID);
			switch ($folder->type) {
				case 'SL':
					if (!$account->sharedAccount) {
						$account->sharedAccount = new SharedAccountAccount(
							$oUser,
							$_SESSION['EMAIL'] . '_shared',
							$this
						);
					}
					$account = &$account->sharedAccount;
					break;
				case 'D':
					$account = &$account->remindersAccount;
					break;
				case 'V':
					$account = &$account->virtualAccount;
					break;
				case 'C':
				case 'E':
				case 'T':
				case 'N':
				case 'J':
				case 'F':
				case 'Y':
				case 'I':
					$folder->openAccess();
					$account = &$account->gwAccount;
					break;
			}
			$this->aData['single'] = true;
			try {
				 
				$folder->rights = $account->getMyRights($this->sFID);
				Folder::checkRights($folder, Folder::RIGHT_ADMIN);
				$folder->acl = $account->getAcl($this->sFID, $folder->getType() == 'I' || $folder->getType() == 'Y');
				$sizeFolder = $account->getFolder('__@@SIZE@@__/' . $folder->groupOwner);
				$folder->size = $sizeFolder->getSize();
				$folder->quota = $sizeFolder->getQuota();
				$inherited = true;
				if ($folder->acl) {
					@$someUserRight = reset($folder->acl);
					if ($someUserRight & Folder::RIGHT_INHERITED) {
						$inherited = true;
					} else {
						$inherited = false;
					}
				}
				$folder->inherited = $inherited;
			} catch (Exc $e) {

			}
			if ($folder->isRSS()) {
				$folder->channels = $folder->getChannels();
			}
			$folders[$folder->name] = $folder;
		} else {
			$parentFolder = null;
			if(!empty($this->parentFolderId) && is_callable([$account, 'getFolderIfExists'])){
				$parentFolder = $account->getFolderIfExists($this->parentFolderId, false);
			}
			$folders = $account->getFolders(false, $parentFolder);
			 			if (isset($account->folders['main']) && count($account->folders['main']) == 0) {
				$account->sync();
				$folders = $account->getFolders(false, $parentFolder);
			}
			if ($gwtrash = $account->getGWTrash()) {
				$folders[] = $gwtrash;
			}
		}
		return $folders;
	}

	protected function getSpecialFolders($account)
	{
		if(empty($this->sFID)){
			return $account->getFolders();
		}
		$folder = $account->getFolder($this->sFID);
		$folder->getSubfolders();
		return [$folder];
	}

	protected function exeGetInputXML()
	{
		 		$oUser = &$_SESSION['user'];
		if(!empty($this->special)){
			$folders = $this->getSpecialFolders($oUser->getAccount($this->sAID));
		}else {
			$folders = $this->getFolders($oUser->getAccount($this->sAID));
		}
		$this->sTemplateFile = 'webmailiqfolders_get';
		$this->aData['aid'] = $this->sAID;
		$this->aData['folder'] = $this->cnvFolders($folders, false, true);  	}

	 
	protected function checkNewFolderForTC($oAccount)
	{
		if(!preg_match('/(?P<dir>.*)\/[^\/]+$/', $this->sFolderName, $matches)) return false;
		$parentFolder = null;
		try {
			$parentFolder = $oAccount->getFolder($matches['dir']);
		}catch (Exc $exc){
			try {
				$parentFolder = (is_object($oAccount->account)) ? $oAccount->account->getFolder($matches['dir']) : null;
			}catch (Exc $exc){}
		}
		 		if(strpos($matches['dir'],'@##internalservicedomain.icewarp.com##') !== false && $this->sFType == 'I'){
			return true;
		}
		if($parentFolder instanceof Folder){
			 			if(($parentFolder->type == 'I' || $parentFolder->type == 'Y') && $this->sFType == 'I') return true;
			 			if($parentFolder->type != 'I' && $parentFolder->type != 'Y' && $this->sFType != 'I') return true;
		}else{
			return false;  		}
		throw new Exc('folder_create','Unable to create folder in TeamChat');
	}

	protected function setActionAdd($oUser, $oAccount, $sFolderType)
	{
		 		$this->sTemplateFile = 'webmailiqfolders_set';

		$this->checkNewFolderForTC($oAccount);

		 		$param['name'] = $this->sFolderName;
		$param['type'] = $this->sFType;
		$param['channel_url'] = $this->sChannelURL;
		$param['private'] = $this->sPrivate;
		if ($this->channels && $oAccount->protocol == 'IMAP') {
			$param['channels'] = $this->channels;
			$this->aData['rss'] = true;
		}
		$param['virtual'] = $this->virtual;
		if ($param['virtual']['search']) {
			$this->aData['search'] = $param['virtual']['search'];
		}
		if ($this->sShareType) {
			$param['virtual']['sharetype'] = $this->sShareType;
			$this->aData['sharetype'] = $this->sShareType;
		}
		$this->oFolder = $oAccount->createFolder($param);
		$default_folders = $_SESSION['user']->getDefaultFolderList();
		 		if (in_array($param['name'], $default_folders)) {
			$type = array_search($param['name'], $default_folders);
			$this->oFolder->setDefault($type, true);
		}

		$folders = $this->cnvFolders(array($this->sFID => $this->oFolder));
		$this->aData = reset($folders);
		$this->aData['type'] = $this->oFolder->getType();
		$this->aData['subscribed'] = 1;
		$this->aData['name'] = $this->oFolder->name;
		$this->aData['display'] = $this->oFolder->display;
		$this->aData['relative_folder'] = $this->oFolder->groupRelativeFolder;

		 		$allFolders = $oAccount->getFolders(false);
		$folderOwnerArray = array();
		foreach ($allFolders as $folder) {
			$folderOwnerArray[$folder->name] = $folder->groupOwner;
		}
		if (count($folderOwnerArray) > 0) {
			$folderPathParts = explode('/', $this->oFolder->name);
			array_pop($folderPathParts);
			$subfolder = implode('/', $folderPathParts);
			$this->aData['owner'] = $folderOwnerArray[$subfolder] ? $folderOwnerArray[$subfolder] : $this->oFolder->groupOwner;
		} else {
			$this->aData['owner'] = $this->oFolder->groupOwner;
		}

		$this->aData['teamchat_notify'] = $this->oFolder->teamChatNotify;
		if ($this->oFolder->isPublic() || $this->oFolder->isShared()) {
			$this->aData['subscription_type'] = $this->oFolder->subscription_type ? 'folder' : 'account';
		}
		if ($this->bCloneRoom) {
			$this->oFolder->cloneRoom($this->sCloneRoom);
		}
		$this->sFID = $this->oFolder->name;
		 
	}

	protected function setActionEdit($oUser, $oAccount, $sFolderType)
	{
		 		$this->sTemplateFile = 'webmailiqfolders_set';
		 		try {

			$this->oFolder = $oAccount->getFolder($this->sFID);
			$parameters['name'] = $this->sNewName;
			$newName = $this->sNewName ? $this->sNewName : $this->sFID;
			 			if ($this->sNewName) {
				$primary = $oUser->getAccount($_SESSION['EMAIL']);
				if ($primary->isDelayed()) {
					$primary->syncDelayedFolders();
				}
			}
			$parameters['channel'] = $this->sNewChannel;
			$parameters['channels'] = $this->channels;
			$parameters['subscription'] = $this->sSubscription;
			$parameters['default'] = $this->sDefault;
			$parameters['sharetype'] = $this->sShareType;
			$parameters['notify'] = $this->bNotify;
			switch ($this->oFolder->type) {
				case 'V':
					$parameters['folders'] = $this->virtual['folders'];
					$parameters['primary'] = $this->virtual['primary'];
					if (isset($this->virtual['search'])) {
						$parameters['search'] = $this->virtual['search'];
					}
					break;
			}

			$this->oFolder->edit($parameters);
			$folderID = $this->oFolder->name;
			$default_folders = $_SESSION['user']->getDefaultFolderList();
			 			if (false !== $type = array_search($folderID, $default_folders)) {
				$this->oFolder->setDefault($type, true);
			}
		} catch (Exc $e) {
			$ignoreExceptions = array(
				'folder_does_not_exist' => 1
			);
			if (!isset($noticeExceptions[$e->wmcode])) {
				throw new Exc($e->wmcode, $e->getMessage());
			}
			 		}
		 		if ($this->acl) {
			$oAccount->setAcl($this->acl, $this->sFID);
		} else {
			 			if ($this->removeAcl) {
				$acl = $oAccount->inheritAcl($this->sFID);
			}
		}
		if ($sFolderType == 'M' || $sFolderType == 'R') {
			$oAccount->sync();
		} else {
			if ($oAccount->account) {
				$oAccount->account->sync(true);
			}
		}
		$this->oFolder = $oAccount->getFolder($folderID);
		$this->oFolder->rights = $oAccount->getMyRights($folderID);
		$folders = $this->cnvFolders(array($folderID => $this->oFolder));
		$this->aData = reset($folders);
		if (isset($parameters['search'])) {
			$this->aData['search'] = $parameters['search'];
		}
		if ($this->oFolder->sharetype) {
			$this->aData['sharetype'] = $this->oFolder->sharetype;
		}
		$this->aData['subscribed'] = $this->oFolder->groupChatSubscribed;
		$this->aData['relative_path'] = $this->oFolder->groupRelativeFolder;
		$this->aData['teamchat_notify'] = $this->oFolder->teamChatNotify;
	}

	protected function setActionDelete($oUser, $oAccount, $sFolderType)
	{
		 		$oAccount->deleteFolder($this->sFID);
		 		if ($sFolderType == 'M' || $sFolderType == 'R') {
			$oAccount->sync();
		} else {
			if ($oAccount->account) {
				$oAccount->account->sync();
			}
		}
	}

	protected function setActionSync($oUser, $oAccount, $sFolderType)
	{
		$this->oFolder = &$oAccount->getFolder($this->sFID);
		$this->oFolder->toSync = true;
		log_buffer("SYNC folder " . $this->sFID . " start","EXTENDED");
		$this->oFolder->sync();
		log_buffer("SYNC folder " . $this->sFID . " end","EXTENDED");
		$this->aData['aid']  = $this->sAID;
		$this->aData['folder']['num'] = WebmailIqFolders::cnvFolders([$this->oFolder],false,$_SESSION['refreshed']);
		$_SESSION['refreshed'] = false;
		$this->sTemplateFile='webmailiqfolders_get';

		log_buffer("CONVERT folder end","EXTENDED");
		unset($_SESSION['sync'][$this->sAID]);
	}

	 
	protected function setActionEmpty($oUser, $oAccount, $sFolderType)
	{
		$this->oFolder = $oAccount->getFolder($this->sFID);
		if(empty($this->sSearch)) return $this->oFolder->emptyFolder($this->sDestinationAccount, $this->sDestinationFolder, $sFolderType);
		if(empty($this->sDestinationFolder)) return $this->oFolder->deleteFiltered($this->sSearch);
		$oUser = $_SESSION['user'];
		$oDestinationAccount = $oUser->getAccount($this->sDestinationAccount);
		$oDestination = $oDestinationAccount->getFolderWithAutoCreate($this->sDestinationFolder);
		return $this->oFolder->moveFiltered($this->sSearch, $oDestination);
	}

	protected function setActionMoveall($oUser, $oAccount, $sFolderType)
	{
		$oDestAccount = $oUser->getAccount($this->sDestinationAccount);
		$oDestFolder = $oDestAccount->getFolder($this->sDestinationFolder);
		$this->oFolder = &$oAccount->getFolder($this->sFID);
		$this->oFolder->moveItems($oDestFolder);
	}

	protected function setActionCopyall($oUser, $oAccount, $sFolderType)
	{
		$oDestAccount = $oUser->getAccount($this->sDestinationAccount);
		$oDestFolder = $oDestAccount->getFolder($this->sDestinationFolder);
		$this->oFolder = &$oAccount->getFolder($this->sFID);
		$this->oFolder->copyItems($oDestFolder);
	}

	protected function setActionMarkasread($oUser, $oAccount, $sFolderType)
	{
		$flag = Item::FLAG_SEEN;
		 		$this->oFolder = &$oAccount->getFolder($this->sFID);
		$this->oFolder->markItems($flag);
	}

	protected function setActionMarkasunread($oUser, $oAccount, $sFolderType)
	{
		$flag = Item::FLAG_SEEN;
		 		$this->oFolder = &$oAccount->getFolder($this->sFID);
		$this->oFolder->unmarkItems($flag);
	}

	protected function setActionSaveItems($oUser, $oAccount, $sFolderType)
	{
		$this->oFolder = $oAccount->getFolder($this->sFID);
		$download = $this->oFolder->saveItems();
		$fullpath = $download['fullpath'];
		$class = $download['class'];
		$_SESSION['user']->closeSession();
		$this->aData['class'] = $class;
		$this->aData['fullpath'] = $fullpath;
		$this->aData['aid'] = $this->sAID;
		$this->aData['fid'] = $this->sFID;
		$this->aData['save_items'] = true;
		$this->sTemplateFile = 'webmailiqitems_set';
	}

	protected function setActionRemoveMember($oUser, $oAccount, $sFolderType)
	{
		$this->oFolder = &$oAccount->getFolder($this->sFID);
		$this->oFolder->removeMember($this->sRemoveAccount);
	}

	protected function setActionAddMember($oUser, $oAccount, $sFolderType)
	{
		$this->oFolder = &$oAccount->getFolder($this->sFID);
		 		$aInvite = slMailParse::parseAddresses($this->sTo);
		foreach ($aInvite as $invite) {
			$aNewMembers[] = $invite['address'];
		}
		 		$gw = new GroupWareManagement();
		foreach ($this->oDOMDoc->query('folders:account', $this->oDistrib) as $oDOMAccount) {
			$sAID = $oDOMAccount->getAttribute('uid');
			$oDLAccount = $_SESSION['user']->getAccount($sAID);
			 			foreach ($this->oDOMDoc->query('folders:folder', $oDOMAccount) as $oDOMFolder) {
				$sFID = $oDOMFolder->getAttribute('uid');
				$oDLFolder = $oDLAccount->getFolder($sFID);
				foreach ($this->oDOMDoc->query('folders:to', $oDOMFolder) as $dst) {
					$aContactList = array();
					$value = $dst->nodeValue;
					$aLocations = $gw->getDistributionListItems($value, $oDLFolder);
					foreach ($aLocations as $location) {
						$aNewMembers[] = $location['LCTEMAIL1'];
					}
				}
			}
		}
		$this->oFolder->addMember($aNewMembers, $this->sComment);
	}

	protected function setActionNotifyLimit($oUser, $oAccount, $sFolderType)
	{
		$oAccount->gwAccount->sendFolderLimitNotification($this->sFID, $this->sComment);
	}

	 
	protected function exeSetInputXML()
	{
		 		$oUser = &$_SESSION['user'];
		$oAccount = $oUser->getAccount($this->sAID);
		 		if ($this->sAction == 'add' || $this->sAction == 'notify_limit') {
			if ($this->sFType == 'QL' || $this->sFType == 'VS') {
				$sFolderType = $this->sFType;
			} else {
				$sFolderType = strtoupper($this->sFType{0});
			}
		} else {
			$folder = $oAccount->getFolder($this->sFID);
			$sFolderType = $folder->type;
		}
		if (@strpos($this->sFID, '__@@VIRTUAL@@__') === 0) {
			$sFolderType = 'V';
		}
		 		switch ($sFolderType) {
			 			case 'C':  			case 'E':  			case 'T':  			case 'N':  			case 'J':  			case 'F':  			case 'I':  			case 'Y':  				$oAccount = &$oAccount->gwAccount;
				if (!is_object($oAccount)) {
					throw new Exc('gw_init_error');
				}
				$this->gwFolder = true;
				break;
			case 'V':
				$oAccount = &$oAccount->virtualAccount;
				if (!is_object($oAccount)) {
					throw new Exc('virtual_init_error');
				}
				break;
			case 'M':  			case 'Q':  			case 'QL':
			case 'R':  			default:
				 				break;
		}
		 		 		 		$method = 'setAction' . Tools::camelize($this->sAction);
		if(method_exists($this, $method)){
			call_user_func_array([$this, $method], [&$oUser, &$oAccount, &$sFolderType]);
		}elseif ($this->sAction == 'add') $this->setActionAdd($oUser, $oAccount, $sFolderType);  		elseif ($this->sAction == 'edit') $this->setActionEdit($oUser, $oAccount, $sFolderType);  		elseif ($this->sAction == 'delete') $this->setActionDelete($oUser, $oAccount, $sFolderType);  		elseif ($this->sAction == 'sync') $this->setActionSync($oUser, $oAccount, $sFolderType);  		elseif ($this->sAction == 'empty') $this->setActionEmpty($oUser, $oAccount, $sFolderType);  		elseif ($this->sAction == 'moveall') $this->setActionMoveall($oUser, $oAccount, $sFolderType);
		elseif ($this->sAction == 'copyall') $this->setActionCopyall($oUser, $oAccount, $sFolderType);
		elseif ($this->sAction == 'markasread') $this->setActionMarkasread($oUser, $oAccount, $sFolderType);  		elseif ($this->sAction == 'markasunread') $this->setActionMarkasunread($oUser, $oAccount, $sFolderType);
		elseif ($this->sAction == 'save_items') $this->setActionSaveItems($oUser, $oAccount, $sFolderType);
		elseif ($this->sAction == 'remove_member') $this->setActionRemoveMember($oUser, $oAccount, $sFolderType);
		elseif ($this->sAction == 'add_member') $this->setActionAddMember($oUser, $oAccount, $sFolderType);
		elseif ($this->sAction == 'notify_limit') $this->setActionNotifyLimit($oUser, $oAccount, $sFolderType);

		$this->aData['aid'] = $this->sAID;
		$this->aData['fid'] = $this->oFolder->name;
		$this->aData['rights'] = Folder::rightsToString($this->oFolder->rights, $this->oFolder->name);
	}

	 
	private function exeInputXML()
	{
		 		if($this->aAttrs['type'] == 'get'){
			return $this->exeGetInputXML();
		}elseif ($this->aAttrs['type'] == 'set'){
			return $this->exeSetInputXML();
		}
	}

		 		 
	public static function cnvFolders($folders, $interface = false, $actual = false)
	{
		if (!is_array($folders)) return;
		$aItems = array();
        foreach ($folders as $k => $v) {
			$aItm = array();
                       
			 			if (!isset($v->gw) || !$v->gw) {
                $aItm['rights'] = Folder::rightsToString($v->rights, $v->name);
				                 if ($v->type == 'R') {
                    $aItm['rights'] = Folder::rightsToString($v->rights, $v->name);
					$aItm['channel'] = $v->channel;
				}
                if ($v->isDefault && $v->defaultType == 'D') {
                    $aItm['count'] = $v->countItems(null, false);
                }
                $aItm['recent'] = $v->countItems(Item::FLAG_SEEN, false);
                $aItm['subscribed'] = (bool)($v->sync ?? false);
				
			 			} else {
                $aItm['rights'] = Folder::rightsToString($v->rights, $v->name);
                if ($actual) {
                    if ($v->groupChatUnread == 0) {
						$aItm['force_recent'] = 1;
					}
                    $aItm['recent'] = $v->groupChatUnread;
				}
				$aItm['owner'] = $v->groupOwner;
				$aItm['relative_path'] = $v->groupRelativeFolder;
				$aItm['subscribed'] = $v->groupChatSubscribed;
				$aItm['groupchat_lastreadid'] = $v->groupChatLastReadID;
				$aItm['groupchat_lastactivity'] = $v->groupChatLastActivity;
				$aItm['teamchat_notify'] = $v->teamChatNotify;
                if ($v->type != 'V') {
					$aItm['private_root'] = $v->isPrivateRoot();
				}
 			}
            if ($v->type == 'V') {
				$aItm['tagname'] = 'virtual';
				$aItm['search'] = $v->search;
				$aItm['sharetype'] = $v->sharetype;
				$v->rights = $v->getMyRights();
                $aItm['rights'] = Folder::rightsToString($v->rights, $v->name);
				$fdrs = array();
                if ($v->folders) foreach ($v->folders as $folder) {
					$fdr = array();
					$fdr['name'] = $folder->name;
                    $fdr['primary'] = ($folder->name == $v->primary) ? true : false;
                    $fdrs[] = $fdr;
				}
                if ($v->nonExistingFolders) foreach ($v->nonExistingFolders as $folder) {
					$fdr = array();
					$fdr['name'] = $folder;
                    $fdr['primary'] = ($folder == $v->primary) ? true : false;
					$fdr['noexist'] = true;
                    $fdrs[] = $fdr;
				}
				$aItm['folders'] = $fdrs;
				$aItm['searchFolder'] = true;
			}
            if(isset($v->subfolders)){
				$aItm['tagname'] = 'subfolders';
				$aItm['searchFolder'] = true;
				$fdrs = array();
				foreach ($v->subfolders as $folder) {
					$fdr = array();
					$fdr['name'] = $folder->baseName;
					$fdrs[] = $fdr;
				}
            	$aItm['folders'] = $fdrs;
			}
            $aItm['name'] = $v->name;
			
            if (!$interface) {
                $aItm['id'] = $v->name;
			             } else {
				$aItm['id'] = $v->name;
                if ($v->localizedName) {
					$aItm['localizedName'] = $v->localizedName;
				}
				
                switch ($v->getType()) {
					case 'C':
						$sView = 'contact_list';
					break;
					case 'M':
						$sView = 'mail_list';
					break;
				}
				$aItm['view'] = $sView;
			}
            if (isset($v->acl) && $v->acl) {
                foreach ($v->acl as $owner => $right) {
					$r['email'] = $owner;
					$r['right'] = Folder::rightsToString($right);
					$aItm['acl'][] = $r;
				}
			}
            $aItm['type'] = $v->getType();
			$aItm['public'] = $v->publicRoot ?? '';
			$aItm['shared'] = $v->shared ?? '';
            if ($v->isPublic() || $v->isShared()) {
                $aItm['subscription_type'] = $v->subscription_type ? 'folder' : 'account';
			}
			$aItm['archive'] = $v->isArchive();
			$aItm['spam'] = $v->isSPAM();
			$aItm['resource'] = $v->isResource();
			$aItm['default'] = $v->isDefault();
			$aItm['default_type'] = $v->defaultType;
            $aItm['search'] = $v->search ?? false;
            $aItm['display'] = $v->display ?? false;
            $aItm['inherited_acl'] = isset($v->inherited) && $v->inherited ? 1 : 0;
			$aItm['rss'] = $v->isRSS();
			$aItm['size'] = $v->size ?? '';
			$aItm['quota'] = $v->quota ?? '';
            if (isset($v->channels) && $v->channels) {
				$aItm['channels'] = $v->channels;
			}
			$aItems[] = $aItm;
		}
         		return $aItems;
	}
}
?>
