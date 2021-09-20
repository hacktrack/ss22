<?php
 
class Paths
{
   
	private $cacheDir;
	public $cache;

	public function __construct($directory,$cache)
  {
    $this->cacheDir = $directory;
    $this->cache = &$cache;
  }
  
  public function getCacheDir()
  {
      return $this->cacheDir;
  }
  
	 
	public function getMessageFile($dir, $itemID)
	{
		return $dir . '/' . $itemID . '.msg';
	}

	 
	public function getMessageDir($accountID, $folderID)
	{
		return $this->cacheDir . '~'.$accountID . '/' . $folderID;
	}
	
	 
	public function getMessagePath($accountID, $folderName, $itemID)
	{
		$this->cache->transaction();
		$stmt = $this->cache->prepare('SELECT folder_id
								FROM folder
								WHERE account_id = ? AND name = ?');
		$stmt->execute(array($accountID, $folderName));
		
		$row = $stmt->fetch();
     		
		if (!$row) {
			return false;
		}
			
		$folderID = $row['folder_id'];

		return $this->getMessageFile($this->getMessageDir($accountID, $folderID), $itemID);
	}
}
?>
