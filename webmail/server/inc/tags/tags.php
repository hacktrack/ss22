<?php

class TagsHandler
{
	static private $instance;

	public $gwAccount;
	public $defaultRights;

    private function __construct(&$account)
	{
		$rights = Folder::RIGHT_READ;
		$rights |= Folder::RIGHT_FOLDER_READ;
		$this->defaultRights = $rights;
		if(!$account->gwAccount){
			throw new Exc('gw_init_error');
		}
		$this->gwAccount = &$account->gwAccount;
	}
	
	static public function instance(&$account)
	{
		if(!isset(self::$instance)){
			self::$instance = new TagsHandler($account);
		}
		return self::$instance;
	}
	public function getItemsID()
	{
        return $this->getItems();
	}
	public function getItems(&$folder,$aFilter = array())
	{
		$sid = $this->gwAccount->sGWSessionID;
		if(isset($aFilter['folder'])){
			try {
				$oFolder = $folder->account->getFolder($aFilter['folder']);
				if($oFolder->type=='V'){
					if(!$oFolder->isEmpty()){
						$oFolder = $oFolder->getPrimary();
					}else{
						return array();
					}
				}
				if(isset(User::$gwFolders[$oFolder->getType()])){
					$sid = $oFolder->openAccess();
				}
			}catch(Exception $e){
			}
		}
		$arr = Storage::getAvailableTags($this->gwAccount,$aFilter,$sid);
		foreach($arr as $key => $listItem){
			$item = new TagsItem($folder);

			$item->uid = $listItem['wuid'];
			$item->size = $listItem['TAGCOUNT'];
			$item->subject = $listItem['TAGNAME'];
			$item->from = $listItem['TAGCOLOR'];
			$item->to = 'dummy';
			$item->date = 0;
			$item->wmclass = 'K';
			$list[$item->uid] = $item;
			$item = false; 
		}
		return $list;
	}
	public function countItems(&$folder,$flags,$positive,$filter = "",$fulltext = "",$gwFolder = "")
	{
		$flag = $positive?~Item::FLAG_SEEN:Item::FLAG_SEEN;
		if($flags & $flag){
			return 0;
		}
		$sid = $this->gwAccount->sGWSessionID;
		if($gwFolder){
			try{
				$oFolder = $folder->account->getFolder($gwFolder);
				if($oFolder->type=='V'){
					if(!$oFolder->isEmpty()){
						$oFolder = $oFolder->getPrimary();
					}else{
						return 0;
					}
				}
				if(isset(User::$gwFolders[$oFolder->getType()])){
					$sid = $oFolder->openAccess();
				}
			}catch(Exception $e){
				
			}
		}
		$count = $this->gwAccount->gwAPI->FunctionCall(
			"GetTagCount",
			$sid,
			icewarp_sanitize_db_sql($filter),
			'TagName'
		);
		return $count;
	}
	
	public function getItem(&$folder,$itemID)
	{
		$list = $this->getItems($folder);
		if(!is_array($list) || !isset($list[$itemID])){
			throw new Exc('item_invalid_id',$itemID);
		}
		$item = $list[$itemID];
		return $item;
	}
	
	public function getFolders($refresh = true)
	{
		$result = new stdClass();
		$result->name = '__@@TAGS@@__';
		$result->rights = $this->defaultRights;
		return array(0=>$result);
	}
	public function drop()
	{
		
	}
}
?>