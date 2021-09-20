<?php 

class GroupAccount extends Account
{
	public function __construct(GroupWareAccount $oGWAccount)
	{
		$this->gwAccount = $oGWAccount;
		$this->folders['group'] = array(); 
	}	
	
	public function &getFolder($name, &$type = '', $logError = true, $allowDualHiddenFolder = false)
	{
		 		if(!isset($this->folders['group'][$name])){
			$this->folders['group'][$name] = new GroupFolder($this, $name);
		}
		return $this->folders['group'][$name];
	}
	
	 	public function getFolders($refresh = true)
	{
		return $this->folders['group'];
	}

    public function sync($force_gw = false, $folders = array()){}
}
?>