<?php
require_once(SHAREDLIB_PATH.'system.php');
slSystem::import('tools/filesystem');

define('CERT_EXPIRED',2);
define('CERT_OK',1);
define('CERT_ERROR',0);


 
class slSMime
{
    public $certificates;
    public $tempDir;
    public $extraCertDir;

	public function processMessage(&$fp,&$filename, $recipient, $sign, $encrypt,$from,&$errors = false,$cipherStrength = 0, $passphrase = '')
	{
		
		fclose($fp);
		$errors = false;
		$plainfile = $filename;
		$signHeaders = $this->getOpenSSLheaderarray($filename);
		$encryptHeaders = $this->getOpenSSLheaderarray($filename,'encrypt');
		
		 		if ($sign){
			
			$contentType = $signHeaders['Content-Type'];
			preg_match('/charset=([^;^\s]+)/i',$contentType,$matches);
			if($matches[1]){
				$charset = $matches[1];
			}else{
				$charset = 'UTF-8';
			}
			
			unset($signHeaders['Content-Type']);
			
			$cert = $this->getCertificate($from,'personal');
			$encodedfile = slToolsFilesystem::randomFilename($this->getTempDir());
			if ($cert) {
				$pubkey = $cert['cert'];
				$privkey = $cert['pkey'];
				$privkey = openssl_pkey_get_private($privkey,$passphrase);
				if(!is_resource($privkey)){
					throw new Exception('smime_sign_passphrase_invalid');
				}
				$extracerts = $cert['extracerts'];
				if($extracerts){
					$efile = $this->storeExtraCerts($cert);
				}else{
					$efile = false;
				}
				if ($passphrase) {
					$pkey = openssl_get_privatekey($privkey,$passphrase);
				} else {
					$pkey = openssl_get_privatekey($privkey,'');
				}
				
				if ($pkey){
					
					if($efile){
						$sigres = icewarp_openssl_pkcs7_sign($plainfile, $encodedfile, $pubkey, $pkey, $signHeaders, PKCS7_DETACHED, $efile);
					}else{
						$sigres = icewarp_openssl_pkcs7_sign($plainfile, $encodedfile, $pubkey, $pkey, $signHeaders);
					}
					
					if ($sigres){
						
						slSystem::import('tools/icewarp');
						slSystem::import('tools/string');
						 						slToolsIcewarp::iw_delete($plainfile);
						chmod($encodedfile,0755);
						
						 						$content = file_get_contents($encodedfile);
						 						 						$content = slToolsString::lf2crlf($content);
						 						slToolsIcewarp::iw_file_put_contents($encodedfile,$content);
						slToolsIcewarp::iw_index($encodedfile);
						 						$plainfile = $encodedfile;
					} else {
						if(file_exists($encodedfile)){
							slSystem::import('tools/icewarp');
							slToolsIcewarp::iw_index($encodedfile);
							slToolsIcewarp::iw_delete($encodedfile);
						}
						 					}
				}
			}
		}
		 		if ($encrypt){
			
			$encodedfile = slToolsFilesystem::randomFilename($this->getTempDir());
			$cert = $this->getCertificate($recipient,'public');
			$key = $cert['cert'];
			if ($key){
				if ( icewarp_openssl_pkcs7_encrypt( $plainfile, $encodedfile, $key, $encryptHeaders, 0, $cipherStrength ) ){
					$fp = null;
					slSystem::import('tools/icewarp');
					slToolsIcewarp::iw_delete($plainfile);
					slToolsIcewarp::iw_index($encodedfile);
					chmod($encodedfile,0755);
					$plainfile = $encodedfile;
				} else {
					if(file_exists($encodedfile)){
						slSystem::import('tools/icewarp');
						slToolsIcewarp::iw_index($encodedfile);
						slToolsIcewarp::iw_delete($encodedfile);
					}
				}
			}else{
				$error['id'] = 'recipient_certificate_missing';
				$error['value'] = $recipient;
				$errors[] = $error;
			}
		}
		$filename = $plainfile;
		$fp = fopen($filename,'ab');
		if($errors){
			return false;
		}else{
			return true;
		}
	}

	public function decodeMessage( &$certmsg = false, $smimetype = false, &$crt = '',&$isOutlook = false, &$expired = false, $time = false, $passphrase = '' )
	{
        $binary = null;
		if(!$time){
			$time = time();
		}
		slSystem::import('tools/icewarp');
		$isOutlook = false;
		$expired = false;
		 		$encodedfile = slToolsFilesystem::randomFilename($this->getTempDir());
		$plainfile = slToolsFilesystem::randomFilename($this->getTempDir());
		if (@$fd = fopen($encodedfile, "wb")){
			fwrite($fd, $certmsg, strlen($certmsg));
			@fclose($fd);
			slToolsIcewarp::iw_index($encodedfile);
		}
		
		$list = $this->getCertificateList('personal',$time);
		if($list) foreach($list as $cert){
			$pubkey = $cert['cert'];
			$pkey = openssl_pkey_get_private($cert['pkey'],$passphrase);
			
			if(!$pkey){
				throw new Exception('smime_decrypt_passphrase_invalid');
			}
			 			if (@openssl_pkcs7_decrypt( $encodedfile, $plainfile, $pubkey, $pkey )) {
				slToolsIcewarp::iw_index($plainfile);
				if($time > $cert['ainfo']['validTo_time_t']){
					$expired = true;
				}
				break;
			}
		}

		slToolsIcewarp::iw_delete($encodedfile);
		if (file_exists($plainfile)) {
			$result = false;
			if (filesize($plainfile) > 0) {

				 				$certmsg = file_get_contents($plainfile);
				 				if(strpos($certmsg,'signed-data')!==false){
					$isOutlook = true;
					$this->verify($plainfile,$crt,false,$smimetype,$time);
					$certmsg = $crt['out'];
				}
				if (substr($certmsg,strlen($certmsg)-4,4)!=CRLF.CRLF){
					$certmsg.=CRLF.CRLF;
				}
				$result = true;
			}

			 			slToolsIcewarp::iw_delete($plainfile);
			return $result;
		}
		
		return false;
	}
	
	public function verify($filename,&$cert = false,$encrypted = false,$smimetype = false, $time = false, $passphrase = '')
	{
		if(!$time){
			$time = time();
		}
        $infilename = null;
		slSystem::import('tools/icewarp');
		if($encrypted){
			$certmsg = file_get_contents($filename);
			$this->decodeMessage($certmsg,$smimetype,$crt,$encrypted,$expired,$time,$passphrase);
			if($crt){
				$cert = $crt;
			}
			$infilename = slToolsFilesystem::randomFilename($this->getTempDir());
			
			slToolsIcewarp::iw_file_put_contents($infilename,$certmsg);
			$filename = $infilename;
		}
		
		$outfilename = slToolsFilesystem::randomFilename($this->getTempDir());
        $verifyCert = slToolsFilesystem::randomFilename($this->getTempDir());
        openssl_pkcs7_verify($filename, PKCS7_NOVERIFY, $verifyCert);
        if($data = openssl_pkcs7_verify($filename, PKCS7_NOVERIFY, $verifyCert, [], $verifyCert, $outfilename) === true) {
			slToolsIcewarp::iw_index($outfilename);
			$result = CERT_OK;
			$cert['cert'] = file_get_contents($verifyCert);
			$cert['out'] = file_get_contents($outfilename);
			$info = slSMime::getCertificateInfo($cert['cert'],$raw);
			$expiration = strval($raw['validTo_time_t']);
			if($time > $expiration){
				$result = CERT_EXPIRED;
			}
			@slToolsIcewarp::iw_delete($outfilename);
			$cert['info'] = $info;
			$cert['rawinfo'] = $raw;
		}else{
			 			$result = CERT_ERROR;
		}
		if($encrypted){
			@slToolsIcewarp::iw_delete($infilename);
		}

		return $result;
	}
	
	public function convertMessageToPlainfile($message)
	{
		$filename = slToolsFilesystem::randomFilename();
		$message = str_replace("\x0D\x0A.", "\x0D\x0A", $message);
		if (@$file = fopen($filename, "wb")){
			fwrite($file, $message, strlen($message));
			fclose($file);
			slSystem::import('tools/icewarp');
			slToolsIcewarp::iw_index($filename);
		} else {
			return false;
		}
		return $filename;
	}

	public function getOpenSSLheaderarray($filename,$type = 'sign')
	{
		$parser = new MailParse($filename);
		$headers = $parser->getHeaders(true);
		if($type == 'encrypt'){
			$sslHeaders = array("Subject", "From", "Reply-To", "To", "Date","Deferred-Delivery", 
													"Return-Receipt", "Message-ID","CC","BCC");
			$result = array();
			
			 			foreach ($sslHeaders as $item) {
				if (isset($headers[strtolower($item)]))
					$result[$item] = $headers[strtolower($item)];
			}
			
			 			foreach ($headers as $key => $value) {
				if (substr($key, 0, 2) == 'x-'){
					if(is_array($value)){
						$value = join(CRLF.ucwords($key).': ',$value);
					}
					$result['X-'.ucwords(substr($key, 2))] = $value;
				}
			}
		}else{
			$sslHeaders = array("Subject", "From", "To", "Date","Deferred-Delivery","Content-Type","CC","Message-ID","BCC");
			$result = array();
			
			 			foreach ($sslHeaders as $item) {
				if (isset($headers[strtolower($item)]))
					$result[$item] = $headers[strtolower($item)];
			}
			
			 			foreach ($headers as $key => $value) {
				if(is_array($value)){
					$value = join(CRLF.ucwords($key).': ',$value);
				}
				if (substr($key, 0, 2) == 'x-')
					$result['X-'.ucwords(substr($key, 2))] = $value;
			}
		}
		return $result;
	}
	
	
	public function setCertificate($crt,$email,$type = 'personal')
	{
		$this->certificates[$type][strtoupper($email)] = $crt;
	}
	
	public function getCertificate($email,$type = 'personal',$time = false)
	{
		if(!$time){
			$time = time();
		}
		if(!isset($this->certificates[$type][strtoupper($email)])){
			throw new Exception($type.'_certificate');
		}
		if($type == 'personal'){
			foreach($this->certificates[$type][strtoupper($email)] as $crt){
				if($crt['ainfo']['validFrom_time_t'] < $time && $time < $crt['ainfo']['validTo_time_t']){
					return $crt;
				}
			}
		}
		return $this->certificates[$type][strtoupper($email)];
	}
	
	public function getCertificateList($type = 'personal',$time = false)
	{
		if(!$time){
			$time = time();
		}
        $result = [];
		if($type == 'personal'){
			foreach($this->certificates[$type] as $email => $emailCrts){
				foreach($emailCrts as $crt){					
					if(($crt['ainfo']['validFrom_time_t'] < $time) && ($time < $crt['ainfo']['validTo_time_t'])){
						$result[$email] = $crt;
					}	
				}
			}
			return $result;
		}
		return $this->certificates[$type];
	}
	
	public function setCertificateList($list,$type = 'personal')
	{
		$this->certificates[$type] = $list;
	}
	
	public function setTempDir($directory)
	{
		$this->tempDir = $directory;
	}
	
	public function getTempDir()
	{
		return $this->tempDir;
	}
	
	public function setExtraCertDir($directory)
	{
		$this->extraCertDir = $directory;
	}
	
	public function getExtraCertDir()
	{
		return $this->extraCertDir;
	}
	
	public function storeExtraCerts($cert)
	{
		if($cert['extracerts'] && $this->getExtraCertDir()){
			$dir = $this->getExtraCertDir();
			$filename = $dir.$cert['id'].'.crt';
			if(!file_exists($filename)){
				$result = join(LF,$cert['extracerts']);
				slSystem::import('tools/icewarp');
				slToolsIcewarp::iw_file_put_contents($filename,$result);
			}
			return $filename;
		}
		return false;
	}

	public function getCertificateInfo($key,&$raw = false)
	{
        $result = '';
		if ($key){
			 			$raw = openssl_x509_parse($key);
			 			if (is_array($raw)){
				$result = $raw["name"] . "\r\n\r\n";
				$result .= $raw["subject"]["CN"] . "\r\n";
				$result .= $raw["subject"]["emailAddress"] . "\r\n\r\n";
				$result .= $raw["issuer"]["C"] . "\r\n";
				$result .= $raw["issuer"]["ST"] . "\r\n";
				$result .= $raw["issuer"]["L"] . "\r\n";
				$result .= $raw["issuer"]["O"] . "\r\n";
				$result .= $raw["issuer"]["OU"] . "\r\n";
				$result .= $raw["issuer"]["CN"] . "\r\n";
				$result .= $raw["issuer"]["emailAddress"] . "\r\n\r\n";
				$result .= $raw["validFrom"] . "\r\n";
				$result .= $raw["validTo"] . "\r\n\r\n";
			}
		}
		return trim($result);
	}
	
	static public function personalToPublic($list, $time = false)
	{
		if(!$time){
			$time = time();
		}
		$result = array();
		if($list){
			foreach($list as $email => $certs){
				foreach($certs as $crt){					
					if(($crt['ainfo']['validFrom_time_t'] < $time) && ($time < $crt['ainfo']['validTo_time_t'])){
						$result[$email] = $crt;
					}	
				}				
			}
		}
		return $result;
	}
}
?>