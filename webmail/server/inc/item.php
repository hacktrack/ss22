<?php

 
abstract class Item
{
	 
	 
	const FLAG_ANSWERED = 0x01;  
	const FLAG_DELETED  = 0x02;  
	const FLAG_DRAFT	= 0x04;  
	const FLAG_FLAGGED  = 0x08;  
	const FLAG_RECENT	= 0x10;  
	const FLAG_SEEN	 = 0x20;  
	
	const FLAG_FORWARDED = 0x40;  

	const FLAG_COMPLETED = 0x80;  
	 
	
	 
	 
	const ST_FLAG_HTMLBODY = 0x01;  
	const ST_FLAG_CACHED = 0x02;  
	 
	
	 
	 
	const NORMAL_PRIORITY = 3;  
	 
	
	 
	public $size;

	 
	public $date;

	 
	public $flags;

	 
	public $from;

	 
	public $to;

	 
	public $subject;
	
	 
	public $staticFlags;
	
	 
	public $priority;
	
	 
	public $color;
 	public $sMimeStatus;
  	public $hasAttachments;
  	public $flag_update;
  	public $wmclass;

	 
	protected function __construct($size, $date, $flags, $from, $to, $subject, 
				$staticFlags, $priority, $color, $sMimeStatus, $hasAttachments)
	{
		$this->size	= $size;
		$this->date	= $date;
		$this->from	= $from;
		$this->to	  = $to;
		$this->priority = $priority;
		$this->subject  = $subject;
		$this->flags    = $flags;
		$this->color    = $color; 
		$this->staticFlags = $staticFlags;
		$this->sMimeStatus = $sMimeStatus;
		$this->hasAttachments = $hasAttachments;
		
	}

	 
	protected static function create(&$folder, $aItem = array())
	{
	}

	 
	protected static function createFile(&$folder, $filePath)
	{
	}

	 
	abstract public function delete();

	 
	abstract protected function move($folder);

	 
	protected function setFlags($flags, $field)
	{
		$this->$field |= $flags;
		$this->flag_update = (int) $this->flag_update | 1;
	}

	 
	protected function unsetFlags($flags, $field)
	{
		$this->$field &= ~$flags;
		$this->flag_update |= 1;
	}
	
	 
	protected function checkSetFlags($flags, $field)
	{
		$curFlags = intval($this->$field);
		$flags = intval($flags);
		$set = $curFlags & $flags;
		if ($set === $flags)
			return false;
		else
			return true;
	}
	
	 
	protected function checkUnsetFlags($flags, $field)
	{
		$curFlags = intval($this->$field);
		$flags = intval($flags);
		$set = $curFlags & $flags;
		if ($set === 0) 
			return false;
		else
			return true;
	}
	
	 
	public function setFullFlags($flags, $field = 'flags')
	{
		$curFlags = intval($this->$field);
		$flags = intval($flags);
		$unsetFlags = $curFlags & ~$flags;
		$setFlags = $flags & ~$curFlags;

		if ($setFlags)
			$this->setFlags($setFlags, $field);
		if ($unsetFlags){
			$this->unsetFlags($unsetFlags, $field);
    }
  }
	
	 
	abstract public function getMessage();
	
	public function getTagList()
	{
		return array();
	}
	
	public function setTagList($tags, $updateTagList = true)
	{
		return false;
	}
	
	public function parseIceWarpServerRequest($val)
	{
		preg_match("#method(\s|\t)?+=(\s|\t)?(\")?([^\"^\s^\r^\n^;]{1,})(;)?(\")?(;)?#i",$val,$matches);
		$method = $matches[4];
		preg_match("#user(\s|\t)?+=(\s|\t)?(\")?([^\"^\s^\r^\n^;]{1,})(;)?(\")?(;)?#i",$val,$matches);
		$user = $matches[4];
		preg_match("#folder(\s|\t)?+=(\s|\t)?(\")?([^\"^\r^\n^;]{1,})(;)?(\")?(;)?#i",$val,$matches);
		$folder = $matches[4];
		preg_match("#right(\s|\t)?+=(\s|\t)?(\")?([^\"^\s^\r^\n^;]{1,})(;)?(\")?(;)?#i",$val,$matches);
		$rights = $matches[4];
		preg_match("#author(\s|\t)?+=(\s|\t)?(\")?([^\"^\s^\r^\n^;]{1,})(;)?(\")?(;)?#i",$val,$matches);
		$author = $matches[4];
		preg_match("#serverkey(\s|\t)?+=(\s|\t)?(\")?([^\"^\s^\r^\n^;]{1,})(;)?(\")?(;)?#i",$val,$matches);
		$serverID = $matches[4];
		preg_match("#folderdisplay(\s|\t)?+=(\s|\t)?(\")?([^\"^\s^\r^\n^;]{1,})(;)?(\")?(;)?#i",$val,$matches);
		$displayname = $matches[4];
		
		$result['method'] = $method;
		$result['user'] = $user;
		$result['folder'] = urldecode($folder);
		$result['rights'] = Folder::rightsToString(GroupWareFolder::decodeRights($rights));
		$result['author'] = $author;
		$result['server_id'] = $serverID;
		$result['displayname'] = $displayname;
		
		return $result;	
	}

	public function parseIceWarpTeamchatNotifications($val)
	{
		preg_match("#user(\s|\t)?+=(\s|\t)?(\")?([^\"^\s^\r^\n^;]{1,})(;)?(\")?(;)?#i",$val,$matches);
		$user = $matches[4];
		preg_match("#roomID(\s|\t)?+=(\s|\t)?(\")?([^\"^\s^\r^\n^;]{1,})(;)?(\")?(;)?#i",$val,$matches);
		$roomID = $matches[4];
		preg_match("#postID(\s|\t)?+=(\s|\t)?(\")?([^\"^\r^\n^;]{1,})(;)?(\")?(;)?#i",$val,$matches);
		$postID = $matches[4];
		preg_match("#serverkey(\s|\t)?+=(\s|\t)?(\")?([^\"^\r^\n^;]{1,})(;)?(\")?(;)?#i",$val,$matches);
		$serverID = $matches[4];
		
		$result['user'] = $user;
		$result['room_id'] = urldecode($roomID);
		$result['post_id'] = urldecode($postID);
		$result['server_id'] = urldecode($serverID);
		
		return $result;	
	}

	static public function checkAttachmentName($name)
	{
		$api = IceWarpAPI::instance();
		$c_os = $api->getProperty('C_OS');
		$regex = '/\//si';
		if($c_os == 0){
			$regex ='/(:|\/|\\|\*|\||")/si';
		}
		$result = true;
		if(preg_match($regex,$name,$matches)){
			$result = false;
		}
		return $result;
	}

	static public function fixAttachmentName($name)
	{
		return Tools::fixAttachmentName($name);
	}
}

 
?>
