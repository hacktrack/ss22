<?php

class Search
{
  private static $base;

	public $oAPI;
	public $iFound;
	public $sPath;
	public $aFound;

  private function __construct($sPath)
  {
    $this->sPath = $sPath;
    $this->oAPI = createobject("API");
  }
  
  public static function instance($sPath)
  {
    if(!self::$base[$sPath])
      self::$base[$sPath] = new Search($sPath);
      
    return self::$base[$sPath];
  }

  public function search($sPhrase,$sExt = false,$bRCR = false,$aFound = false){
    $this->iFound = 0;
    $this->aFound = $aFound;

         if($this->sPath[strlen($this->sPath)]=="\\")
      $this->sPath  = substr($this->sPath,0,strlen($this->sPath)-1).'/';
    $aFiles = $this->search_r($sPhrase,$this->sPath,$sExt,$bRCR);
    return $aFiles;
  }
  
  private function search_r($sPhrase,$sPath,$sExt,$bRCR)
  {
  	slSystem::import('tools/php');
    $aResult = array();
    if(is_dir($sPath))
    if ($oHandler = opendir($sPath)) {
      while (($sFile = readdir($oHandler))) {

        if ( ($sFile == '.') || ($sFile == '..') || (substr($sFile,0,1) == '~') )
          continue;
        
        $sCurrent = $sPath.'/'.$sFile;

                 if(isset($this->aFound[$sCurrent])){
          $aResult[] = preg_replace("/\.".$sExt."$/","",$sFile);
          continue;
        }
 
        if(is_dir($sCurrent)){
         if($bRCR) {
            if($aFiles = $this->search_r($sPhrase,$sCurrent,$sExt,$bRCR))
              $aResult = slToolsPHP::array_merge($aFiles,$aResult);
          }
        } else {
          if($sExt){
            $aInfo = pathinfo($sFile);
            if($aInfo['extension']!=$sExt) 
              continue;
          }
                     $sContent = icewarp_get_message_content($sCurrent,'',DB_BODY_LIMIT,0); 

          if(stripos($sContent,$sPhrase)!==false){
            $aResult[] = preg_replace("/\.".$sExt."$/","",$sFile);
          }
        }
      }
      closedir($oHandler);
    }
    return $aResult;  
  }  
}

?>
