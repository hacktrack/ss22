<?php

class QuarantineFolder extends Folder
{
	public $email;
	public $folderID;
	public $type;
	public $typeName;
	public $iAuthorized;
	public $defaultFilter;

    public function __construct($name,$email)
  {
  	$this->email = strtolower($email);
    $this->name  = $name;

    switch($name)
    {
      case Q_FOLDER_NAME:
      	$this->folderID = 'Quarantine';
        $this->type = 'Q';
        $this->typeName = 'quarantine';
        $this->iAuthorized = 2;
        
      break;
      case B_FOLDER_NAME:
    	$this->folderID = 'Blacklist';
        $this->type = 'QL';
		$this->typeName = 'blacklist';
        $this->iAuthorized = 0;
      break;
      case W_FOLDER_NAME:
		$this->folderID = 'Whitelist';
        $this->type = 'QL';
		$this->typeName = 'whitelist';
        $this->iAuthorized = 1;
      break;
    }
    $this->rights = Folder::rightsToBitValue('riwtl');
    $this->defaultFilter =  'owner='.urlencode($this->email).
    						'&type='.$this->typeName.
    						'&urlstyle=1';

  }
  
  public function getItems(&$aFilterTag = array(), $createObject = true, $ignoreHidden = true)
  {
         $api = createobject('API');
         $sort = '';
    if ($aFilterTag['orderby']){
		$aFilterTag['orderby'] = str_replace('qdate asc','sndcreatedon asc,sndcreatedat asc',strtolower($aFilterTag['orderby']));
    	$aFilterTag['orderby'] = str_replace('qdate desc','sndcreatedon desc,sndcreatedat desc',strtolower($aFilterTag['orderby']));
		if($_SESSION['COLLATE_ENABLE']){
	  		$aFilterTag['orderby'] = Tools::collateOrderBy($aFilterTag['orderby']);
		}
		$sort = $aFilterTag['orderby'];
    }
    if ($aFilterTag['sql']){
      $filter = $aFilterTag['sql'];
    }
    $param['spam_admin'] = $_SESSION['EMAIL'];
    $param['type'] = $this->typeName;
    $param['offset'] = $aFilterTag['offset']?intval($aFilterTag['offset']):0;
    if($aFilterTag['limit']){
      $param['limit'] = ($aFilterTag['limit']);
    }
         $aList = $api->ManageConfig(
    	'antispam/quarantine', 
    	'list', 
    	$this->defaultFilter.
    	($param['limit']?'&limit='.intval($param['limit']):'').
    	'&offset='.intval($param['offset']).
    	($sort?'&order_by='.urlencode(icewarp_sanitize_db_sql($sort,false,true,'antispam')):'').
    	($filter?'&sql='.urlencode(icewarp_sanitize_db_sql($filter)):'')
    );
    $aLines = mb_split(CRLF,$aList);

         unset($aLines[count($aLines)-1]);

         foreach($aLines as $sLine){
       $aLine = mb_split("&",$sLine);
       foreach($aLine as $key => $val){
       	$aLine[$key] = urldecode($val);
       }
       $return[$aLine[0].'#'.$aLine[4]] = new QuarantineItem($this,$aLine);
    }
    return $return;
  }
  
  public function getItem($itemID, $cache = array())
  {
      $id = base64_decode($itemID);
      $info = explode("#",$id);
      
      $api = createobject('API');
             $aList = $api->ManageConfig(
      		'antispam/quarantine',
      		'list',
      		$this->defaultFilter.'&sql='.urlencode('SndOwner=\''.icewarp_escape_db_string($info[1],'antispam').'\' AND SndEmail=\''.icewarp_escape_db_string($info[0],'antispam').'\' AND SndAuthorized =  \''.$this->iAuthorized.'\'')
      );
      $aLines = mb_split(CRLF,$aList);
      $aItem = mb_split("&",$aLines[0]);
  	  foreach($aItem as $key => $val){
       	$aItem[$key] = urldecode($val);
      }

      if ($aItem)
        return new QuarantineItem($this,$aItem,true); 
  }  
  
         public function deleteItems($oItems = false){
      $result = true;
      if(!$oItems) $oItems = $this->getItems();
      if(!$oItems){
      	return false;
      }
      foreach($oItems as $oItem){
        $result = $oItem->delete() && $result;
      }
      return $result;
    }
    
              public function moveItems(&$oFolder,$oItems = false){
    }
    
    public function copyItems(&$oFolder,$oItems = false){
    }
        
  public function countItems($flags = 0,$positive = true,$filter = "")
  {
         if ($flags && !$positive)
      return 0;
    $api = createobject('API');
         $filter = $this->defaultFilter.($filter?'&sql='.urlencode($filter):'');

          $count = $api->ManageConfig(
    	'antispam/quarantine', 
    	'count', 
    	$filter
    );
    $count = trim(str_replace(array(";","&"),"",$count));
	if(!$count){
		$count = 0;
	}
    return $count; 
  }
  
  public function whitelistItem($id, $deliver = false)
  {
	  $item = $this->getItem($id);
	  return $item->whitelist(false,$deliver);
  }

  public function blacklistItem($id)
  {
    $item = $this->getItem($id);
    return $item->blacklist();
  }  

  public function deliverItem($id)
  {
    $item = $this->getItem($id);
    $item->deliver();
  }
    
  public static function create(&$account,$name,$param = '',$createDual = true)
  {
         return new QuarantineFolder($name,$_SESSION['EMAIL']);
  }
  
  public function delete()
  {}
  
  public function rename($newName)
  {}

  
  public function createItem($aItem)
  {    
    return QuarantineItem::create($this,$aItem);
  }
  
  public function sync()
  {}
  
  public function search($aFilterTag)
  {
    return $this->getItems($aFilterTag);
  }
  
  public function emptyFolder()
  {
    $this->deleteItems();
  }

    public function setDefault($type, $updateSettings = true){}

    public function setSubscription($state){}

    public function setNotify($bValue){}

    public function setChannels($mailbox, $channels, $encoded = false){}
}
?>
