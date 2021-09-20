<?php

class RSSItem extends CacheItem
{
	public $wmclass;

	 
	public function __construct($folder, $itemID, $rid,$size, $date, $flags, 
								$from, $to, $subject, $staticFlags, $priority, $color,
								$sMimeStatus, $hasAttachments, $sBody = '')
	{
		
  		parent::__construct($folder, $itemID, $rid, $size, $date, $flags, 
							$from, $to, $subject, $staticFlags, $priority, $color,
							$sMimeStatus, $hasAttachments);	
      $this->wmclass = 'R';
      $this->body = $sBody;
  }

	 
	public static function decode(&$item)
	{
	  

    $item->color   = 'Z';
 
		$item->priority  = isset($item->priority) ? intval($item->priority) : Item::NORMAL_PRIORITY;
		$item->staticFlags = isset($staticFlags['flags']) ? $staticFlags['flags'] : 0;
		
    $item->size = 0;
    $item->flags = 0;
    $item->sMimeStatus = 0;
    $item->date = strtotime($item->date);
		if(!$item->date) $item->date = time();

  } 
	
	 
	public function delete($cache = array(), $delayed = false)
	{
		$folder  = &$this->folder;
		$account = &$folder->account;

		 
     		 
		 
		parent::setFlags(Item::FLAG_DELETED,'flags');
	}
	
   
	public function markAsRead()
	{
	   parent::setFlags(32,'flags');
  }
  
   
	public function markAsUnread()
	{
	   parent::setFlags(0,'flags');
  }
    	
	 
	public function setFlags($flags, $field = 'flags')
	{
	 
		 
		parent::setFlags($flags, $field);
  }
	 
	protected function unsetFlags($flags, $field = 'flags')
	{
		 
		parent::unsetFlags($flags, $field);
	}
	
	 
	public function autoCreateMessage($filename = null)
	{
		$folder  = $this->folder;
		$account = $folder->account;

     
		if (parent::getMessage() === false) {

			 
			$rss = RSS::instance($account);
			
			$dir = dirname($filename);
			
			if(!is_dir($dir)){
				slSystem::import('tools/filesystem');
				slToolsFilesystem::mkdir_r($dir, 0777, true);
			}
       			$rss->saveMessageToFile($folder->name, $this->rid, $filename);

      $fp = fopen($filename,'ab+');
      
      fseek($fp,-4,SEEK_END);
      $end = fread($fp,4);
      
             if ($end!=CRLF.CRLF)
        fwrite($fp,CRLF.CRLF);
      
      fclose($fp);

			$this->sync();
		} else {
			 			$this->setFlags(Item::FLAG_SEEN);
		}
		return true;
	}

	private function sync(){}
	
  public function getHTML(&$aItem,&$base,$htmlspecialchars = true)
  {
		$aHTML = array();
		$aHTML['title'] = $this->subject;
		$aHTML['href'] = $this->to;
		$aHTML['description'] = slToolsString::purifyHTML($this->body, true, false);
		$aURL = parse_url($this->to);
		$aItem['base'] = $aURL['host'];
		$sHTML = template('inc/templates/rss.tpl',$aHTML);
		if($htmlspecialchars){
			$sHTML = slToolsPHP::htmlspecialchars($sHTML);
		}
		return $sHTML;
  }
  
  public function getText()
  {
  	$html = $this->getHTML($aItem,$base,false);
  	slSystem::import('tools/string');
  	$text = slToolsString::removeHTML($html);
  	return $text;
  }

	public function getLocalMessage($file = null){}
}

?>
