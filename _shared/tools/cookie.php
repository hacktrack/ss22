<?php

class slToolsCookie
{
     
    public $secure;
     
    public $httpOnly;

	public function __construct()
	{
		 		if(defined('SECURE_COOKIE') && SECURE_COOKIE){
			$this->secure = true;
			 		}

		 		if (isset($_SERVER['HTTPS'])) {
			$lowerString = strtolower($_SERVER['HTTPS']);
			if ($lowerString === 'on') {
				$this->secure = true;
			}
		}
		if (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] === '443') {
			$this->secure = true;
		}

	}

	 	public function isSecure() {
		return $this->secure === true;
	}

	public function deleteAll(string $includePath = null)
    {
        if (!isset($_SERVER['HTTP_COOKIE'])) return;
        $cookies = explode(';', $_SERVER['HTTP_COOKIE']);
        foreach($cookies as $cookie) {
            $parts = explode('=', $cookie);
            $name = trim($parts[0]);
            setcookie($name, '', time()-1000);
            setcookie($name, '', time()-1000, '/');
            setcookie($name, '', time()-1000, './');
            if(!empty($includePath)){
                $includePath = trim($includePath, '/');
                setcookie($name, '', time()-1000, '/' . $includePath . '/');
                setcookie($name, '', time()-1000, '/' . $includePath);
            }
        }
    }

	public function setcookie($name, $value = "", $expire = 0, $path = "/",$domain = "")
	{
		return setcookie($name,$value,$expire,$path,$domain,$this->secure,$this->httpOnly);
	}
}

?>