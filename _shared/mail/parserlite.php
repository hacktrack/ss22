<?php

require_once(SHAREDLIB_PATH.'tools/charset.php');
require_once(SHAREDLIB_PATH.'tools/string.php');

 

 
class slMailParseLite
{
    public $type;
    public $file;

	 
	private function __construct($source,$type = 0)
	{
		$this->type = $type;
		switch( $type ){
			case 0:
				if(!file_exists($source)){
					throw new Exception('no_input');
				}
				$this->file = fopen($source,'rb'); 
			break;
			case 1:
				if(!$source){
					throw new Exception('no_input');
				}
				throw new Exception('open_string_not_yet_supported');
			break;
		}
	}
	 
	public function __desctruct()
	{
		switch( $this->type ){
			case 0:
				@fclose($this->file); 
			break;
		}
	}
	
	 
	static public function openFile($file)
	{
		return new slMailParseLite($file,0);
	}
	
	 
	public function getHeaders($requiredHeaders = array())
	{
		$line = '';
		$headers = array();
		$header = array();
		$previousHeader = '';
		if($requiredHeaders){
			$requiredHeaders = array_flip($requiredHeaders);
		}
		fseek($this->file,0);
		while(!feof($this->file)){
			$char = fread($this->file,1);
			if($char=="\n"){
				if(trim($line)==''){
					return $headers;
				}else{
					$header = $this->parseHeader($line,$previousHeader);
					if(!$requiredHeaders || isset($requiredHeaders[$header['name']])){
						if(!isset($headers[$header['name']])){
							$headers[$header['name']] = '';
						}
						$headers[$header['name']].=$this->headerToUtf($header['value']);
					}
					if($requiredHeaders){
						$missingHeader = false;
						foreach($requiredHeaders as $rHeader){
							if(!isset($headers[$rHeader])){
								$missingHeader = true;
							}	
						}
						if(!$missingHeader){
							return $headers;
						}
					}
					$previousHeader = $header['name'];
				}
				$line = '';
			}else{
				$line .= $char;
			}
		}
		
		return $headers;
	}
	
	 
	private function parseHeader($line,$previousHeader = '')
	{
		$header = array();
		 		$line = rtrim($line);
		 		if($line[0]==" " || $line[0]=="\t"){
			$header['name'] = $previousHeader;
			$header['value'] = trim($line);
		}else{
			$headerInfo = explode(":",$line,2);
			$header['name'] = strtolower(trim($headerInfo[0]));
			$header['value'] = $headerInfo[1];
		}
		return $header;
	}
	
	 
	private function headerToUtf($header)
	{
		$converted = array();
		if(!is_array($header)){
			$headers[0] = $header;
		}else{
			$headers = $header;
		}
		foreach($headers as $key => $sheader){
			$converted[$key] = '';
			if($headerArr = imap_mime_header_decode($sheader)){
				foreach ($headerArr as $item) {
					if ($item->charset == 'default' || strtolower($item->charset) == 'us-ascii'){
						 if (!slToolsString::isabovechar($item->text)){
							$converted[$key] .= $item->text;
						 }else{
					 		$converted[$key] .= slToolsCharset::my_iconv('', 'UTF-8//IGNORE', $item->text);
						}
					}
					else{
						$converted[$key] .= slToolsCharset::my_iconv($item->charset, 'UTF-8//IGNORE', $item->text);
					}
				}
			}
		}
		if(is_array($converted) && count($converted)==1){
			$converted = reset($converted);
		}
		if(!$converted){
			$converted = '';
		}
		return $converted;
	}
}

?>