<?php
define('CHECK_INTERVAL', 1825);

 
class GroupWareItem extends Item
{
    public $sFields;      
    public $itemID;   
    private $itemPrefix;  
    public $item;
    const FLAG_ORGANIZATOR = 0x01;
     
    const FLAG_ATTENDEE = 0x02;
     
    const FLAG_TRANSPARENT = 0x04;      const FLAG_TENTATIVE = 0x08;      const FLAG_OUTOFOFFICE = 0x10;      const FLAG_GROUPCHATATTENDEE = 0x40;      const FLAG_HTMLCONTENT = 0x100;

    public $bSingle;
    public $wmclass;
    public $aAttendees;
    public $occurrenceID;
    public $reactions_metadata;
    public $itemInstances;
    public $duplicity;
    public $rename;
    public $fields;
    public $itemType;
    public $sFID;
    public $aAddons;
    public $folder;

 
     
    public function __construct(GroupWareFolder &$folder, $item, $aAddonSelect = array(), $fields = '', $bSingle = false, $ctz = 0)
    {
        if($item['EVNCLASS'] == 'E'){
            if(strtolower($item['EVNDESCFORMAT']) === 'text/html'){
                $item['EVNNOTE'] = slToolsString::purifyHTML($item['EVNNOTE'], Tools::externalResourcesEnabled());
            }else{
                             }
        }
        $this->item = $item;
        $this->folder = &$folder;
        $this->fields = $fields;

        $this->setPrefix();
        $this->bSingle = $bSingle;
                 $this->itemID = $this->item[$this->itemPrefix . "_ID"];
        if (!$this->itemID) $this->itemID = $this->item[strtolower($this->itemPrefix . "_ID")];

                 $this->itemType = $this->folder->getType();
        $sFID = $this->openAccess();

                 $sAddonsXML = '';

        if ($bSingle) {
            $this->item['TICKET'] = $folder->account->gwAPI->FunctionCall('GetAttachmentPathLocal', $sFID, $this->itemID, '', 'TICKET');

            $this->getAddons();
			$ticketset = false;
			$inviteticketset = false;
            if ($this->aAddons) foreach ($this->aAddons as $key => $addon) {
                $sAddonsXML .= $addon->getXML($ctz);
                if (!isset($this->item['EVNCLASS']) || ($this->item['EVNCLASS'] != 'F' && $this->item['EVNCLASS'] != 'M')) continue;

                if (!$ticketset && $addon->ticket) {
                    $this->item['TICKET'] = $addon->ticket;
                    $ticketset = true;
				}
				if(!$inviteticketset && $addon->inviteTicket){
					$this->item['INVITETICKET'] = $addon->inviteTicket;
					$inviteticketset = true;
				}
                if ($addon->sAddonType != 'attachment' || strpos($fields, 'data') === false) continue;

                $att = $addon->getData();
                @$att = reset($att);
                if ($att['ATTSIZE'] && ($att['ATTSIZE'] < 524288)) {
                    $name = $att['ATTDESC'] ? $att['ATTDESC'] : $att['ATTNAME'];
                    $ext = strtolower(substr($name, strrpos($name, '.') + 1));
                    if($ext == 'txt'){
                        $this->item['data'] = $addon->getAttachment($att['ATTNAME']);
                    }elseif($ext == 'htm' || $ext == 'html'){
                        slSystem::import('tools/string');
                        $enableExternalResources = false;
                        if (isset($_SESSION['clientSettings']) && isset($_SESSION['clientSettings']['show_inline_images']) && true === $_SESSION['clientSettings']['show_inline_images']) {
                            $enableExternalResources = true;
                        }
                        $this->item['data'] = slToolsString::basicSanitizeHTML($addon->getAttachment($att['ATTNAME']), $enableExternalResources);
                    }
				}

			}
			if ($this->item['EVNDOCRIGHTS'] ?? false){
				$this->item['EVNDOCEDITABLE'] = ($this->item['EVNDOCRIGHTS'] & MerakGWAPI::RIGHT_WRITE) <> 0;
			}
        }
        if ($this->item['EVNMENTIONS_INFO'] ?? false) {
            $list = MerakGWAPI::ParseParamLine($this->item['EVNMENTIONS_INFO']);
            $sAddonsXML .= '<mentions>';
            if (is_array($list)) foreach ($list as $itm) {
                $sAddonsXML .= '<mention uid="' . $itm['ID'] . '"><values>';
                unset($itm['ID']);
                if (is_array($itm)) foreach ($itm as $in => $iv) {
                    $in = strtolower($in);
                    $sAddonsXML .= '<' . $in . '>' . @slToolsPHP::htmlspecialchars(trim($iv)) . '</' . $in . '>';
                }
                $sAddonsXML .= '</values></mention>';
            }
            $sAddonsXML .= '</mentions>';
            unset($this->item['EVNMENTIONS_INFO']);
        }

        $this->sFields = $this->composeXML($sAddonsXML);
        $this->wmclass = 'GW';
    }

     
     
     
    private function setPrefix($item = null)
    {
         
        if ($item) $this->item = $item;

         
        if ((isset($this->item["ITMCLASS"]) && ($this->item["ITMCLASS"] == 'C' || $this->item["ITMCLASS"] == 'L')
                || isset($this->item["itmclass"]) && ($this->item["itmclass"] == 'C' || $this->item["itmclass"] == 'L')) || strtolower($this->item['ITMFOLDER']) == '@@trash@@') {
            $sPrefix = 'ITM';
        } else {
            $sPrefix = 'EVN';
        }
         
        $this->itemPrefix = $sPrefix;
    }

    public function getAddons($type = false)
    {
        $type = $type ? $type : $this->itemType;
        if ($this->aAddons) return $this->aAddons;
        $oAddon = array();
        $oAddon['attachment'] = new GroupWareAddon($this, 'attachment');
        switch ($type) {
            case 'C':
                $oAddon['location'] = new GroupWareAddon($this, 'location');
                $oAddon['certificate'] = new GroupWareAddon($this, 'certificate');
                $oAddon['location']->enableConvertNote();
                break;
                         case 'L':
                $oAddon['location'] = new GroupWareAddon($this, 'location');
                break;
            case 'E':
                $oAddon['recurrence'] = new GroupWareAddon($this, 'recurrence');
                $oAddon['reminder'] = new GroupWareAddon($this, 'reminder');
                $oAddon['contact'] = new GroupWareAddon($this, 'contact');
                $oAddon['note'] = new GroupWareAddon($this, 'note');
                $oAddon['note']->enableConvertNote();
                if ($this->folder->getType() == 'I') {
                    $oAddon['reaction'] = new GroupWareAddon($this, 'reaction');
                }
                break;
            case 'T':
                $oAddon['recurrence'] = new GroupWareAddon($this, 'recurrence');
                $oAddon['reminder'] = new GroupWareAddon($this, 'reminder');
                $oAddon['contact'] = new GroupWareAddon($this, 'contact');
                $oAddon['note'] = new GroupWareAddon($this, 'note');
                $oAddon['note']->enableConvertNote();
                break;
            case 'N':
                $oAddon['note'] = new GroupWareAddon($this, 'note');
                $oAddon['note']->enableConvertNote();
                break;
            case 'M':
            case 'F':
                $oAddon['revision'] = new GroupWareAddon($this, 'revision');
                $oAddon['revision']->enableConvertNote();
                if ($this->folder->getType() == 'I') {
                    $oAddon['reaction'] = new GroupWareAddon($this, 'reaction');
                }
                if ($type == 'M') {
                    $oAddon['xattribute'] = new GroupWareAddon($this, 'xattribute');
                }
                break;
            case 'J':
                $oAddon['contact'] = new GroupWareAddon($this, 'contact');
                break;
            case 'G':
            case 'Y':
            case 'I':
            case 'Q':
            case 'R':
            case 'D':
            case 'S':
            case 'Z':
                $itemType = $this->item[$this->itemPrefix . 'CLASS'];
                if (in_array($itemType, array('Q', 'I', 'R', 'S', 'W', 'D', 'Y', 'M', 'Z'))) {
                    $oAddon['reaction'] = new GroupWareAddon($this, 'reaction');
                    if ($itemType == 'M') {
                        $oAddon['xattribute'] = new GroupWareAddon($this, 'xattribute');
                        $oAddon['revision'] = new GroupWareAddon($this, 'revision');
                    }else{
                        unset($oAddon['attachment']);
                    }
                } else {
                    return $this->getAddons($itemType);
                }
                break;
        }
        return $this->aAddons = $oAddon;
    }

     
                        
    
		public static function import(&$folder, $sType, $sData, $delete_after_import)
		{
			 
			$sFID = $folder->openAccess();
      		switch($sType)
      		{
        		case 'vcalendar':
				case 'sif':
					 					 					if (true === $delete_after_import) {
						$sType .= ';ALLOWOCCURRENCE';
					}
			   		if(!$sIID = $folder->account->gwAPI->FunctionCall("AddVCalendar", $sFID, $sData, '', $sType)){
			   		    throw new Exc('import_vcalendar');
                    }
                    $folder->type = 'E';
			   		break;
        		case 'vcard':
        		case 'ldif':
         			 
			   		if(!$sIID = $folder->account->gwAPI->FunctionCall("AddVCard", $sFID, $sData, '', $sType)){
			   		    throw new Exc('import_vcard');
                    }
        			break;
	      }
	      $oItem = $folder->getItem($sIID);
	      return $oItem;
    	}
	 
	public static function create(&$folder,$aItem = [],$aTreeItem = [])
	{
         
        $sFID = $folder->openAccess();
        if($folder->getType() == 'J' && !empty($aItem['evnmeetingid'] ?? null)){
            $filter = ['sql' => icewarp_sanitize_db_sql('EvnMeetingId = ' . $aItem['evnmeetingid'] . ' AND EvnStartDate = ' . $aItem['_tzevnstartdate'])];
            $item = $folder->getItems($filter);
            if(current($item) instanceof GroupWareItem) return current($item);
        }

		$duplicityAction = $aItem['duplicity'];
		unset($aItem['duplicity']);
		if(strtoupper($folder->folderID) == '@@MYCARD@@'){
			$aItem['itmuid'] = '@@mycard@@';
			self::setAccountName($aItem['itmclassifyas']);
		}
		$isRecurrent = isset($aTreeItem['@childnodes']['recurrences']);
		if($isRecurrent){
			unset($aItem['ctz']);
			$aItem['evntimeformat'] = 'Z';
		}
		if(!$aItem['_tzid']){
			$aItem['_tzid'] = $_SESSION['CLIENT_TIMEZONE'] ? $_SESSION['CLIENT_TIMEZONE'] : $_SESSION['SERVER_TIMEZONE'];
		}
		if(isset($aItem['evnflags']) && self::isOrganizator($aItem['evnflags']) ){
            $groupchatowneremail = '';
			$sOrganizer = $folder->account->gwAPI->getFolderOwner($folder,$groupchatowneremail);
			$sOrganizerFullAddress = $folder->account->gwAPI->getOwnerFullAddress($sOrganizer,$groupchatowneremail);
			$aItem['evnorganizer'] = $sOrganizerFullAddress;
		}
		 		$aItem = array_change_key_case($aItem,CASE_LOWER);
		 		if(($folder->getType() == 'F' || ($folder->getType() == 'I' && ($aItem['evnclass'] == 'F' || $aItem['evnclass'] == 'M'))) && !self::checkAttachmentName($aItem['evntitle'])){
		    throw new Exc('attachment_name',$aItem['evntitle']);
		}
		         $sPrefix = 'evn';
        $sFuncName = 'Event';
        $sNote = 'evnnote';
        if ($folder->getType() == 'C') {
            $sPrefix = 'itm';
            $sFuncName = 'Contact';
            $sNote = 'itmdescription';
        }
        $aItem[$sPrefix.'class'] = $aItem[$sPrefix.'class'] ?? $folder->getType();
		$addonNote = $aTreeItem['@childnodes']['notes'][0]['@childnodes']['note'][0]['@childnodes']['values'][0]['@childnodes']['note_text'][0]['@value'] ?? null;
		         if($aItem['evndescformat'] == 'text/html'){
            $textNote = self::removeHtmlNoteParagraph($aItem[$sNote]);
            if(empty($textNote)) unset($aItem[$sNote]);
            if($aItem['meeting_action'] == '1' || $aItem['meeting_action'] == 'create'){
                $aItem[$sNote] = $textNote;
            }
        }
        $noteHasAttachmets = self::dataContainsAttachment($aItem[$sNote]);
        if($noteHasAttachmets){
            $addonNote = $aItem[$sNote] = self::replaceCID($aItem[$sNote], $aTreeItem);
		}

		$tzid = $aItem['_tzid'];
		$folder->account->gwAPI->TZClearCache();
		$folder->account->gwAPI->TimeZone($aItem,'in',false,$isRecurrent);
        $sNote = strtoupper($sNote);
        if(isset($aItem['EVNURL'])){
            $aItem['EVNURL'] = iconv_substr(slToolsString::utf8_bad_replace(slToolsString::removeHTML($aItem['EVNURL'])),0,255, 'utf-8');
        }
		 		$sParametersLine = $folder->account->gwAPI->CreateParamLineStrictLength($aItem, ['EVNURL' => 255, 'EVNTITLE' => 510, 'EVNLOCATION' => 510, 'EVNRID' => 255]);
        $sParameters = 'use_tzid=1';
        if ($sParametersLine) {
            $sParameters .= '&' . $sParametersLine;
        }
        if ($duplicityAction == 'replace') {
            $sParameters .= '&forcereplace=1';
        }
        if ($aItem['THUMBNAILIMAGEID']) {
            $sParameters .= '&thumbnailimageid=' . $aItem['THUMBNAILIMAGEID'];
            unset($aItem['THUMBNAILIMAGEID']);
        }
        if(!empty($addonNote) && $folder->getType() != 'N') $sParameters .= ';SKIP_GROUPCHAT_PROCESSING';
		 		if(!$sEvnId = $folder->account->gwAPI->FunctionCall("Add".$sFuncName."Info", $sFID, $sParameters, "")){
			$lastError = $folder->account->gwAPI->FunctionCall("GetLastError",$folder->account->sGWSessionID);

            if($lastError != 13) throw new Exc('item_create',$sEvnId);
            if($folder->subtype != 'U') throw new Exc('item_duplicity',$aItem['EVNTITLE']);

            $freename = GroupWareItem::proposeFreeFileName($folder, $aItem['EVNLOCATION']);
            $originalFilename = $aItem['EVNLOCATION'];
            $aTreeItem['@childnodes']['attachments'][0]['@childnodes']['attachment'][0]['@childnodes']['values'][0]['@childnodes']['description'][0]['@value'] = $freename;
            $aTreeItem['@childnodes']['values'][0]['@childnodes']['evntitle'][0]['@value'] = $freename;
            $aTreeItem['@childnodes']['values'][0]['@childnodes']['evnlocation'][0]['@value'] = $freename;
            $aTreeItem['@childnodes']['values'][0]['@childnodes']['evnrid'][0]['@value'] = $freename;
            $aItem['EVNTITLE'] = $aItem['EVNLOCATION'] = $aItem['EVNRID'] = $freename;
            $sParameters = $folder->account->gwAPI->CreateParamLineStrictLength($aItem,  ['EVNURL' => 255, 'EVNTITLE' => 510, 'EVNLOCATION' => 510, 'EVNRID' => 255]);
            if(!empty($addonNote) && $folder->getType() != 'N') $sParameters .= ';SKIP_GROUPCHAT_PROCESSING';
            $sEvnId = $folder->account->gwAPI->FunctionCall("Add".$sFuncName."Info", $sFID, $sParameters, "");
		}

        $aItem[$sPrefix . '_id'] = $sEvnId;
        $aItem[strtoupper($sPrefix . '_id')] = $sEvnId;
        $aItem['EVN_CREATED'] = time();
        $item = new GroupWareItem($folder, $aItem);
        if(!empty($addonNote) && ($aItem['MEETING_ACTION'] == '1' || $aItem['MEETING_ACTION'] == 'create')){
             $reloadedItem = $folder->getItem($sEvnId, NO_ADDONS);
             if($reloadedItem instanceof GroupWareItem) {
                 $addonNote = $reloadedItem->item['EVNNOTE'];
             }
             unset($reloadedItem);
        }


                          $item->processTZID($aItem, false, $isRecurrent);

                 $item->getAddons();

                 if ($item->aAddons) {
            foreach ($item->aAddons as $addon) {
                $addonResult = $addon->process($aTreeItem);
                if ($addon->sAddonType == 'recurrence' && isset($aTreeItem['@childnodes']['recurrences'])) {
                    $data = $addon->getData();
                    $data = $data[0];
                    $rcrID = $data['RCR_ID'];
                }
                if ($addon->sAddonType == 'reaction') {
                    parse_str($addonResult, $data);
                    $item->reactions_metadata = $data['reactions'];
                }
                if ($addon->sAddonType == 'attachment') {
                    if ($item->folder->getType() == 'I' || $item->folder->getType() == 'F') {
                        $item->att_webdav_link = $addon->GetAttachmentFile($addonResult['id'], 'READONLYTICKET');
                        if ($originalFilename) {
                            $item->att_webdav_link .= '&filename=' . urlencode($originalFilename);
                        }
                        $item->att_size = $addonResult['size'];
                        $contentType = $addonResult['type'];
                    } else {
                        $data = $addon->getData();
                        $item->att_webdav_link = $addon->GetAttachmentFile($data['ATTNAME'], 'TICKET');
                        $item->att_size = $item->item['EVNCOMPLETE'];
                    }
                    if($noteHasAttachmets) {
                        $noteReplace = 'attachment_id_'.md5($addonResult['id']);
                        if(strpos($addonNote, $noteReplace) !== false){
                            $attachmentPath = $folder->account->gwAPI->FunctionCall("getAttachmentPath", $sFID, $sEvnId, $addonResult['id'], 'READONLYTICKET');
                            $addonNote = str_replace('attachment_id_'.md5($addonResult['id']), $attachmentPath, $addonNote);
                            $aItem[$sNote] = $addonNote;
                        }
                    }
                }

				 				if($folder->getType() == 'I' && ($aItem['EVNCLASS'] == 'M' || $contentType == 'message/rfc822') && $addon->sAddonType == 'attachment' && (!isset($aItem['EVNCLASS']) || $aItem['EVNCLASS'] == 'F')){
					if($contentType == 'message/rfc822'){
						$aItem['EVNCLASS'] = 'M';
						 						unset($item->aAddons);
						$item->getAddons('M');
					}
					 					$mailID = $item->getFileAttachmentID();
					$file = $addon->getAttachmentFile($mailID);
					$item = GroupWareItem::createFromMessage($folder, $file, ($aItem['EVNCLASS'] == 'M' ? ($aItem['EVNNOTE'] ? $aItem['EVNNOTE'] : $aItem['EVNTITLE']) : ''), $item, $aItem);
				}
			}
		}

		try{
			 			$item->processTags($aItem);
		}catch(Exc $e){
			throw new Exc('item_create');
		}
		 		$status = $aItem['EVNSTATUS'];
		$item->occurrenceID = $item->processStatus($aItem,$aTreeItem,true,$rcrID);
	    if($status=='M' && $status <> $aItem['EVNSTATUS']){
	       	  		$folder->account->gwAPI->FunctionCall("Add".$sFuncName."Info", $sFID, 'evnstatus=B', $sEvnId);
	    }
        $aItem[$sNote] = $addonNote;
	    if(!empty($aItem[$sNote])){
            if($folder->getType() == 'N'){
                $folder->account->gwAPI->FunctionCall("setEventNoteText", $sFID, $sEvnId, $aItem[$sNote]);
            }else{
                $noteparams = [$sNote => $aItem[$sNote]];
                if($aItem['MEETING_ACTION'] == '1'){
                    $noteparams['MEETING_ACTION'] = '3';
                }
                $folder->account->gwAPI->FunctionCall("Add".$sFuncName."Info", $sFID, '&' . $folder->account->gwAPI->CreateParamLine($noteparams), $sEvnId, '', ';NOEDITCOUNTER');
            }
        }
		         $finalizeParams = $item->folder->getType() == 'I' ? '&return_link_id=1' : '';
		$id = $folder->account->gwAPI->FunctionCall("Add".$sFuncName."Info", $sFID, $finalizeParams, $sEvnId);
		if($item->folder->getType() == 'I'){
			parse_str($id,$result);
			if($result['linkid']){
				$item->linkID = $result['linkid'];
			}
		}
		if($folder->getType() == 'I') $folder->groupChatLastActivity = $aItem['EVN_CREATED'];
		return $item;
	}

	static public function proposeFreeFileName($folder,$name,$itemid = '')
	{
		$folder->openAccess();
		return $folder->account->gwAPI->FunctionCall("ProposeFreeFileName", $folder->sFID, $name, $itemid);
	}

	static public function isOrganizator($flags)
	{
		$flags = (int) $flags;
		return  $flags & GroupWareItem::FLAG_ORGANIZATOR;
	}

    static public function isAttendee($flags)
    {
        $flags = (int)$flags;
        return $flags & GroupWareItem::FLAG_ATTENDEE;
    }

    static public function isGroupChatAttendee($flags)
    {
        $flags = (int)$flags;
        return $flags & GroupWareItem::FLAG_GROUPCHATATTENDEE;
    }

    public function getException($rcr_id, $occurence_id)
    {
        $oAccount = &$this->folder->account;
                 $this->openAccess();

        $exceptions = $oAccount->gwAPI->FunctionCall('GetEventException', $this->sFID, $rcr_id);
        $exceptions = $oAccount->gwAPI->ParseParamLine($exceptions);
        if ($exceptions) {
            foreach ($exceptions as $exception) {
                if ($exception['EXPEVNID'] == $occurence_id) {
                    return $exception;
                }
            }
        }
    }

      
    public function delete($datestamp = false, $following = false, $reason = '', $ignore_reason = false, $skip_trash = false, $skip_imip = false, $originalFolder = false)
    {
        $flags = $this->item['EVNFLAGS'];
        if (GroupWareItem::isAttendee($flags) && !$reason && !$ignore_reason) {
            throw new Exc('item_decline_failed_id', $this->itemID);
        }
        $result = true;
                 $oAccount = &$this->folder->account;
                 $this->openAccess();

        $sClass = $this->item['EVNCLASS'];
        $sRcrID = $this->item['EVNRCR_ID'];
        $oAccount->gwAPI->TZClearCache();
        $oAccount->gwAPI->TimeZone($this->item, 'in');
        $junk = null;
                 if ($datestamp) {
            $isFirstDisplayDate = $this->isFirstDisplayDate($this->item['EVN_ID'], $datestamp);
            $isDisplayedOnlyThisDay = $this->isDisplayedOnlyThisDay($this->item['EVN_ID'], $datestamp);
                         if(($following && $isFirstDisplayDate) || ($following && $isDisplayedOnlyThisDay) || ($isFirstDisplayDate && $isDisplayedOnlyThisDay)){
                $this->classicDelete($datestamp, $result, $reason, $skip_trash);
                return $result;
            }
            $this->getAddons();
            $addon = new GroupWareAddon($this, 'recurrence');
            $newAddon = $addon->getData();
            $newAddon = $newAddon[0];
                         if ($following) {
                $newAddon['RCRENDDATE'] = $datestamp - 1;
                $newAddon['RCR_COUNT'] = 0;
                $result = $addon->edit($newAddon, $newAddon['RCR_ID']);
                $result = $this->removeExceptions($newAddon['RCR_ID'], true, $datestamp - 1) && $result;
                if (strpos($originalFolder->folderID, 'TeamChat') === false && ($mid = $this->updateMasterObject($oAccount))) {
                    $master = $this->folder->getItem($mid);
                }
                             } else if ($sClass != 'O' && $sClass != 'V') {
                                 $addon = new GroupWareAddon($this, 'recurrence');
                $addonData = $addon->getData();
                $addonData = $addonData[0];
                                 if ($this->isFirstDisplayDate($this->item['EVN_ID'], $datestamp) && $this->isDisplayedOnlyThisDay($this->item['EVN_ID'], $datestamp)) {
                    if ($addon) $result = true;
                    $this->classicDelete($datestamp, $result, $reason, $skip_trash);
                    return $result;
                }
                $result = true;
                if (!$this->isGroupChatAttendee($flags)) {
                    $result = $this->makeException($datestamp);
                                     }
                $master = $this;
            }
            if(strpos($originalFolder->folderID, 'TeamChat') === false) {
                $this->imipUpdate($master, array(), array(), array(), array(), false, false, true, true, false, $junk, $datestamp, true);
            }
            return $result;
        }
        $aItem = null;
        $aTreeItem = null;
                 if ($sClass == 'O') {
                         $this->getAddons();
            $exception = $this->getException($sRcrID, $this->itemID);
            $datestamp = $exception['EXPDATE'];

            if (!$result = $oAccount->gwAPI->FunctionCall('DeleteEvent', $this->sFID, $this->itemID, strval(true))) {
                throw new Exc('item_delete', $this->itemID);
            }
            if ($masterID = $this->updateMasterObject($oAccount, false, true)) {
                try {
                    $masterObject = $this->folder->getItem($masterID);
                    $this->imipUpdate($masterObject, $aItem, $aTreeItem, array(), $this->aAttendees, true, false, false, true, false, $junk, $datestamp, true);
                } catch (Exception $e) {}
            }
        } else if ($sClass == 'V') {
            $this->getAddons();
            $exception = $this->getException($sRcrID, $this->itemID);
            $datestamp = $exception['EXPDATE'];
            if ($masterID = $this->updateMasterObject($oAccount, false, true)) {
                try {
                    $masterObject = $this->folder->getItem($masterID);
                    $this->imipUpdate($masterObject, $aItem, $aTreeItem, array(), $this->aAttendees, true, false, false, true, false, $junk, $datestamp, true);
                } catch (Exception $e) {}
            }
            if (!$result = $oAccount->gwAPI->FunctionCall('DeleteEvent', $this->sFID, $this->itemID, strval(true))) {
                throw new Exc('item_delete', $this->itemID);
            }
        }          else {
            $result = $this->classicDelete($datestamp, $result, $reason, $skip_trash, $skip_imip);
        }
        return $result;
    }

    public function classicDelete($datestamp, &$result, $reason = '', $skip_trash = false, $skip_imip = false)
    {
        try {
            if (!$skip_imip && $this->folder->type != 'G' && $this->item['EVNFLAGS']) {
                $bOrganizator = $this->isOrganizator($this->item['EVNFLAGS']);

					 					if($bOrganizator){
						$this->cancel();
						 					 					} elseif($this->isAttendee($this->item['EVNFLAGS'])){
					    return $this->decline($reason);
					}
				}
			}catch(Exception $imipException){
				$bException = true;
			}
			$oAccount = &$this->folder->account;
			$sFuncName = $this->folder->type=='C'?'Contact':'Event';
			$sFuncName = $this->folder->type=='G'?'Item':$sFuncName;

			if($skip_trash){
				$sParameters = ';NORECOVERY';
			}
			 			$result = $oAccount->gwAPI->FunctionCall('Delete'.$sFuncName, $this->sFID, $this->itemID, '0', $sParameters) && $result;
			if($bException){
				throw new $imipException;
			}
			return $result;
		}

    public function removeExceptions($sRcrID, $occurrances = false, $datestamp = false)
    {
        $oAccount = $this->folder->account;

                 $exceptions = $oAccount->gwAPI->FunctionCall('GetEventException', $this->sFID, $sRcrID);
        $exceptions = $oAccount->gwAPI->ParseParamLine($exceptions);
                 if ($exceptions) foreach ($exceptions as $exception) {
            if (($datestamp < $exception['EXPDATE']) || !$datestamp) {
                                 if ($exception['EXPEVNID'] && $occurrances && !$result = $oAccount->gwAPI->FunctionCall('DeleteEvent', $this->sFID, $exception['EXPEVNID'], strval(true))) {
                    throw new Exc('item_delete', $exception['EXPEVNID']);
                }
                $oAccount->gwAPI->FunctionCall('DeleteEventException', $this->sFID, $exception['EXP_ID']);
            }
        }
    }

	public function moveExceptions($oldRcrID,$newRcrID,$datestamp = false)
	{
		$oAccount = $this->folder->account;
		return $oAccount->gwAPI->FunctionCall('MoveEventException', $this->sFID, $oldRcrID, $newRcrID, " EXPDATE > ".$datestamp);
    }

    protected function renameTeamChatFile(& $aItem)
    {
        $existing = $this->aAddons['attachment']->getData();
        if(is_array($existing) && !empty($existing)){
            foreach($existing as $att){
                if($att['ATTDESC'] == $this->item['EVNTITLE']){
                    $attID = $att['ATTNAME'];
                }
            }
            if(!$attID){
                throw new Exc('item_attachment_uid');
            }
        }
        $attachments = array();
        $attachment = array();
        $attachment['@childnodes']['values'][0]['@childnodes']['description'][0]['@value'] = $aItem['evntitle'];
        $attachment['@attributes']['uid'] = $attID;
        $attachments['@childnodes']['attachment'][$attID] = $attachment;
        $aTreeItem['@childnodes']['attachments'][0] = $attachments;
        $aTreeItem['@childnodes']['values'][0]['@childnodes']['evnlocation'][0]['@value'] = $aItem['evntitle'];
        $aTreeItem['@childnodes']['values'][0]['@childnodes']['evnrid'][0]['@value'] = $aItem['evntitle'];
        $aItem['evnlocation'] = $aItem['evnrid'] = $aItem['evntitle'];
    }

     
	public function edit($aItem, $aTreeItem, $datestamp = false, $following = false, $finalize = true)
	{
        $junk = null;
         		$skipInvitation = $aItem['skip_invitation'];
		$autoSave = $aItem['auto_save'];
        if ($autoSave){
        	unset($aTreeItem['@childnodes']['reminders']);
        	unset($aTreeItem['@childnodes']['attachments']);
        	unset($aTreeItem['@childnodes']['contacts']);
        }

        if((boolval($this->item['EVNLOCKAPPMASK']) || !empty($this->item['EVNLOCKHASH'])) && $this->item['EVNLOCKOWN_ID'] != $_SESSION['GW_OWNERID']){
			             throw new Exc('item_attachment_uid_locked');
        }
                 if(isset($aItem['evntitle']) && $this->item['EVNCLASS'] == 'F' && $this->folder->getType() == 'I'){
            $this->renameTeamChatFile($aItem);
        }

        if($this->folder->folderID == '@@mycard@@' && isset($aItem['itmclassifyas'])){
        	self::setAccountName($aItem['itmclassifyas']);
		}
		 		if($this->folder->getType() == 'F' || ($this->folder->getType() == 'I' && $aItem['evnclass'] == 'F')){
			if(!self::checkAttachmentName($aItem['evnlocation'])){
				throw new Exc('attachment_name');
			}
		}
		$duplicityAction = $aItem['duplicity'];
        unset($aItem['auto_save'], $aItem['skip_invitation'], $aItem['duplicity']);

		$sNote = $this->folder->getType() == 'C' ? 'itmdescription' : 'evnnote';
        $addonNote = &$aTreeItem['@childnodes']['notes'][0]['@childnodes']['note'][0]['@childnodes']['values'][0]['@childnodes']['note_text'][0]['@value'] ?? null;
		                  if($aItem['evndescformat'] == 'text/html') {
            $textNote = self::removeHtmlNoteParagraph($aItem[$sNote]);
            if ($aItem['meeting_action'] == '1' || $aItem['meeting_action'] == 'create') {
                $aItem[$sNote] = $textNote;
            }
        }
        if (empty($aItem[$sNote])){
            unset($aItem[$sNote]);
        }else{
            $noteHasAttachmets = self::dataContainsAttachment($aItem[$sNote]);
            if($noteHasAttachmets) {
                $addonNote = $aItem[$sNote] = self::replaceCID($aItem[$sNote], $aTreeItem);
            }
        }

		if(isset($aItem['EVNURL'])){
            $aItem['EVNURL'] = iconv_substr(slToolsString::utf8_bad_replace(slToolsString::removeHTML($aItem['EVNURL'])),0,255, 'utf-8');
		}
		if(isset($aItem['data'])){
			$data = $aTreeItem['@childnodes']['values'][0]['@childnodes']['data'][0]['@value'];	
			$data = $this->replaceCID($data, $aTreeItem);
			$aTreeItem['@childnodes']['values'][0]['@childnodes']['data'][0]['@value'] = $data;
			if(!isset($aItem['evncomplete'])){
				$aItem['evncomplete'] = strlen($data);
			}
			unset($aItem['data']);
		}

        if ($this->folder->getType() == 'E' && $this->isGroupChatAttendee($this->item['EVNFLAGS'])) {
            throw new Exc('item_edit_groupchat_attendee');
        }
        $groupchatowneremail = '';
        $aCurrentID = [];
        $bInvitation = false;
        if ($this->isOrganizator($this->item['EVNFLAGS']) || $this->isOrganizator($aItem['evnflags'])) {
            $sOrganizer = $this->folder->account->gwAPI->getFolderOwner($this->folder, $groupchatowneremail);
            $sOrganizerFullAddress = $this->folder->account->gwAPI->getOwnerFullAddress($sOrganizer, $groupchatowneremail);
            $aItem['evnorganizer'] = $sOrganizerFullAddress;
                         $this->getAddons();
                         $aCurrentList = $this->aAddons['contact']->getData();
            if ($aCurrentList) {
                foreach ($aCurrentList as $key => $aAtt) {
                    if (isset($aAtt['CNTEVN_ID'])) {
                        unset($aCurrentList[$key]['CNTEVN_ID']);
                    }
                    $aCurrentID[$aAtt['CNT_ID']] = $aAtt;
                }
            }

            if (isset($aTreeItem['@childnodes']['contacts'][0]['@childnodes']['contact'])) {
                $aDelete = [];
                $aChangedList = &$aTreeItem['@childnodes']['contacts'][0]['@childnodes']['contact'];
                foreach ($aChangedList as $id => $changed) {
                    if (isset($aCurrentID[$id]) && $changed['@attributes']['uid'] && !isset($changed['@childnodes'])) {
                        $aDelete[$aCurrentID[$id]['CNTEMAIL']] = $id;
                    }
                }
                foreach ($aChangedList as $id => $changed) {
                    if (isset($changed['@childnodes'])) {
                        $email = $changed['@childnodes']['values'][0]['@childnodes']['cntemail'][0]['@value'];
                        if (isset($aDelete[$email])) {
                            $aChangedList[$aDelete[$email]] = $changed;
                            $aChangedList[$aDelete[$email]]['@attributes']['uid'] = $aDelete[$email];
                            unset($aChangedList[$id]);
                        }
                    }
                }
            }
            $bInvitation = true;
        }

		if($this->item['EVNFLAGS'] && (isset($aItem['evnflags']) && !$aItem['evnflags'])){
			$sentNothing = true;
		}
		if(!$this->item['EVNFLAGS'] && ($this->isOrganizator($aItem['evnflags']))){
			$sentAlways = true;
		}

		if ($skipInvitation || $autoSave) $sentNothing = true;
		 		$sFID = $this->openAccess();
		 		$oAccount = &$this->folder->account;
		 		$aCompare = $this->item;
		$oAccount->gwAPI->TimeZone($aCompare, 'in');
		$isAttendee = $this->isAttendee($aItem['evnflags']) || $this->isAttendee($this->item['EVNFLAGS']);
		if($isAttendee){
			$sOrganizer = $this->item['EVNORGANIZER'];
			$sAttendeeEmail = $this->folder->account->gwAPI->getFolderOwner($this->folder);
		}
		if (($bInvitation || $isAttendee || $this->folder->getType() == 'T') && $aItem) {
            foreach ($aItem as $property => $value){
                $propertyUpper = strtoupper($property);
                if ($propertyUpper != 'CTZ' && ($aCompare[$propertyUpper] != $aItem[$property])) {
                    if ($propertyUpper == 'TZLINK' || $propertyUpper == 'EVNTYPE' || ($propertyUpper == 'MEETING_ACTION' && $aItem['meeting_action'] != 1)) continue;
                    if ($propertyUpper == 'EVNSTATUS') {
                        $bStatusChange = true;
                    }
                    if ($isAttendee) {
                        $bSendCounterAction = true;
                    } else {
                        $bResetAttendees = true;
                    }
                }
            }
            if (!$bInvitation && !$isAttendee) {
                unset($bSendCounterAction);
                unset($bResetAttendees);
            }
		}
		 		$aItem = array_change_key_case($aItem, CASE_UPPER);
		$tzid = $aItem['_TZID'];
		 		if(!$datestamp && !$following){
			$this->processTZID($aItem,true);
			$this->occurrenceID = $this->processStatus($aItem,$aTreeItem,$bStatusChange);
		}
		$oAccount->gwAPI->TZClearCache();
		$oAccount->gwAPI->TimeZone($aItem, 'in');
		$sClass = $this->item['EVNCLASS'];
		$sRcrID = $this->item['EVNRCR_ID'];
		$oldItem = $this->item;
		if($aItem['_TZID']){
			$oldStartDate = $oldItem['_TZEVNSTARTDATE'];
			unset($oldItem['EVNSTARTDATE']);
			unset($oldItem['EVNSTARTTIME']);
			unset($oldItem['EVNENDDATE']);
			unset($oldItem['EVNENDTIME']);
			unset($aItem['EVNSTARTDATE']);
			unset($aItem['EVNSTARTTIME']);
			unset($aItem['EVNENDDATE']);
			unset($aItem['EVNENDTIME']);
		}else{
			$oldStartDate = $oldItem['EVNSTARTDATE'];
			unset($oldItem['_TZEVNSTARTDATE']);
			unset($oldItem['_TZEVNSTARTTIME']);
			unset($oldItem['_TZEVNENDDATE']);
			unset($oldItem['_TZEVNENDTIME']);
			unset($aItem['_TZEVNSTARTDATE']);
			unset($aItem['_TZEVNSTARTTIME']);
			unset($aItem['_TZEVNENDDATE']);
			unset($aItem['_TZEVNENDTIME']);
		}
		 		$sFuncName = $this->folder->getType() == 'C' ? 'Contact' : 'Event';

		 		if ($datestamp){
			 			if (!$following) {
				 				if ($this->item['EVNCLASS'] != 'O' && $this->item['EVNCLASS'] != 'V') {
					$sItem = 'evntitle=' . $this->item['EVNTITLE'];
					 					if (!($result = $oAccount->gwAPI->FunctionCall("Add" . $sFuncName . "Info", $sFID, $sItem, $this->itemID))){
						throw new Exc('item_edit', self::getError($oAccount->gwAPI));
					}

					 					$result = $this->makeOccurrance($datestamp, $aItem, $aTreeItem,false,$aItem,$tzid,$oldItem);

					$this->processTags($aItem);
					 					if($finalize){
						$oAccount->gwAPI->FunctionCall("Add" . $sFuncName . "Info", $sFID, '', $this->itemID);
					}
					$this->imipUpdate($this,$aItem,$aTreeItem,$aCurrentList,$aChangedList,$bResetAttendees,$sentNothing,$sentAlways,$bSendCounterAction,false,$junk,$datestamp);
					return $result;
				}
			 			} else {
				if($isAttendee){
					throw new Exc('item_edit_all_following_attendee');
				}
				unset($aItem['EVN_ID']);
				unset($aItem['EVNRCR_ID']);
				unset($aItem['EXPDATE']);
				unset($aItem['EXPFOLLOWING']);
				unset($aItem['EVNRID']);
				if(!$this->isFirstDisplayDate($this->itemID,$datestamp)){
					 					 					$addon = new GroupWareAddon($this, 'recurrence');
					$oldAddon = $addon->getData();
					$oldAddon = $oldAddon[0];
					$oldEnd = $oldAddon['RCRENDDATE'];
					 					 					$oldStart = $oldStartDate;
					$oldRcrID = $oldAddon['RCR_ID'];
					$newAddon = $oldAddon;
					$newAddon['RCRENDDATE'] = $datestamp - 1;
					$newAddon['RCRCOUNT'] = 0;

					 					$newItem = $oldItem;

					 					if ($oldAddon['RCRCOUNT']){
						$sAddonParams = $oAccount->gwAPI->CreateParamLine($oldAddon);
						$newEndDate = $oAccount->gwAPI->FunctionCall('GetEventRecurrenceEndDate', $oAccount->sGWSessionID, $oldStartDate.'-'.($oldStartDate + 3650), $sAddonParams);
						$oldAddon['RCRENDDATE'] = $newEndDate;
						$oldAddon['RCRCOUNT'] = 0;
					}

					 					$result = $addon->edit($newAddon, $newAddon['RCR_ID']);
					if ($aItem){
						foreach ($aItem as $itemProperty => $itemValue){
							$newItem[$itemProperty] = $itemValue;
						}
					}
					$newItem['EVNSTARTDATE'] = $datestamp;
					if(isset($aItem['EVNENDTIME'])){
						if ($aItem['EVNENDTIME'] != -1){
							$newItem['EVNENDDATE'] = $datestamp;
						}else{
							 							$newItem['EVNENDDATE'] = $datestamp + 1;
						}
					}
					if(isset($aItem['_TZEVNENDTIME'])){
						if ($aItem['_TZEVNENDTIME'] != -1){
							$newItem['_TZEVNENDDATE'] = $datestamp;
						}else{
							 							$newItem['_TEVNENDDATE'] = $datestamp + 1;
						}
					}
					 					unset($newItem['EVN_ID']);
					unset($newItem['EVNRCR_ID']);
					unset($newItem['EXPDATE']);
					unset($newItem['EXPFOLLOWING']);
					unset($newItem['EVNRID']);
					unset($newItem['EVNUID']);
					self::removeEditTags($newItem, CASE_UPPER);
					$aNewItem = $newItem;
					$newItem = $oAccount->gwAPI->CreateParamLine($newItem);
					if($newItem){
						$newItem = 'use_tzid=1&'.$newItem;
					}
					if (!$sEvnId = $oAccount->gwAPI->FunctionCall("Add" . $sFuncName . "Info", $sFID, $newItem)){
						throw new Exc('item_edit', self::getError($oAccount->gwAPI));
					}
					$newItem = $this->folder->getItem($sEvnId, NO_ADDONS);
					$aNewItem['_TZID'] = $tzid;
					$newItem->processTZID($aNewItem,true);
					$newItem->getAddons();
					if ($oldStart == $datestamp){
						$this->folder->deleteItems(array(0 => $this));
					}

					                     $result = $this->copyEventAddons($this,$newItem);
                    @$reminders = $result['reminder'];
                    $aTreeItem['@attributes']['uid'] = $sEvnId;
                    if ($reminders) foreach ($reminders as $rmnID => $newID) {
                        $reminder = $aTreeItem['@childnodes']['reminders'][0]['@childnodes']['reminder'][$rmnID];
                        unset($aTreeItem['@childnodes']['reminders'][0]['@childnodes']['reminder'][$rmnID]);
                        $reminder['@attributes']['uid'] = $newID;
                        $reminder['@childnodes']['values'][0]['@childnodes']['rmn_id'][0]['@value'] = $newID;
                        $reminder['@childnodes']['values'][0]['@childnodes']['rmnevn_id'][0]['@value'] = $sEvnId;
                        $aTreeItem['@childnodes']['reminders'][0]['@childnodes']['reminder'][$newID] = $reminder;
                    }

                                         if ($datestamp == slToolsDate::unix2calendardate(time())) {
                        $oldReminder = new GroupWareAddon($this, 'reminder');
                        $dataOldReminder = current($oldReminder->getData());
                        $dataOldReminder['RmnLastAck'] = strtotime("tomorrow") - 1;
                        $oldReminder->edit($dataOldReminder, $dataOldReminder['RMN_ID']);
                    }

					 					$addon = new GroupWareAddon($newItem, 'recurrence');
					$newRcrID = $addon->create($oldAddon);
					 					$result = $this->moveExceptions($oldRcrID, $newRcrID, $datestamp) && $result;
					$this->updateMasterObject($oAccount);
					$newItem->processTags($aItem);

					 					$newItem->getAddons();
					unset($newItem->aAddons['recurrence']);
					foreach($newItem->aAddons as $oAddon){
						$addonResult = $oAddon->process($aTreeItem);
						if($oAddon->sAddonType == 'reaction'){
							parse_str($addonResult,$data);
							$this->reactions_metadata = $data['reactions'];
						}
					}

					 					if($finalize){
						$oAccount->gwAPI->FunctionCall("Add" . $sFuncName . "Info", $sFID, '', $sEvnId);
					}
					if(!$skipInvitation && !$autoSave){
						$this->imipUpdate($this,$aItem,$aTreeItem,$aCurrentList,$aChangedList,$bResetAttendees,$sentNothing,$sentAlways,$bSendCounterAction,false,$junk,$datestamp);
						$imip = iMIP::load($this->folder->account);
						$imip->iMIP_Email($newItem,'invite',array(),false,$sAttendeeEmail,$sOrganizer);
					}
					return $sEvnId;
				}			}
		}

		$masterObject = &$this;
		 		if ($sClass == 'O' || $sClass == 'V') {

			if($sClass == 'O'){
				$masterID = $this->updateMasterObject($oAccount);
			}
			 			unset($aItem['EXPDATE']);
			$sItem = $oAccount->gwAPI->CreateParamLine($aItem);
			if($sItem){
				$sItem = 'use_tzid=1&'.$sItem;
			}
			if (!$result = $oAccount->gwAPI->FunctionCall("Add" . $sFuncName . "Info", $this->sFID, $sItem, $this->itemID)){
				throw new Exc('item_edit', self::getError($oAccount->gwAPI));
			}
			 			$this->getAddons();
			if ($this->aAddons){
				foreach ($this->aAddons as $aAddon){
					$addonResult = $aAddon->process($aTreeItem);
					if($aAddon->sAddonType == 'reaction'){
						parse_str($addonResult,$data);
						$this->reactions_metadata = $data['reactions'];
					}
				}
			}
			 			if($sClass=='O'){
				$masterObject = &$this->folder->getItem($masterID);
			}else{
				$masterObject = $this;
			}

			$aCurrentList = $this->aAddons['contact']->getData();
			$exception = $this->getException($sRcrID, $this->itemID);
			$datestamp = $exception['EXPDATE'];

			$this->processTags($aItem);
			$this->imipUpdate(
				$masterObject,
				$aItem,
				$aTreeItem,
				$aCurrentList,
                $aChangedList,
				$bResetAttendees,
				$sentNothing,
				$sentAlways,
				$bSendCounterAction,
				true,
				$junk,
				$datestamp
			);
			return $this->itemID;
		 		} else {
			 			if ($aItem['EVNCLASS']!='T' && !$datestamp && isset($aItem['EVNSTARTDATE']) && isset($aItem['EVNENDDATE'])) {
				$addon = new GroupWareAddon($this, 'recurrence');
				$aAddon = $addon->getData();
				if ($aAddon && $aAddon['RCRENDDATE']) {
					$aAddon = $aAddon[0];
					$oldEnd = $aAddon['RCRENDDATE'];
					$diff = $aItem['EVNSTARTDATE'] - $this->item['EVNSTARTDATE'];
					if ($aAddon['RCRENDDATE']) {
						$aAddon['RCRENDDATE'] += $diff;
						$result = $addon->edit($aAddon, $aAddon['RCR_ID']);
					}
				}
			}

			$sItem = $oAccount->gwAPI->CreateParamLine($aItem);
			if($sItem){
				$sItem = 'use_tzid=1&'.$sItem;
			}
			if($duplicityAction=='replace'){
				$sItem .= ($sItem?'&':'').'forcereplace=1';
			}

			if($aItem['THUMBNAILIMAGEID']){
				$thumbnail = $aItem['THUMBNAILIMAGEID'];
				unset($aItem['THUMBNAILIMAGEID']);
                $sItem .= ($sItem ? '&' : '').'thumbnailimageid='.$thumbnail;
			}

			if($sItem && !$result = $oAccount->gwAPI->FunctionCall("Add" . $sFuncName . "Info", $sFID, $sItem, $this->itemID)){
                $lastError = self::getError($oAccount->gwAPI);
                if($lastError == 13){
                    $fullpath = $oAccount->account->accountID.'/'.$this->folder->folderID.'/'.$this->itemID;
                    $error = '<duplicate><item><class>item</class><fullpath>'.$fullpath.'</fullpath><name>'.$aItem['EVNTITLE'].'</name><freename>'.self::proposeFreeFileName($this->folder,$aItem['EVNTITLE']).'</freename></item></duplicate>';
                    throw new XMLExc('items_duplicity', $error);
                }
                throw new Exc('item_edit', self::getError($oAccount->gwAPI));
			}
            $sNote = strtoupper($sNote);
			 			$this->getAddons();
			if ($this->aAddons){
				foreach ($this->aAddons as $k => $aAddon){
					$addonResult = $aAddon->process($aTreeItem);
					if($aAddon->sAddonType == 'reaction'){
						parse_str($addonResult,$data);
						$this->reactions_metadata = $data['reactions'];
					}elseif($aAddon->sAddonType == 'attachment' && isset($addonResult['id'])) {
                        $noteReplace = 'attachment_id_'.md5($addonResult['id']);
                        if(strpos($addonNote, $noteReplace) !== false){
                            $attachmentPath = $this->folder->account->gwAPI->FunctionCall("getAttachmentPath", $sFID, $this->itemID, $addonResult['id'], 'READONLYTICKET');
                            $addonNote = str_replace('attachment_id_'.md5($addonResult['id']), $attachmentPath, $addonNote);
                            $aItem[$sNote] = $addonNote;
                        }
                    }
				}
			}
			
			 			if(!empty($aTreeItem['@childnodes']['recurrences'][0]['@childnodes']['recurrence'] ?? null) || !empty($aTreeItem['@childnodes']['attachments'][0]['@childnodes']['attachment'] ?? null)){
				$bResetAttendees = true;
				$bSendCounterAction = (bool)$isAttendee;
			}
                         if('create' == $aTreeItem['@childnodes']['values'][0]['@childnodes']['meeting_action'][0]['@value'] ?? false){
                $bResetAttendees = true;
                $bSendCounterAction = false;            }

			$this->processTags($aItem);
			             $finalizeParams = '';

            $aItem[$sNote] = $addonNote;
            if(!empty($aItem[$sNote])){
                if($this->folder->getType() == 'N'){
                    $this->folder->account->gwAPI->FunctionCall("setEventNoteText", $sFID, $this->itemID, $aItem[$sNote]);
                }else{
                    $noteparams = [$sNote => $aItem[$sNote]];
                    if($aItem['MEETING_ACTION'] == '1'){
                        $noteparams['MEETING_ACTION'] = '3';
                    }
                    $this->folder->account->gwAPI->FunctionCall("Add".$sFuncName."Info", $sFID, '&' . $this->folder->account->gwAPI->CreateParamLine($noteparams), $this->itemID, '', ';NOEDITCOUNTER');
                }
            }

			if($sItem && $finalize){
				$oAccount->gwAPI->FunctionCall("Add" . $sFuncName . "Info", $sFID, $finalizeParams, $this->itemID);
			}
		}
		$this->imipUpdate(
			$masterObject,
			$aItem,
			$aTreeItem,
			$aCurrentList,
			$aChangedList,
			$bResetAttendees,
			$sentNothing,
			$sentAlways,
			$bSendCounterAction,
			false,
			$junk,
			$datestamp
		);
		return $this->itemID;
	}

	static public function fixAttachmentName($name)
	{
		$api = IceWarpAPI::instance();
		$c_os = $api->getProperty('C_OS');
        $regex = '/\//si';
		if($c_os==0){
			$regex ='/(:|\/|\\|\*|\||")/si';
		}

        $name = trim(preg_replace($regex, '', $name));
        return $name;
    }



	public function removeTZTags(&$aItem)
	{

	}

	private function getNextDisplayOcurrance($evnID,$datestamp)
	{
		$items = $this->getItemInstances($evnID,$datestamp);
		if($items){
			foreach($items as $item){
				if($item['EVNSTARTDATE']>$datestamp){
					return $item;
				}
			}
		}
		return false;
	}

	 	private function isFirstDisplayDate($evnID,$datestamp)
	{
		$items = $this->getItemInstances($evnID,$datestamp);
		if($items){
			foreach($items as $item){
				if($item['EVNSTARTDATE']<$datestamp){
					return false;
				}
			}
		}
		return true;
	}

	private function isDisplayedOnlyThisDay($evnID,$datestamp)
	{
		$items = $this->getItemInstances($evnID,$datestamp);
		$count = count($items);
		return (bool)($count <= 1);
	}

	private function getItemInstances($evnID,$datestamp)
	{
		if(!$this->itemInstances){
			$fields = 'EVN_ID,EVNSTARTDATE';
			$interval = ($datestamp - CHECK_INTERVAL).'-'.($datestamp + CHECK_INTERVAL);
			$filter = "EVN_ID = '".$evnID."'";
			$items = $this->folder->account->gwAPI->FunctionCall('GetIntervalEvents', $this->folder->sFID, $interval, $filter, $fields);
			$this->itemInstances = $this->folder->account->gwAPI->ParseParamLine($items);
		}
		return $this->itemInstances;
	}

    private function imipUpdate(&$masterItem, $aItem, $aTreeItem, $aCurrentList, $aChangedList, $bResetAttendees = false, $sentNothing = false, $sentAlways = false, $bSendCounterAction = false, $isOccurrance = false, &$changedAttendeeItem = false, $datestamp = '', $delete = false)
    {
        if ($sentNothing) return;
        $imip = iMIP::load($masterItem->folder->account);

                 if (!$masterItem->isOrganizator($masterItem->item['EVNFLAGS']) && !$masterItem->isOrganizator($aItem['EVNFLAGS']) && !$bSendCounterAction) return;

                 if ($aCurrentList) {
            foreach ($aCurrentList as $aAtt) {
                $aCurrentID[$aAtt['CNT_ID']] = $aAtt;
            }
        }
                 $occurranceItem = $masterItem;
        if ($isOccurrance || !$datestamp) {
            $occurranceItem = $this;
        }
        $occurranceItem->aAttendees = $aCurrentID;
                 if ($aChangedList) {
            foreach ($aChangedList as $key => $aAttendee) {
                if ($uid = $aAttendee['@attributes']['uid']) {
                    if (isset($aAttendee['@childnodes']['values'])) {
                        $sEmail = $aAttendee['@childnodes']['values'][0]['@childnodes']['cntemail'][0]['@value'];
                        $aAction['action'] = 'change';
                        $aAction['email'] = $sEmail;
                        $bResetAttendees = true;
                        if ($occurranceItem->aAttendees[$uid]['CNTEMAIL'] != $aAction['email']) {
                            $aAction['action'] = 'invite';
                            if ($aCurrentList) {
                                foreach ($aCurrentList as $itm) {
                                    if ($itm['CNTEMAIL'] == $occurranceItem->aAttendees[$uid]['CNTEMAIL']) {
                                        $aDelete[] = $itm;
                                    }
                                }
                            }
                            if (isset($aCurrentID[$uid])) {
                                $aCurrentID[$uid]['CNTCONTACTNAME'] = $aAttendee['@childnodes']['values'][0]['@childnodes']['cntcontactname'][0]['@value'];
                                $aCurrentID[$uid]['CNTEMAIL'] = $aAction['email'];
                            }
                            if ($aCurrentList) {
                                foreach ($aCurrentList as $key => $itm) {
                                    if ($itm['CNTEMAIL'] == $occurranceItem->aAttendees[$uid]['CNTEMAIL']) {
                                        $aCurrentList[$key]['CNTCONTACTNAME'] = $aAttendee['@childnodes']['values'][0]['@childnodes']['cntcontactname'][0]['@value'];
                                        $aCurrentList[$key]['CNTEMAIL'] = $aAction['email'];
                                    }
                                }
                            }
                            $occurranceItem->aAttendees[$uid]['CNTCONTACTNAME'] = $aAttendee['@childnodes']['values'][0]['@childnodes']['cntcontactname'][0]['@value'];
                            $occurranceItem->aAttendees[$uid]['CNTEMAIL'] = $aAction['email'];
                        }
                        $aActions[$aAction['email']] = $aAction;
                    } else {
                                                 if (isset($aCurrentID[$uid])) {
                            $bResetAttendees = true;
                            @$aDelete[] = array_change_key_case($aCurrentID[$uid], CASE_UPPER);
                            unset($aCurrentID[$uid]);
                        }
                    }
                                     } else {
                    $bResetAttendees = true;
                    $aAtt = array();
                    $cursor = &$aTreeItem['@childnodes']['contacts'][0]['@childnodes']['contact'][$key]['@childnodes']['values'][0]['@childnodes'];
                    if ($cursor) {
                        foreach ($cursor as $key2 => $val) {
                            $aAtt[strtoupper($key2)] = $val[0]['@value'];
                        }
                    }
                    $aAtt['CNTRSVP'] = 1;
                    $aAtt['CNTEXPECT'] = 1;
                    $aAtt['CNTCONTACTNAME'] = $aAttendee['@childnodes']['values'][0]['@childnodes']['cntcontactname'][0]['@value'];
                    $occurranceItem->aAttendees[] = $aAtt;
                    $sEmail = $aAttendee['@childnodes']['values'][0]['@childnodes']['cntemail'][0]['@value'];
                    $aAction['action'] = 'invite';
                    $aAction['email'] = $sEmail;
                    $aActions[$aAction['email']] = $aAction;
                }
            }
        }
        if ($aCurrentID) {
            foreach ($aCurrentID as $aCurrent) {
                $aAction['action'] = ($aItem['EVNFLAGS'] && ($aItem['EVNFLAGS'] != $occurranceItem->item['EVNFLAGS'])) ? 'invite' : 'change';
                $aAction['email'] = $aCurrent['CNTEMAIL'];
                $occurranceItem->aAttendees[$aCurrent['CNT_ID']]['CNTRSVP'] = 1;
                $aActions[$aAction['email']] = $aAction;
            }
        }
        if ($bResetAttendees || $sentAlways || $bSendCounterAction) {
                         $update_status['@childnodes']['contacts'][0]['@childnodes']['contact'] = array();
            $pointer = &$update_status['@childnodes']['contacts'][0]['@childnodes']['contact'];

            if (is_array($aCurrentList) && !empty($aCurrentList)) foreach ($aCurrentList as $aID => $aAttendee) {
                if (isset($aChangedList[$aAttendee['CNT_ID']]['@childnodes']['values'][0]['@childnodes']['cntstatus'][0]['@value'])) {
                    $pointer[$aID]['@childnodes']['values'][0]['@childnodes']['cntstatus'][0]['@value'] = $aChangedList[$aAttendee['CNT_ID']]['@childnodes']['values'][0]['@childnodes']['cntstatus'][0]['@value'];
                } else {
                    $pointer[$aID]['@childnodes']['values'][0]['@childnodes']['cntstatus'][0]['@value'] = 'B';
                }
                $pointer[$aID]['@attributes']['uid'] = $aAttendee['CNT_ID'];
            }
            if ((!$datestamp || $isOccurrance) && $occurranceItem && $occurranceItem->aAddons['contact']) {
                $occurranceItem->aAddons['contact']->process($update_status);
            }
            $aAttachment = false;
            $isAttendee = $occurranceItem->isAttendee($aItem['evnflags']) || $occurranceItem->isAttendee($masterItem->item['EVNFLAGS']);
            if ($isAttendee) {
                $aAction['action'] = 'counter';
                $sMethod = 'COUNTER';
                $sOwnerEmail = $occurranceItem->folder->account->gwAPI->getFolderOwner($masterItem->folder);
            } else {
                $sMethod = 'REQUEST';
                $sOwnerEmail = false;
            }
            if ($datestamp && $delete) {
                if ($isAttendee) {
                    $occurranceItem->decline('', $datestamp);
                } else {
                    $occurranceItem->cancel($aDelete, $datestamp);
                }
            } else {
                $oInvitation = $masterItem->createInvitation(false, $sMethod, $datestamp, $occurranceItem->itemID);
                $aAttachment = $masterItem->createInvitationAttachment($oInvitation, $sMethod);
                $imip->iMIP_Email($masterItem, $aAction['action'], $aAttachment, false, $aAction['email'], false, $sOwnerEmail);
            }
        }
                 if ($aDelete) {
            $masterItem->cancel($aDelete, $datestamp, $isAttendee);
        }
    }

	private function updateSequence()
	{
		if (!$result = $this->folder->account->gwAPI->FunctionCall("AddEventInfo", $this->sFID, 'evnsequence='.($this->item['EVNSEQUENCE'] + 1), $this->item['EVN_ID'])){
			throw new Exc('item_edit', self::getError($this->folder->account->gwAPI));
		}
	}

    public function updateMasterObject($account, $deleteException = false, $occuranceID = false)
    {
        $eventsline = $account->gwAPI->FunctionCall('GetEventList', $this->sFID, "evnrcr_id='" . $this->item['EVNRCR_ID'] . "'", 'evntitle');  
        $eventsline = $account->gwAPI->ParseParamLine($eventsline);

        $event = $eventsline[0];
        if (!$event) {
            return false;
        }
                 $sItem = 'evntitle=' . ($event['EVNTITLE']);

        if (!$result = $account->gwAPI->FunctionCall("AddEventInfo", $this->sFID, $sItem, $event['EVN_ID'])) {
            throw new Exc('item_edit', self::getError($account->gwAPI));
        }

        if ($deleteException || $occuranceID) {
                         $exceptions = $account->gwAPI->FunctionCall('GetEventException', $this->sFID, $this->item['EVNRCR_ID']);
            $exceptions = $account->gwAPI->ParseParamLine($exceptions);

            if ($exceptions) foreach ($exceptions as $exc) {
                if ($exc['EXPRCR_ID'] != $this->item['EVNRCR_ID']) continue;
                $toDelete = $exc['EXP_ID'];
                                 if ($occuranceID && $this->itemID == $exc['EXPEVNID']) {
                                         if ($this->item['EVNCLASS'] != 'V') {
                        $sParam = $account->gwAPI->CreateParamLine(array('EXPEVNID' => ''));
                    }
                    if (!$account->gwAPI->FunctionCall('AddEventException', $this->sFID, $exc['EXPRCR_ID'], $sParam, $exc['EXP_ID'])) {
                        throw new Exc("item_occurance_delete", $exc['EXP_ID']);
                    }
                } else if ($deleteException) {
                                         if (!$account->gwAPI->FunctionCall('DeleteEventException', $this->sFID, $toDelete)) {
                        throw new Exc("item_exception_delete", $toDelete);
                    }
                }
            }
        }
                 $account->gwAPI->FunctionCall("AddEventInfo", $this->sFID, '', $event['EVN_ID']);
        return $event['EVN_ID'];
    }

	  
		public function move($destination)
		{
			$folder = $this->folder;
			$account = $folder->account;
			 			$folder->openAccess();
			 			switch($this->duplicity){
				case 'rename':
					$duplicity = ';COPYRENAMETO='.urlencode($this->rename);
					break;
				case 'replace':
					$duplicity = ';FORCEREPLACE=1';
					break;
			}
			 			if(!$account->gwAPI->FunctionCall("MoveItem", $folder->sFID, $this->itemID, MerakGWAPI::encode($destination->folderID), $duplicity)){
				$lastError = self::getError($account->gwAPI);
				if($lastError == 13){
					throw new Exc('item_duplicity',$this->item['EVNTITLE']);
				}
				throw new Exc('item_move',$this->itemID);
			}
			return true;
		}

	  
		public function copy($destination)
		{
			$folder = $this->folder;
			$account = $folder->account;
			 			$folder->openAccess();
            $duplicity = '';
			 			switch($this->duplicity){
				case 'rename':
					$duplicity .= ';COPYRENAMETO='.urlencode($this->rename);
					break;
				case 'replace':
					$duplicity .= ';FORCEREPLACE=1';
					break;
			}
			if(!GroupWareItem::isOrganizator($this->item['EVNFLAGS'])){
                $duplicity .= ';EXCLUDEATTENDEES';
            }
			if(is_callable([$destination, 'handleCopyItemFrom'])) return $destination->handleCopyItemFrom($this, $folder);
			 			if(!($copiedID = $account->gwAPI->FunctionCall("CopyItem", $folder->sFID, $this->itemID, MerakGWAPI::encode($destination->folderID), $duplicity))){
				$lastError = self::getError($account->gwAPI);
				if($lastError == 13){
					throw new Exc('item_duplicity',$this->item['EVNTITLE']);
				}
				throw new Exc('item_copy',$this->itemID);
			}
			return $copiedID;
		}

		 
		public function makeException($datestamp, $occurrance_id = false)
		{
			$this->openAccess();
			$folder = $this->folder;
			$oAccount = $folder->account;

			$result = $oAccount->gwAPI->FunctionCall("GetEventRecurrence", $this->sFID, $this->itemID);
			$result = $oAccount->gwAPI->ParseParamLine($result);

			$sEvnRcrID = $result[0]['RCR_ID'];

			$parameters['expDate'] = $datestamp;
			if ($occurrance_id) $parameters['expEvnID'] = $occurrance_id;

        $parameters = $oAccount->gwAPI->CreateParamLine($parameters);

			return $oAccount->gwAPI->FunctionCall("AddEventException", $this->sFID, $sEvnRcrID, $parameters);
		}

		 
		public function makeOccurrance($datestamp, $parameters = array(), $aTreeItem,$addons = false,$aItem = false,$tzid = false,$oldItem = array(),$doNotCopyReminder = false)
		{
			$this->openAccess();
			$folder = $this->folder;
			$oAccount = $folder->account;
			$occurrance = $oldItem;
			if ($occurrance) {
				$occurrance = array_change_key_case($occurrance, CASE_LOWER);
				unset($occurrance['evn_id']);
				unset($occurrance['evngrp_id']);
				unset($occurrance['evn_created']);
				$sRcrID = $occurrance['evnrcr_id'];
				unset($occurrance['evnrcr_id']);
			}

			if ($parameters){
				$parameters = array_change_key_case($parameters, CASE_LOWER);
				unset($parameters['expdate']);

				$itm = array_change_key_case($this->item, CASE_LOWER);
				if ($parameters)
					foreach ($parameters as $key => $val){  
						$occurrance[$key] = $val;
					}
			}
			 			if($occurrance['evnclass'] != 'T'){
				if($occurrance['evnendtime'] == '-1' && $occurrance['evnstartdate'] == $occurrance['evnenddate']){
					$occurrance['evnstartdate'] = $datestamp;
					$occurrance['evnenddate'] = $datestamp + 1;
				}
				if($occurrance['_tzevnendtime'] == '-1' && $occurrance['_tzevnstartdate'] == $occurrance['_tzevnenddate']){
					$occurrance['_tzevnstartdate'] = $datestamp;
					$occurrance['_tzevnenddate'] = $datestamp + 1;
				}
			}
			self::removeEditTags($occurrance);
			$tzid = $tzid?$tzid:$occurrance['_tzid'];

			if(!$aItem['EVNTIMEFORMAT']){
				$aItem['EVNTIMEFORMAT'] = $occurrance['evntimeformat'];
			}else{
				$occurrance['evntimeformat'] = $aItem['EVNTIMEFORMAT'];
			}
			if(!$aItem['_TZID'] && ($tzid || $occurrance['_tzid'])){
				if(!$tzid && $occurrance['_tzid']){
					$tzid = $occurrance['_tzid'];
				}
				$aItem['_TZID'] = $tzid;
			}else{
				$occurrance['evntimeformat'] = 'Z';

			}
			$occurrance['evnclass'] = ($folder->getType() == 'T') ? $parameters['evnclass'] : 'O';  			if($occurrance['evntimeformat'] == 'Z'){
				$occurrance['_tzid'] = $tzid;
			}
			if( !isset($occurrance['_tzevnstarttime'])){
				unset($occurrance['_tzid']);
			}

			$sOccurrance = $oAccount->gwAPI->CreateParamLine($occurrance);
			if($sOccurrance){
				$sOccurrance = 'use_tzid=1&'.$sOccurrance;
			}
			 			if (!$sEvnId = $oAccount->gwAPI->FunctionCall("AddEventInfo", $this->sFID, $sOccurrance, '', $sRcrID)) {
			    throw new Exc('item_occurrance_create');
            }

			 			if (!$this->makeException($datestamp, $sEvnId)) throw new Exc('item_exception_create');

			$oOcurrance = $this->folder->getItem($sEvnId);

			if($tzid) $occurrance['_tzid'] = $tzid;
			$oOcurrance->processTZID($occurrance);

			$result = $this->copyEventAddons($this,$oOcurrance,$doNotCopyReminder);
			@$reminders = $result['reminder'];
			$aTreeItem['@attributes']['uid'] = $sEvnId;
			if($reminders) foreach($reminders as $rmnID => $newID){
				$reminder = $aTreeItem['@childnodes']['reminders'][0]['@childnodes']['reminder'][$rmnID];
				unset($aTreeItem['@childnodes']['reminders'][0]['@childnodes']['reminder'][$rmnID]);
				$reminder['@attributes']['uid'] = $newID;
				$reminder['@childnodes']['values'][0]['@childnodes']['rmn_id'][0]['@value'] = $newID;
				$reminder['@childnodes']['values'][0]['@childnodes']['rmnevn_id'][0]['@value'] = $sEvnId;
				$aTreeItem['@childnodes']['reminders'][0]['@childnodes']['reminder'][$newID] = $reminder;
			}

			 			$oOcurrance->getAddons();
			 			unset($oOcurrance->aAddons['recurrence']);

			 			if ($oOcurrance->aAddons)
				foreach ($oOcurrance->aAddons as $aAddon){
					$aAddon->process($aTreeItem);
				}

			return $sEvnId;
		}


	static public function copyEventAddons(&$sourceItem,&$targetItem,$noreminder = false)
	{
		 		$attendee = new GroupWareAddon($sourceItem,'contact');
		$attendeeData = $attendee->getData();
		 		$attachment = new GroupWareAddon($sourceItem,'attachment');
		$attachmentsData = $attachment->getData();
		 		$reminder = new GroupWareAddon($sourceItem,'reminder');
		$reminderData = $reminder->getData();

		@$rem = reset($reminderData);

		 		if($attendeeData){
			$attendee = new GroupWareAddon($targetItem,'contact');
			foreach($attendeeData as $attendeeItm){
				$attendeeItm['CNTRSVP'] = 1;
				$attendeeItm['CNTSTATUS'] = 'B';
				unset($attendeeItm['CNTEVN_ID']);
				unset($attendeeItm['CNT_ID']);
				$attendee->create($attendeeItm);
			}
		}
		 		if($attachmentsData){
			$attachment = new GroupWareAddon($targetItem,'attachment');
			foreach($attachmentsData as $attacmentItm){
				$att['class'] = 'attachment';
				$att['fullpath'] = $sourceItem->folder->account->account->accountID.'/'.
				$sourceItem->folder->folderID.'/'.
				$sourceItem->item['EVN_ID'].'/'.
				$attacmentItm['ATTNAME'];
				$att['description'] = $attacmentItm['ATTDESC'];
				$attachment->create($att);
			}
		}
		 		if(!$noreminder && $reminderData){
			$reminder = new GroupWareAddon($targetItem,'reminder');
			foreach($reminderData as $reminderItm){
				unset($reminderItm['RMN_ID']);
				unset($reminderItm['RMNEVN_ID']);
				$newReminder = $reminder->create($reminderItm);
				$result['reminder'][$rem['RMN_ID']] =$newReminder;
			}
		}
		return $result;
	}

    private static function removeTags(&$array, array $unset, $case = CASE_LOWER)
    {
        $array = array_change_key_case($array, $case);

        foreach ($unset as $u){
            if ($case == CASE_UPPER) {
                unset($array[strtoupper($u)]);
            } elseif ($case == CASE_LOWER){
                unset($array[strtolower($u)]);
            }
        }
    }

	private static function removeTimeTags(&$array, $case = CASE_LOWER)
	{
		$unset = array(0 => 'evnstarttime', 1 => 'evnendtime', 2 => 'evnstartdate', 3 => 'evnenddate');
	    self::removeTags($array, $unset, $case);
	}

	private static function removeEditTags(&$array, $case = CASE_LOWER)
	{
		$unset = array(0 => 'evn_editcounter', 1 => 'evnt_created', 2 => 'evn_modified', 3 => 'evnfolder');
        self::removeTags($array, $unset, $case);
	}
		 
		public function composeXML($sAddonsXML)
		{
			$additionalFields = '';
			switch ($this->item['EVNCLASS'] ?? null) {
				case 'S':
				case 'Q':
				case 'R':
				case 'D':
				case 'B':
				case 'W':
				case 'Y':
				case 'Z':
					$additionalFields = ',evn_documenteditinginfo,evncomevnid,evncomlinkextras,GPinOwnName,GPinOwnEmail,Pin_MetaData,PinOwnEmail,PinOwnID,PinOwnName,PinWhen,GPinWhen,LPinWhen,PinOwnEmail,PinOwnName,PinEvn_ID,PinOwn_ID,MENWHOOWN_ID,MenLinkType,MenLink_ID,MenLinkEmail,MenLinkName,MenWhoOwnEmail,MenWhoOwnName,MenWhen,evnnote_text,evnmentions_info,reavalue,evntitle,evnlocation,evnnote,evnownername,evnowneremail,evnmodifiedowneremail,evnmodifiedownername,evnlinkextras,evnthumbnailticket,evnsizeinfo';
					break;
				case 'I':
					$additionalFields = ',evncomevnid,evncomlinkextras,GPinOwnName,GPinOwnEmail,Pin_MetaData,PinOwnEmail,PinOwnID,PinOwnName,PinWhen,GPinWhen,LPinWhen,PinOwnEmail,PinOwnName,PinEvn_ID,PinOwn_ID,MENWHOOWN_ID,MenLinkType,MenLink_ID,MenLinkEmail,MenLinkName,MenWhoOwnEmail,MenWhoOwnName,MenWhen,evnnote_text,evnmentions_info,reavalue,evn_metadata,evntitle,evnlocation,evnnote,evnownername,evnowneremail,evnmodifiedowneremail,evnmodifiedownername,evnlinkextras,evnprocessingqueued,evnthumbnailtime,evnthumbnailid,evnthumbnailticket,evnsizeinfo';
					break;
				case 'M':
				case 'F':
					$additionalFields = ',evndoceditable,inviteticket,evndocinvite,evndocpass,evndocexpire,evndocrights,evn_documenteditinginfo,evncomevnid,evncomlinkextras,GPinOwnName,GPinOwnEmail,Pin_MetaData,PinOwnEmail,PinOwnID,PinOwnName,PinWhen,GPinWhen,LPinWhen,PinOwnEmail,PinOwnName,PinEvn_ID,PinOwn_ID,MENWHOOWN_ID,MenLinkType,MenLink_ID,MenLinkEmail,MenLinkName,MenWhoOwnEmail,MenWhoOwnName,MenWhen,evnnote_text,evnmentions_info,reavalue,evntitle,evnlocation,evnnote,evnownername,evnowneremail,evnmodifiedowneremail,evnmodifiedownername,evnprocessingqueued,evnthumbnailtime,evnthumbnailid,evnticket,evnsizeinfo,evnlockown_email,evnthumbnailticket,evnsizeinfo,evnlockown_id';
					break;
				case 'E':
					$additionalFields = ',osd,evncomevnid,evncomlinkextras,GPinOwnName,GPinOwnEmail,Pin_MetaData,PinOwnEmail,PinOwnID,PinOwnName,PinWhen,GPinWhen,LPinWhen,PinOwnEmail,PinOwnName,PinEvn_ID,PinOwn_ID,MENWHOOWN_ID,MenLinkType,MenLink_ID,MenLinkEmail,MenLinkName,MenWhoOwnEmail,MenWhoOwnName,MenWhen,evnnote_text,evnmentions_info,reavalue,evntitle,evnlocation,evnnote,evnownername,evnowneremail,evnmodifiedowneremail,evnmodifiedownername,evnmystatus,evnaccepted,evnacceptedparticipantcount,evnthumbnailticket,evnsizeinfo';
					break;
				case 'T':
					if (isset($this->item['EVNDESCFORMAT']) && isset($this->item['EVNNOTE']) && 'text/html' === $this->item['EVNDESCFORMAT']) {
						$enableExternalResources = false;
						if (isset($_SESSION['clientSettings']) && isset($_SESSION['clientSettings']['show_inline_images']) && true === $_SESSION['clientSettings']['show_inline_images']) {
							$enableExternalResources = true;
						}
						$this->item['EVNNOTE'] = slToolsString::purifyHTML($this->item['EVNNOTE'], $enableExternalResources);
					}
					break;
				default:
					 					break;
			}
			$sReturn = '<values>'.Tools::makeXMLTags($this->item,$this->fields.$additionalFields).'</values>'.$sAddonsXML;

        return $sReturn;
    }

		 
		public function openAccess()
		{
			$this->sFID = $this->folder->openAccess();
			return $this->sFID;
    	}

		public function closeAccess() {}
 
    public function getItemData(&$info = array())
    {
        $data = $this->getVersitObject($vinfo);

        $title = $this->item['ITMCLASSIFYAS'] ? $this->item['ITMCLASSIFYAS'] : $this->item['EVNTITLE'];
        if (!$title) $title = 'item';

        $info['size'] = strlen($data);
        $info['name'] = $title . $vinfo['fileext'];
        $info['mimetype'] = $vinfo['mimetype'];
        $info['encoding'] = 'base64';

        return $data;
    }

     
     
    public function sendData()
    {
        $data = $this->getVersitObject($info);
        $size = strlen($data);
        if ($this->item['ITMCLASS'] == 'C' || $this->item['ITMCLASS'] == 'L') {
            $name = $this->item['ITMCLASSIFYAS'] . '-' . $this->item['ITM_ID'];
        } else {
            $name = $this->item['EVNTITLE'] . '-' . $this->item['EVN_ID'];
        }
        $fileName = $name . $info['fileext'];
        $mimeType = $info['mimetype'];
        $_SESSION['user']->closeSession();
        slToolsFilesystem::sendFileHeaders($fileName, $size, $mimeType);
        echo $data;
    }

    public function sendCID($cid, $start_part_id, $ids)
    {
        $attachment = new GroupWareAddon($this, 'attachment');
        $p = $start_part_id;
        $partID = null;
		$oItem = $this->getEML($attachment,$partID,$p);
		return $oItem->sendCID($cid,$start_part_id,$ids);
	}
  
	public function getVersitObject(&$info = array())
	{
		 
		$folder = $this->folder;
		$account = $folder->account;
		$folder->openAccess();
		$info = array();
		$params = ';EMBEDATT';

		if($this->itemType == 'C'){
            $function = 'GetvCard';
            $info['fileext'] = VCARD_EXT;
            $info['mimetype'] = 'text/x-vcard';
        }else{
            $function = 'GetvCalendar';
            $info['fileext'] = VCALENDAR_EXT;
            $info['mimetype'] = 'text/x-vcalendar';
        }

		 
		return $account->gwAPI->FunctionCall($function, $this->sFID, $this->itemID, $params);
	   	}

	public function getDataFile(&$info)
	{
		$versit = $this->getVersitObject($info);
		$filename = Tools::randomFilename();
		slSystem::import('tools/icewarp');
		slToolsIcewarp::iw_file_put_contents($filename,$versit);
		if($this->item['ITMCLASS']=='C'){
			$name = $this->item['ITMCLASSIFYAS'].'-'.$this->item['ITM_ID'];
		}else{
			$name = $this->item['EVNTITLE'].'-'.$this->item['EVN_ID'];
		}
		$info['name'] = $name.$info['fileext'];
		$info['type'] = $info['mimetype'];
		$info['size'] = filesize($filename);
		$info['file'] = $filename;
		return $filename;
	}

	 

    public function getAllAttachments()
    {
        $attachment = new GroupWareAddon($this, 'attachment');
        $aAttachments = $attachment->getData();

                 if ($aAttachments) foreach ($aAttachments as $key => $aAttachment) {
            $aResult[$key]['file_content'] = $attachment->getAttachment($aAttachment['ATTNAME']);
            $aResult[$key]['name'] = $aAttachment['ATTDESC'];
            $aResult[$key]['param'] = Tools::parseURL($aAttachment['ATTPARAMS']);
        }

        if (!$aResult) throw new Exc('attachment_get');

        return $aResult;
    }

	public function getAttachmentData($partID,&$info = array())
	{
		$attachment = $this->getAttachment($partID);
		$info['name'] = $attachment['name'];
		$info['mimetype'] = $attachment['param']['mimetype'];
		$info['encoding'] = 'base64';

		return base64_encode($attachment['file_content']);
	}

	 
	public function getAttachmentDataFile($partID,&$info = array(),$start_part_id = '')
	{

		$attachment = new GroupWareAddon($this,'attachment');
		 		if(strpos($partID,'|')!==false){
			$partID = str_replace('|','/',$partID);
		}
		if($start_part_id){
			$partID = $start_part_id.'/'.$partID;
		}
        $attInfo = [];
        if (strpos($partID, '/') !== false) {
            $parts = explode('/', $partID);
            $attachmentID = $parts[0];
            $emlAttachmentID = $parts[1];
            $startPartID = $parts[0] . '|' . $parts[1];
            $oItem = $this->getEML($attachment, $partID, $startPartID);
            $result = $oItem->getAttachmentDataFile(substr($partID, strpos($partID, '/') + 1), $attInfo);
            $info['name'] = $attInfo['name'];
            $info['mimetype'] = $attInfo['mimetype'];
            return $result;
        } else {
            $attInfo = $this->getAttachment($partID, false, false);

            $info['name'] = $attInfo['name'];
            $info['mimetype'] = $attInfo['param']['mimetype'];

            return $attachment->getAttachmentFile($partID);
        }
    }

    public function getAttachmentDataFileCID($cid, &$info = array())
    {
        $attachment = new GroupWareAddon($this, 'attachment');
        $startPartID = null;
		$oItem = $this->getEML($attachment, $cid, $startPartID);
		$result = $oItem->getAttachmentDataFileCID($cid, $info);
		return $result;
	}

	public function getAllAttachmentFiles($start_part_id = false)
	{
		$attachment = new GroupWareAddon($this,'attachment');
		if($start_part_id){
			$partID = $start_part_id;
			$oItem = $this->getEML($attachment,$partID,$start_part_id);
            $attachmentID = '1';
			if(strpos($partID,'|')!==false){
				$parts = explode('|',$partID);
				$attachmentID = $parts[1];
			}
			return $oItem->getAllAttachmentFiles($attachmentID);
		}else{
			$aAttachments = $attachment->getData();
			 			if ($aAttachments) foreach ($aAttachments as $key => $aAttachment) {
                $aResult[$key]['file'] = $attachment->getAttachmentFile($aAttachment['ATTNAME']);
                $aResult[$key]['name'] = $aAttachment['ATTNAME'];
                if(strpos($aAttachment['ATTNAME'],'.')===false){
                    $aResult[$key]['name'] = $aAttachment['ATTDESC'];
                }
			}
		}

		if (!$aResult){
			throw new Exc('attachment_get','list');
		}
		return $aResult;
	}

	 
	public function getAttachment($partID,$startPartID = false,$content = true)
	{
		$attachment = new GroupWareAddon($this,'attachment');
		 		if($startPartID){
			$oItem = $this->getEML($attachment,$partID,$startPartID);
			return $oItem->getAttachment($startPartID);
		}else{
			$aAttachments = $attachment->getData($partID);
			 			if(!$aAttachments){
                $aAttachments = $attachment->getData(urldecode($partID));
            }
            if($aAttachments) foreach ($aAttachments as $key => $aAttachment) {
                if($content){
                    $aResult['file_content'] = $attachment->getAttachment($aAttachment['ATTNAME']);
                }
                $aResult['name'] = $aAttachment['ATTDESC'];
                $aResult['param'] = Tools::parseURL($aAttachment['ATTPARAMS']);
            }
		}
		if (!$aResult) throw new Exc('attachment_get',$partID);

		return $aResult;
	}

	public function getEML($attachment = '' ,&$partID,&$startPartID)
	{
		if(!$attachment){
			$attachment = new GroupWareAddon($this,'attachment');
		}
		if(strpos($startPartID,'|') !== false){
			$parts = explode('|',$startPartID);
			$attachmentID = $parts[0];
			$startPartID = $parts[1];
		}else{
			$attachmentID = $startPartID;
			$startPartID = false;
		}
		if($attachmentID=='@@MAIN@@'){
			$attachmentID = $this->getFileAttachmentID();
		}
		@$att = reset($attachment->getData($attachmentID));

		$params = $att['ATTPARAMS'];
		$params = Tools::parseURL($params);
		if($params['mimetype'] == 'message/rfc822' || $params['mimetype'] = 'mimetype=message%2Frfc822'){  			$file = $attachment->getAttachmentFile($att['ATTNAME']);

			if($startPartID){
				$parser = new MailParse($file,array(),false,'',$startPartID);
			}else{
				$parser = new MailParse($file);
			}
			$oItem = new GroupWareItemMail($this,$partID,$parser,$attachmentID,$startPartID);

			return $oItem;
		}
	}

	public function sendAttachment($partID,$startPartID = false,$ids = array(),$sForceName = false,$resize = false,$atttype = '',$skin = false,$passphrase = '')
	{
        $fName = null;
		$attachment = new GroupWareAddon($this,'attachment');
		 		if($startPartID){
			$oItem = $this->getEML($attachment,$partID,$startPartID);
			return $oItem->sendAttachment($partID,$startPartID,$ids,$sForceName,$resize,$atttype,false,$passphrase);
		 		}else{
			@$att = reset($attachment->getData($partID));
			if (!$att){
				if($skin != false){

					if(!slToolsFilesystem::securepath($skin)){
						throw new Exc('skin_secure_path');
					}
					$name = 'face-placeholder.gif';
					$file = '../client/skins/'.$skin.'/images/'.$name;
					if(!file_exists($file)){
						$file = '../client/skins/default/images/'.$name;
					}
					$size = icewarp_file_get_size($fName,true);
					slToolsFilesystem::sendFileHeaders($name, $size, 'image/gif', false, 'inline');
					slToolsFilesystem::downloadFile($file,false);
				}
				throw new Exc('attachment_get',$partID);
			}
			if(!$att['ATTPARAMS']){
				$att['ATTPARAMS'] = Tools::createURL(array('mimetype' => 'application/octet-stream'));
			}

			$fName = $attachment->getAttachmentFile($att['ATTNAME'],'',$atttype);
			if($_SESSION['user']){
				$_SESSION['user']->closeSession();
			}

            if ($resize) {
                                 $uPath = User::getUploadDir('resize/');
                $uName = $uPath . slSystem::uniqueID() . urlencode($att['ATTNAME']);
                copy($fName, $uName);
                slSystem::import('tools/image');
                $image = new slToolsImage();
                $image->load($uName);
                $image->edit($resize['width'], $resize['height'], $resize['crop']);
                $fName = $uPath . $image->save();
            }
            $atttype = $atttype ? $atttype : $att['ATTTYPE'];
                         if ($att['ATTTYPE'] == 'U') {
                $url = trim(icewarp_file_get_contents($fName, true));
                header("Location: " . $url);
                die();
            } else {
                switch ($atttype) {
                    case 'T':
                        $mimeType = 'image/jpeg';
                        $fileName = 'THUMB.jpg';
                        $mode = 'inline';
                        break;
                    case 'D':
                        $mimeType = 'application/pdf';
                        $fileName = 'PDF.pdf';
                        $mode = 'inline';
                        break;
                    case 'H':
                        $mimeType = 'text/html';
                        $fileName = '';
                        $mode = 'inline';
                        break;
                    case 'E':
                        $mimeType = 'text/plain';
                        $fileName = '';
                        $mode = 'inline';
                        break;
                    default:
                        $params = Tools::parseURL($att['ATTPARAMS']);
                        $mimeType = $params['mimetype'];
                        $fileName = $att['ATTDESC'];
                        $mode = 'attachment';
                        break;
                }
                $size = icewarp_file_get_size($fName, true);
                slToolsFilesystem::sendFileHeaders($fileName, $size, $mimeType, false, $mode);
                slToolsFilesystem::downloadFile($fName, false);
            }
        }
    }

    public function sendDocument($type = 'attachment', $resize = array(), $passphrase = '')
    {
                                   switch ($type) {
            case 'attachment':
                $this->sendAttachment($this->item['EVNTITLE'], false, array(), false, $resize, '', false, $passphrase);
                break;
            case 'pdf':
                $this->sendAttachment($this->item['EVNTITLE'], false, array(), false, $resize, 'D', false, $passphrase);
                break;
            case 'thumbnail':
                $this->sendAttachment($this->item['EVNTITLE'], false, array(), false, $resize, 'T', false, $passphrase);
                break;
        }
    }

    public function getSubjectFileName()
    {
        return '';
    }

    public function importAttachment($att_id, $delete_after_import = false)
    {
        $path = explode("|", $att_id);
        $att_id = $path[0];
        $part_id = $path[1];
        $attachment = new GroupWareAddon($this, 'attachment');
        $oItem = $this->getEML($attachment, $att_id, $att_id);
        $info = array();
        $vcard = $oItem->getAttachmentData($part_id, $info);

        $gwAPI = &$this->folder->account->gwAPI;
        if (!$gwAPI->IsConnected()) {
            throw new Exc('groupware_init_failed');
        }
        $sXML = $gwAPI->FunctionCall("ConvertVersit", $gwAPI->sessid, $vcard, 'XML;FILTER=ATTACH');
        $oXML = simplexml_load_string($sXML);

        switch ($info['mimetype']) {
            case 'text/directory':
            case 'text/vcard':
            case 'text/x-vcard':
                $mimetype = 'vcard';
                $type = 'C';
                break;
            case 'text/x-vcalendar':
            case 'text/calendar':
            default:
                $mimetype = 'vcalendar';
                if ($oXML->VEVENT) {
                    $type = 'E';
                } elseif ($oXML->VTODO) {
                    $type = 'T';
                } elseif ($oXML->VNOTE) {
                    $type = 'N';
                } elseif ($oXML->VJOURNAL) {
                    $type = 'J';
                } else {
                    $name = $oXML->getName();
                    if ($name == 'VNOTE') {
                        $type = 'N';
                    } else {
                        throw new Exc('item_invalid_type');
                    }
                }
                break;
        }
        $fdrType = 'gw';

        $oAccount = $_SESSION['user']->getAccount($_SESSION['EMAIL']);
        $sFolderName = $_SESSION['user']->getDefaultFolder($type);
        if ($delete_after_import) {
            try {
                $oFolder = $oAccount->account->getFolder('__@@GWTRASH@@__', $fdrType);
                $sFolderName = '__@@GWTRASH@@__';
            } catch (Exc $e) {
                             }
        }
        try {
            if (!is_object($oFolder)) {
                $oFolder = $oAccount->getFolder($sFolderName, $fdrType);
            }
        } catch (Exc $e) {
            throw new Exc('default_folder_missing', $type);
        }
        $oItem = $oFolder->importItem($mimetype, $vcard);
        $result['folder'] = $oFolder;
        $result['item'] = $oItem;
        if ($delete_after_import) {
            $oItem->delete(false, false, '', true, true, true);
        }
        return $result;
    }

     

    public function createInvitation($bAttendeeInit = false, $sMethod = 'REQUEST', $datestamp = false, $occurranceID = false)
    {
                 $oGWAccount = &$this->folder->account;
        $sFolder = $this->folder->folderID;

        $sEvnID = $this->itemID;

                 $iMIP = iMIP::load($oGWAccount);
        $oInvitation = $iMIP->createInvitation($sFolder, $sEvnID, $bAttendeeInit, $sMethod, $datestamp, $occurranceID);
        return $oInvitation;
    }

    public function createInvitationAttachment($oInvitation, $sMethod = 'REQUEST')
    {
                 $oGWAccount = &$this->folder->account;
                 $iMIP = iMIP::load($oGWAccount);
                 $aAttachment = $iMIP->createAttachment($oInvitation->sInvitation, '', $sMethod);

        $sXML = $iMIP->convertVersit($oInvitation->sInvitation);
        $aAttachment['xml'] = $sXML;
        return $aAttachment;
    }

              public function cancel($aAttendees = array(), $datestamp = '')    {
                 $iMIP = iMIP::load($this->folder->account);
        $oInvitation = $iMIP->loadInvitationID($this->folder->folderID, $this->itemID);

                          if (!$aAttendees) {
            if (!$this->aAddons['contact']) {
                $this->aAddons['contact'] = new GroupWareAddon($this, 'contact');
            }
            $oAttendees = $this->aAddons['contact'];
            $aAttendees = $oAttendees->getData();
            $this->aAttendees = $aAttendees;
        }
        if ($aAttendees) foreach ($aAttendees as $aAttendee)
            $aAttendeeID[] = $aAttendee['CNTEMAIL'];


        $sData = $oInvitation->cancel($aAttendeeID, $datestamp);


        $sXML = $iMIP->convertVersit($sData);

                 $aAttachment = $iMIP->createAttachment($sData, '', 'CANCEL');
        $aAttachment['imip_xmlstr'] = $sXML;
        $iMIP->iMIP_Email($this, 'cancel', $aAttachment, false);

        return $aAttachment;
    }

              public function decline($reason = '', $datestamp = '')
    {
                 $iMIP = iMIP::load($this->folder->account);
        $oInvitation = $iMIP->loadInvitationID($this->folder->folderID, $this->itemID);

                          $sData = $oInvitation->decline($this->folder->account->gwAPI->getFolderOwner($this->folder), $reason, $datestamp);
        $sXML = $iMIP->convertVersit($sData);

                 $aAttachment = $iMIP->createAttachment($sData, 'REPLY');
        $aAttachment['imip_xmlstr'] = $sXML;

        $iMIP->iMIP_Email($this, 'decline', $aAttachment);

        return $aAttachment;
    }

    public function getCertificate($part_id = 'current', $passphrase = '')
    {
        $addon = new GroupWareAddon($this, 'certificate');
        $list = $addon->getData();
        if ($part_id == 'current') {
            return Storage::getCurrentCertificate($list);
        } else {
            return $list[$part_id];
        }
    }

    public function processTZID($aItem, $edit = false, $isRecurrent = false)
    {
        @$aItem = array_change_key_case($aItem, CASE_UPPER);
        if (isset($aItem['EVNTIMEFORMAT'])) {
            switch (strtoupper($aItem['EVNTIMEFORMAT'])) {
                case 'Z':
                    if ($aItem['_TZID']) {
                        if ($edit) {
                            $attributes = $this->folder->account->gwAPI->FunctionCall(
                                "GetItemAttributes",
                                $this->folder->sFID,
                                $this->item['EVN_ID']
                            );
                            $attributes = $this->folder->account->gwAPI->ParseParamLine($attributes);
                            if (is_array($attributes) && !empty($attributes)) {
                                foreach ($attributes as $attr) {
                                    if (strtolower($attr['ATRTYPE']) == 'tz') {
                                        $this->folder->account->gwAPI->FunctionCall(
                                            "DeleteItemAttribute",
                                            $this->folder->sFID,
                                            $this->item['EVN_ID'],
                                            $attr['ATR_ID'],
                                            'tz'
                                        );
                                    }
                                }
                            }
                        }

                        $vtimezone = $this->folder->account->gwAPI->FunctionCall(
                            "GetTZIDVTIMEZONE",
                            $aItem['_TZID']
                        );
                        $this->folder->account->gwAPI->FunctionCall(
                            "AddItemAttribute",
                            $this->folder->sFID,
                            $this->item['EVN_ID'],
                            $vtimezone,
                            'AtrType=tz'
                        );
                    }
                    break;
                case 'L':
                case 'F':
                default:
                    if ($edit) {
                        $this->folder->account->gwAPI->FunctionCall(
                            "DeleteItemAttribute",
                            $this->folder->sFID,
                            $this->item['EVN_ID'],
                            '',
                            'tz'
                        );
                    }
                    break;
            }
        }
    }

    public function processTags($aItem)
    {
        $aItem = array_change_key_case($aItem, CASE_UPPER);
        $sFID = $this->openAccess();
        $gwAPI = &$this->folder->account->gwAPI;
        $tags = isset($aItem['EVNTYPE']) ? $aItem['EVNTYPE'] : (isset($aItem['ITMCATEGORY']) ? $aItem['ITMCATEGORY'] : false);
        if ($tags) {
            if (!$gwAPI->FunctionCall(
                "SetItemTags",
                $sFID,
                $this->itemID,
                $tags,
                ";NOEDITCOUNTER"
            )) {
                throw new Exc('item_tags');
            }
        }
    }

    public function processStatus(&$aItem, $aTreeItem, $setStatus = false, $rcrID = false)
    {
        $aItem = array_change_key_case($aItem, CASE_UPPER);
        $sClass = $aItem['EVNCLASS'] ? $aItem['EVNCLASS'] : $this->item['EVNCLASS'];
        $sRcrID = $rcrID ? $rcrID : $this->item['EVNRCR_ID'];
                 if ($sClass == 'T' && $aItem['EVNCOMPLETE'] == 100 && $aItem['EVNSTATUS'] != 'M') {
            $aItem['EVNSTATUS'] = 'M';
        }

                 if (isset($aItem['EVNSTATUS']) && $aItem['EVNSTATUS'] == 'M' && $setStatus) {
                         if ($sClass == 'T') {
                                 if ($sRcrID) {
                    unset($aItem['EVNSTATUS']);
                    $param = $this->item;
                    $param['EVNSTATUS'] = 'M';
                    $param['EVNCOMPLETE'] = 100;
                    $param['EVNCOMPLETED'] = time();
                    $next = $this->getNextDisplayOcurrance($this->item['EVN_ID'], $this->item['EVNSTARTDATE']);
                    if ($next) {
                        if ($this->item['EVNENDDATE']) {
                            $aItem['EVNENDDATE'] = $next['EVNENDDATE'];
                            $difference = $next['EVNENDDATE'] - $this->item['EVNENDDATE'];
                        }
                        if ($this->item['EVNSTARTDATE']) {
                            $aItem['EVNSTARTDATE'] = $next['EVNSTARTDATE'];
                            $difference = $next['EVNSTARTDATE'] - $this->item['EVNSTARTDATE'];
                        }
                    }

                    unset($param['EVNRCR_ID']);
                    unset($param['EVNGRP_ID']);
                    unset($param['EVNOWN_ID']);
                    unset($param['EVNMODIFIEDOWN_ID']);
                    unset($param['EVN_CREATED']);
                    unset($param['EVN_DELETED']);
                    unset($param['EVN_ID']);

                    unset($param['EVN_ID']);
                    self::removeEditTags($param, CASE_UPPER);
                    $datestamp = $this->item['EVNENDDATE'] ? $this->item['EVNENDDATE'] : $this->item['EVNSTARTDATE'];
                    if ($next) {
                        $result = $this->makeOccurrance(
                            $datestamp,
                            $param,
                            $aTreeItem,
                            false,
                            false,
                            false,
                            array(),
                            true
                        );
                        $currentRecurrence = new GroupWareAddon($this, 'recurrence');
                        $currentRecurrenceData = $currentRecurrence->getData();
                        $currentRecurrenceData = $currentRecurrenceData[0];
                        if ($currentRecurrenceData['RCRCOUNT'] > 1) {
                            $currentRecurrenceData['RCRCOUNT']--;
                            $currentRecurrence->edit($currentRecurrenceData, $currentRecurrenceData['RCR_ID']);
                        }

                        $currentReminder = new GroupWareAddon($this, 'reminder');
                        $currentReminderData = $currentReminder->getData();
                        if ($currentReminderData) foreach ($currentReminderData as $reminderData) {
                            $timestamp = $reminderData['RMNTIME'];
                            $addonID = $reminderData['RMN_ID'];
                            $editData = array();
                            $editData['RMNTIME'] = $timestamp + $difference * 86400;
                            $editData['RMNLASTACK'] = 0;
                            $currentReminder->edit($editData, $addonID);
                        }

                    } else {
                        $aItem['EVNSTATUS'] = 'M';
                        $aItem['EVNCOMPLETE'] = 100;
                        $aItem['EVNCOMPLETED'] = time();
                    }
                                     } else {
                    $aItem['EVNSTATUS'] = 'M';
                    $aItem['EVNCOMPLETE'] = 100;
                    $aItem['EVNCOMPLETED'] = time();

                }
                $sFID = $this->openAccess();
                $sParameters = $this->folder->account->gwAPI->CreateParamLine($aItem);
                if ($sParameters) {
                    $sParameters = 'use_tzid=1&' . $sParameters;
                }

                                 if (!$sEvnId = $this->folder->account->gwAPI->FunctionCall(
                    "AddEventInfo",
                    $sFID,
                    $sParameters,
                    $this->item['EVN_ID']
                )) {
                    throw new Exc('item_status', $sParameters);
                }
            }
        }
        if (!$sRcrID) {
            $result = $sEvnId;
        }
        return $result;
    }

     
    public function recover(array $aMapping = [])
    {
        $sOriginalFolder = $this->item['EVNORIGINALFOLDER'] ? $this->item['EVNORIGINALFOLDER'] : $this->item['ITMORIGINALFOLDER'];

        if (array_key_exists($sOriginalFolder, $aMapping)) {
            $sOriginalFolder = $aMapping[$sOriginalFolder];
        }

        $destination = $this->folder->account->getFolder($sOriginalFolder);
        $this->move($destination);
    }

    public function getPublicUrl($att_id = false, $rights = Folder::RIGHT_READ, $expire = false)
    {
        $gwAPI = &$this->folder->account->gwAPI;
        $sFID = $this->openAccess();
        $rights = GroupWareFolder::encodeRights($rights);
        $expire = $expire ? $expire : (time() + DAY_LENGTH);
        $id = $this->itemID . ($att_id ? '/' . urlencode($att_id) : '');

        $attachments = $this->aAddons['attachment']->getData();

        if ($att_id === false) {
            $attachment = reset($attachments);
        } else {
            if ($attachments) foreach ($attachments as $att) {
                if ($att['ATTNAME'] == $att_id) {
                    $attachment = $att;
                }
            }
        }
        if ($attachment) {
            $ticket = $this->aAddons['attachment']->getAttachmentFile($attachment['ATTNAME'], 'TICKET&short=1&rights=' . $rights);
            return $ticket;
        }
    }

    public function lock()
    {
        $gwAPI = &$this->folder->account->gwAPI;
        $sFID = $this->openAccess();
        if (($result = $gwAPI->FunctionCall(
                "LockItem",
                $sFID,
                $this->item['EVN_ID'],
                1              )) <= 0) {
            throw new Exc('item_lock', $result);
        }
    }

    public function unlock()
    {
        $gwAPI = &$this->folder->account->gwAPI;
        $sFID = $this->openAccess();
        if (($result = $gwAPI->FunctionCall(
                "UnlockItem",
                $sFID,
                $this->item['EVN_ID'],
                1,                  1               )) <= 0) {
            throw new Exc('item_unlock', $result);
        }
    }

    public function notify($copy_to, $all, $comment = false)
    {
        $gwAPI = &$this->folder->account->gwAPI;
        $sFID = $this->openAccess();
        if ($copy_to != '') {
            $parameters['list'] = $copy_to;
        }
        if ($all !== '') {
            $parameters['all'] = $all;
        }
        if ($comment) {
            $parameters['comment'] = $comment;
        }

		$paramline = $gwAPI->CreateParamLine($parameters);
		if(($result = $gwAPI->FunctionCall(
				"NotifyAboutItemChanges",
				$sFID,
				$this->item['EVN_ID'],
				$paramline
		)) <= 0){
			throw new Exc('item_notify',$result);
		}
	}
	
	public function revertToRevision($revisionID)
	{
		$gwAPI = &$this->folder->account->gwAPI;
		$sFID = $this->openAccess();
		if(($result = $gwAPI->FunctionCall(
				"RevertToItemRevision",
				$sFID,
				$this->item['EVN_ID'],
				$revisionID
		)) <= 0){
			throw new Exc('item_revert_to_revision',$result);
		}
	}
	
	public function notifyGroupChat($email)
	{
		$gwAPI = &$this->folder->account->gwAPI;
		$sFID = $this->openAccess();
		if(($result = $gwAPI->FunctionCall(
				"NotifyAboutItemSharing",
				$sFID,
				$this->item['EVN_ID'],
				'email='.urlencode($email)
		)) <= 0){
			throw new Exc('item_notify_groupchat',$result);
		}
	}	
	
	public function getRevisionFile($attachmentID,$revisionID)
	{
		if($this->folder->getType() != 'F' && $this->folder->getType()!='I'){
			throw new Exc('item_invalid_type');
		}
		$gwAPI = &$this->folder->account->gwAPI;
		$sFID = $this->openAccess();
		if(!$path = $gwAPI->FunctionCall(
				"GetAttachmentPathLocal",
				$sFID,
				$this->item['EVN_ID'],
				$attachmentID,
				'REVID='.$revisionID
		)){
			throw new Exc('item_get_attachment_path',$path);
		}
		return $path;
	}
	
	public function getRevisionProperties($attachmentID,$revisionID)
	{
		if($this->folder->getType() != 'F' && $this->folder->getType()!='I'){
			throw new Exc('item_invalid_type');
		}
		$gwAPI = &$this->folder->account->gwAPI;
		$sFID = $this->openAccess();
		if(!$param = $gwAPI->FunctionCall(
				"GetAttachmentList",
				$sFID,
				$this->item['EVN_ID'],
				$attachmentID,
				$revisionID
		)){
			throw new Exc('item_get_attachment_path',$param);
		}
		$param = MerakGWAPI::parseParamLine($param);
		return $param;
	}
	
	public function downloadRevision($attachmentID,$revisionID)
	{
		 		$sFID = $this->openAccess();
		$gwAPI = &$this->folder->account->gwAPI;
		$attachment = new GroupWareAddon($this, 'attachment');
		$data = $attachment->getData();
		if(!$data){
			throw new Exc('attachment_get');
		}
		 		$filename = $this->getRevisionFile($attachmentID, $revisionID);
		$info = $this->getRevisionProperties($attachmentID, $revisionID);
		 		$info = reset($info);
		$params = $info['ATTPARAMS'];
		$params = Tools::parseURL($params);
		$mimetype = $params['mimetype'];
		 		slToolsFilesystem::sendFileHeaders($info['ATTDESC']?$info['ATTDESC']:$info['ATTNAME'], $info['ATTSIZE'], $mimetype);
		slToolsFilesystem::downloadFile($filename);
	}

     
	static public function dataContainsAttachment(? string &$data) : bool
    {
        return (bool)preg_match('/(\<img[^>]+src=").*?sid=' . preg_quote($_SESSION['SID']) . '&amp;class=([^&]+)&amp;fullpath=((?:[^\'"&\/]+\/)+([^"&]+)[^"]*)([^>]+>)/i', $data);
    }

	static public function replaceCID(&$data, & $aTreeItem)
    {
        $pattern = '/(?P<prefix>\<img[^>]+src=").*?sid=' . preg_quote($_SESSION['SID']) . '&amp;class=(?P<class>[^&]+)&amp;fullpath=(?P<fullpath>(?:[^\'"&\/]+\/)+(?P<name>[^"&]+)[^"]*)(?P<suffix>[^>]+>)/i';
        if(preg_match_all($pattern, $data, $matches, PREG_SET_ORDER)){
            foreach ($matches as $match) {
                $attachment = [];
                $attachment['fullpath'] = urldecode($match['fullpath']);
                $attachment['class'] = $match['class'];
                $attachment['description'] = urldecode($match['name']);
                $attachment['cid'] = 'attachment_id_'.md5($attachment['description']);

                $result['@childnodes'] = [];
                foreach ($attachment as $key => $item) {
                    $result['@childnodes'][$key][0]['@value'] = $item;
                }
                $aTreeItem['@childnodes']['attachments'][0]['@childnodes']['attachment'][0]['@childnodes']['values'][] = $result;

                $data = str_replace($match[0], $match['prefix'] . $attachment['cid'] . $match['suffix'], $data);
            }
        }
        return $data;
    }
	
	static public function getError(&$gwAPI)
	{
		$error = $gwAPI->FunctionCall("GetLastError",$gwAPI->sessid);
		if(strpos($error,':')!==false){
			$error = explode(':',$error);
			$error = $error[0];
		}
		return $error;
	}
	
	public function accept()
	{
		$oIMIP = iMIP::load($this->folder->account);
		$oInvitation = $oIMIP->loadInvitationID($this->folder->name,$this->itemID);
        $sReply = $oInvitation->accept($this->folder->name,$this->folder->account->gwAPI->getFolderOwner($this->folder));

        $sReplyXML = $oIMIP->convertVersit($sReply);
        $aAttachment = $oIMIP->createAttachment($sReply,'', 'REPLY');
        $aAttachment['xml'] = $sReplyXML;
                 $oIMIP->iMIP_Email($this,'accept',$aAttachment);
	}

    public function tentative()
    {
        $oIMIP = iMIP::load($this->folder->account);
        $oInvitation = $oIMIP->loadInvitationID($this->folder->name,$this->itemID);
        $sReply = $oInvitation->tentative($this->folder->account->gwAPI->getFolderOwner($this->folder));
        $sReplyXML = $oIMIP->convertVersit($sReply);
        $aAttachment = $oIMIP->createAttachment($sReply,'', 'REPLY');
        $aAttachment['xml'] = $sReplyXML;
        return $aAttachment;
    }
	
	public function addPin($global = false)
	{
		$sFID = $this->openAccess();
		$response = $this->folder->account->gwAPI->FunctionCall("AddEventPin",$sFID,$this->itemID,'global='.($global?'1':'0'));
		parse_str($response,$result);
		switch($result['result']){
			case '1':
				 			break;
			     			case '2':
				throw new Exc('add_pin_already_exists');
			break;
			     			case '':
			case '0':
				throw new Exc('add_pin');
				break;
		}
		return $result['timestamp'];
	}
	
	public function deletePin($global = false)
	{
		$sFID = $this->openAccess();
		$result = $this->folder->account->gwAPI->FunctionCall("DeleteEventPin",$sFID,$this->itemID,'global='.($global?'1':'0'));
		if(!$result){
			throw new Exc('delete_pin');
		}
	}
	
	public static function setAccountName($name)
	{
		$aProperties = array();
		$aProperties['fullname'] = $name;
		return $_SESSION['user']->editAccount($_SESSION['EMAIL'],$aProperties);
	}
	
	public function getFileAttachmentID()
	{
		if($this->folder->getType() != 'F' && $this->folder->getType()!='I'){
			throw new Exc('item_invalid_type');
		}
		$gwAPI = &$this->folder->account->gwAPI;
		$sFID = $this->openAccess();
		if(!$param = $gwAPI->FunctionCall("GetAttachmentList", $sFID, $this->item['EVN_ID'], '', '')){
			throw new Exc('item_get_attachment_path',$param);
		}
		$param = MerakGWAPI::parseParamLine($param);
		if(is_array($param) && !empty($param)){
			foreach($param as $attachment){
				if($attachment['ATTTYPE']=='F'){
					$attachment_id = $attachment['ATTNAME'];
				}
			}
		}
		return $attachment_id;
	}


         static public function createFromMessage(&$folder, $file, $comment = '', &$item = false, &$aItem = array(), $finalize = false)
    {
        $folder->openAccess();

        $parser = new slMailParse($file, array(), true);
        $structure = $parser->parse(false, false);

                 if (!isset($aItem['EVNCLASS']) || $aItem['EVNCLASS'] == 'F') {
            $aItem['EVNCLASS'] = 'M';
        }

		$aItem['EVNORGANIZER'] = $structure['headers']['from'];
		$aItem['EVNMEETINGID'] = $structure['headers']['to'];

		if($structure['headers']['cc']){
			$aItem['EVNMEETINGID'].=','.$structure['headers']['cc'];
		}
		if($structure['headers']['bcc']){
			$aItem['EVNMEETINGID'].=','.$structure['headers']['bcc'];
		}
		$aItem['EVNMEETINGID'] = substr($aItem['EVNMEETINGID'],0,255);
		$to_count = count(slMailParse::parseAddresses($structure['headers']['to']));
		$cc_count = count(slMailParse::parseAddresses($structure['headers']['cc']));
		$bcc_count = count(slMailParse::parseAddresses($structure['headers']['bcc']));
		$aItem['EVNSEQUENCE'] = $to_count+$cc_count+$bcc_count;
		$unixtime = strtotime($structure['headers']['date']);
		$aItem['EVNSTARTTIME'] = IceWarpGWAPI::unix2calendarTime($unixtime);
		$aItem['EVNSTARTDATE'] = IceWarpGWAPI::unix2calendarDate($unixtime);
		$aItem['EVNNOTE'] = $comment;
		$aItem['EVNLOCATION'] = $structure['isHTML']?slToolsString::removeHTML($structure['html_body']):$structure['text_body'];
		$aItem['EVNLOCATION'] = iconv_substr(slToolsString::utf8_bad_replace($aItem['EVNLOCATION']),0,510, 'utf-8');
		if($structure['isHTML']){
			if(!$aItem['EVNFLAGS']){
				$aItem['EVNFLAGS'] = GroupWareItem::FLAG_HTMLCONTENT;
  			}else{
				  $aItem['EVNFLAGS'] |= GroupWareItem::FLAG_HTMLCONTENT;
			}
		}
		$aItem['EVNDESCFORMAT'] = 'text/plain';
		$aItem['EVNCOMPLETE'] = filesize($file);
		if(!isset($aItem['EVNSHARETYPE'])){
			$aItem['EVNSHARETYPE'] = 'U';
		}

		if(isset($structure['attachments']) && is_array($structure['attachments']) && !empty($structure['attachments'])){
			$attachments = '[';
			foreach($structure['attachments'] as $key => $attachment){
				$attachmentjson[]= '{' .
					'"name":"'.trim(json_encode($attachment['name']),'"').'",'.
					'"part_id":"'.trim(json_encode($attachment['part_id']),'"').'",'.
					'"size":"'.trim(json_encode($attachment['size']),'"').'",'.
					'"type":"'.trim(json_encode($attachment['type']),'"').'"'.
				'}';
			}
			$attachments.= join(",",$attachmentjson);
			$attachments.= ']';
			$metadata= '&attachments='.urlencode($attachments);
		}
		$name = slMailParse::getAttachmentName($structure,'1',array(),true,'.eml');
		if(!$name){
			$name = trim(Storage::getNoTitleLabel()).'.eml';
		}
		$fixed_name = CacheItem::getSubjectFileNameStatic($name,'','.eml');

		$aItem['EVNTITLE'] = iconv_substr(slToolsString::utf8_bad_replace($name), 0, 510, 'utf-8');
		$aItem['EVNRID'] = $aItem['EVNTITLE'];

        $sParameters = $folder->account->gwAPI->CreateParamLine($aItem);
        $sItemID = $folder->account->gwAPI->FunctionCall(
            "AddEventInfo",
            $folder->sFID,
            $sParameters . '&metadata=' . urlencode($metadata),
            $item ? $item->itemID : ''
        );
        $finalizeItem = $finalize;
        if (!$item) {
            $aItem['EVN_ID'] = $sItemID;
            $item = new GroupWareItem($folder, $aItem);
            $item->aAddons = array();
            $item->getAddons('M');
            $finalizeItem = true;
        }
        if ($structure['headers']['to']) {
            $aData = array();
            $aData['atrtype'] = 'to';
            $aData['atrvalue'] = $structure['headers']['to'];
            $item->aAddons['xattribute']->create($aData);
        }
        if ($structure['headers']['cc']) {
            $aData = array();
            $aData['atrtype'] = 'cc';
            $aData['atrvalue'] = $structure['headers']['cc'];
            $item->aAddons['xattribute']->create($aData);
        }
        if ($structure['headers']['bcc']) {
            $aData = array();
            $aData['atrtype'] = 'bcc';
            $aData['atrvalue'] = $structure['headers']['bcc'];
            $item->aAddons['xattribute']->create($aData);
        }
                 $parser = new slMailParse(
            $file,
            array(
                'sid' => $_SESSION['SID'],
                'account_id' => $_SESSION['EMAIL'],
                'folder_id' => $folder->folderID,
                'item_id' => $item->itemID,
                'placeholder' => true
            )
            ,
            true
        );
        $structure = $parser->parse(false, false);

        $url = '';
		 		if ($finalizeItem){
			$folderID = date('Y-m-d-') . Tools::my_uniqid();
			$itemID = Tools::my_uniqid();
			$aData['class'] = 'file';
			$aData['fullpath'] = $folderID.'/'.$itemID;
			$_SESSION['user']->addFileAttachment(
				$file,
				$fixed_name,
				'message/rfc822',
				$folderID,
				$itemID
			);
            $folderAccess = $item->openAccess();
			$addonMessage = $item->aAddons['attachment']->create($aData);
            $url = $attachmentPath = $folder->account->gwAPI->FunctionCall("getAttachmentPath", $folderAccess, $item->itemID, $addonMessage['id'], 'READONLYTICKET');
		}

		if($structure['isHTML']){
			$html = $structure['html_body'];
			$plain = slToolsString::removeHTML($html);
		}else{
			$html = slToolsString::text2html($structure['plain_body']);
			$plain = $structure['plain_body'];
		}

		$previewHtml = urldecode($html);
        if(!empty($url) && preg_match_all('/(?P<search>src=""\s*icewarp-src="(?:[^"&]+&amp;)+(?:[^"&]+&amp;)*part=(?P<part>[^"&]+)[^"]*")/i', $previewHtml, $matches, PREG_SET_ORDER)){
            foreach ($matches as $match) {
                $previewHtml = str_replace($match['search'], 'src="' . $url . '&partid=' . $match['part'] . '"', $previewHtml);
            }
        }

		$folderID = $folderID?$folderID:Tools::my_uniqid();
		$itemID_html = Tools::my_uniqid();
		$_SESSION['user']->addStringAttachment(
            $previewHtml,
			'MAIL_PREVIEW.html',
			'text/html',
			$folderID,
			$itemID_html
		);
		$aData['class'] = 'file';
		$aData['fullpath'] = $folderID.'/'.$itemID_html;
		$aData['AttType'] = 'H';
		$item->aAddons['attachment']->create($aData);

		$itemID_text = Tools::my_uniqid();
		$_SESSION['user']->addStringAttachment(
            $previewHtml,
			'MAIL_PREVIEW.txt',
			'text/plain',
			$folderID,
			$itemID_text
		);
		$aData['class'] = 'file';
		$aData['fullpath'] = $folderID.'/'.$itemID_text;
		$aData['AttType'] = 'E';
		$item->aAddons['attachment']->create($aData);

		if($finalizeItem){
			 			$sItemID = $folder->account->gwAPI->FunctionCall(
				"AddEventInfo",
				$folder->sFID,
				'&return_link_id=1',
				$item->itemID
			);
			parse_str($sItemID,$result);
			if($result['linkid']){
				$item->linkID = $result['linkid'];
			}
		}
		return $item;
	}

	public function documentInvite($expire,$editable,$pass)
	{
		$sFID = $this->openAccess();

		if($editable){
			$rights = MerakGWAPI::RIGHT_BITS | MerakGWAPI::RIGHT_READ | MerakGWAPI::RIGHT_FOLDER_READ | MerakGWAPI::RIGHT_WRITE | MerakGWAPI::RIGHT_FOLDER_LOOKUP;
		}else{
			$rights = MerakGWAPI::RIGHT_BITS | MerakGWAPI::RIGHT_READ | MerakGWAPI::RIGHT_FOLDER_READ | MerakGWAPI::RIGHT_FOLDER_LOOKUP;
		}

		$result = $this->folder->account->gwAPI->FunctionCall(
			"AddDocumentInvite",
			$sFID,
			$this->itemID,
			'rights='.urlencode($rights).
			'&expire='.urlencode($expire).
			'&password='.urlencode($pass)
		);
		if(!$result){
			throw new Exc('document_invite');
		}
	}

	public function documentUninvite()
	{
		$sFID = $this->openAccess();
		$result = $this->folder->account->gwAPI->FunctionCall(
			"DeleteDocumentInvite",
			$sFID,
			$this->itemID
		);
		if(!$result){
			throw new Exc('document_uninvite');
		}
	}

	public function documentLink($targetFolder,$note = '')
	{
		$sFID = $this->openAccess();
		$targetFolder = $this->folder->account->getFolder($targetFolder);
		$sTargetFID = $targetFolder->openAccess();

		$result = $this->folder->account->gwAPI->FunctionCall(
			"AddDocumentLink",
			$sFID,
			$sTargetFID,
			$this->itemID,
			'EvnNote='.urlencode($note)
		);
		if(!$result){
			throw new Exc('document_link');
		}		
	}

    public function getMessage()
    {
             }

    public static function removeHtmlNoteParagraph($string, $htmlentities = false)
    {
        $count = 0;
        $string = preg_replace('/(?:<|(?:\\&lt;))div(?:>|(?:\\&gt;))(.*?)(?:<|(?:\\&lt;))\\/div(?:>|(?:\\&gt;))/i', '\\1' . PHP_EOL, $string, -1, $count);
        if($count == 0) $string = preg_replace('/(?:<|(?:\\&lt;))br\\s?\\/?(?:>|(?:\\&gt;))/i', PHP_EOL, $string);
        $replace = '<p>\\1</p>';
        if($htmlentities) $replace = htmlentities($replace);
        $string = preg_replace('/^(?:(.*)[\r\n]*)$/m', $replace, $string);
        return strip_tags($string,'<img><p>');
    }
}
