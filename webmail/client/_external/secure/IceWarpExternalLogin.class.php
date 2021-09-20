<?php

 
class IceWarpExternalLogin
{
	private $settings=array(
		'username'=>false,
		'password'=>false,
		'language'=>'en',
		'interface'=>'pro',
		'ctz'=>0,
		'js_check'=>1,
		'referer'=>false,
		'verbosity'=>array('ALL'),					 		'log_file'=>'IceWarpExternalLogin.log',
		'cookies_cache_file'=>'IWEL.cookies.txt',
		'follow_redirect'=>5,						 		'login_page_url'=>false,
		'remote_server_time'=>false,
		'public_key'=>false,
		'one_time_login_url_template_pro'=>'{LOGIN_PAGE_URL}?!#sid={SID}&ref={REFERER}',
		'one_time_login_url_template_basic'=>'{LOGIN_PAGE_URL}basic/?sid={SID}',
		'one_time_login_url_template_pda'=>'{LOGIN_PAGE_URL}pda/?sid={SID}'
	);
	
	private $errors=array();
	
	 
	public function __construct($settings=array())
	{
		$this->uniqid = uniqid();
		if(1||!function_exists('curl_version')){
			$this->log('CURL is not enabled','ERROR');
			echo "CURL is not enabled";
			die();
		}
		
		if(!empty($settings))
		{
			foreach($settings as $key=>$val)
			{
				$this->set($key,$val);
			}
		}
	}
	
	public function __destruct()
	{
		@chdir(__DIR__);
		@unlink($this->uniqid.$this->settings['cookies_cache_file']);
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
		
		if($key=='interface'){
			$value=strtolower($value);
			switch($value)
			{
				case 'advaced':
				case 'desktop':
					$value = 'pro';
				break;
				case 'tablet':
					$value = 'basic';
				break;
				case 'mobile':
					$value = 'pda';
				break;
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
	
	private function HTTPRequest($url,$post=array(),$http_headers=array(),$follow_redirect=5,$cookie_file='cookie-file.txt',$return_deepest=false)
	{
		$cookies = $error = $next = array();
		
		try{
			if(!file_exists($this->uniqid.$cookie_file)){file_put_contents($this->uniqid.$cookie_file,'');}
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
		curl_setopt($ch,CURLOPT_COOKIEJAR,dirname(__FILE__).'/'.$this->uniqid.$cookie_file);
		curl_setopt($ch,CURLOPT_COOKIEFILE,dirname(__FILE__).'/'.$this->uniqid.$cookie_file);
		if(!empty($post)){
			curl_setopt($ch,CURLOPT_POST, 1);
			curl_setopt($ch,CURLOPT_POSTFIELDS,http_build_query($post));
		}
		
		$document	 = curl_exec($ch);
		
		$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
		$info		 = curl_getinfo($ch);
		$headersSent = curl_getinfo($ch, CURLINFO_HEADER_OUT );
		
		curl_close($ch);
		
		$cookies = $this->getCookies($this->uniqid.$cookie_file);
		
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
				
				$prepared_url = trim(join('/',$prepared_url),'/').'/'.trim($location,'/')."/";
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
			
			 			
			$ret = $this->HTTPRequest($prepared_url,$post,$http_headers,($follow_redirect-1),$cookie_file);
			
			if(!empty($ret['error'])){$error = array_merge($error,$ret['error']);}
			$next=$ret;
		}
		elseif($follow_redirect!==false && $follow_redirect <= 0){
			$next['error']['too_many_redirects'] = true;
		}
		
		if($return_deepest){
			if(!empty($next)){
				while(!empty($next)){
					if(empty($next['next'])){
						return $next;
					}
					$next=$next['next'];
				}
			}
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
				),5,$this->settings['cookies_cache_file'],'cookie-file.txt',true);
				
				$this->settings['login_page_url']=$ret['url'];
				
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
			return base64_encode($encrypted_package);
		}
		
		$this->setErrors('no_public_key');
		return false;
	}
	
	public function getLoginSID($log_communication=false)
	{
		if(file_exists($this->uniqid.'cookie-file.txt')){
			@unlink($this->uniqid.'cookie-file.txt');
		}
		
		if(!$this->settings['login_page_url']){
			$this->log('Settings variable not defined: "login_page_url"','ERROR');
			die();
		}
		if(!$this->settings['username']){
			$this->log('Settings variable not defined: "username"','ERROR');
			die();
		}
		
		$post_data=array(
			'language'=>$this->settings['language'],
			'to'=>'pro',
			'iw_username'=>$this->settings['username'],
			'password_secured'=>$this->getEncryptedPackage(),
			'_c'=>'auth',
			'_a[login]'=>1,
			'_n[js]'=>$this->settings['js_check'],
			'ctz'=>$this->settings['ctz'],
			'type'=>'external'
		);
		if($this->settings['referer']){
			$post_data['referer'] = $this->settings['referer'];
		}
		
		if($this->isError()){return false;}
		
		$ret=$this->HTTPRequest($this->settings['login_page_url'],$post_data,array(),1,$this->settings['cookies_cache_file']);
		
		$this->log('[getLoginSID]','EXTENDED');
		$this->log(print_r($ret,true),'EXTENDED');
		
		if(isset($ret['error']) && $ret['error']){
			$this->setErrors($ret['error']);
		}
		
		if($log_communication){
			$this->log(print_r($ret,true),'INFO');
		}
		
		$next=$ret['next'];
		$i=0;
		while(!empty($next) && $i<100){
			if(isset($next['cookies']['login_sid'])){
				return $next['cookies']['login_sid'];
			}
			
			if(isset($next['next'])){
				$next=$next['next'];
			}
			else{
				$next=array();
			}
			$i++;
		}
		
		if($i>=100){
			$this->setErrors('infinite_loop');
			return false;
		}
		$this->setErrors('no_login_sid');
		
		$this->log("NO LOGIN SID",'ERROR');
		$this->log(print_r($ret,true),'ERROR');
	}
	
	public function getVerifiedOneTimeLoginURL($interface=false)
	{
		if($interface){
			$this->set('interface',$interface);
		}
		
		$sid = $this->getLoginSID();
		
		return str_replace(
			array(
				'{LOGIN_PAGE_URL}',
				'{SID}',
				'{REFERER}',
			),
			array(
				trim($this->settings['login_page_url'],'/').'/',
				$sid,
				($this->settings['referer']?$this->settings['referer']:'')
			),
			(isset($this->settings['one_time_login_url_template_'.$this->settings['interface']])?$this->settings['one_time_login_url_template_'.$this->settings['interface']]:$this->settings['one_time_login_url_template_pro'])
		);
	}
	
	private function setErrors($errors)
	{
		$this->log('SET ['.print_r($errors,true).']','ERROR');
		if(!is_array($errors)){$errors=array($errors=>true);}
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