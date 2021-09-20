<?php

require_once(SHAREDLIB_PATH.'system.php');

 
class slLink
{
    public $path;
    public $parameters;

	 
	public function __construct($link = false)
	{
		if($link = false){
			slSystem::import('io/request');
			$request = slRequest::instance();
			$link = $request->getQueryString();
		}
		$this->parameters = array();
		$this->parseLink($link);
	}
	
	
	 
	public function addParameter( $parameter, $value )
	{
		$this->parameters[$parameter] = $value;
	}
	
	 
	public function editParameter( $parameter, $value )
	{
		$this->parameters[$parameter] = $value;
	}
	
	 
	public function deleteParameter( $parameter )
	{
		if(isset($this->parameters[$parameter])){
			unset($this->parameters[$parameter]);
		}
	}
	
	 
	public function setParameter( $parameter, $value )
	{
		if($this->parameters[$parameter]){
			$this->editParameter($parameter, $value);
		}
	}
	
	 
	public function getParameters($encode = false)
	{
		$parameters = '';
		if($this->parameters){
			foreach($this->parameters as $paramName => $paramValue){
				if($encode){
					$amp = '&amp;';
					$value = rawurlencode($paramValue);
				}else{
					$amp = '&';
					$value = $paramValue;
				}
				$parameters.='&'.$paramName.'='.$value;
			}
		}
		return $parameters;
	}
	
	 
	public function getPath()
	{
		return $this->path;
	}
	
	 
	public function setPath( $path )
	{
		$this->path = $path;
	}
	
	
	 
	public function getURI($encode = false)
	{
		$link = $this->getPath().$this->getParameters($encode);
		return $link;
	}
	
	 
	private function parseLink($link)
	{
		$info = explode('?',$link);
		$this->path = $info[0];
		if($qs = $info[1]){
			$parameters = explode('&',$qs);
			if($parameters){
				foreach($parameters as $paramName => $paramValue){
					$this->addParameter( $paramName, $paramValue );
				}
			}
		}
	}
	
	static public function cutQueryString($url)
	{
		if(strpos($url,'?')!==false){
			$url = substr($url,0,strpos($url,'?'));
		}
		 
		return $url;
	}
	
	static public function replaceURLVariable($uri,$varName,$value)
	{
		if(strpos($uri,$varName)!==false){
			$varname = quotemeta($varName);
			$uri = preg_replace(
				'/&'.$varname. '\=[^\s^\&]*/i',
				$value?('&'.$varName.'='.rawurlencode($value)):'',
				$uri
			);
		}else{
			$uri.='&'.$varName.'='.rawurlencode($value);
		}
		return $uri;
	}
	
	
	static public function removeErrorAndMessage($link)
	{
		if(strpos($link,'mid=')!==false){
			$link = self::replaceURLVariable($link,'mid','');
		}
		if(strpos($link,'msg=')!==false){
			$link = self::replaceURLVariable($link,'msg','');
		}
		if(strpos($link,'eid=')!==false){
			$link = self::replaceURLVariable($link,'eid','');
			$link = self::replaceURLVariable($link,'_s[action]','');
			$link = self::replaceURLVariable($link,'pwpolicy','');
		}
		return $link;
	}
	

}

?>