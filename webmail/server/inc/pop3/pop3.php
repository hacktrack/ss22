<?php
 

class POP3
{
  public $num_msg;
  
  private $Socket;
  private $Line;
  private $Status;
  private static $instance;

	public $bConnected;
	public $isLogged;
	public $aList;
	public $account;

    private function __construct($server, $port = 110,$username,$password,$account = false)
  {
    $this->account = $account;
    if($port=='995'){
    	if(strpos($server,'ssl://')===false){
    		$server = 'ssl://'.$server;
    	}
    }
    $this->bConnected = $this->open($server, $port);
    $this->isLogged = $this->login($username,$password);
  }

     
	public static function instance($account) 
  {
    $email = $account->accountID;
    if (!isset(self::$instance[$email])) {
      self::$instance[$email] = new POP3($account->server,$account->port,$account->username,$account->getPassword(),$account);
    }
    
    return self::$instance[$email];
  }

  public function msgNumber($uid){
    if (!$this->aList) $this->getItemsID();
    return $this->aList[$uid]->nr;
  }

     
  public function createMessage($folder,$message,$file = false, &$uid = false){
    throw new Exc('pop3_create_message_support','pop3_create_message_support');
  }
    
  public function getMailboxes(){
  	$mailbox = new stdClass();
    $mailbox->name = 'INBOX';
    $mailbox->attributes = 63;
    $mailbox->delimiter = '/';
    $mailbox->rights = 63;
    
    $mailboxes[] = $mailbox;
    return $mailboxes;
  }
  
  public function getItems($mailbox = false,$sequence = "1:*"){
    if (!$this->aList) $this->getItemsID();
    foreach($this->aList as $uid => $item){
      $itm = $this->getItemDetails($mailbox,$uid);
      $list[$itm->uid] = $itm;    
    }
    return $list;
  }

  public function getItemsID($mailbox = false,$sequence = "1:*"){
    
    
    for($i=1;$i<=$this->num_msg;$i++){
    	$itm = new stdClass();
    	$itm->uid = $this->uidl($i);
    	$itm->nr = $i;
    	$this->aList[$itm->uid] = $itm;
    	unset($itm);
    }
    return $this->aList;
  }
  
  public function getItem($mailbox,$uid){
    return $this->getItemDetails($mailbox,$uid);	
  }
  
  public function getItemHeaders($mailbox,$uid){
    return $this->getHeaders($mailbox,$uid);	
  } 
   
  public function getItemDetails($mailbox,$uid){
      $message = $this->getMessage($mailbox, $uid);
      return $this->getMessageItem($message, $uid);
  }
  
	public function getMessage($mailbox, $uid){
		$nr = $this->msgNumber($uid);
		$message = $this->retr($nr);
		return $message;
	}
  public function getBody($mailbox,$uid){
      $nr = $this->msgNumber($uid);
      $body = $this->retr($nr);  
      $body = substr(strtr($body,CRLF.CRLF),0,DB_BODY_LIMIT);
      return $body; 
  }
  public function getHeaders($mailbox, $uid){
      $nr = $this->msgNumber($uid);

      $headers = $this->top($nr);

      return $this->getMessageItem($headers,$uid);    
  }  
	private function getMessageItem($message, $uid, $flags = 0, $staticFlags = array())
	{

		$headers="";
    $separator = strpos($message,"\r\n\r\n");
		if ($separator === false)
			$headers = $message;
		else
			$headers = substr($message,0,$separator + strlen("\r\n\r\n"));

    if($headers){
    $parser = new MailParse(false,false,false,false,'1',$headers);
		$msgHeaders = $parser->getHeaders();   
		$item = new stdClass();
		$item->size  = strlen($message);
		$item->uid   = $uid;
		$item->flags = $flags;
		$item->color = 'Z';

		$item->date  = isset($msgHeaders['date']) ? $msgHeaders['date']: '';

    if (!is_int($item->date))
          $item->date = strtotime($item->date);

    $item->from  = isset($msgHeaders['from']) ? $msgHeaders['from'] : '';
		$item->to    = isset($msgHeaders['to']) ? $msgHeaders['to'] : '';
		$item->subject = isset($msgHeaders['subject']) ? $msgHeaders['subject'] : '';
		$item->priority = isset($msgHeaders['priority']) ? $msgHeaders['priority'] : Item::NORMAL_PRIORITY;
		$item->received = isset($msgHeaders['received']) ? $msgHeaders['received'] : false;
    $item->staticFlags = isset($staticFlags['flags']) ? $staticFlags['flags'] : 0;
		$item->sMimeStatus = isset($staticFlags['smime_status']) ? $staticFlags['smime_status'] : 0;
		$item->hasAttachments = isset($staticFlags['has_attachment']) ? $staticFlags['has_attachment'] : false;
    
		return $item; 
	  }
	  return false;
  }
  
  
     		
	public function deleteItems($oFolder,$oItems = false)
	{
		if ($oItems){ 
			foreach($oItems as $oItem){
				$this->deleteMessage($oFolder->name,$oItem->rid);
			}
			$this->quit();
		} else {
			$this->emptyMailbox($oFolder->name);
		}
	}
	
	 
	public function deleteMessage($mailbox = false, $uid)
	{
    if (!$this->aList) $this->getItemsID();
    if (!$this->dele($this->msgNumber($uid)))
      throw new Exc('item_delete',$uid);
	}	
	
	 
	public function emptyMailbox($mailbox = false)
	{
	  $result = true;
    if (!$this->aList) $this->getItemsID();
    for($i = 1; $i <= $this->num_msg;$i++){
      $result = $this->dele($i) && $result;
    }   
    $this->quit(); 
    if (!$result)
      throw new Exc('folder_empty');
    
	}
	
  public function search($oFolder,$sPhrase,$aItems = false)
  {

    $sPath = $this->getFolderPath($oFolder->folderID);
    $search = Search::instance($sPath);
    $result = $search->search($sPhrase,'msg',false,$aItems);
    return $result;
  }	
  
	public function getFolderPath($mailboxID){
    return User::getDir(false)."~".$this->account->accountID."/".$mailboxID."/";
  }
  
	 
	public function saveMessageToFile($mailbox, $uid, $filename)
	{

		$dir = dirname($filename);
			
		if(!is_dir($dir)){
			slSystem::import('tools/filesystem');
			slToolsFilesystem::mkdir_r($dir, 0777, true);
		}
    	$this->retr($this->msgNumber($uid),$filename);

		return true;
	}
	         public function open($server, $port)
  {
  	
    if (@($this->Socket = fsockopen($server, $port)) <= 0) return false;

    @$this->Line = fgets($this->Socket, 1024);
    $this->Status["LASTRESULT"] = substr($this->Line, 0, 1);
    $this->Status["LASTRESULTTXT"] = substr($this->Line, 0, 1024);

    if ($this->Status["LASTRESULT"] <> "+") return false;

    return true;
  }
  
  public function login($user, $pass)
  {
  
    if (!($this->user($user))) return false;
    if (!($this->pass($pass))) return false;

    $this->num_msg = $this->pop3_stat();

    return true;
  }

  private function user($user)
  {
    if (!(@fputs($this->Socket, "USER $user\r\n"))) return false;

    @$this->Line = fgets($this->Socket, 1024);
    $this->Status["LASTRESULT"] = substr($this->Line, 0, 1);
    $this->Status["LASTRESULTTXT"] = substr($this->Line, 0, 1024);

    if ($this->Status["LASTRESULT"] <> "+") return false;
    return true;
  }

  private function pass($pass)
  {
    if (!(@fputs($this->Socket, "PASS $pass\r\n"))) return false;

    @$this->Line = fgets($this->Socket, 1024);
    $this->Status["LASTRESULT"] = substr($this->Line, 0, 1);
    $this->Status["LASTRESULTTXT"] = substr($this->Line, 0, 1024);

    if ($this->Status["LASTRESULT"] <> "+") return false;
    return true;
  }

  private function pop3_stat()
  {
    if (!(@fputs($this->Socket, "STAT\r\n"))) return false;

    @$this->Line = fgets($this->Socket, 1024);
    $this->Status["LASTRESULT"] = substr($this->Line, 0, 1);
    $this->Status["LASTRESULTTXT"] = substr($this->Line, 0, 1024);

    if ($this->Status["LASTRESULT"] <> "+") return false;
    list($x, $count, $size) = explode(" ", $this->Line);
    
    return $count;
  }

  
  public function pop3_list($nr)
  {
    if (!(@fputs($this->Socket, "LIST $nr\r\n"))) return false;

    @$this->Line = fgets($this->Socket, 1024);
    $this->Status["LASTRESULT"] = substr($this->Line, 0, 1);
    $this->Status["LASTRESULTTXT"] = substr($this->Line, 0, 1024);

    if ($this->Status["LASTRESULT"] <> "+") return false;

    list($x, $count, $size) = explode(" ", $this->Line);
    
    return $size;
  }
  
  public function top($nr)
  {
    if (!(@fputs($this->Socket, "TOP $nr 0\r\n"))) return false;

    @$this->Line = fgets($this->Socket, 1024);
    $this->Status["LASTRESULT"] = substr($this->Line, 0, 1);
    $this->Status["LASTRESULTTXT"] = substr($this->Line, 0, 1024);

    if ($this->Status["LASTRESULT"] <> "+") return false;
    
    $result = array();
    while ((@$this->Line = fgets($this->Socket, 1024)) <> ".\r\n")
    {
      if (!($this->Line)) return false;
      if ($this->Line[0]==".") $this->Line = substr($this->Line,1,strlen($this->Line));
      
      $result[] =  $this->Line;
      $this->Line = "";
    }
    $result = implode("",$result);
    
    return $result;

  }
  
  public function retr($nr, $filename = false)
  {
    if (!(@fputs($this->Socket, "RETR $nr\r\n"))) return false;

    @$this->Line = fgets($this->Socket, 1024);
    $this->Status["LASTRESULT"] = substr($this->Line, 0, 1);
    $this->Status["LASTRESULTTXT"] = substr($this->Line, 0, 1024);

    if ($this->Status["LASTRESULT"] <> "+") return false;
    
    $result = array();
    if($filename) @$fp = fopen($filename,'wb+');
    while ((@$this->Line = fgets($this->Socket, 1024)) <> ".\r\n")
    {
      if (!($this->Line)) return false;
      if ($this->Line[0]==".") $this->Line = substr($this->Line,1);
        
      if($filename) @fwrite($fp,$this->Line);
      $this->Line = "";
    }
    if($filename){
    	@fclose($fp);
    	slSystem::import('tools/icewarp');
    	slToolsIcewarp::iw_index($filename);
		return true;
	}
    
    return $result;
  }

  public function uidl($nr)
  {
    if (!(@fputs($this->Socket, "UIDL $nr\r\n"))) return false;
  
    @$this->Line = fgets($this->Socket, 1024);
    $this->Status["LASTRESULT"] = substr($this->Line, 0, 1);
    $this->Status["LASTRESULTTXT"] = substr($this->Line, 0, 1024);
  
    if ($this->Status["LASTRESULT"] <> "+") return false;
  
    $uidl = trim($this->Line);
    $uidl = trim(substr($uidl, strrpos($uidl, " ") + 1, strlen($uidl) - strrpos($uidl, " ") - 1));
    $uidl = strtr($uidl, "/\\:*?\"<>|", "---------");

    return $uidl;
  }

  public function dele($nr)
  {
    if (!(@fputs($this->Socket, "DELE $nr\r\n"))) return false;

    @$this->Line = fgets($this->Socket, 1024);
    $this->Status["LASTRESULT"] = substr($this->Line, 0, 1);
    $this->Status["LASTRESULTTXT"] = substr($this->Line, 0, 1024);

    if ($this->Status["LASTRESULT"] <> "+") return false;
    return true;
  }

  public function quit()
  {
    if (!(@fputs($this->Socket, "QUIT\r\n"))) return false;
  
    @$this->Line = fgets($this->Socket, 1024);
    $this->Status["LASTRESULT"] = substr($this->Line, 0, 1);
    $this->Status["LASTRESULTTXT"] = substr($this->Line, 0, 1024);
  
    if ($this->Status["LASTRESULT"] <> "+") return false;
              return true;
  }

  public function close() { 
    @fclose($this->Socket); 
  }
public function drop(){}

  public function __destruct(){
    $this->close();
  }
}
?>
