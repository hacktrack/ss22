<?php

define('QS_SPAM',0);
define('QS_ACCEPT',1);
define('QS_AWAITING',2);
define('QS_REJECT',3);
define('QS_DELETE',4);
define('QS_DELIVER',5);
define('QS_ADD',6);


class QuarantineItem extends CacheItem
{
	public $createdOn;
	public $createdAt;
	public $wmclass;
	public $sender;
	public $domain;
	public $owner;
	public $quarantineFolder;

	   public function __construct($folder,$param,$single = false)
  {

    $this->sender = $param[0];
    $this->createdOn = $param[1];
    $this->createdAt = $param[5];
    $this->domain = $param[6];
    $this->subject = $param[7];
    $this->owner = $param[4];
    $this->wmclass = 'Q';
    $this->quarantineFolder = $param[2];
    $this->itemID = $param[0].'#'.$param[4];
         $this->folder = $folder;  
  }
  
	public static function create($folder,$item = array(), $cache = array(), $file = false, $message = false, $bNoCache = false)
	{
		if (!$cache['api']){
			$cache['api'] = createobject("API");
		}
		return self::doAction($_SESSION['EMAIL'],$item['email'],QS_ADD,$cache,$folder->iAuthorized);
	}

	public function delete($cache = array(), $delayed = false)
	{
		if (!$cache['api']){
			$cache['api'] = createobject("API");
		}
		$result = self::doAction($this->owner,$this->sender,QS_DELETE,$cache);
		return $result;
	}

	public function whitelist($cache = array(),$deliver = false)
	{
		if (!$cache['api']){
			$cache['api'] = createobject("API");
		}
		$result = self::doAction($this->owner,$this->sender,QS_ACCEPT,$cache);
		return $result;

	}
  
  public function blacklist($cache = array())
  {
		if (!$cache['api']){
			$cache['api'] = createobject("API");
		}
		$result = self::doAction($this->owner,$this->sender,QS_SPAM,$cache);
		return $result;

  } 
   
  public function deliver($cache = array())
  {
		if (!$cache['api']){
			$cache['api'] = createobject("API");
		}
		$result = self::doAction($this->owner,$this->sender,QS_DELIVER);
		return $result;

  }  
  
     public function edit($file, $message =false, $item = array() ,$cache = array())
  {}
    
  public function move($folder, $cache = [], $delayed = false)
  {}
  
  public function getMessage()
  {
    $message = $this->getMessageFile();
    return @file_get_contents($message);
  }
  public function getMessageFile()
  {
  		if($_SESSION['EMAIL'] == $this->owner){
   			$path = $_SESSION['USERDIR'];
  		}else{
  			$mDomain = createobject('domain');
  			$mDomain->Open($this->domain);
  			   			if($mDomain->getProperty('d_type')==3){
  				$path = $mDomain->getProperty('D_BaseMailboxPath');
  			}else{
  				$mAccount = createobject('account');
  				$mAccount->open($this->owner);
  				$path = $mAccount->getProperty('U_FullMailboxPath');	
  			}
  		}
  		
  		$path = $path.'~spam/~quarantine/'.$this->quarantineFolder.'/';
  		$items = glob($path.'*.tmp');

  		return $items[sizeof($items) - 1];  	}
	 
	public function parseMessage($decodeMime = true,$partID = 1,&$newMessage = false,$block_external = false,&$blocked = false,$download = false, $source = false, $rawhtml = false, $passphrase = '', $purify = true)
	{
		$file = $this->getMessageFile();
		$ids = array(
			'sid'=>$_SESSION['SID'],
			'account_id'=>$_SESSION['EMAIL'],
			'folder_id'=>$this->folder->name,
			'item_id'=>base64_encode($this->itemID)		
		);
		 		$parser = new MailParse($file, $ids , $decodeMime, '', $partID, '', $purify);
		$parser->PassPhrase = $passphrase;
		$parser->block_external = $block_external;
		$parser->download = $download;
		$blocked = $parser->blocked;
		$structure = $parser->parse(false,$rawhtml);
		if($source){
			$fp = fopen($file,'rb+');
			$structure['source'] = fread($fp,1024000);
			fclose($fp);
			if(filesize($file) > 1024000){
				$structure['source'] .= CRLF.'--- Truncated ---';
			}
		}
		$structure['headers_plain'] = '';
		if($structure['info']['headers']) foreach($structure['info']['headers'] as $header => $value){
			if($value){ 
				if(is_array($value)){
					foreach($value as $hval){
						$structure['headers_plain'].=ucfirst($header).': '.$hval.CRLF;
					}
				}else{
					$structure['headers_plain'].=ucfirst($header).': '.$value.CRLF;
				}
			}
		}
		
		return $structure;
	} 
	
	private static function doAction($owner,$sender,$action,$cache = array(),$value = 0)
	{
		if (!$cache['api']){
			$cache['api'] = createobject("API");
		}
		switch($action){
			case QS_ADD:
				$result = $cache['api']->QuarantineSet($owner,$sender,$value);
			break;
			case QS_SPAM:
			case QS_ACCEPT:
			case QS_DELETE:
			case QS_DELIVER:
				$result = $cache['api']->QuarantineSet($owner,$sender,$action);
			break;
		}
		return $result;
	}
	
	public function getCertificate($structure = false, $passphrase = '')
	{
		return false;
	}
	
	public function autoCreateMessage($filename = null)
	{
		return true;
	}

	public function getLocalMessage($file = null){}
}
?>
