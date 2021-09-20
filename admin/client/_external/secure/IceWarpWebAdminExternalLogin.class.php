<?php

 
class IceWarpWebAdminExternalLogin
{
	private $settings=array(
		'username'=>false,
		'password'=>false,
		'language'=>'en',
		'js_check'=>1,
		'referer'=>false,
		'verbosity'=>array('ALL'),					 		'log_file'=>'IceWarpExternalLogin.log',
		'cookies_cache_file'=>'IWEL.cookies.txt',
		'follow_redirect'=>5,						 		'login_page_url'=>false,
		'admin_login_page_url'=>false,
		'api_url'=>false,
		'persistent'=>0,
		'remote_server_time'=>false,
		'public_key'=>false,
		'one_time_login_url_template'=>'{ADMIN_LOGIN_PAGE_URL}?sid={SID}&ref={REFERER}&language={LANGUAGE}',
	);
	
	private $errors=array();
	
	 
	public function __construct($settings=array())
	{
		if(!function_exists('curl_version')){
			$this->log('CURL is not enabled','ERROR');
			echo "CURL is not enabled";
			die();
		}
		
		if(!empty($settings))
		{
			foreach($settings as $key=>$val)
			{
				switch($key){
					case 'referer':
						if(empty($val)){
							$val=false;
						}
					break;
					case 'login_page_url':
					case 'admin_login_page_url':
					case 'api_url':
						$val=trim($val,'/ ')."/";
					break;
				}
				$this->set($key,$val);
			}
		}
	}
	
	public function __destruct()
	{
		@chdir(__DIR__);
		@unlink($this->settings['cookies_cache_file']);
	}
	
	private function log($text,$type="INFO")
	{
		try
		{
			if ($this->settings['verbosity'][0]=='ALL' || in_array($type,$this->settings['verbosity']))
			{
				if(is_array($text)){
					$text = print_r($text,true);
				}
				
				if(substr_count($this->settings['log_file'],'/')>0){
					$path=explode('/',$this->settings['log_file']);
					unset($path[count($path)-1]);
					if(!file_exists(join('/',$path))){
						mkdir(join('/',$path),0755);
					}
				}
				if (!file_exists($this->settings['log_file']))
				{
					file_put_contents($this->settings['log_file'],'');
				}
				file_put_contents($this->settings['log_file'],file_get_contents($this->settings['log_file'])."[".date('d.m.Y H:i:s')."] ".$text."\r\n");
			}
		}
		catch(Exception $e)
		{
			die('Writing to log failed'."\r\n\r\n".print_r($e,true));
		}
	}
	
	private function set($key,$value)
	{
		if($key=='verbosity'){
			if(!is_array($value)){
				$value=array($value);
			}
		}
		
		if($key=='logout_page_url'){
			$key='referer';
		}
		
		$this->settings[$key]=$value;
	}
	
	private function getCookies($cookie_file)
	{
		$cookies = array();
		if(file_exists($cookie_file))
		{
			$data = explode("\n\n",str_replace(array("\r\n","\r"),array("\n","\n"),file_get_contents($cookie_file)));
			if(isset($data[1]))
			{
				$data = explode("\n",$data[1]);
				foreach($data as $val)
				{
					$val = explode("\t",$val);
					if(isset($val[count($val)-2]) && !empty($val[count($val)-2]))
					{
						$cookies[$val[count($val)-2]]=$val[count($val)-1];
					}
				}
			}
		}
		return $cookies;
	}
	
	private function HTTPRequest($url,$post=array(),$http_headers=array(),$follow_redirect=5,$cookie_file='cookie-file.txt',$return_last_redirect=true,$resend_data=false)
	{
		$error = $next = array();
		
		try{
			if(!file_exists($cookie_file)){file_put_contents($cookie_file,'');}
		}catch(Exception $e){
			$this->log("Cannot create cookie file","ERROR");
		}
		
		$ch = curl_init();
		curl_setopt($ch,CURLOPT_URL, $url);
		curl_setopt($ch,CURLOPT_FAILONERROR,0);
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
		curl_setopt($ch,CURLOPT_TIMEOUT, 300);
		curl_setopt($ch,CURLOPT_SSL_VERIFYHOST,0);
		curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,0);
		curl_setopt($ch,CURLINFO_HEADER_OUT, 1);
		curl_setopt($ch,CURLOPT_HTTPHEADER,$http_headers);
		curl_setopt($ch,CURLOPT_HEADER, 1);
		curl_setopt($ch,CURLOPT_USERAGENT,'IceWarp Remote Login');
		curl_setopt($ch,CURLOPT_COOKIEJAR,dirname(__FILE__).'/'.$cookie_file);
		curl_setopt($ch,CURLOPT_COOKIEFILE,dirname(__FILE__).'/'.$cookie_file);
		if(!empty($post)){
			curl_setopt($ch,CURLOPT_POST, 1);
			curl_setopt($ch,CURLOPT_POSTFIELDS,(is_array($post)?http_build_query($post):$post));
		}
		
		$document	 = curl_exec($ch);
		
		$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
		$info		 = curl_getinfo($ch);
		$headersSent = curl_getinfo($ch, CURLINFO_HEADER_OUT );
		
		curl_close($ch);
		
		$cookies = $this->getCookies($cookie_file);
		
		$header				 = substr($document,0,$header_size);
		$headers			 = explode("\n",str_replace(array("\r\n","\r"),array("\n","\n"),$header));
		$processed_headers	 = array('status'=>array('protocol'=>'','code'=>$info['http_code'],'message'=>''));
		$status_header		 = explode(" ",$headers[0]);
		
		if(isset($status_header[0])){$processed_headers['status']['protocol']=$status_header[0];unset($status_header[0]);}
		if(isset($status_header[1])){$processed_headers['status']['code']=$status_header[1];unset($status_header[1]);}
		if(isset($status_header[2])){$processed_headers['status']['message']=join(' ',$status_header);}
		
		unset($headers[0]);
		foreach($headers as $val){
			$val  = explode(':',$val);
			$name = trim($val[0]);
			unset($val[0]);
			if(!empty($name)){
				$processed_headers[strtolower($name)] = trim(join(':',$val));
			}
		}
		
		$body = substr($document, $header_size);
		
		if(isset($processed_headers['x-error'])){
			$error[$processed_headers['x-error']] = true;
		}
		
		if(isset($processed_headers['location']) && $follow_redirect && $follow_redirect>0)
		{
			$location		 = $processed_headers['location'];
			$prepared_url	 = $location;
			$tested_part=explode('?',$location);
			$tested_part=explode('#',$tested_part[0]);
			
			if(substr_count($tested_part[0],'://') == 0)
			{
				$parsed			 = parse_url($url);
				$prepared_url	 = $parsed['scheme'].'://'.$parsed['host'].(isset($parsed['port'])?":".$parsed['port']:'').$parsed['path'];
				$prepared_url	 = explode('/',$prepared_url);
				
				if(substr_count($prepared_url[count($prepared_url)-1],'.') > 0){
					unset($prepared_url[count($prepared_url)-1]);
				}
				
				$prepared_url = trim(join('/',$prepared_url),'/').'/'.$location;
				$prepared_url = explode('/',str_replace('/./','/',$prepared_url));
				$lastKey	  = false;
				
				foreach($prepared_url as $key => $val)
				{
					if($val == '..' && $lastKey !== false){
						unset($prepared_url[$lastKey]);
						unset($prepared_url[$key]);
					}
					$lastKey = $key;
				}
				$prepared_url = join('/',$prepared_url);
			}
			
			$ret = $this->HTTPRequest($prepared_url,($resend_data?$post:array()),$http_headers,($follow_redirect-1),$cookie_file);
			
			if(!empty($ret['error'])){$error = array_merge($error,$ret['error']);}
			$next=$ret;
		}
		elseif(!$follow_redirect || $follow_redirect <= 0){
			$next['error']['too_many_redirects'] = true;
		}
		
		if(!empty($next)){
			$result=$next;
			while(isset($result['next'])&&!empty($result['next'])){
				$result=$next;
			}
			return $result;
		}
		
		return array(
			'url'		=> $url,
			'headers'	=> $processed_headers,
			'body'		=> $body,
			'cookies'	=> $cookies,
			'request'	=> $headersSent,
			'next'		=> $next,
			'error'		=> $error
		);
	}
	
	private function retrievePublicKeyAndServerTime()
	{
		if(!$this->settings['public_key'] || !$this->settings['remote_server_time'])
		{
			if($this->settings['login_page_url'])
			{
				$ret = $this->HTTPRequest($this->settings['login_page_url'],array(),array(
					'X-remote-login: 1'
				),5,$this->settings['cookies_cache_file']);
				
				$this->log('[retrievePublicKeyAndServerTime]','EXTENDED');
				$this->log(print_r($ret,true),'EXTENDED');
				
				if(isset($ret['error']) && $ret['error']){
					$this->setErrors($ret['error']);
				}
				
				if(isset($ret['headers']['x-rsa'])){
					$this->set('public_key',base64_decode(urldecode($ret['headers']['x-rsa'])));
				}else{
					$this->setErrors('no_rsa_header');
				}
				
				if(isset($ret['headers']['x-time'])){
					$this->set('remote_server_time',$ret['headers']['x-time']);
				}else{
					$this->setErrors('no_time_header');
				}
			}
			else
			{
				$this->log('Settings variable not defined: "login_page_url"','ERROR');
			}
		}
	}
	
	public function getPublicKey()
	{
		if(!$this->settings['public_key']){
			$this->retrievePublicKeyAndServerTime();
		}
		return $this->settings['public_key'];
	}
	
	public function getRemoteServerTime()
	{
		if(!$this->settings['remote_server_time']){
			$this->retrievePublicKeyAndServerTime();
		}
		return $this->settings['remote_server_time'];
	}
	
	private function getPasswordPackage()
	{
		$package = $this->settings['password'];
		if($this->settings['remote_server_time']){
			$package = 'p='.urlencode($this->settings['password'])."&t=".$this->settings['remote_server_time'];
		}
		return $package;
	}
	
	private function getEncryptedPackage()
	{
		$public_key = $this->getPublicKey();
		if($public_key)
		{
			$password_package	 = $this->getPasswordPackage();
			$public				 = openssl_pkey_get_public($public_key);
			$encrypted_package	 = '';
			openssl_public_encrypt($password_package,$encrypted_package,$public);
			
			return bin2hex($encrypted_package);
		}
		
		$this->setErrors('no_public_key');
		return false;
	}

	public function getLoginSID($log_communication=false)
	{
		if(!$this->settings['api_url']){
			$this->log('Settings variable not defined: "api_url"','ERROR');
			die();
		}
		if(!$this->settings['login_page_url']){
			$this->log('Settings variable not defined: "login_page_url"','ERROR');
			die();
		}
		if(!$this->settings['admin_login_page_url']){
			$this->log('Settings variable not defined: "admin_login_page_url"','ERROR');
			die();
		}
		if(!$this->settings['username']){
			$this->log('Settings variable not defined: "username"','ERROR');
			die();
		}
		
		$post_data=array(
			'language'=>$this->settings['language'],
			'username'=>$this->settings['username'],
			'password_rsa'=>$this->getEncryptedPackage(),
			'persistent'=>$this->settings['persistent'],
			'action'=>'login',
			'type'=>'external'
		);
		if($this->settings['referer']){
			$post_data['referer'] = $this->settings['referer'];
		}
		
		if($this->isError()){return false;}
		
		$query='<iq format="text/xml" type="set"><query xmlns="admin:iq:rpc"><commandname>authenticate</commandname><commandparams><authtype>1</authtype><email>'.$post_data['username'].'</email><digest>'.$post_data['password_rsa'].'</digest><persistentlogin>'.$post_data['persistent'].'</persistentlogin></commandparams></query></iq>';
		
		$ret=$this->HTTPRequest($this->settings['api_url'],$query,array(),5,$this->settings['cookies_cache_file'],true,true);
		
		try
		{
			$xoData=simplexml_load_string($ret['body']);
			if(!$xoData->query){
				$this->setErrors('api_invalid_output');
				return false;
			}
		}
		catch(Exception $e)
		{
			$this->setErrors('api_invalid_xml_output');
			return false;
		}
		
		if(isset($xoData->attributes()->type))
		{
			if($xoData->attributes()->type == 'result'){
	
				$sid=$xoData->attributes()->sid;

				return $sid;
			} elseif($xoData->attributes()->type == 'error'){
				$ret['error']=$xoData->query->error->attributes()->uid;
			}
		}
		else
		{
			$ret['error']="unknown_error";
		}
		
		$this->log('[getLoginSID]','EXTENDED');
		$this->log(print_r($ret,true),'EXTENDED');
		
		if(isset($ret['error']) && $ret['error']){
			$this->setErrors($ret['error']);
		}
		
		if($log_communication){
			$this->log(print_r($ret,true),'INFO');
		}
		
		$this->setErrors('no_login_sid');
		
		$this->log("NO LOGIN SID",'ERROR');
		$this->log(print_r($ret,true),'ERROR');
	}
	
	public function getVerifiedOneTimeLoginURL($interface)
	{
		if($interface){
			$this->set('interface',$interface);
		}
		
		$sid = $this->getLoginSID();
		
		return str_replace(
			array(
				'{LANGUAGE}',
				'{LOGIN_PAGE_URL}',
				'{ADMIN_LOGIN_PAGE_URL}',
				'{SID}',
				'{REFERER}',
			),
			array(
				$this->settings['language'],
				trim($this->settings['login_page_url'],'/').'/',
				trim($this->settings['admin_login_page_url'],'/').'/',
				$sid,
				urlencode(($this->settings['referer']?$this->settings['referer']:''))
			),
			(isset($this->settings['one_time_login_url_template'])?$this->settings['one_time_login_url_template']:$this->settings['one_time_login_url_template'])
		);
	}
	
	private function setErrors($errors)
	{
		$this->log('SET ['.print_r($errors,true).']','ERROR');
		if(!is_array($errors)){$e=$errors;$errors=array();$errors[(string)$e]=true;}
		$this->errors=array_merge($this->errors,$errors);
	}
	
	public function getErrors()
	{
		if(!empty($this->errors)){
			return $this->errors;
		}
		return false;
	}
	
	public function isError()
	{
		if(!empty($this->errors)){
			return true;
		}
		return false;
	}
}
?>