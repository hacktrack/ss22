<?php

 

class InputStream
{
	private $sInputXML;   	private $oInputXML;   	 
	public function __construct() 
	{
		 		if (!isset($sBuffer)){
		    $sBuffer = trim(file_get_contents("php://input"));
		    if (defined('INPUT_DEVEL_OVERRIDE')){
		    	$sBuffer=INPUT_DEVEL_OVERRIDE;
		    }
		    
		     			
			 			if(preg_match("#charset=(.*)#i",$_SERVER['CONTENT_TYPE'],$matches)){
				$charset = trim($matches[1]);
				if($charset && substr(strtolower($charset),0,5)!='utf-8'){
			  		$sBuffer = Tools::my_iconv($charset,'UTF-8//IGNORE',$sBuffer);
			 	}
			}
			
			 			if (!$sBuffer){
				throw new Exc('inputstream_no_xml_input');  			}
			libxml_disable_entity_loader(true);
			slSystem::import('tools/dom');
			
				
			try{
				$oBuffer = slToolsDOM::openFromString($sBuffer,true);
			}catch(Exc $e){
				
				$sBuffer = slToolsString::utf8_bad_replace($sBuffer,' ',true);
				if (!$oBuffer = slToolsDOM::openFromString($sBuffer)){
					libxml_disable_entity_loader(false);
					throw new Exc('inputstream_corrupted_input',$sBuffer);				}
			}
			libxml_disable_entity_loader(false);

		}
		 		$this->oInputXML = $oBuffer;
		unset($oBuffer);
		$this->sInputXML = $sBuffer;
		unset($sBuffer);
	}
	 
	public function getString()
	{
		return $this->sInputXML;
	}
	
	 
	public function getDOM()
	{
		return $this->oInputXML;
	}
	
	public function __destruct()
	{
		unset($this->oInputXML);
		unset($this->sInputXML);
	}

		
}
?>
