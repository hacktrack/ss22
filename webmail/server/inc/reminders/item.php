<?php

class RemindersItem
{
	public $itemID;
	public $evntitle;
	public $evnclass;
	public $rmnlastack;
	public $evnstarttime;
	public $evnstartdate;
	public $evnendtime;
	public $evnenddate;
	public $evnmeetingid;
	public $evnorganizer;
	public $rmnminutesbefore;
	public $reminderunixtime;
	public $wmclass;
	public $ctz;
	public $evnrcr_id;
	public $rmntime;
	public $timestamp;
	public $rmn_id;
	public $folder;
	public $evnfolder;
	public $evn_id;

    public function __construct(&$folder,$data)
	{
		$id = $data['RMN_ID'].
			'|'.$data['EVN_ID'].
			'|'.$data['EVNRCR_ID'].
			'|'.$data['RMNTIME'].
			'|'.$data['RMNMINUTESBEFORE'].
			'|'.$data['RMNLASTACK'].
			'|'.$data['REMINDERUNIXTIME'].
			'|'.$data['EVNFOLDER'];
		$id = base64_encode($id);
		$this->itemID = $id;
		$this->rmn_id = $data['RMN_ID'];
		$this->evn_id = $data['EVN_ID'];
		$this->evnrcr_id = $data['EVNRCR_ID'];
		$this->evntitle = $data['EVNTITLE'];
		$this->evnfolder = $data['EVNFOLDER'];
		$this->evnclass= $data['EVNCLASS'];
		$this->rmnlastack = $data['RMNLASTACK'];
		$this->evnstarttime = $data['EVNSTARTTIME'];
		$this->evnstartdate = $data['EVNSTARTDATE'];
		$this->evnendtime = $data['EVNENDTIME'];
		$this->evnenddate = $data['EVNENDDATE'];
		$this->evnmeetingid = $data['EVNMEETINGID'];
		$this->evnorganizer = $data['EVNORGANIZER'];
		$this->rmnminutesbefore = $data['RMNMINUTESBEFORE'];
		$this->reminderunixtime = $data['REMINDERUNIXTIME'];
		$this->rmntime = $data['RMNTIME'];
		$this->folder = &$folder;
		$this->wmclass = 'D';
	}
	
	public function setTimezone($minutes)
	{
		$this->ctz = $minutes;
	}
	
	public function setTimestamp($timestamp)
	{
		$this->timestamp = $timestamp;
	}
	 
	
	public function dismiss()
	{
		if($this->isRecurrent()){
			$this->dismissRecurrent();
		}else{
			$this->dismissDefault();
		}
		$this->updateMasterObject();
	}
	
	public function snooze($minutes)
	{
		 		if($this->rmntime == 0){
			 
			$param['RMNLASTACK'] = $this->timestamp + $minutes*60;
			$this->set($param,$this->rmn_id);
			 			$param = array();
			$param['RMNTIME'] = $this->timestamp + $minutes*60;
			$this->set($param);
		 		}else{
			$param['RMNTIME'] = $this->timestamp +$minutes*60;
			$this->set($param,$this->rmn_id);
		}
		$this->updateMasterObject();
	}
	
	public function isRecurrent()
	{
		if($this->evnrcr_id){
			return true;
		}else{
			return false;
		}
	}
	
	public function dismissRecurrent()
	{
		$oAccount = &$this->folder->account->gwAccount;
		$gwapi = &$this->folder->account->gwAccount->gwAPI;
		 		if($this->rmntime == 0){
			$param['RMNLASTACK'] = $this->timestamp;
			$this->set($param,$this->rmn_id);
		 		}else{
			if(!$gwapi->IsConnected()){
				$gwapi->OpenGroup('*');
			}
			if(!$gwapi->FunctionCall(
				"DeleteEventReminders",
				$oAccount->sGWSessionID,
				$this->evn_id,
				$this->rmn_id
			)){
				throw new Exc('reminder_dismiss');
			}
		}
	}
	
	public function dismissDefault()
	{
		$param['RMNLASTACK'] = $this->timestamp;
		$this->set($param,$this->rmn_id);
	}
	
	
	 
	
	public function set($param,$id = "")
	{
		$oAccount = &$this->folder->account->gwAccount;
		$gwapi = &$this->folder->account->gwAccount->gwAPI;
		if(!$gwapi->IsConnected()){
			$gwapi->OpenGroup('*');
		}
		 
		$param = $gwapi->CreateParamLine($param);
		if(!$gwapi->FunctionCall(
			"AddEventReminder",
			$oAccount->sGWSessionID,
			$this->evn_id,
			$param,
			$id
		)){
			throw new Exc('reminder_set');
		}
	}
	
	public function updateMasterObject()
	{

		$oAccount = &$this->folder->account->gwAccount;
		$gwapi = &$this->folder->account->gwAccount->gwAPI;
		$folder = $oAccount->getFolder($this->evnfolder);
		$sfid = $folder->openAccess();
		$item = $folder->getItem($this->evn_id,NO_ADDONS);
		$aItem['EvnTitle'] = $item->item['EVNTITLE'];
		$sItem = $gwapi->CreateParamLine($aItem);
		if (!$result = $gwapi->FunctionCall(
			"AddEventInfo",
			$sfid,
			$sItem,
			$this->evn_id)
		){
			throw new Exc('item_edit', $gwapi->FunctionCall("GetLastError",$gwapi->sessid));
		}
		if (!$result = $gwapi->FunctionCall(
			"AddEventInfo",
			$sfid,
			'',
			$this->evn_id)
		){
			throw new Exc('item_edit', $gwapi->FunctionCall("GetLastError",$gwapi->sessid));
		}
	}

    static public function decode(&$item, $staticFlags = false, $folder = false, $protocolHandler = false)
    {
    }
}

?>