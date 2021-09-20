<?php
 
class POP3Account extends CacheAccount
{
	public $folderClassName;
	public $primary;

	 
	 
  public function __construct($user, $accountID,$server ,$port = 110,$username,$password,$primary, $properties = false)
  {

                          $this->folderClassName = 'POP3Folder';
        parent::__construct($user, $accountID,$server, $port, 
                $username, $password, false,'pop3',$properties);
  			$this->primary = $primary;
  			
  }
  
     
  public function createFolder($param)
  {
 		$name = isset($param['name'])?$param['name']:false;
		$type = isset($param['type'])?$param['type']:'';
  			Folder::checkName($name);
                 parent::createFolder($param);
           		$this->folders['main'][$name] = POP3Folder::create($this, $name);
  		return $this->folders['main'][$name];
  }
  
   
	public function sync($force_gw = false,$folders = array())
	{
		$pop3 = POP3::instance($this);
		if(!$folders){
			$folders = $pop3->getMailboxes();
		}
		parent::sync($force_gw, $folders);
		return true;
	}

	public function test()
	{
		$pop3 = POP3::instance($this);
		$mAccount = new IceWarpAccount();
		$result = $mAccount->AuthenticateUserHash($this->username, $this->getPassword(), $_SERVER['SERVER_NAME'],'||'.$_SERVER['REMOTE_ADDR'],$_SESSION['LOGGING_TYPE']);
		if($result && $mAccount->EmailAddress!=rtrim($this->accountID,'_TEST')){
			return false;
		}
		return $pop3->isLogged;
	}
}
?>
