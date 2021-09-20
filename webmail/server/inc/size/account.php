<?php 

class SizeAccount extends Account
{
	public function __construct(GroupWareAccount $oGWAccount)
	{
		$this->gwAccount = $oGWAccount;
		$this->folders['size'] = array(); 
	}	
	
	public function &getFolder($name, &$type = '', $logError = true, $allowDualHiddenFolder = false)
	{
		 		if(!isset($this->folders['size'][$name])){
			$this->folders['size'][$name] = new SizeFolder($this, $name);
		}
		return $this->folders['size'][$name];
	}
	
	 	public function getFolders($refresh = true)
	{
		return $this->folders['size'];
	}

    public function sync($force_gw = false, $folders = array()){}
}
?>