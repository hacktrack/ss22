<?php
 
class LocalPOPAccount extends CacheAccount
{
	public $folderClassName;
	public $virtualAccount;

	 
	 
  public function __construct($user, $accountID, $primary, $properties = false)
  {

        $apos = strpos($accountID,"@");
        $username = substr($accountID,0,$apos);
        $password = $properties['password'];

        $this->folderClassName = 'LocalPOPFolder';
        
        parent::__construct($user, $accountID,
  							$_SERVER['SERVER_NAME'], 25, $username, $password, $primary,'local',$properties);
  		 		LocalPOP::instance($this);
  }
  
	   
  public function createFolder($param)
  {
		$name = isset($param['name'])?$param['name']:false;
		$type = isset($param['type'])?$param['type']:'';
		Folder::checkName($name);
                 parent::createFolder($param);

           		$this->folders['main'][$name] = LocalPOPFolder::create($this, $name);
  		return $this->folders['main'][$name];  
  }

  	 
	public function sync($force_gw = false, $folders = array())
	{

		$lpop = LocalPOP::instance($this);
		$folders = $lpop->getMailboxes();
		parent::sync($force_gw, $folders);
		if($this->gwAccount){
			try{
				$this->gwAccount->sync($force_gw);
			}catch(Exc $e){
				
			}
		}
		if($this->virtualAccount){
			$this->virtualAccount->sync();
		}
		return true;
	}
	
	public function test()
	{
		$mAccount = new MerakAccount();
		$result = $mAccount->AuthenticateUserHash($this->username, $this->getPassword(), $_SERVER['SERVER_NAME'],'||'.$_SERVER['REMOTE_ADDR'],$_SESSION['LOGGING_TYPE']);
		if($result && $mAccount->EmailAddress!=rtrim($this->accountID,'_TEST')){
			$result = false;
		}
		return $result;
	}
	
	public function setAcl($acl,$folder = '.',$bSetDual = true)
	{
		if($bSetDual && $this->gwAccount){
			if($folder == '.' || $folder == ''){
				$this->gwAccount->setAcl($acl,'',false);
			}else{
				try{
					$this->gwAccount->getFolder($folder);
					$this->gwAccount->setAcl($acl,$folder,false);
				}catch(Exc $e){
					
				}
			}
		}
	}
	
	public function inheritAcl($sName,$bInheritDual = true)
	{
		$acl = null;
		if($bInheritDual && $this->gwAccount){
			$acl = $this->gwAccount->inheritAcl($sName,false);
		}
		return $acl;
	}
	
	public function isInheritedACL($sName,$acl)
	{
		return true;
	}
	
	public function getMyRights($folder)
	{
		return Folder::DEFAULT_RIGHTS;
	}
}
?>
