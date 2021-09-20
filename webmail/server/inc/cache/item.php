<?php
 
abstract class CacheItem extends Item
{
	 
	public $folder;

	 
	public $itemID;

	 
	public $rid;

	public $size;
	public $body;
	public $cc;
	public $bcc;
	public $sms;
	public $sort_from;
	public $sort_to;
	public $sort_cc;
	public $sort_bcc;
	public $sort_sms;
	public $message_id;
	public $file;
	public $flag_update;
	public $source_folder_id;
	public $is_hidden;
	public $dummy_id;
	public $taglist;
	public $item_moved;
	public $x_icewarp_server_request;

	abstract public function getLocalMessage($file = null);
	abstract public function autoCreateMessage($filename = null);

	 
	public function __construct($folder, $itemID, $rid, $size, $date, 
						$flags, $from, $to, $subject, $staticFlags, $priority, $color,
						$sMimeStatus, $hasAttachments,$body='',$cc='',$bcc='',$sms='',$sfrom='',
						$sto='',$scc='',$sbcc ='',$ssms ='',$message_id = '',$item_moved = 0,$file = '',$flag_update = false,
						$source_folder_id = false,$is_hidden = false,$dummy_id = false,$taglist = '')
	{
		parent::__construct($size, $date, $flags, $from, $to, $subject, 
						$staticFlags, $priority, $color, $sMimeStatus, $hasAttachments);
		$this->itemID = $itemID;
		$this->rid = $rid;
		$this->size = $size;
		$this->body = $body;
		$this->cc = $cc;
		$this->bcc = $bcc;
		$this->sms = $sms;
		$this->sort_from = $sfrom;
		$this->sort_to = $sto;
		$this->sort_cc = $scc;
		$this->sort_bcc = $sbcc;
		$this->sort_sms = $ssms;
		$this->message_id = $message_id;
		$this->file = $file;
		$this->folder = $folder;
		$this->flag_update = $flag_update;
		$this->source_folder_id = $source_folder_id;
		$this->is_hidden = $is_hidden;
		$this->dummy_id = $dummy_id;
		$this->taglist = $taglist;
		$this->item_moved = $item_moved;
	}

	 

	 	protected static function create(&$folder, $item = array(), $cache = array(),$file = false, $message = false)
	{
		$account = $folder->account;
		if (!$cache['cache']){
			$cache['cache'] = Cache::instance($_SESSION['user']);
			$cache['cache']->transaction();
			$commit = true;
		}
		if($folder->itemClassName=='IMAPItem'){
			$item->uid = IMAP::fixID($item->uid);
		}
		$itemID = $cache['cache']->createItem(
			array(
				'folder_id'	=> $folder->folderID,
				'rid'		 => $item->uid,
				'size'		=> $item->size,
				'date'		=> $item->date,
				'flags'		=> $item->flags,
				'header_from' => $item->from,
				'header_to'	=> $item->to,
				'header_cc' => $item->cc,
				'header_bcc'	=> $item->bcc,
				'header_sms' => $item->sms,
				'subject'	 => $item->subject,
				'static_flags' => $item->staticFlags,
				'priority'	 => $item->priority,
				'color'	 => $item->color,
				'smime_status' => $item->sMimeStatus,
				'has_attachment' => $item->hasAttachments ? 'T' : 'F',
				'sort_from' => Tools::dbSortValue($item->from),
				'sort_to'	=> Tools::dbSortValue($item->to.$item->cc.$item->bcc.$item->sms),
				'sort_cc' => Tools::dbSortValue($item->cc),
				'sort_bcc'	=> Tools::dbSortValue($item->bcc),
				'sort_sms' => Tools::dbSortValue($item->sms),
				'message_id'=> $item->message_id,
				'taglist'=>$item->taglist,
				'item_moved'=>$item->item_moved
			),
			$cache
		);
		if($commit){
			$cache['cache']->commit();
		}
		 		if($folder->isRemote()){
			$cache['cache']->createMessage(
				$account->accountID,
				$folder->folderID,
				$itemID,
				$message,
				$file
			);
		}

		return $itemID;
	}
	
	 
	protected function edit($file, $message = false, $item = array(),$cache = array())
	{
		$folder  = $this->folder;
		$account = $folder->account;

		if (!$cache['cache'])
			$cache['cache'] = Cache::instance($_SESSION['user']);

		$this->editProperties($item, $cache);
		
		if($folder->isRemote()){
			if($file || $message){
				$cache['cache']->editMessage(
					$account->accountID,
					$folder->folderID,
					$this->itemID,
					$message,
					$file
				);
			}
		}
	}
	
	 
	private function editProperties($item, $cache = array()) {
		if (!isset($cache['cache'])) {
			$account = $this->folder->account;
			$cache['cache'] = Cache::instance($_SESSION['user']);
		}
		 		$allowedItems = array(
			'rid'		 => 'uid',
			'size'		=> 'size',
			'date'		=> 'date',
			'flags'		=> 'flags',
			'header_from' => 'from',
			'header_to'	=> 'to',
			'header_cc'	=> 'cc',
			'header_bcc'	=> 'bcc',
			'header_sms'	=> 'sms',
			'sort_to'	=> 'sort_to',
			'sort_cc'	=> 'sort_cc',
			'sort_bcc'	=> 'sort_bcc',
			'sort_sms'	=> 'sort_sms',
			'sort_from'	=> 'sort_from',
			'subject'	 => 'subject',
			'static_flags' => 'staticFlags',
			'priority'	 => 'priority',
			'color'	 => 'color',
			'smime_status' => 'sMimeStatus',
			'has_attachment' => 'hasAttachments',
			'flag_update'=>'flag_update',
			'source_folder_id'=>'source_folder_id',
			'is_hidden'=>'is_hidden',
			'dummy_id'=>'dummy_id',
			'taglist'=>'taglist',
			'item_moved'=>'item_moved'
		);
		$setItems = array();
		foreach ($allowedItems as $key => $value) {
			if (isset($item->$value) && $item->$value!='') {
				 $setItems[$key] = $item->$value;
				 $this->$value = $item->$value;
			}
		}
		
		 		if (isset($setItems['has_attachment']))
			$setItems['has_attachment'] = $setItems['has_attachment'] ? 'T' : 'F';

		$cache['cache']->updateItem($this->itemID, $setItems, $cache);
	}
	
	public function updateItem($fields)
	{
		$cache['cache'] = Cache::instance($_SESSION['user']);
		$cache['cache']->updateItem($this->itemID, $fields, $cache,'none',$this);
	}

	 
	public function delete($cache = array(),$delayed = false)
	{
		$folder  = $this->folder;
		$account = $folder->account;

		if (!$cache['cache']){
			$fCache = false;
			$cache['cache'] = Cache::instance($_SESSION['user']);
		} else {
			$fCache = true;
		}
		if(!$delayed){
			$cache['cache']->deleteItem(
				$account->accountID, 
				$folder->folderID, 
				$this->itemID,
				$fCache
			);
		}else{
			$cache['cache']->updateItem(
				$this->itemID,
				array(),
				array(),
				'delete',
				$this
			);
		}
		
		if($folder->isRemote()){
			
			$cache['cache']->deleteMessage(
				$account->accountID,
				$folder->folderID,
				$this->itemID
			);
		}
		return true;
	}

	 
	protected function move($folder,$cache = array(),$delayed = false)
	{
		$account = $folder->account;
		if (!$cache['cache']){
			$cache['cache'] = Cache::instance($_SESSION['user']);
		}
		$cache['cache']->updateItem(
			$this->itemID, 
			array(
				'folder_id' => $folder->folderID,
				'rid'		=> $this->rid
			), 
			$cache,
			$delayed?'move':'none',
			$this,
			$this->folder,
			$folder
		);
		if ($folder->isRemote()){
			$cache['cache']->moveMessage(
				$account->accountID,
				$this->folder->folderID,
				$this->itemID,
				$folder->folderID
			);
		}
		unset($this->folder);
		$this->folder = &$folder;
	}
	
	 
	protected function copy($folder, $message = '', $cache = array(),$copiedID = '',$oldID = '', $delayed = false)
	{
		$account = $folder->account;
		if(!$cache['cache']){
			$cache['cache'] = Cache::instance($_SESSION['user']);
		}
		$rid = $delayed?($copiedID?$copiedID:$this->rid):($oldID?$oldID:$this->rid);
		$this->rid = $rid;
		$itemID = $cache['cache']->createItem(
			array(
				'folder_id'	=> $folder->folderID,
				'rid'		 => $rid,
				'size'		=> $this->size,
				'date'		=> $this->date,
				'flags'		=> $this->flags,
				'header_from' => $this->from,
				'header_to'	=> $this->to,
				'header_cc'	=> $this->cc,
				'header_bcc'	=> $this->bcc,
				'header_sms'	=> $this->sms,
				'subject'	 => $this->subject,
				'static_flags' => $this->staticFlags,
				'priority'	 => $this->priority,
				'color'	 => $this->color,
				'smime_status' => $this->sMimeStatus,
				'has_attachment' => $this->hasAttachments ? 'T' : 'F',
				'sort_from' => Tools::dbSortValue($this->from),
				'sort_to'	=> Tools::dbSortValue($this->to.$this->cc.$this->bcc.$this->sms),
				'sort_cc' => Tools::dbSortValue($this->cc),
				'sort_bcc'	=> Tools::dbSortValue($this->bcc),
				'sort_sms' => Tools::dbSortValue($this->sms),
				'message_id'=> $this->message_id,
				'source_folder_id'=>$delayed?$this->folder->folderID:0,
				'flag_update'=>$delayed?($this->flag_update | 8):0,
				'taglist'=>$this->taglist,
				'item_moved'=>$this->item_moved
			),
			$cache
		);
		if ($folder->isRemote()){
			$cache['cache']->createMessage(
				$account->accountID,
				$folder->folderID,
				$itemID,
				$message
			);
		}
	}

	 
	protected function setFlags($flags, $field = 'flags')
	{

		$folder  = $this->folder;
		$account = $folder->account;
		
		switch ($field) {
		case 'flags':
			$params = array('flags' => $this->flags | $flags);
			break;
		
		case 'staticFlags':
			$params = array('static_flags' => $this->staticFlags | $flags);
			break;
		
		default:
			throw new Exc('flags_unknown_field');		}
		$cache = Cache::instance($_SESSION['user']);
		$cache->updateItem($this->itemID, $params, array(),'flags', $this);

		parent::setFlags($flags, $field);
	}

	 
	protected function unsetFlags($flags, $field = 'flags')
	{
		$folder  = $this->folder;
		$account = $folder->account;
		
		switch (strtolower($field)) {
		case 'flags':
			$params = array('flags' => $this->flags & ~$flags);
			break;
		
		case 'staticflags':
			$params = array('static_flags' => $this->staticFlags & ~$flags);
			break;
		
		default:
			throw new Exc('flags_unknown_field');
		}

		$cache = Cache::instance($_SESSION['user']);
		$cache->updateItem($this->itemID, $params, array(),'flags',$this);

		parent::unsetFlags($flags, $field);
	}
	
		 
	public function changeColor($color,$updateCache = true)
	{
		$folder  = $this->folder;
		$account = $folder->account;
		
		 		if (!$color)
			$color = null;
			
		if($updateCache){
			$cache = Cache::instance($_SESSION['user']);
			$cache->updateItem($this->itemID, array('color' => $color), array(), 'flags', $this);
		}
		$this->color = $color;
		
		 		if ($color !== null && $color != 'Z'){
			$flags = Item::FLAG_FLAGGED;
			if($color == 'Y'){
				$flags|=Item::FLAG_COMPLETED;
			}else{
				$this->unsetFlags(Item::FLAG_COMPLETED);	
			}
			$this->setFlags($flags);
		} else {
			$this->unsetFlags(Item::FLAG_FLAGGED);
		}
	}


	 
	public function getMessage()
	{
		$folder  = $this->folder;
		$account = $folder->account;

		$cache = Cache::instance($_SESSION['user']);
		return $cache->getMessage($account->accountID,
								  $folder->folderID,
								  $this->itemID);
	}
	
	 
	public function getMessageFile()
	{
		$folder  = $this->folder;
		$account = $folder->account;

		$cache = Cache::instance($_SESSION['user']);
		 		if($this->folder->isLocal()){
			$messageFile = $this->getLocalMessage();
			if(!file_exists($messageFile)){
				 				log_buffer("Invalid message file : ".$messageFile,"EXTENDED");
				throw new Exc('invalid_msg_file');
			}
			return $messageFile;
		}

		 		return $cache->getMessageFile(
			$cache->getMessageDir(
				$account->accountID, 
				$folder->folderID
			),
			$this->itemID
		);
	}

	 
	protected function createMessage($message)
	{
		if($this->folder->isLocal()){
			return true;
		}
		$folder  = $this->folder;
		$account = $folder->account;

		$cache = Cache::instance($_SESSION['user']);
		$cache->createMessage(
			$account->accountID,
			$folder->folderID,
			$this->itemID,
			$message
		);
	}
	
	 
	public function parseMessage($decodeMime = true,$partID = 1,&$newMessage = false,$block_external = false,&$blocked = false,$download = false, $source = false, $rawhtml = false, $passphrase =  '', $purify = true)
	{
		$ids = array();
		$ids['account_id'] = $this->folder->account->accountID;
		$ids['folder_id'] = $this->folder->name;
		$ids['item_id'] = $this->itemID;
		$ids['sid'] = session_id();

		$cache = Cache::instance($_SESSION['user']);
		$filename =  $this->getMessageFile();
		if(!file_exists($filename)){
			$this->autoCreateMessage($filename);
		}
		 		log_buffer("MailParse ( ItemID ) : ".$this->itemID,"EXTENDED");
		log_buffer("MailParse ( ParseFile ) : ".$filename,"EXTENDED");
		
		$parser = new MailParse($filename, $ids, $decodeMime,'',$partID, '', $purify);
		$parser->PassPhrase = $passphrase;
		$parser->block_external = $block_external;
		$parser->download = $download;
		$structure = $parser->parse(false, $rawhtml, true);
		$blocked = $parser->blocked;

		$structure['headers_plain'] = '';
		if($source){
			$structure['source'] = $parser->getPartSource($partID, 1024000);
		}
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
		$updateParsedInfo = false;
		if(!$partID || $partID=='1'){
			if(!($this->staticFlags & Item::ST_FLAG_CACHED)){
				$updateParsedInfo = true;
			}
			
			$stFlags = self::getFlagsFromStructure( $message, $structure, true,$filename, $passphrase);
			if($this->sMimeStatus!=$stFlags['smime_status']){
				$updateParsedInfo = true;
			}
			if(isset($structure['headers']['x-icewarp-smartattach'])){
				$stFlags['has_attachment'] = true;
			}
			$this->setFullFlags($stFlags['flags'], 'staticFlags');
		}		
			
		 		if ($updateParsedInfo) {
			$item = new stdClass();
			$item->hasAttachments = $stFlags['has_attachment'];
			$item->sMimeStatus = $stFlags['smime_status'];
			$item->from = $structure['headers']['from'];
			$item->sort_from = Tools::dbSortValue($item->from);
			$item->to = $structure['headers']['to'];

			if(isset($structure['headers']['cc']) && $cc = $structure['headers']['cc']){
				$item->cc = $cc;
				$item->sort_cc = Tools::dbSortValue($cc);
			}else{
				$item->cc = '';
			}
			if(isset($structure['headers']['bcc']) && $bcc = $structure['headers']['bcc']){
				$item->bcc = $bcc;
				$item->sort_bcc = Tools::dbSortValue($bcc);
			}else{
				$item->bcc = '';
			}
			if(isset($structure['headers']['sms']) && $sms = $structure['headers']['sms']){
				$item->sms = $sms;
				$item->sort_sms = Tools::dbSortValue($sms);
			}else{
				$item->sms = '';
			}
			$item->sort_to = Tools::dbSortValue($item->to.$item->cc.$item->bcc.$item->sms);
			$item->priority = intval($structure['headers']['priority']);
			$item->subject = $structure['headers']['subject'];
			$item->message_id = $structure['headers']['message-id'];

			$newMessage = true;
			$this->editProperties($item);
		}

		return $structure;
	}

	
	 
	protected static function getFlagsFromStructure(&$message, &$structure, $cached,$file = false,$passphrase = '')
	{
		$result = array();
		$result['flags'] = 0;
		$parser = new MailParse('',array(),false,'','1','Dummy');
		$parser->PassPhrase = $passphrase;

		if ($parser->hasAttachments($structure)){

			$result['has_attachment'] = true;
		}else{
			$result['has_attachment'] = false;

		}
		if ($cached){
			$result['flags'] |= Item::ST_FLAG_CACHED;
		}
		
		if ($parser->hasHTMLBody($structure)){
			$result['flags'] |= Item::ST_FLAG_HTMLBODY;
		}
		;
		$result['smime_status'] = $parser->sMimeStatus($structure,$message,$file,$cert);
		if($cert && !isset($structure['certificate'])){
			$structure['certificate'] = $cert;
		}					
		return $result;
	}
	
	 
	static protected function getStaticFlags(&$message, $cached = true,$file = false, $passphrase ='')
	{

		if($file){
			$parser = new MailParse($file);
		}else{
			$parser = new MailParse(false,false,false,false,'1',$message);
		}
		$parser->PassPhrase = $passphrase;
		$structure = $parser->parse();
		return self::getFlagsFromStructure( $message, $structure, $cached,$file, $passphrase);
	}
	 
	public function sendData()
	{
		$file = $this->getMessageFile();
		if(!file_exists($file)){
			$this->autoCreateMessage($file);
		}
		slToolsFilesystem::sendFileHeaders($this->getSubjectFileName('.eml'), filesize($file), 'message/rfc822');
		$_SESSION['user']->closeSession();
		$fp = fopen($file,'rb');
		while ($buffer = fread($fp,65536)){
			echo $buffer;
		}
		fclose($fp);
	}
	
	public function getDataFile(&$info)
	{
		$file = $this->getMessageFile();
		if(!file_exists($file)){
			$this->autoCreateMessage($file);
		}
		$info['name'] = self::getSubjectFileName('.eml');
		$info['size'] = filesize($file);
		$info['type'] = 'message/rfc822';
		$info['file'] = $file;
		return $file;
	}
	
	 
	public function sendAttachment($partID,$startID,$ids = array(),$sForceName = false,$resize = false,$atttype='',$skin = false,$passphrase = '', $return = false)
	{
		$file = $this->getMessageFile();
		if(!file_exists($file)){
			$this->autoCreateMessage($file);
		}
		if(empty($ids)){
			$ids = array(
				'account_id'=>$this->folder->account->accountID,
				'folder_id'=>$this->folder->name,
				'item_id'=>$this->itemID,
				'sid'=>$_SESSION['SID']
			);
		}
		$mailparse = new MailParse($file,$ids,true,'',$startID);
		$mailparse->PassPhrase = $passphrase;
		$_SESSION['user']->closeSession();	
		if($return) return $mailparse->getPart($partID,$params);
		$mailparse->sendPart($partID,$sForceName,$resize);
	}
	
	public function sendCID($cid,$startID,$ids = array(),$sForceName = false,$resize = false)
	{
		$file = $this->getMessageFile();
		if(!file_exists($file)){
			$this->autoCreateMessage($file);
		}
		if(empty($ids)){
			$ids = array(
				'account_id'=>$this->folder->account->accountID,
				'folder_id'=>$this->folder->name,
				'item_id'=>$this->itemID,
				'sid'=>$_SESSION['SID']
			);
		}

		$_SESSION['user']->closeSession();

		$mailparse = new MailParse($file,$ids,true,'',$startID);
		$mailparse->sendCID($cid,$sForceName,$resize,$startID);
		 	}
	
	public function getAttachmentDataFileCID($cid,&$info = array())
	{
		$file =  $this->getMessageFile();
		$ids = array(
				'account_id'=>$this->folder->account->accountID,
				'folder_id'=>$this->folder->name,
				'item_id'=>$this->itemID,
				'sid'=>$_SESSION['SID']
		);
		$mailparse = new MailParse($file,$ids,true);
		$attachmentFile = $mailparse->getPartFileCID($cid,$params);
		
		$info['mimetype'] = $params['info']['content-type'];
		$info['name'] = MailParse::getAttachmentName($params['info'], null);
		$info['encoding'] = $params['info']['transfer-encoding'];
		return $attachmentFile;
	}
	

  	public function getSubjectFileName($ext='',$part_id = '') 
  	{
		  return self::getSubjectFileNameStatic($this->subject,$this->date,$ext,$part_id);
	}

	public static function getSubjectFileNameStatic($subject,$date = '',$ext = '', $part_id = '')
	{
		   		  $prefix=substr($subject,0,80).$part_id;
		  if($date){
		  	$fdate=date('YmdHis', $date);
		  }else{
			$fdate ='';
		  }
	
		   		  return trim(str_replace(array('/','\\',':','*','?','"','|','<','>','='), array(), $prefix . ($prefix?' - ':'') . $fdate . $ext));
		
	}
	
	public function getAllAttachments($start_part_id = '1')
	{
		if(!$start_part_id){
			$start_part_id = '1';
		}
		$ids = array(
				'account_id'=>$this->folder->account->accountID,
				'folder_id'=>$this->folder->name,
				'item_id'=>$this->itemID,
				'sid'=>$_SESSION['SID']
		);
	    $parser = new MailParse($this->getMessageFile(),$ids,true);
	    $parser->startPart = $start_part_id;
	    $structure = $parser->parse();
	    $result = $structure['attachments'];
	    if($result) foreach($result as $key => $attachment){
	      $content = $parser->getPart($attachment['part_id'],$params);	
	      if(preg_match('/(?P<url>https?\:\/\/.*\/teamchatapi\/.*)/', $content, $matches) && filter_var($matches['url'], FILTER_VALIDATE_URL) && ($urlContent = slToolsIcewarp::get_curl_file_contents($matches['url']))){
		 $content = $urlContent;
	      }
	      $result[$key]['file_content'] = $content;
	      if(($pos = strpos($attachment['part_id'],'|IMIP'))!==false){
	      	$imip_container = substr($attachment['part_id'],0,$pos);
	      }
	    }
	    if($imip_container && $result){
	    	foreach($result as $key => $att){
	    		if($att['part_id']==$imip_container){
	    			unset($result[$key]);
	    		}
	    	}
	    }	
	    
    return $result;
  }
  
  public function getAllAttachmentFiles($start_part_id = '1')
  {
  	$ids = array(
		'account_id'=>$this->folder->account->accountID,
		'folder_id'=>$this->folder->name,
		'item_id'=>$this->itemID,
		'sid'=>$_SESSION['SID']
	);
    $parser = new MailParse($this->getMessageFile(),$ids,true);
    $parser->startPart = $start_part_id;
    $structure = $parser->parse();
    $result = $structure['attachments'];
    if($result) foreach($result as $key => $attachment){
      $file = $parser->getPartFile($attachment['part_id'],$params);
      $result[$key]['file'] = $file;
      if(($pos = strpos($attachment['part_id'],'|IMIP'))!==false){
      	$imip_container = substr($attachment['part_id'],0,$pos);
      }
    }
    if($imip_container && $result){
    	foreach($result as $key => $att){
    		if($att['part_id']==$imip_container){
    			unset($result[$key]);
    		}
    	}
    }
    return $result;
  }

 
	public function getItemData(&$info = array(),$passphrase = '')
	{
		static $attachCount;
		$info['mimetype'] = 'message/rfc822';
		$info['name'] = 'message_'.((string) ++$attachCount).".eml";
		$message = $this->getMessage();
		if($this->sMimeStatus > 1){
			$crt = '';
			slSystem::import('mail/smime');
			$smime = new slSMime();
			$smime->setCertificateList(Storage::getPersonalCertificates());
			$smime->setTempDir(User::getDir());
			$smime->decodeMessage($message,false,$crt,$isOutlook,$expired,$this->date,$passphrase);
		}
		return $message;
	}

	public function getAttachmentData($partID,&$info = array())
	{
		$file =  $this->getMessageFile();
		
		if(($pos = strpos($partID,'/')) !== false) {
			$att_id = substr($partID,$pos+1);
			$part_id = substr($partID,0,$pos);
		}else{
			$att_id = $partID;
			$part_id = 1;
		}
		if(($pos = strpos($partID,'|')) !== false) {
			$att_id = substr($partID,$pos+1);
			$part_id = substr($partID,0,$pos);
		}else{
			$att_id = $partID;
			$part_id = 1;
		}
		$ids = array(
			'account_id'=>$this->folder->account->accountID,
			'folder_id'=>$this->folder->folderID,
			'item_id'=>$this->itemID,
			'sid'=>$_SESSION['SID']
		);
		
		$mailparse = new MailParse($file,$ids,true,(!$part_id || $part_id==1)?'':$part_id,$part_id);
		$params=array();
		$attachment = $mailparse->getPart($att_id,$params);
		if(empty($attachment)){
			$attachment = $this->getSmartAttachmentData($partID, $params);
		}
		$info['mimetype'] = $params['info']['content-type'];
		$info['name'] = MailParse::getAttachmentName($params['info'],$att_id);
		$info['encoding'] = $params['info']['transfer-encoding'];
		return $attachment;
	}

	protected function getSmartAttachmentData($partID, array & $params)
	{
		if(!isset($params['info']['headers']['x-icewarp-smartattach'])) return '';
		$parameters = ['account_id' => $this->folder->account->accountID, 'folder_id' => $this->folder->name, 'item_id' => $this->itemID, 'sid' => $_SESSION['SID']];
		return $this->sendAttachment($partID, null, $parameters, false, false, '', false, '', true);
	}
  
	public function getAttachmentDataFile($partID,&$info = array())
	{
		$file =  $this->getMessageFile();
		if(($pos = strpos($partID,'/')) !== false) {
			$att_id = substr($partID,$pos+1);
			$part_id = substr($partID,0,$pos);
		}else{
			$att_id = $partID;
			$part_id = 1;
		}
		$ids = array(
			'account_id'=>$this->folder->account->accountID,
			'folder_id'=>$this->folder->folderID,
			'item_id'=>$this->itemID,
			'sid'=>$_SESSION['SID']
		);
		$mailparse = new MailParse($file,$ids,true,(!$part_id || $part_id==1)?'':$part_id,$part_id);
		$mailparse->startPart = $part_id;

		$attachmentFile = $mailparse->getPartFile($att_id,$params);
		$info['mimetype'] = $params['info']['content-type'];
		$info['name'] = MailParse::getAttachmentName($params['info'],$att_id);
		$info['encoding'] = $params['info']['transfer-encoding'];
		return $attachmentFile;
	}

	public function initInvitation($partID,&$oIMIP)
	{
		 		$sVersit = $this->getAttachmentData($partID,$info);
		
		 		$oIMIP = iMIP::load($this->folder->account->gwAccount);
		$oInvitation = $oIMIP->loadInvitation($sVersit);  
		
		return $oInvitation;
	}

	public function acceptInvitation($partID,$sFolder,$owner = false, $inPublicFolder = false)
	{
		$oInvitation = $this->initInvitation($partID,$oIMIP);
		$aFrom = MailParse::parseAddresses($this->from);
		$sFolder = $inPublicFolder?'group':$sFolder;
		$sReply = $oInvitation->accept($sFolder,$owner,$this->getMessageFile(),$aFrom[0]['address']);
		$sReplyXML = $oIMIP->convertVersit($sReply);
		$aAttachment = $oIMIP->createAttachment($sReply,'', 'REPLY');
		
		$aAttachment['xml'] = $sReplyXML;
		
		return $aAttachment;
	}

	public function declineInvitation($partID,$owner = false, $reason = '')
	{
		$oInvitation = $this->initInvitation($partID,$oIMIP);  
		
		$sReply = $oInvitation->decline($owner, $reason);
		
		$aAttachment = $oIMIP->createAttachment($sReply,'', 'REPLY');
		$aAttachment['xml'] = $oIMIP->convertVersit($sReply);
		
		return $aAttachment;
	}

	public function tentativeInvitation($partID,$owner = false)
	{

		$oInvitation = $this->initInvitation($partID,$oIMIP);
		$aFrom = MailParse::parseAddresses($this->from);
		$sReply = $oInvitation->tentative($owner,$this->getMessageFile(),$aFrom[0]['address']);
		
		$sReplyXML = $oIMIP->convertVersit($sReply);
		$aAttachment = $oIMIP->createAttachment($sReply,'', 'REPLY');
		
		$aAttachment['xml'] = $sReplyXML;
		
		return $aAttachment;
	}
	
	public function proposeInvitation($partID,$owner = false, $gwparams = '')
	{

		$oInvitation = $this->initInvitation($partID,$oIMIP);
		$aFrom = MailParse::parseAddresses($this->from);
		$sReply = $oInvitation->propose($owner,$this->getMessageFile(),$aFrom[0]['address'], $gwparams);
		
		$sReplyXML = $oIMIP->convertVersit($sReply);
		$xml = slToolsXML::loadString($sReplyXML);
		if(strval($xml->xpath('X-SERVER-NONEDITABLE')[0])=='1'){
			throw new Exc('item_edit_groupchat_attendee');
		}
		$aAttachment = $oIMIP->createAttachment($sReply,'', 'REPLY');
		
		$aAttachment['xml'] = $sReplyXML;
		
		return $aAttachment;
	}
	public function declineCounterInvitation($partID,$owner = false, $reason = '')
	{
		$oInvitation = $this->initInvitation($partID,$oIMIP);
		$sReply = $oInvitation->declineCounter($this->from, $owner, $reason);
		$aAttachment = $oIMIP->createAttachment($sReply,'', 'REPLY');
		
		$aAttachment['xml'] = $oIMIP->convertVersit($sReply);
		
		return $aAttachment;
	}

	public function acceptCounterInvitation($partID,$sFolder,$owner = false,$inPublicRoot = false)
	{
		$oInvitation = $this->initInvitation($partID,$oIMIP);
		$aFrom = MailParse::parseAddresses($this->from);
		$sFolder = $inPublicRoot?'group':$sFolder;
		$sReply = $oInvitation->acceptCounter($sFolder,$owner,$this->getMessageFile(),$aFrom[0]['address']);
		$aAttachment = $oIMIP->createAttachment($sReply,'', 'REPLY');
		
		$aAttachment['xml'] = $oIMIP->convertVersit($sReply);
		return $aAttachment;
	}
	
	public function processInvitation($partID)
	{
		$oInvitation = $this->initInvitation($partID,$oIMIP);
		return $oInvitation->process();
	}

	public function getCertificate($structure = false, $passphrase = '')
	{
		$file = $this->getMessageFile();
		if($structure === false){
			$structure = $this->parseMessage(true,'1',$newMessage,false,$blocked,false,false,false,$passphrase);
		}
		if(isset($structure['certificate']) && $structure['certificate']){
			return $structure['certificate'];
		}else{
			$info = $this->getFlagsFromStructure($message,$structure,true,$file,$passphrase);
			if(isset($structure['certificate']) && $structure['certificate']){
				return $structure['certificate'];
			}else{
				return false;
			}
		}
	}
	
	public function subscribe()
	{
		
		$this->getSubscriptionInfo();
		$account = $this->x_icewarp_server_request['user'];
		$folder =$this->x_icewarp_server_request['folder'];
		$user = &$_SESSION['user'];
		$shared_prefix = $_SESSION['SHARED_PREFIX'];
		$oPrimaryAccount = $user->getAccount($_SESSION['EMAIL']);
		$subscriptionAccount[] = $account;
		$gwPresence = $oPrimaryAccount->gwAccount && $oPrimaryAccount->gwAccount->bLogged;
		$imapPresence = $oPrimaryAccount->protocol=='IMAP';
		
		$groupWareSubscribed = false;
		$imapSubscribed = false;
		if($folder){
			$folder = '/'.$folder;
			if($gwPresence){
				try{
					$oPrimaryAccount->gwAccount->subscribeFolder($shared_prefix.$account.$folder);
					$groupWareSubscribed = true;
				}catch(Exc $e){
				}
				if($imapPresence){
					try{
						$oPrimaryAccount->subscribeFolder($shared_prefix.$account.$folder);
						$imapSubscribed = true;
					}catch(Exc $e){
						
					}	
				}
			}
		}else{
			
			if($gwPresence){
				try{
					$oPrimaryAccount->gwAccount->subscribe($subscriptionAccount);
					$groupWareSubscribed = true;
				}catch(Exc $e){

				}
			}
			if($imapPresence){
				try{
					$oPrimaryAccount->subscribe($subscriptionAccount);
					$imapSubscribed = true;
				}catch(Exc $e){
					
				}
			}
		}
		if(!$groupWareSubscribed && !$imapSubscribed){
			throw new Exc('subscribe');
		}		
	}
	
	public function unsubscribe()
	{
		$info = $this->getSubscriptionInfo();
		$account = $this->x_icewarp_server_request['user'];
		$folder =$this->x_icewarp_server_request['folder'];
		$user = &$_SESSION['user'];
		$shared_prefix = $_SESSION['SHARED_PREFIX'];
		$oPrimaryAccount = $user->getAccount($_SESSION['EMAIL']);
		$subscriptionAccount[] = $account;
		$gwPresence = $oPrimaryAccount->gwAccount && $oPrimaryAccount->gwAccount->bLogged;
		$imapPresence = $oPrimaryAccount->protocol=='IMAP';
		if($folder){
			$folder = '/'.$folder;
			if($gwPresence){
				try{
					$oPrimaryAccount->gwAccount->unsubscribeFolder($shared_prefix.$account.$folder);
				}catch(Exc $e){
					if($imapPresence){
						$oPrimaryAccount->unsubscribeFolder($shared_prefix.$account.$folder);
					}
				}
			}
		}else{
			if($imapPresence){
				$oPrimaryAccount->unsubscribe($subscriptionAccount);
			}
			if($gwPresence){
				$oPrimaryAccount->gwAccount->unsubscribe($subscriptionAccount);
			}
		}
	}
	
	public function getSubscriptionInfo()
	{
		$message = $this->parseMessage();  		if (isset($message['headers']['x-icewarp-server-request'])) {
			$val = $message['headers']['x-icewarp-server-request'];
			preg_match(
				"#method(\s|\t)?+=(\s|\t)?(\")?([^\"^\s^\r^\n^;]{1,})(;)?(\")?(;)?#i",
				$val,
				$matches
			);
			$method = $matches[4];
			preg_match(
				"#user(\s|\t)?+=(\s|\t)?(\")?([^\"^\s^\r^\n^;]{1,})(;)?(\")?(;)?#i",
				$val,
				$matches
			);
			$user = $matches[4];
			preg_match(
				"#folder(\s|\t)?+=(\s|\t)?(\")?([^\"^\r^\n^;]{1,})(;)?(\")?(;)?#i",
				$val,
				$matches
			);
			$folder = $matches[4];
			preg_match(
				"#right(\s|\t)?+=(\s|\t)?(\")?([^\"^\s^\r^\n^;]{1,})(;)?(\")?(;)?#i",
				$val,
				$matches
			);
			$rights = $matches[4];
			$rights = Folder::rightsToString(GroupWareFolder::decodeRights($rights));
			$this->x_icewarp_server_request['method'] = $method;
			$this->x_icewarp_server_request['user'] = $user;
			$this->x_icewarp_server_request['folder'] = $folder=='*'?'':$folder;
			$this->x_icewarp_server_request['folder'] = urldecode($folder);
			$this->x_icewarp_server_request['rights'] = $rights;
		}
	}
	
	public function importAttachment($att_id, $delete_after_import = false)
	{
		$info = array();
		$vcard = $this->getAttachmentData($att_id,$info);
		
		$gwAPI = $this->folder->account->gwAccount->gwAPI;
		if(empty($gwAPI) && !$this->folder->account->primary){
			foreach ($this->folder->account->user->getAccounts() as $account) {
				if($account->primary){
					$gwAPI = $account->gwAccount->gwAPI;
					break;
				}
			}
		}

		if(empty($vcard) || empty($gwAPI) || !$gwAPI->IsConnected()){
			throw new Exc('groupware_init_failed');
		}

		switch($info['mimetype']){
			case 'text/directory':
			case 'text/vcard':
			case 'text/x-vcard':
				$mimetype = 'vcard';
				$type = 'C';
				break;
			case 'text/x-vcalendar':
			case 'text/calendar':
			default:
				$sXML = $gwAPI->FunctionCall("ConvertVersit",$gwAPI->sessid,$vcard,'XML;FILTER=ATTACH');
				$oXML = simplexml_load_string($sXML);
				if($oXML === false) $oXML = Tools::fixXML($sXML);
				if($oXML === false) throw new Exc('import_failed');
				$mimetype = 'vcalendar';
				if($oXML->VEVENT){
					$type = 'E';
				}elseif($oXML->VTODO){
					$type = 'T';
				}elseif($oXML->VNOTE){
					$type = 'N';
				}elseif($oXML->VJOURNAL){
					$type = 'J';
				}else{
					$name = $oXML->getName();
					if($name != 'VNOTE'){
                        throw new Exc('item_invalid_type');
					}
                    $type = 'N';
				}
			break;
		}
		$fdrType = 'gw';
		$oAccount = $_SESSION['user']->getAccount($_SESSION['EMAIL']);
		$sFolderName = $_SESSION['user']->getDefaultFolder($type);
		if($delete_after_import){
			try{
				$oFolder = $oAccount->getFolder('__@@GWTRASH@@__', $fdrType);
				$sFolderName = '__@@GWTRASH@@__';
			}catch(Exc $e){
				 			}
		}
		try{
			if(!is_object($oFolder)){
				$oFolder = $oAccount->getFolder($sFolderName, $fdrType);
			}
		}catch(Exc $e){
			throw new Exc('default_folder_missing',$type);
		}
		
		$oItem = $oFolder->importItem($mimetype,$vcard, $delete_after_import);
		$result['folder'] = $oFolder;
		$result['item'] = $oItem;
		if($delete_after_import){
			$oItem->delete(false, false, '', true, true, true);
		}
		return $result;
	}
}

 
?>
