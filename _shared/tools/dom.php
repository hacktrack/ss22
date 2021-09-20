<?php

if(!defined('LIBXML_PARSEHUGE')){
	define('LIBXML_PARSEHUGE',524288);
}

 
class slToolsDOM extends DOMDocument {
	 
	private $file;

	 
	private $xpath;

	 
	public function __construct($file = '')
	{
	  parent::__construct('1.0', 'utf-8');

		 		$this->preserveWhiteSpace = true;
		$this->formatOutput = true;

		$this->file  = $file;
		$this->xpath = null;
	}

	 
	public static function open($file,$throwException = false,$options = 0)
	{
		if (!is_file($file))
			return null;

		$class = __CLASS__;
		$doc = new $class($file);
		 		$contents = file_get_contents($file);
		$result = $doc->loadXML($contents,$options);
  		   		
  		if($throwException && $result===false){
  			throw new Exc('dom_load_xml');
  		}
	  	$doc->xpath = new DOMXPath($doc);
		self::setXMLNamespace($doc);
    
		return $doc;
	}

     
	public static function openFromString($input,$throwException = false,$options = 0, $isHTML = false)
	{
        $doc = new static();
                 if($isHTML){
            if(preg_match('/(?P<search><meta[^>]+charset=[\'"]?(?P<charset>[^\'";>]+)(?:[^\'">]+?)?[\'"]?[^>]+>)/i', $input, $matches)){
                $replace = str_replace($matches['charset'], 'utf-8', $matches['search']);
                $input = str_replace($matches['search'], $replace, $input);
            }
            @$result = $doc->loadHTML(mb_convert_encoding($input, 'HTML-ENTITIES', 'UTF-8'), $options);
                         foreach ($doc->childNodes as $item){
                if ($item->nodeType == XML_PI_NODE) $doc->removeChild($item);              }
            $doc->encoding = 'UTF-8';          }else{
            @$result = $doc->loadXML($input,$options);
        }
        if($throwException && $result === false){
            throw new Exc('dom_load_xml');
        }
        $doc->xpath = new DOMXPath($doc);
        self::setXMLNamespace($doc);
                 return $doc;
	}
	 	
	public static function setXmlNamespace(&$doc)
	{
		 		$doc->xpath->registerNamespace("auth","webmail:iq:auth");  
		$doc->xpath->registerNamespace("accounts","webmail:iq:accounts");  
		$doc->xpath->registerNamespace("folders","webmail:iq:folders");
		$doc->xpath->registerNamespace("items","webmail:iq:items");
		$doc->xpath->registerNamespace("private","webmail:iq:private"); 
		$doc->xpath->registerNamespace("domain","webmail:iq:domain"); 
		$doc->xpath->registerNamespace("public","webmail:iq:public");  
		$doc->xpath->registerNamespace("message","webmail:iq:message"); 
		$doc->xpath->registerNamespace("freebusy","webmail:iq:freebusy");  
		$doc->xpath->registerNamespace("spellchecker","webmail:iq:spellchecker"); 
		$doc->xpath->registerNamespace("import","webmail:iq:import");
		$doc->xpath->registerNamespace("upload","webmail:iq:upload");
		$doc->xpath->registerNamespace("tools","webmail:iq:tools");

	}

     
	public function save($file = '', $options = null)
	{
		if (($file === '')
			&& ($this->file === ''))
		{
			throw new Exc('xml_invalid_file_name');
		}
		@parent::save(($file !== '') ? $file : $this->file, $options);
	}

	 
	public function query($xpath, $node = null)
	{
		return $this->xpath
			? $this->xpath->query($xpath, $node ? $node : $this)
			: array();
	}

	 
	public function getNode($xpath, $node = null)
	{
		$nodes = $this->query($xpath, $node);
		if ($nodes->length > 1)
			throw new Exc('xml_xpath_more_nodes_found',$xpath);
		if ($nodes->length == 0)
			return null;

		return $nodes->item(0);
	}

	 
	public function getNodeValue($xpath, $node = null)
	{
		if (!$node = $this->getNode($xpath, $node))
			 return false;
		
		return $node->nodeValue;
	}

	 
	public function getNodeAttribute($xpath, $name, $node = null)
	{
		$node = $this->getNode($xpath, $node);
		if ($node === null){
			throw new Exception('xml_node_does_not_exist',$name);
		}
		return $node->getAttribute($name);
	}


	 
	public static function encode($str)
	{
		return @slToolsPHP::htmlspecialchars($str, ENT_COMPAT, 'UTF-8');
	}
	
	 	
	public function getNodeContent($node)
	{	 
				
		   		  $sStart = $sClose = $sReturn = $sSubReturn = '';
		  $bHasNodes = $bHasValue = false;

		   
		  $sAttributes = '';
		  if (@$node->hasAttributes()){
				foreach ($node->attributes as $attribute)
					if ($attribute->value!="") $sAttributes.=' '.$attribute->name.'="'.$attribute->value.'"';
		  }
	  
		   

		  if (@$node->namespaceURI && $node->nodeName=='query')
		  {
          $sAttributes.=' xmlns="'.$node->namespaceURI.'"';
		  }   

		   
		  if (@$node->hasChildNodes()) 
		  {
				foreach ($node->childNodes as $childNode){
					  $sSubReturn.=self::getNodeContent($childNode);
				}
				
				$sReturn = $sSubReturn; 
				$bHasNodes = true;
				
		    
		  } else {	  
				$sReturn= slToolsPHP::htmlspecialchars($node->nodeValue);
				if ($node->nodeValue) $bHasValue = true;
		  }
		  
		   
		  if (isset($node->tagName)){
			$bPair = ($bHasValue || $bHasNodes);
			$sStart = '<'.$node->tagName.$sAttributes.($bPair?">":"/>");
			$sClose = ($bPair?'</'.$node->tagName.'>':'');
		  }
	
		  return $sStart.$sReturn.$sClose;
	}
	
	public function __destruct()
	{
		unset($this->file);
		unset($this->xpath);
	}
}


?>