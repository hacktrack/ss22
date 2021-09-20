<?php

class slToolsXML
{
	static public function loadFile($file)
	{
		 		$content = file_get_contents($file);
		if ($content === false) {
			return false;
		}
		return simplexml_load_string($content);
	}

	static public function loadString( $string )
	{
		if (!$string) {
			throw new Exc('xml_load_string:empty_input');
		}
		$xml = self::getXmlFromString($string); 
		return $xml;
	}

	static public function getXmlFromString($xmlString)
	{
		$xml = simplexml_load_string($xmlString, 'SimpleXMLElement', LIBXML_NOERROR);
		 		if (false === $xml) {
			$xml = self::fixXML($xmlString);
		}
		return $xml;
	}

	static public function fixXML($XMLString)
	{
        $binary = '';
		for ($i = 0; $i < 32; $i++) {
			$binary .= chr($i);
		}
		$XMLString = strtr($XMLString, $binary, "          \n  \r                   ");
		$xml = simplexml_load_string($XMLString, 'SimpleXMLElement', LIBXML_NOERROR);
		if (false === $xml) {
			$xml = simplexml_load_string(self::utf8_bad_replace($XMLString, ' ', true));
		}
		return $xml;
	}

	static public function utf8_bad_replace($input, $replace = ' ', $fixForXML = false)
	{
		
		$input = str_replace("\xef\xbf\xbe", "", $input);
		 		return icewarp_utf8_bad_replace($input, $replace, true);
	}

	static public function saveString( $xml )
	{
		return $xml->asXML();
	}
	
	static public function saveFile( $xml, $file )
	{
		return $xml->asXML( $file );
	}
	
	static public function xml2array( $xml )
	{
        $result = [];
		if( (string) $xml != '' ){
			$result['@value'] = (string) $xml;
		}
		if( $xml->attributes() ){
			$result['@attributes'] = (array) $xml->attributes();
		}
		if( $xml->children() ){
			$elmCount = 0;
			foreach( $xml->children() as $elmName => $elm ){
				$result['@children'][$elmName][$elmCount++] = self::xml2array( $elm );
			}
		}
		return $result;
	}
	
	static public function xml2simplearray( $xml, $elmName = '' )
	{
        $result = [];
		if(!strval($xml)){
			return $result;
		}
		$value = trim( strval($xml) );

		if( $value != '' ){
			$result = $value;
		}else{
			if( $xml->children() ){
				foreach( $xml->children() as $elmName => $elm ){
					$result[$elmName] = self::xml2simplearray( $elm, $elmName );
				}
			}
		}
		return $result;
	}
	
	static public function array2xml( $array )
	{
	
	}
	
	static public function xml2dom( $xml )
	{
		
	}
	
	static public function dom2xml( $dom )
	{
	}
	
	static public function xpath( $xml, $query )
	{
		
	}

     
	protected static function getXpathSearch(array $values, string $prefixPath) : string
    {
        $conditions = [];
        foreach ($values as $key => $value) {
            $conditions[] = "./$key = '$value'";
        }
        return "//./{$prefixPath}[" . implode(' and ', $conditions) . "]";
    }

     
    public static function removeFromXmlByChildValues(string $xmlFile, array $values, string $prefixPath) : void
    {
        if(!file_exists($xmlFile)) return;
        $xml = new DOMDocument();
        $xml->preserveWhiteSpace = false;
        $xml->formatOutput = true;
        $xml->load($xmlFile);
        $xpathXml = new DOMXPath($xml);
        $elements = $xpathXml->query(self::getXpathSearch($values, $prefixPath));
        if(empty($elements->length)) return;
        foreach ($elements as $element) {
            $element->parentNode->removeChild($element);
        }
        file_put_contents($xmlFile, $xml->saveXML());
    }
}

?>