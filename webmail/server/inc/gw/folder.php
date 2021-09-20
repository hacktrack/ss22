<?php
 
class GroupWareFolder extends Folder
{
	private static $aAliasTags = array('osd','oed','ost','oet');
	private static $contactQuery = '((LCTTYPE IS NULL) OR (ITMCLASS=\'C\' AND LCTTYPE=\'H\') OR (ITMCLASS=\'L\' AND(( LCTTYPE=\'O\'))))';
	public $folderID;  	public $name;	  	public $type;	  	public $folder;	 	public $account;  	public $subscription_type;
	public $isGAL;
	public $isDefault;
	public $rights;
	public $display;
	public $groupChatUnread;
	public $groupChatLastReadID;
	public $groupChatSubscribed;
	public $subtype;
	public $groupChatLastActivity;
	public $lastPinnedItem;
	public $count_function;
	public $special_count;
	public $function;
	public $groupRelativeFolder;
	public $rigths;
	public $acl;
	public $autoSubscribe;
	public $folderInfo;
	public $defaultType;
	public $public;
	public $teamChatNotify;
	public $sFID;
	public $groupOwner;
	public $shared;

	 
	public function __construct(&$oAccount,$folder,$type,$rights = Folder::DEFAULT_RIGHTS,$default = false,$gal  = false,$display = false, $subscriptionFolder = false, $groupChatUnread = 0, $groupOwner = '', $groupRelativeFolder = '', $groupChatSubscribed = '', $groupChatLastReadID = '',$groupChatLastActivity = '',$subtype = '',$teamChatNotify = false)
	{
		 		$sName = MerakGWAPI::decode($folder);
		$this->name= $sName;
		$this->type = $type;
		$this->folderID = $sName;
		$this->isDefault = $default;
		$this->isGAL = $gal;
		$this->groupChatUnread = $groupChatUnread;
		$this->groupChatSubscribed = $groupChatSubscribed;
		$this->groupChatLastReadID = $groupChatLastReadID;
		$this->groupChatLastActivity = $groupChatLastActivity;
		$this->groupOwner = $groupOwner;
		$this->groupRelativeFolder = MerakGWAPI::decode($groupRelativeFolder);
		if($this->isDefault){
			$this->defaultType = $this->type;
			User::setDefaultFolder($this->name,$this->defaultType);
		}
		if($display){
			$this->display = $display;
		}
		$this->rights = $rights;
		$this->account = &$oAccount;
		$this->gw = true;
		$this->subscription_type = $subscriptionFolder;
		$this->subtype = $subtype;
		$this->teamChatNotify = $teamChatNotify;
	}

	protected function handleIdIntervalFilter(array & $aFilterTag)
	{
		if(!($aFilterTag['idinterval'] ?? false) || !preg_match('/^(?P<direction>(?:FUTURE)|(?:PAST))\+?(?P<id>.*)$/i', $aFilterTag['idinterval'], $matches)) return;
		$dateTime = new DateTime();
		$idFilterInterval = $matches['id'];
		if(!empty($idFilterInterval)){
			try{
				$filterIntervalItem = $this->getItem($idFilterInterval);
			}catch (Exception $e){}
			if($filterIntervalItem instanceof GroupWareItem){
				$dateTime->setTimestamp(slToolsDate::calendar2unix($filterIntervalItem->item['EVNSTARTDATE'], $filterIntervalItem->item['EVNSTARTTIME']));
			}
		}
		$interval = slToolsDate::unix2calendardate($dateTime->getTimestamp());
		if(strcasecmp($matches['direction'],'FUTURE') === 0){
			$dateTime->modify('+3 month');
			$interval .= '-' . slToolsDate::unix2calendardate($dateTime->getTimestamp());
			}else{
			$dateTime->modify('-3 month');
			$interval = slToolsDate::unix2calendardate($dateTime->getTimestamp()) . '-' . $interval;
			}
		$aFilterTag['interval'] = $interval;
	}

	protected function useLimitAndOffset(array & $aEvents, array & $aFilterTag)
	{
		if(($aFilterTag['idinterval'] ?? false) && preg_match('/^(?P<direction>(?:FUTURE)|(?:PAST))\+?(?P<id>.*)$/i', $aFilterTag['idinterval'], $matches)){
			$idArray = array_column($aEvents, 'EVN_ID');
			$index = array_search($matches['id'], $idArray);
			$idFilterIntervalDirection = $matches['direction'];
			if($index !== false){
				if(strcasecmp($idFilterIntervalDirection, 'FUTURE') === 0){
					$aFilterTag['offset'] = $index + 1;
				}else{
					$aFilterTag['offset'] = $index;
				}
			}
		}
		if(isset($aFilterTag['orderby'], $aFilterTag['interval']) && !empty($aFilterTag['orderby']) && !empty($aFilterTag['interval'])){
			if(preg_match_all('/(?P<key>[^\s,]+)\s(?P<direction>(?:asc)|(?:desc))/i', strtoupper($aFilterTag['orderby']), $matches, PREG_SET_ORDER)){
				slToolsPHP::arrayOrderBy($aEvents, $matches);
			}
		}

		if(!empty($aFilterTag['limit'] ?? null) && is_numeric($aFilterTag['limit']) && $aFilterTag['limit'] < ($aEventsCount = count($aEvents))) {
			$limit = $aFilterTag['limit'];
			$offset = intval($aFilterTag['offset'] ?? 0);
			if(($offset+$limit) > $aEventsCount){
				$limit = $aEventsCount - $offset;
			}
			if($limit < 0) $limit = 0;
			$aEvents = array_slice($aEvents, $offset, $limit);
		}
	}

	 
	private function loadItems(&$aFilterTag)
	{
		
		$this->lastPinnedItem = '';
		$this->count_function = '';
		$ex = false;
		$reset_unread = false;
		$sFilter = $aFilterTag['sql'];
		$fields = $aFilterTag['tag'];
		$aAddons = $aFilterTag['gwAddons'];

		$reset_unread = $aFilterTag['reset_unread'] ?? null;
		
		$sAttributes = $this->account->gwAPI->filterToAttributes($aFilterTag);
		$aItems = array();
		 
		$this->openAccess();
		if (!$sFilter) $sFilter = '';
		if (!$fields && $fields!='*') {
			if ($this->type=='C' || $this->type=='G') {
				$fields='ITM_ID';
			} else {
				$fields='EVN_ID';
			}
		} elseif ($this->type=='C') {
			 			if (!strstr(strtoupper($fields), 'LCTTYPE') && $fields!='*'){
				$fields .= ',LCTTYPE';
			}
		}
		if($this->type == 'J' && $aFilterTag['meeting'] ?? false){
			if(!empty($aFilterTag['sql'] ?? null)) $aFilterTag['sql'] = '('.$aFilterTag['sql'].') AND ';
			$aFilterTag['sql'] = ($aFilterTag['sql'] ?? '') . 'EvnMeetingId IS NOT NULL AND EvnMeetingId <> \'\'';
		}
		 		if($this->type=='G'){
			$eventsline = $this->account->gwAPI->FunctionCall(
					'GetItemList',
					$this->sFID,
					$sFilter,
					$fields,
					$sAttributes
			);
			$itemPrefix = 'ITM';
		}else if ($this->getType()=="C") {
			if(!isset($aFilterTag['mycard']) || !$aFilterTag['mycard']){
				$sFilter = ($sFilter?$sFilter." AND ":"").self::$contactQuery;
			}
			$eventsline = $this->account->gwAPI->FunctionCall(
					'GetContactDetailList',
					$this->sFID,
					$sFilter,
					$fields,
					$sAttributes
			);
			$itemPrefix = "ITM";			
		 		} else {
			 			$aFields = explode(",",$fields);
            $fields = self::removeIntervalFields($fields);

			$this->handleIdIntervalFilter($aFilterTag);
			$sFilter = $aFilterTag['sql'];
			
			 			if (isset($aFilterTag['interval']) && $aFilterTag['interval']){
				$sIntervalFields = $fields;
				if (in_array('osd',$aFields)){
					$sIntervalFields.=',EVNSTARTDATE as OSD';
				}
				if (in_array('oed',$aFields)){
					$sIntervalFields.=',EVNENDDATE as OED';
				}
				if (in_array('oet',$aFields)){
					$sIntervalFields.=',EVNENDTIME as OET';
				}
				if (in_array('ost',$aFields)){
					$sIntervalFields.=',EVNSTARTTIME as OST';
				}
				 				$aFilterTag['interval'].= ';;;;use_tzid=1&freebusy=1&returnowneremail=1';
				$function = 'GetAllIntervalEvents';
				if(isset($aFilterTag['holidays'])){
					$function = 'GetIntervalEvents';
				}
				 				$eventsline = $this->account->gwAPI->FunctionCall(
						$function,
						$this->sFID,
						$aFilterTag['interval'],
						$sFilter,
						$sIntervalFields
				);
				 			} else {
				$this->function = 'GetEventDetailList';
				if($this->getType()!='T'){
					if(!isset($aFilterTag['groupchat_type']) || $aFilterTag['groupchat_type']!='events'){
						$sFilter = ($sFilter?'('.$sFilter.') AND ':'');
						$sFilter.= "( evnclass <> 'O' )";
					}
				}
				if($this->getType()=='F' || $this->getType()=='I'){
					$docFields = array(
						'evnlockown_email','evn_documenteditinginfo'					);
					$virtualFields = '\'\' as evnlockown_email,\'\' as evn_documenteditinginfo';	
					$aNewFields = array();
					if($aFields){
						foreach($aFields as $field){
							if(!in_array(strtolower($field),$docFields)){
								$aNewFields[] = $field;
							}
						}
					}
					$fields = implode(',',$aNewFields);	
					$fields = $fields?($fields.','.$virtualFields):$virtualFields; 
				}
				if ($this->getType()=='I'){
					$fields = self::removeIntervalFields($fields);
					$aFields = explode(',',$fields);
					$groupChatFields = array(
						'evnlinkid',
						'evnlinktype',
						'evnlinkextras',
						'evnowneremail',
						'evnownername',
						'evnmodifiedowneremail',
						'evnmodifiedownername',
						'evnmystatus',
						'evnaccepted',
						'evnacceptedparticipantcount',
						'evnthumbnailid',
						'evnthumbnailtime',
						'evnthumbnailticket',
						'evnprocessingqueued',
						'evnticket',
                        'evnsizeinfo',
						'evntitle',
						'evnlocation',
						 						'evn_metadata',
						'reavalue',
						'evnmentions_info',
						'evncomevnid',
						'evncomlinkextras',
						'evn_documenteditinginfo'
					);
                    $aNewFields = array();
					if($aFields){
						
						foreach($aFields as $field){
							if(!in_array(strtolower($field),$groupChatFields)){
								$aNewFields[] = $field;
							}
						}
					}
					$fields = implode(',',$aNewFields);
					$virtualFields = '';
					if(stripos($fields,'evnclass')===false){
						$virtualFields = 'evnclass,';
					}
					switch($aFilterTag['groupchat_type']){
						case 'events':
							$this->function = 'GetIntervalEventsList';
							$this->special_count = true;
							$virtualFields = 'evnstartdate as osd,evncomevnid,\'\' as evncomlinkextras,\'\' as evnmentions_info,EvnTitle,EvnNote,EvnLocation,EvnLinkId,EvnLinkType,\'\' as EvnMyStatus,0 As EvnAccepted, 0 as EvnAcceptedParticipantCount';
							break;
						case 'comments':
							$this->function = 'GetCommentedEventList';
							 							$this->special_count = true;
							$virtualFields .= 'evncomevnid,\'\' as evncomlinkextras,\'\' as evnmentions_info,reavalue,Evn_Metadata,EvnTitle,EvnLocation,EvnNote,EvnLinkId,EvnLinkType,\'\' as EvnLinkExtras,\'\' as evnowneremail,\'\' as evnownername,\'\' as evnmodifiedowneremail,\'\' as evnmodifiedownername, \'\' as EvnMyStatus,0 as EvnAccepted, 0 as EvnAcceptedParticipantCount,0 as EvnProcessingQueued,0 as EvnThumbnailTime, \'\' as EvnThumbnailId, \'\' as EvnTicket,\'\' as EvnSizeInfo';
							break;
						case 'global_pins':
						case 'my_pins':
							$virtualFields .= 'evncomevnid,\'\' as evncomlinkextras,PinEvn_ID,PinOwn_ID,PinOwnName,PinOwnEmail,PinWhen,\'\' as evnmentions_info,Evn_Metadata,EvnTitle,EvnLocation,EvnNote,EvnLinkId,EvnLinkType,\'\' as EvnLinkExtras,\'\' as evnowneremail,\'\' as evnownername,\'\' as evnmodifiedowneremail,\'\' as evnmodifiedownername, \'\' as EvnMyStatus,0 as EvnAccepted, 0 as EvnAcceptedParticipantCount,0 as EvnProcessingQueued,0 as EvnThumbnailTime, \'\' as EvnThumbnailId, \'\' as EvnTicket,\'\' as EvnSizeInfo';
							if($aFilterTag['groupchat_type']=='global_pins'){
								$this->function = 'GetGlobalPinnedEventList';
								 							}else if($aFilterTag['groupchat_type']=='my_pins'){
								$this->function = 'GetPinnedEventList';
								 								$virtualFields.=',Pin_ID';
							}
							$this->special_count = true;
							break;
						case 'mentions':
							$this->function = 'GetMyMentionsEventList';
							 							$this->special_count = true;
							$virtualFields .= 'evncomevnid,\'\' as evncomlinkextras,MENWHOOWN_ID,MenLinkType,MenLink_ID,MenLinkEmail,MenLinkName,MenWhoOwnEmail,MenWhoOwnName,MenWhen,\'\' as evnmentions_info,Evn_Metadata,EvnTitle,EvnLocation,EvnNote,EvnLinkId,EvnLinkType,\'\' as EvnLinkExtras,\'\' as evnowneremail,\'\' as evnownername,\'\' as evnmodifiedowneremail,\'\' as evnmodifiedownername, \'\' as EvnMyStatus,0 as EvnAccepted, 0 as EvnAcceptedParticipantCount,0 as EvnProcessingQueued,0 as EvnThumbnailTime, \'\' as EvnThumbnailId, \'\' as EvnTicket,\'\' as EvnSizeInfo';
							break;
						default:
							$this->lastPinnedItem = $this->account->gwAPI->FunctionCall(
									'GetNewestGlobalPinTimeStamp',
									$this->sFID,
									$sFilter,
									$fields,
									$sAttributes
							);
							$this->special_count = true;
							$this->function = 'GetEventList';
							$virtualFields .= '\'\' as evnthumbnailticket,\'\' as evnsizeinfo,evncomevnid,\'\' as evncomlinkextras,GlobalEventPin.PINOWN_ID as PINOWN_ID,GlobalEventPin.PinOwnEmail as PinOwnEmail,GlobalEventPin.PinOwnName as PinOwnName, GlobalEventPin.PinWhen as GPinWhen,EventPin.PinWhen as LPinWhen,\'\' as evnmentions_info,Evn_Metadata,reavalue,EvnTitle,EvnLocation,EvnLinkId,EvnLinkType,\'\' as EvnLinkExtras,\'\' as evnowneremail,\'\' as evnownername,\'\' as evnmodifiedowneremail,\'\' as evnmodifiedownername, \'\' as EvnMyStatus,0 as EvnAccepted, 0 as EvnAcceptedParticipantCount,0 as EvnProcessingQueued,0 as EvnThumbnailTime, \'\' as EvnThumbnailId, \'\' as EvnTicket';
							break;
					}
					$fields = $fields?($fields.','.$virtualFields):$virtualFields; 
				}
				if($sAttributes){
					$sAttributes .=';use_tzid=1';
				}else{
					$sAttributes = 'use_tzid=1';
				}
				if(!$reset_unread){
					$sAttributes .=';dont_set_last_seen=1';
				}
				if(isset($aFilterTag['groupchat_type']) && $aFilterTag['groupchat_type'] == 'events'){
					$sAttributes='';
					if($aFilterTag['limit']){
						$sAttributes='limit='.$aFilterTag['limit'];
					}
					if($aFilterTag['offset']){
						$sAttributes.='&from='.$aFilterTag['offset'];
					}
					$eventsline = $this->account->gwAPI->FunctionCall(
						$this->function,
						$this->sFID,
						$sAttributes,
						$sFilter,
						$fields
					);
					if(!($this->account->account->isGuest ?? false)){
						$paramParser = new \tools\ParamLineParser($eventsline);
						$sFilter .= ' AND (EvnUID IN ("'.implode('","', $paramParser->getAllValuesColumn('evn_id')).'"))';
						$callendar = $this->account->getFolder($_SESSION['user']->getDefaultFolder('E'));
						$folderId = $callendar->openAccess();
						$eventsLineCallendar = $this->account->gwAPI->FunctionCall(
							$this->function,
							$folderId,
							$sAttributes,
							$sFilter,
							$fields
						);

						$aEvents = $this->account->gwAPI->ParseParamLine($eventsline);
						$calendarEvents = new \tools\ParamLineParser($eventsLineCallendar);
						$indexes = $paramParser->getIndexesBySearchArray($calendarEvents->getValuesColumns('EVNID', 'EVNSTARTDATE', 'EVNSTARTTIME', 'EVNENDDATE', 'EVNENDTIME'));
						$aEvents = array_intersect_key($aEvents, array_flip($indexes));
					}else{
						$aEvents = $this->account->gwAPI->ParseParamLine($eventsline);
					}
				}else{
					
					$eventsline = $this->account->gwAPI->FunctionCall(
							$this->function,
							$this->sFID,
							$sFilter,
							$fields,
							$sAttributes
					);
				}
			}
			$itemPrefix = "EVN";
		}

		
		 		if(!isset($aEvents)) $aEvents = $this->account->gwAPI->ParseParamLine($eventsline);
		if($aFilterTag['next'] ?? false){
			$sFilter = str_replace("Evn_ID <=","Evn_ID >",$sFilter);
			$sAttributes = str_replace("evn_id DESC;","evn_id ASC;",$sAttributes);
			$sAttributes = str_replace("limit=".$aFilterTag['limit'],"limit=".$aFilterTag['next'],$sAttributes);
			$eventsline = $this->account->gwAPI->FunctionCall(
					$this->function,
					$this->sFID,
					$sFilter,
					$fields,
					$sAttributes
			);
			$aOtherEvents = $this->account->gwAPI->ParseParamLine($eventsline);
			$aOtherEvents = array_reverse($aOtherEvents);
			$aEvents = array_merge($aOtherEvents,$aEvents);
		}
		foreach ($aEvents as $key => $aEvent) {
			$aEvents[$key]['EVNMEETINGID'] = str_replace('@', '_', $aEvents[$key]['EVNMEETINGID'] ?? null);
		}
		if(isset($aFilterTag['groupchat_type']) && $aFilterTag['groupchat_type'] == 'events'){
			$virtualItem = $aEvents[0];
			unset($aEvents[0]);
			@$resultOffset = reset($virtualItem);
			$aFilterTag['offset'] = $resultOffset;
		}
		 		$this->account->gwAPI->TZClearCache();

		$this->useLimitAndOffset($aEvents, $aFilterTag);

		 		if ($aEvents) foreach($aEvents as $aEvent){
			if (isset($aEvent['EVNURL'])){
				$aEvent['EVNURL'] = slToolsString::removeHTML($aEvent['EVNURL']);
			}
			 			if( $aFilterTag['groupchat_type'] && in_array($aFilterTag['groupchat_type'],['global_pins','my_pins']) ){
				$aEvent['EVNNOTE'] = slToolsString::removeHTML($aEvent['EVNNOTE']);
			}
			if (!isset($aEvent[$itemPrefix.'CLASS'])){
				$aEvent[$itemPrefix.'CLASS']=$this->type;
			}
			$aEvent['CTZ'] = $aFilterTag['timezone'];

			if(isset($aFilterTag['interval']) && $aFilterTag['interval']){
				$this->account->gwAPI->TimeZone($aEvent,'out',true);
			}
			 			if(is_array($aFilterTag['gwAddons']) && in_array('location', $aFilterTag['gwAddons'])){
				$aItems[$aEvent[$itemPrefix."_ID"]] = $this->getItem($aEvent[$itemPrefix."_ID"],WITH_ADDONS, $aFilterTag['timezone'], 0, '*',$partID, $aFilterTag['gwAddons']);
			}else{
				if ( (isset($aFilterTag['interval']) && $aFilterTag['interval'])
						|| ($ex===true) || $aFilterTag['groupchat_type']=='events'){
					$aItems[] = new GroupWareItem($this,$aEvent,$aAddons,$fields);
				} else {
					$aItems[$aEvent[$itemPrefix."_ID"]] = new GroupWareItem(
							$this,
							$aEvent,
							$aAddons,
							$fields
					);
				}
			}
		}
		$this->count = count($aItems);
		return $aItems;
	}

	

	 
	public function getItems(&$aFilterTag = array(), $createObject = true, $ignoreHidden = true)
	{
		$aItems = $this->loadItems( $aFilterTag );
		return $aItems;
	}


	private function prepareItems($aNoJoin,&$sAttributes,&$sFilter)
	{
		$aNoJoin = $this->account->gwAPI->FunctionCall(
				'GetContactDetailList',
				$this->sFID,
				$sFilter,
				'ITM_ID'
		);
		$statement = '';
		if ($aNoJoin){
			$aNoJoin = $this->account->gwAPI->ParseParamLine($aNoJoin);
			foreach($aNoJoin as $item){
				if ($statement) $statement.=' OR ';
				$statement.="ITM_ID='".$item['ITM_ID']."'";
			}
			$sFilter = $statement;
		}
	}
	 
	public function getItem($itemID,$bFlags = WITH_ADDONS,$ctz = 0,$instanceDate = 0,$fields = '*',&$partID = '', $aAddonSelect = array())
	{
		$folder = &$this;
		 		$folder->openAccess();
		$prefix = ($folder->getType()=='C' || $folder->type=='G')?'ITM':'EVN';
		 		if(strpos($itemID,'|')!==false){
			
			$parts = explode('|',$itemID,2);
			$itemID = $parts[0];
			$partID = $parts[1];
			$oItem = $this->getItem($itemID);
			if($partID=='@@MAIN@@'){
				$partID = $oItem->getFileAttachmentID();
			}
			$attachment = new GroupWareAddon($oItem,'attachment');
			$eml = $oItem->getEML($attachment,$itemID,$partID);
			return $eml;
		}
		 		if($itemID=='@@mycard@@'){
			$aEvent = $this->account->gwAPI->FunctionCall(
					'GetContactList',
					$folder->sFID,
					"ItmUID='@@mycard@@'",
					""
			);
			$aEvent = $this->account->gwAPI->ParseParamLine($aEvent);
			if(is_array($aEvent) && !empty($aEvent)){
				$aMyCardID = $aEvent[0]['ITM_ID'];
				$aEvent = $this->account->gwAPI->FunctionCall(
						'GetContactInfo',
						$folder->sFID,
						$aMyCardID
				);
			}else{
				 				$myvcard = $this->account->gwAPI->FunctionCall(
						'GetMyvCard',
						$this->account->gwAPI->gid
				);
				$this->account->gwAPI->FunctionCall(
						'SetMyvCard',
						$this->account->gwAPI->gid,
						$myvcard
				);
				 				$aEvent = $this->account->gwAPI->FunctionCall(
						'GetContactList',
						$folder->sFID,
						"ItmUID='@@mycard@@'",
						""
				);
				$aEvent = $this->account->gwAPI->ParseParamLine($aEvent);
				if(!is_array($aEvent) || empty($aEvent)) throw new Exc('item_invalid_id',$itemID);
				$aMyCardID = $aEvent[0]['ITM_ID'];
				$aEvent = $this->account->gwAPI->FunctionCall(
						'GetContactInfo',
						$folder->sFID,
						$aMyCardID
				);
			}
			 		}else{
			 			if($folder->getType()=='C'){
				$aEvent = $this->account->gwAPI->FunctionCall(
						'GetContactInfo',
						$folder->sFID,
						$itemID
				);
			}else if($folder->getType()=='G'){
				$aEvent = $this->account->gwAPI->FunctionCall(
						'GetItemInfo',
						$folder->sFID,
						$itemID,
						''
				);
			}else{
				$aditionalParameters = 'use_tzid=1';
				if($this->getType()=='F' || $this->getType()=='I'){
					$aditionalParameters .= '&revision_extended=1';
				}
				if($this->getType()=='I'){
					$aditionalParameters .= '&groupchat_extended=1';
				}
				if($instanceDate){
					$aditionalParameters.='&_tzexpdate='.$instanceDate;
				}
				$aEvent = $this->account->gwAPI->FunctionCall(
						'GetEventInfo',
						$folder->sFID,
						$itemID,
						$aditionalParameters
				);
			}
		}
		$aEvent = $this->account->gwAPI->ParseParamLine($aEvent);

		if ($aEvent[0]){
			if ($bFlags == NO_ADDONS) {
				$bWithAddons = false;
			} else {
				$bWithAddons = true;
			}
			$aEvent[0]['EVNMEETINGID'] = str_replace('@', '_', $aEvent[0]['EVNMEETINGID'] ?? null);
			return new GroupWareItem($this,$aEvent[0],$aAddonSelect,$fields,$bWithAddons,$ctz);
		}else{
			$error = $this->account->gwAPI->FunctionCall("GetLastError", $this->account->sGWSessionID);
			 
			throw new Exc(MerakGWAPI::getGwError($error), MerakGWAPI::getGwErrorMessage($error));
		}
	}
	
	public function deleteItems($oItems = false, $bNoCahe = false, $delayed = 'auto', $reason = '', $ignore_reason = false, $skip_trash = false )
	{
		$sParameters = $skip_trash?';NORECOVERY':'';
		if($oItems){
			$failed = array();
			$result = true;
			foreach($oItems as $oItem){
				if($oItem){
                    $partResult = false;
					$code = '';
					try{
					   $partResult = $oItem->delete(false,false,$reason,$ignore_reason,$skip_trash);
					}catch(Exc $e){
						$code = $e->wmcode;
					}
					$result = $result && $partResult;
					if (!$partResult && $code=='item_decline_failed_id') {
						$failed[] = $oItem->itemID;
					}
				}
			}
			if(!empty($failed) && !$ignore_reason){
				throw new Exc('item_decline_failed_id',join('|',$failed));	
			}
		}else{
			$sFID = $this->openAccess();
			$result = $this->account->gwAPI->FunctionCall(
					'DeleteItem',
					$sFID,
					'',
					'',
					$sParameters
			);
		}
		return $result;
	}

	public function moveItems(&$oFolder,$oItems = false,$cache = false){
		if($oFolder->type=='V'){
			if($oFolder->isEmpty()){
				$sFID = '@@ALL@@#'.$oFolder->getType();
				$folder = new GroupWareFolder(
						$oFolder->account->account->gwAccount,
						$sFID,
						$oFolder->contentType
				);
			}else{
                $ids = array();
				foreach($oFolder->folders as $containFolder){
					$ids[] = $containFolder->folderID;
				}
				$sFID = join( CRLF, $ids );
				$folder = new GroupWareFolder(
						$oFolder->account->account->gwAccount,
						$sFID,
						$oFolder->contentType
				);
		
			}
			$oFolder = $folder;
		}
        $duplicateItems = array();
		if($oItems){
			$result = true;
			foreach($oItems as $oItem){
                $partResult = false;
				try{
					$partResult = $oItem->move($oFolder);
				}catch(Exc $e){
					if($e->wmcode == 'item_duplicity'){
						$duplicate = array();
						$duplicate['class'] = 'item';
						$duplicate['fullpath'] = $oFolder->account->account->accountID.'/'.$this->folderID.'/'.$oItem->itemID;
						$duplicate['name'] = $e->getMessage();
						$duplicate['freename'] = GroupWareItem::proposeFreeFileName($oFolder, $duplicate['name']);
						$duplicateItems[] = $duplicate;
					}else{
						throw $e;
					}
				}
				$result = $result && $partResult;
			}
		}else{
			$sFID = $this->openAccess();
			$result = $this->account->gwAPI->FunctionCall(
					'MoveItem',
					$sFID,
					'',
					MerakGWAPI::encode($oFolder->name)
			);
		}
		if($duplicateItems){
			$error = '<duplicate>';
			foreach($duplicateItems as $duplicateItem){
				$error.='<item><class>'.$duplicateItem['class'].'</class>'.
								'<fullpath>'.$duplicateItem['fullpath'].'</fullpath>'.
								'<name>'.$duplicateItem['name'].'</name>'.
								'<freename>'.$duplicateItem['freename'].'</freename></item>';
			}
			$error .= '</duplicate>';
			throw new XMLExc('items_duplicity',$error);
		}
			
		return $result;
	}

	public function copyItems(&$oFolder,$oItems = false,$cache = false){
		if($oFolder->type=='V'){
			if($oFolder->isEmpty()){
				$sFID = '@@ALL@@#'.$oFolder->getType();
				$folder = new GroupWareFolder(
						$oFolder->account->account->gwAccount,
						$sFID,
						$oFolder->contentType
				);
			}else{
				$ids = array();
				foreach($oFolder->folders as $containFolder){
					$ids[] = $containFolder->folderID;
				}
				$sFID = join( CRLF, $ids );
				$folder = new GroupWareFolder(
						$oFolder->account->account->gwAccount,
						$sFID,
						$oFolder->contentType
				);
		
			}
			$oFolder = $folder;
		}
		
		$duplicateItems = array();
		if($oItems){
			$result = true;
			foreach($oItems as $oItem){
				$partResult = false;
				try{
					$partResult = $oItem->copy($oFolder);
					$result_id[$oItem->itemID] = $partResult;
				}catch(Exc $e){
					if($e->wmcode == 'item_duplicity'){
						$duplicate = array();
						$duplicate['class'] = 'item';
						$duplicate['fullpath'] = $oFolder->account->account->accountID.'/'.$this->folderID.'/'.$oItem->itemID;
						$duplicate['name'] = $e->getMessage();
						$duplicate['freename'] = GroupWareItem::proposeFreeFileName($oFolder, $duplicate['name']);
						$duplicateItems[] = $duplicate;
					}else{
						throw $e;
					}
				}
				$result = $result && $partResult;
			}
		}else{
			$sFID = $this->openAccess();
			$result = $this->account->gwAPI->FunctionCall(
					'CopyItem',
					$sFID,
					'',
					MerakGWAPI::encode($oFolder->name)
			);
		}
		if($duplicateItems){
			$error = '<duplicate>';
			foreach($duplicateItems as $duplicateItem){
				$error.='<item><class>'.$duplicateItem['class'].'</class>'.
								'<fullpath>'.$duplicateItem['fullpath'].'</fullpath>'.
								'<name>'.$duplicateItem['name'].'</name>'.
								'<freename>'.$duplicateItem['freename'].'</freename></item>';
			}
			$error .= '</duplicate>';
			throw new XMLExc('items_duplicity',$error);
		}
		if(!empty($result_id)){
			return $result_id;
		}else{
			return true;
		}
	}

	public function saveItems($oItems = false)
	{
		return $this->account->gwAPI->saveItems($this,$oItems);
	}

	public function saveFolderToVCard()
	{

	}
	 	 
	public function countItems($flags = 0,$positive = true,$filter = "",$search = false,$fields = '')
	{
		$sAttributes = '';
		 		if ($flags) return 0;
		$this->openAccess();
		if($this->type=='G'){
			$count = $this->account->gwAPI->FunctionCall(
					'GetItemCount',
					$this->sFID,
					$filter
			);
		}else if ($this->getType()=="C"){
			$countFunction = 'GetContactDetailCount';
			if(empty($filter)){
				$countFunction = 'getContactCount';
			}else{
				$filter = ($filter?$filter." AND ":"").self::$contactQuery;
			}
			$count = $this->account->gwAPI->FunctionCall($countFunction, $this->sFID, $filter, $sAttributes);
		}else{
			if(!$filter){
				if($this->getType()!='T'){
					$filter = " (EvnClass <> 'O') ";
				}
			}else{
				if($this->getType()!='T'){
					$filter .= " AND ( EvnClass <> 'O' ) ";
				}
			}
		    $this->function = false;
			$count = $this->account->gwAPI->FunctionCall(
					'GetEventCount',
					$this->sFID,
					$filter,
					$sAttributes
			);
			if($this->special_count){ 
				return (int)($count > 0);
			}
		}
		return $count;
	}
	 
	public function delete($bDeleteDual = true)
	{
		$this->openAccess();
		 		$oAccount = &$this->account->account;
		 		$sName = MerakGWAPI::encode($this->name);
		 		if (!$oAccount->gwAccount->gwAPI->FunctionCall
				(
						"DeleteFolder",
						$oAccount->gwAccount->sGWSessionID,
						$sName
				)
		){
			throw new Exc('folder_delete',$sName);
		}
		unset($oAccount->folders['gw'][$this->name]);
		 		if(($oMainFolder = $this->getMainFolder($this->name)) && $bDeleteDual){
			$oMainFolder->delete(false);
		}
	}

	public function deleteOlder($sDays)
	{
		$account = &$this->account;

		$sTime = time() - $sDays * 86400;

		$aFilter['tag'] = 'id,rid,"date"';
		$aFilter['sql'] = ' itm_deleted < ' . $sTime;

		$aOldItems = $this->getItems($aFilter);

		if ($aOldItems)
			$this->deleteItems($aOldItems);
	}
	 
	static public function create(&$account,$folder,$param = '',$createDual = true, $private = false)
	{
		$type = $param;
		 		$account->gwAPI->Login();
		 		if (!$account->sGWSessionID = $account->gwAPI->OpenGroup("*")){
			throw new Exc('group_open','*');
		}
		
		 		$folder = MerakGWAPI::encode($folder);
		if($type=='I'){
			$pos = strrpos($folder,'\\');
			if($pos!==false){
				$displayName = substr($folder,$pos+1);
				$root = substr($folder,0,$pos);
			}else{
				$displayName = $folder;
				$root = '';
			}
		}
		if($createDual){
			 			Folder::createDual($account,MerakGWAPI::decode($folder));
		}
		
		$parameters = $private?'&FdrPrivate=1':'';

		if($type=='I'){
			$folderName = $account->gwAPI->FunctionCall("GenerateFolderId",$account->sGWSessionID);
			$folder = $root.'\\'.$folderName;
			$parameters.= '&FdrDisplay='.urlencode($displayName);
		}
		 		if (!$account->gwAPI->FunctionCall
				(
						"AddFolder",
						$account->sGWSessionID,
						$folder,
						$type,
						$parameters
				)
		){
			if($account->gwAPI->FunctionCall("GetLastError",$account->sGWSessionID)==27){
				throw new Exc('folder_already_exists', $folder);
			}
			throw new Exc('folder_create',$folder);
		}else{
			 			if ($private){
				$folder = substr($folder,strpos($folder,'\\'));
				$folder = $_SESSION['DOMAIN'].$folder;
			}
			$folderInfo = $account->gwAPI->OpenFolder($folder);
			$sFolderInfo = $account->gwAPI->FunctionCall("GetFolderInfo",$folderInfo['fid']);
			@$aFolderInfo = reset($account->gwAPI->ParseParamLine($sFolderInfo));
			$folder = $aFolderInfo['FDR_ID'];
			$type = $aFolderInfo['FDRTYPE'];
			$owner = $aFolderInfo['FDROWNER'];
			$displayName = $aFolderInfo['FDRDISPLAY'];
			$groupChatUnread = $aFolderInfo['FDRGROUPCHATUNREAD'];
			$groupRelativeFolder = $aFolderInfo['GROUPFOLDER'];
			$rights = self::decodeRights($folderInfo['rights']);
		}
		
		$oFolder = new GroupWareFolder($account,$folder,$type,$rights,false,false,$displayName,false,$groupChatUnread,$owner,$groupRelativeFolder);
		
		 		$account->account->folders['gw'][MerakGWAPI::decode($folder)] = $oFolder;

		return $oFolder;
	}

	 
	public function rename($newName,$bRenameDual = true,$checkExistance = true)
	{
		 		$this->openAccess();
		 		Folder::checkRename($this->name,$newName);
		$newName = MerakGWAPI::encode($newName);
		if($checkExistance){
			try{
				 				$this->account->account->getFolder($newName);
				$exist = true;
			}catch(Exc $e){
				$exist = false;
			}
			if($exist){
				throw new Exc('folder_rename');
			}
		}

		$sName = MerakGWAPI::encode($this->name);
		$sMainName = MerakGWAPI::decode($this->name);
		 		$oldParent = substr($sName,0,strrpos($sName,'\\'));
		 		$parent = substr($newName,0,strrpos($newName,'\\'));
		$parentDecoded = MerakGWAPI::decode($parent);
		$oldFolderID = $this->folderID;

		if($parentDecoded && !isset($this->account->account->folders['gw'][$parentDecoded]) && $this->getType()!='I'){
			$this->createParent($parentDecoded);
		}
		if($this->display || $this->getType()=='I'){
			 			if(strrpos($sName,'\\')!=0){
				$folderID = substr($sName,strrpos($sName,'\\')+1);
			}else{
				$folderID = $this->name;
			}
			 			if(strrpos($newName,'\\')!=0){
				$displayName = substr($newName,strrpos($newName,'\\')+1);
			}else{
				$displayName = $newName;
			}
			 			if($oldParent!=$parent){
				$sNewName = $parent.'\\'.$folderID;
				if (!$this->account->gwAPI->FunctionCall
						(
								"RenameFolder",
								$this->account->sGWSessionID,
								$sName,
								IceWarpGWAPI::encode($sNewName)
						)
				){
					throw new Exc('folder_rename');
				}
				if (!$this->account->gwAPI->FunctionCall
						(
								"AddFolder",
								$this->sFID,
								IceWarpGWAPI::encode($sNewName),
								$this->type,
								'&FdrDisplay='.urlencode($displayName)
						)
				){
					throw new Exc('folder_rename');
				}		
				$this->folderID = IceWarpGWAPI::decode($sNewName);	
			}else{
				if (!$this->account->gwAPI->FunctionCall
						(
								"AddFolder",
								$this->sFID,
								$sName,
								$this->type,
								'&FdrDisplay='.urlencode($displayName)
						)
				){
					throw new Exc('folder_rename');
				}
				$sNewName = $sName;
				$this->folderID = IceWarpGWAPI::decode($sName);
			}
			if($this->display){
				$this->display = $displayName;
			}
			$this->name = IceWarpGWAPI::decode($sNewName);		
		}else{
			if (!$this->account->gwAPI->FunctionCall
					(
							"RenameFolder",
							$this->account->sGWSessionID,
							$sName,
							$newName
					)
			){
				if($this->account->gwAPI->FunctionCall("GetLastError",$this->account->sGWSessionID)==27){
					throw new Exc('folder_already_exists', $newName);
				}
				throw new Exc('folder_rename');
			}
			$this->folderID =IceWarpGWAPI::decode( $newName );
			$this->name =IceWarpGWAPI::decode( $newName );
		}

		 		$this->account->gwAPI->CloseFolder($oldFolderID);
		$folderInfo = $this->account->gwAPI->OpenFolder(MerakGWAPI::encode($this->folderID));
		$sFolderInfo = $this->account->gwAPI->FunctionCall("GetFolderInfo",$folderInfo['fid']);
		@$aFolderInfo = reset($this->account->gwAPI->ParseParamLine($sFolderInfo));

		$folder = $aFolderInfo['FDR_ID'];
		$type = $aFolderInfo['FDRTYPE'];
		$owner = $aFolderInfo['FDROWNER'];
		$displayName = $aFolderInfo['FDRDISPLAY'];
		$groupChatUnread = $aFolderInfo['FDRGROUPCHATUNREAD'];
		$groupRelativeFolder = $aFolderInfo['GROUPFOLDER'];
		$rights = self::decodeRights($folderInfo['rights']);
			
		$this->groupChatUnread = $groupChatUnread;
		$this->groupRelativeFolder = $groupRelativeFolder;
		$this->rigths = $rights;

		 		$this->account->account = $_SESSION['user']->getAccount($this->account->account->accountID);

		 		unset($this->account->account->folders['gw'][$oldFolderID]);	
		$this->account->account->folders['gw'][MerakGWAPI::decode($this->folderID)] = $this;

		 		if(($oMainFolder = $this->getMainFolder($sMainName)) && $bRenameDual){
			$oMainFolder->rename(MerakGWAPI::decode($newName),false,false);
		}
	}

	public function createParent($folder)
	{
		$aFolders = explode('/',$folder);
		$aFolders = array_reverse($aFolders);
		$aFoldersCurrent = &$this->account->account->folders['gw'];
		$aFoldersCreate = array();
		 		$iCount = count($aFolders);
		if($aFolders) foreach($aFolders as $key => $fname){
			$sName = '';
			 			for ($i = 0; $i < ($iCount-$key); $i++){
				$sName .= $aFolders[$iCount-$i-1].(($i==$iCount-$key-1)?'':'/');
			}
			 			if (isset($aFoldersCurrent[$sName])){
                 				break;
			} else {
                 				$aFoldersCreate[] = $sName;
			}
		}
		@$aFoldersCreate = array_reverse($aFoldersCreate);
		if($aFoldersCreate) foreach($aFoldersCreate as $fdr){
			$this->account->createFolder(
					array(
							'name'=>MerakGWAPI::encode($fdr),
							'type'=>'M',
							 							 							'virtual'=>false
					),
					false
			);
			$dualAccount = $this->account->account;
			$dualAcl = $dualAccount->getAcl($fdr);
			$dualInherited = $dualAccount->isInheritedACL($fdr,$dualAcl);
			if(!$dualInherited){
				try{
					$this->account->setAcl($dualAcl,$fdr,false);
				}catch(Exc $e){
					 					if(is_array($dualAcl)){
						throw $e;
					}
				}
			}
		}
	}

	 
	public function createItem($aItem,$aTreeItem)
	{
		if(($this->getType()=='F' || ($aItem['evnclass']=='F' || $aItem['evnclass']=='M') ) && !isset($aItem['evntitle'])){
			 
		  	return $this->createItemFile($aItem,$aTreeItem);
		}else{
			try{
				return GroupWareItem::create($this,$aItem,$aTreeItem);
			}catch(Exc $e){
				if($e->wmcode == 'item_duplicity'){
					if($this->isForceRename($aTreeItem)){
						$name = $aItem['evntitle'] = GroupWareItem::proposeFreeFileName($this, $e->getMessage());
						$aItem['evnlocation'] = $aItem['evntitle'];
						$aItem['evnrid'] = $aItem['evntitle'];
						$aTreeItem['@childnodes']['values'][0]['@childnodes']['evntitle'][0]['@value'] = $name;
						$aTreeItem['@childnodes']['values'][0]['@childnodes']['evnlocation'][0]['@value'] = $name;
						$aTreeItem['@childnodes']['values'][0]['@childnodes']['evnrid'][0]['@value'] = $name;
						return GroupWareItem::create($this,$aItem,$aTreeItem);
					}else{
						$class = $aTreeItem['@childnodes']['attachments'][0]['@childnodes']['attachment'][0]['@childnodes']['values'][0]['@childnodes']['class'][0]['@value'];
						$fullpath = $aTreeItem['@childnodes']['attachments'][0]['@childnodes']['attachment'][0]['@childnodes']['values'][0]['@childnodes']['fullpath'][0]['@value'];
						$error = '<duplicate><item><class>'.$class.'</class><fullpath>'.$fullpath.'</fullpath><name>'.$e->getMessage().'</name><freename>'.GroupWareItem::proposeFreeFileName($this, $e->getMessage()).'</freename></item></duplicate>';
						throw new XMLExc('items_duplicity',$error);
					}
				}else{
					throw $e;
				}
			}
		}
	}

	public function getItemClass()
	{
		return GroupWareItem::class;
	}

	public function isForceRename(&$aTreeItem)
	{
		 		$force_rename = false;
		if((isset($aTreeItem['@attributes']['duplicity']) && $aTreeItem['@attributes']['duplicity']=='rename')
			|| $this->subtype=='U'){
			$force_rename = true;
		}
		return $force_rename;
	}

	public function setAcl($aList,$bSetDual = true)
	{
		$this->account->setAcl($aList,$this->name,$bSetDual);
	}

	public function getAcl()
	{
		$this->openAccess();
		if($this->getType()=='I' || $this->getType()=='Y'){
			$expand_guests = true;
		}else{
			$expand_guests = false;
		}
		return $this->acl = $this->account->getAcl($this->name,$expand_guests);
	}

	public function getMyRights()
	{
		$this->openAccess();
		return $this->account->getMyRights($this->name);
	}

	public function getMyCard()
	{

	}

	protected function getMainFolder($name)
	{
		try {
			if ($this->account->account){
				$type = 'main';
				$folder = $this->account->account->getFolder(
						MerakGWAPI::decode($name),
						$type
				);
			}	else {
				$folder = false;
			}
		} catch (Exc $e) {
			$folder = false;
		}
		return $folder;
	}
	 
	public function openAccess()
	{
		$sFID = $this->folderID;
		$oAccount = &$this->account;

		 		$oAccount->gwAPI->Login();

		 		if (!$oAccount->sGWSessionID = $oAccount->gwAPI->OpenGroup('*')){			
			throw new Exc('group_open');
		}


		 		if(!$this->folderInfo = $oAccount->gwAPI->OpenFolder(MerakGWAPI::encode($sFID),$this->autoSubscribe)){
			throw new Exc('folder_open',MerakGWAPI::encode($sFID));
		}else{
			if($this->folderInfo['fid']){
				$this->sFID = $this->folderInfo['fid'];
				$this->rights = self::decodeRights($this->folderInfo['rights']);
				$this->rightsUpdated = true;
			}
		}
		return $this->sFID;
	}

	public function closeAccess()
	{
	}


	 
	public static function decodeRights($gwRights)
	{
		$rights = 0;
		 		if(abs($gwRights) > 1024){
			if($gwRights & MerakGWAPI::RIGHT_READ ) $rights |= Folder::RIGHT_READ;
			if($gwRights & MerakGWAPI::RIGHT_WRITE ) $rights |= Folder::RIGHT_WRITE;
			if($gwRights & MerakGWAPI::RIGHT_MODIFY ) $rights |= Folder::RIGHT_MODIFY;
			if($gwRights & MerakGWAPI::RIGHT_DELETE ) $rights |= Folder::RIGHT_DELETE;
			if($gwRights & MerakGWAPI::RIGHT_FOLDER_READ) $rights |= Folder::RIGHT_FOLDER_READ;
			if($gwRights & MerakGWAPI::RIGHT_FOLDER_WRITE) $rights |= Folder::RIGHT_FOLDER_WRITE;
			if($gwRights & MerakGWAPI::RIGHT_FOLDER_DELETE){
				$rights |= Folder::RIGHT_FOLDER_MODIFY;
				$rights |= Folder::RIGHT_FOLDER_DELETE;
			}
			if($gwRights & MerakGWAPI::RIGHT_ADMIN) $rights |= Folder::RIGHT_ADMIN;
			 			$rights |= Folder::RIGHT_BITS;
			
			if($gwRights & MerakGWAPI::RIGHT_FOLDER_INVITE) $rights |= Folder::RIGHT_FOLDER_INVITE;
			if($gwRights & MerakGWAPI::RIGHT_FOLDER_KICK) $rights |= Folder::RIGHT_FOLDER_KICK;
			if($gwRights & MerakGWAPI::RIGHT_FOLDER_EDIT_FOLDER) $rights |= Folder::RIGHT_FOLDER_EDIT_FOLDER;
			if($gwRights & MerakGWAPI::RIGHT_FOLDER_EDIT_DOCUMENT) $rights |= Folder::RIGHT_FOLDER_EDIT_DOCUMENT;
		 		}else{
			$gwRights = MerakGWAPI::$aRightsToString[$gwRights];
			foreach (str_split($gwRights) as $right) {
				switch ($right) {
					case 'r':
						$rights |= Folder::RIGHT_FOLDER_READ;
						$rights |= Folder::RIGHT_READ;
						break;
					case 'w':
						$rights |= Folder::RIGHT_FOLDER_WRITE;
						$rights |= Folder::RIGHT_WRITE;
						break;
					case 'm':
						$rights |= Folder::RIGHT_FOLDER_MODIFY;
						$rights |= Folder::RIGHT_MODIFY;
						break;
					case 'd':
						$rights |= Folder::RIGHT_FOLDER_DELETE;
						$rights |= Folder::RIGHT_DELETE;
						break;
					case 'o':  $rights |= Folder::RIGHT_ADMIN; break;
				}
			}
		}

		return $rights;
	}
	 
	public static function encodeRights($wmRights)
	{
		$rights = 0;

		if($wmRights & Folder::RIGHT_READ ) $rights |= MerakGWAPI::RIGHT_READ;
		if($wmRights & Folder::RIGHT_WRITE ) $rights |= MerakGWAPI::RIGHT_WRITE;
		if($wmRights & Folder::RIGHT_MODIFY ) $rights |= MerakGWAPI::RIGHT_MODIFY;
		if($wmRights & Folder::RIGHT_DELETE ) $rights |= MerakGWAPI::RIGHT_DELETE;
		if($wmRights & Folder::RIGHT_FOLDER_READ) $rights |= MerakGWAPI::RIGHT_FOLDER_READ;
		if($wmRights & Folder::RIGHT_FOLDER_WRITE) $rights |= MerakGWAPI::RIGHT_FOLDER_WRITE;
		if($wmRights & Folder::RIGHT_FOLDER_DELETE
				|| $wmRights & Folder::RIGHT_FOLDER_MODIFY)
			$rights |= MerakGWAPI::RIGHT_FOLDER_DELETE;
		if($wmRights & Folder::RIGHT_ADMIN) $rights |= MerakGWAPI::RIGHT_ADMIN;
		 		if($wmRights & Folder::RIGHT_FOLDER_INVITE ) $rights |= MerakGWAPI::RIGHT_FOLDER_INVITE;
		if($wmRights & Folder::RIGHT_FOLDER_KICK ) $rights |= MerakGWAPI::RIGHT_FOLDER_KICK;
		if($wmRights & Folder::RIGHT_FOLDER_EDIT_FOLDER ) $rights |= MerakGWAPI::RIGHT_FOLDER_EDIT_FOLDER;
		if($wmRights & Folder::RIGHT_FOLDER_EDIT_DOCUMENT ) $rights |= MerakGWAPI::RIGHT_FOLDER_EDIT_DOCUMENT;
		
		$rights |= MerakGWAPI::RIGHT_BITS;
		return $rights;
	}

	public function importItem($type,$data, $delete_after_import = false)
	{
		return GroupWareItem::import($this,$type,$data, $delete_after_import);
	}
     
	public function getContactList($private = false, $format = false)
	{
		if($this->type!='C'){
			throw new Exc('export_folder_type',$this->type);
		}
		$oGWAPI = &$this->account->gwAPI;
		$this->openAccess();
		$addresses = array();
		if($format){
			$formatstr = '('.$format.')'; 
		}else{
			$formatstr = '';
		}
		 		if($this->sFID){
			 			 
			$select = 'ITMSHARETYPE,ITMCATEGORY,ITMTITLE,ITMSUFFIX,ITMFIRSTNAME,'.
					'ITMMIDDLENAME,ITMSURNAME,ITMJOBTITLE,ITMCOMPANY,ITMCLASSIFYAS,'.
					'ITMDESCRIPTION,ITMOFFICELOCATION,ITMGENDER,ITMPROFESSION,ITMDEPARTMENT,'.
					'ITMNICKNAME,ITMBDATE,ITMSPOUSE,ITMANNIVERSARY,ITMINTERNETFREEBUSY,'.
					'ITMASSISTANTNAME,ITMMANAGERNAME,LCT_ID,LCTTYPE,LCTWEBPAGE,'.
					'LCTEMAIL1,LCTEMAIL2,LCTEMAIL3,LCTSTREET,LCTCITY,LCTSTATE,'.
					'LCTCOUNTRY,LCTZIP,LCTIM,ITMCLASS,LCTPHNWORK1,LCTPHNHOME1,'.
					'LCTPHNFAXWORK,LCTPHNMOBILE,LCTPHNFAXHOME,LCTPHNOTHERFAX,LCTPHNHOME2';
			$result = $oGWAPI->ParseParamLine(
					$oGWAPI->FunctionCall(
							"GetContactDetailList",
							$this->sFID,
							'((ITMCLASS IS Null OR ITMCLASS=\'C\' OR ITMCLASS=\'\'))',
							"ITMGRP_ID,$select"
					)
			);
			             $list = array();
			if(is_array($result)){
				foreach($result as $location){
					$list[$location['ITM_ID']][$location['LCTTYPE']?$location['LCTTYPE']:'H'] = $location;
				}
			}
			if(is_array($list)){
				foreach ($list as $val){
					$address["ID"]=$val['H'][ITM_ID];
					 					$address["CONTACTNAME"]=$val['H'][ITMCLASSIFYAS];
					$address["FIRSTNAME"] = $val['H'][ITMFIRSTNAME];
					$address["MIDDLENAME"] = $val['H'][ITMMIDDLENAME];
					$address["LASTNAME"] =$val['H'][ITMSURNAME];
					$address["NICKNAME"] = $val['H'][ITMNICKNAME];
					$address["TITLE"] = $val['H'][ITMTITLE];
					$address["SUFFIX"] = $val['H'][ITMSUFFIX];
					$address["CATEGORY"]= $val['H'][ITMCATEGORY];
					 					$address["EMAIL"] =  $val['H'][LCTEMAIL1];
					$address["EMAIL2"] = $val['H'][LCTEMAIL2];
					$address["EMAIL3"] = $val['H'][LCTEMAIL3];
					 					$address["PHONE_WORK"] = $val['H'][LCTPHNWORK1];
					$address["PHONE_HOME"] = $val['H'][LCTPHNHOME1];
					$address["PHONE_HOME2"] = $val['H'][LCTPHNHOME2];
					$address["PHONE_MOBILE"] = $val['H'][LCTPHNMOBILE];
					$address["PHONE_FAX_WORK"] = $val['H'][LCTPHNFAXWORK];
					$address["PHONE_FAX_HOME"] = $val['H'][LCTPHNFAXHOME];
					$address["PHONE_FAX_OTHER"] = $val['H'][LCTPHNOTHERFAX];
					
					 					$bday = $val['H'][ITMBDATE];
					$anniversary = $val['H'][ITMANNIVERSARY];
					if($format){
					  $php_format = slToolsDate::ClassicToPHPFormat($format);	
					  $bday = date($php_format,MerakGWAPI::calendar2unixTime($bday, 0));
					  $anniversary = date($php_format,MerakGWAPI::calendar2unixTime($anniversary, 0));     	
					}
					$address["BIRTHDAY".$formatstr] = $bday;
					$address["ANNIVERSARY".$formatstr] = $anniversary;
					
					$address["GENDER"] =$val['H'][ITMGENDER];
					$address["SPOUSE"] = $val['H'][ITMSPOUSE];
					 					$address["STREET"] = $val['H'][LCTSTREET];
					$address["CITY"] = $val['H'][LCTCITY];
					$address["ZIP"] = $val['H'][LCTZIP];
					$address["STATE"] = $val['H'][LCTSTATE];
					$address["COUNTRY"] = $val['H'][LCTCOUNTRY];
					 					$address["HOMEPAGE"] = $val['H'][LCTWEBPAGE];
					$address["FREEBUSYURL"] = $val['H'][ITMINTERNETFREEBUSY];
					$address["IM"] = $val['H'][LCTIM];

					 					$address["COMPANY"]=$val['H'][ITMCOMPANY];
					$address["JOB"] = $val['H'][ITMJOBTITLE];
					$address["PROFESSION"] = $val['H'][ITMPROFESSION];
					$address["DEPARTMENT"] = $val['H'][ITMDEPARTMENT];
					$address["ASSISTANT"] = $val['H'][ITMASSISTANTNAME];
					$address["MANAGER"] = $val['H'][ITMMANAGERNAME];
					$address["OFFICELOCATION"] = $val['H'][ITMOFFICELOCATION];
					 					$address["NOTES"] =$val['H'][ITMDESCRIPTION];
					$address["SHARETYPE"] = $val['H'][ITMSHARETYPE];
					
					 					$address["STREETB"] = $val['B'][LCTSTREET];
					$address["CITYB"] = $val['B'][LCTCITY];
					$address["ZIPB"] = $val['B'][LCTZIP];
					$address["STATEB"] = $val['B'][LCTSTATE];
					$address["COUNTRYB"] = $val['B'][LCTCOUNTRY];
					$address["WEB"] = $val['B'][LCTWEBPAGE];
					$address["HOMEPAGE"] = $val['H'][LCTWEBPAGE];
					 					$address["STREETO"] = $val['O'][LCTSTREET];
					$address["CITYO"] = $val['O'][LCTCITY];
					$address["ZIPO"] = $val['O'][LCTZIP];
					$address["STATEO"] = $val['O'][LCTSTATE];
					$address["COUNTRYO"] = $val['O'][LCTCOUNTRY];
					
					$addresses[$address["ID"]]= $address;
					unset($address);
				}
			}
		}
		return $addresses;
	}
	static public function saveAddressesToFile(&$file, $addresses, $separator = delimiterchar, $private = true)
	{
		slSystem::import('tools/charset');
		 		function ARcmp($a, $b)
		{
			if ($a["ID"] == $b["ID"])
				return 0;
			return ($a["ID"] > $b["ID"]) ? 1 : -1;
		}
		usort($addresses, "ARcmp");
		if ($addresses) {
			 			$headerAddr = reset($addresses);
			unset($headerAddr["ID"]);
			unset($headerAddr["LOCATIONID"]);
			unset($headerAddr["sharing"]);
			$headerAddr = array_keys($headerAddr);
			 			fwrite($file,"\xef\xbb\xbf");
			fwrite($file,implode($separator,$headerAddr)."\r\n");
			 			foreach ($addresses as $address) {
				unset($address["ID"]);
				unset($address["LOCATIONID"]);
				unset($address["sharing"]);
				foreach($address as $key=>$val){
					$address[$key] = $val;
				}
				Tools::my_fputcsv($file, $address, $separator, '"', "\r\n");
			}
		}
		return true;
	}

	public function sync()
	{
	}

	public function emptyFolder($sDestinationAccount, $sDestinationFolder, $sFolderType)
	{
		$oUser = $_SESSION['user'];
		 		if ($sDestinationFolder) {
			$oDestinationAccount = &$oUser->getAccount($sDestinationAccount);
			$oDestination = &$oDestinationAccount->getFolder($sDestinationFolder);
			$this->moveItems($oDestination);
			 		} else {
			$this->deleteItems();
		}
	}

	public function setDefault($type,$updateSettings = true)
	{

		log_buffer("(".$this->name.")->setDefault() ".$type,"EXTENDED");
		 		$sFID = $this->openAccess();
		if(!$this->account->gwAPI->FunctionCall("SetDefaultFolder",$sFID)){
			throw new Exc('folder_set_default',$this->name);
		}
		$oldDefault = User::getDefaultFolder($this->type);
		User::setDefaultFolder($this->name,$this->type);
		 
		if(isset($this->account->account->folders['gw'][$oldDefault])){
			$this->account->account->folders['gw'][$oldDefault]->isDefault = false;
			$this->account->account->folders['gw'][$oldDefault]->isDefault = false;
		}
		$this->account->account->folders['gw'][$this->name]->isDefault = true;
		$this->account->account->folders['gw'][$this->name]->defaultType = $this->type;

		$this->isDefault = true;
		$this->defaultType = $type;

		 		if($this->type=='C'){
			unset($this->account->account->folders['addressbook']);
		}

		if($updateSettings){

			$data = Storage::getUserData();
			$default_folders = &$data['@childnodes']['default_folders'][0]['@childnodes']['item'][0]['@childnodes'];

			$gwFolders = array(
					'C'=>'contacts',
					'E'=>'events',
					'T'=>'tasks',
					'N'=>'notes',
					'J'=>'journal',
					'F'=>'files'
			);
			$default_folders[$gwFolders[$this->type]][0]['@value'] = $this->account->account->accountID.'/'.$this->name;
			$str = Tools::makeXMLStringFromTree($data,'settings',true);
			log_buffer("(".$this->name.")->setDefault() update settings: ".$str,"EXTENDED");
			Storage::setUserDataStr($str,'default_folders');
		}
	}
	
	public function isGAL()
	{
		return $this->isGAL;
	}
	
	public function isShared()
	{
		return ($this->shared || Folder::hasSharedRoot($this->name));
	}
	public function isPublic()
	{
		return $this->public;
	}
	
	public function removeMember($member)
	{
		$this->openAccess();

		if(!$this->account->gwAPI->FunctionCall("KickRoomMember",$this->sFID,$member)){
			throw new Exc('teamchat_kick_member');
		}
	}
	
	public function addMember($aMemberList,$sComment = '')
	{
		if($aMemberList){
			$this->openAccess();
			foreach($aMemberList as $aMember){
				$this->account->gwAPI->FunctionCall('inviteguest',$this->sFID,$aMember,'comment='.urlencode($sComment));
			}
		}
	}
	
	 
	public function setSubscription($state)
	{
		$account = $this->account;
		$this->openAccess();
		$result = $this->account->gwAPI->FunctionCall('SetTeamchatFolderSubscription',$this->sFID,'subscribe='.intval($state));
		if ($result){
			$this->groupChatSubscribed = $state;
		}
		return $result;
	}
	
	public function cloneRoom($sourceRoom)
	{
		$aMembers = array();		
		 		$sourceRoomID = substr($sourceRoom,strpos($sourceRoom,'/')+1);
		$oSourceRoom = $this->account->account->getFolder($sourceRoomID);
		$aSourceACL = $oSourceRoom->getAcl();
		if(is_array($aSourceACL)){
			foreach($aSourceACL as $email => $right){
				 				if($email != $_SESSION['EMAIL']){
					$aMembers[] = trim($email,'[]');
				}
			}
		}
		return $this->addMember($aMembers);
	}

	public function setNotify($bValue)
	{
		$account = $this->account;
		$this->teamChatNotify = $bValue;
		$this->openAccess();
		return $this->account->gwAPI->FunctionCall('SetTeamchatRoomNotifications',$this->sFID,'notifications='.intval($bValue));	
	}

	public function isPrivateRoot()
	{
		if($this->shared && $this->groupOwner){
			$groupOwnerDomain = substr($this->groupOwner,strrpos($this->groupOwner,'@')+1);
			return $groupOwnerDomain == '##internalservicedomain.icewarp.com##';
		}
	}

	public function setChannels($mailbox, $channels, $encoded = false){}

	static private function removeIntervalFields($fields)
	{
		 		$aFields = explode(",",$fields);
		$array = array();
		if($aFields) foreach($aFields as $item){
			if (!in_array(trim($item),self::$aAliasTags)) {
				$array[] = trim($item);
			}
		}
		return implode(",",$array);
	}
}
?>
