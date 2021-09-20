<?php

if(!defined('SHAREDLIB_PATH')) {
    if (($sharedLibPath = realpath(__DIR__ . '/../../_shared')) && is_dir($sharedLibPath)) {
        define('SHAREDLIB_PATH', $sharedLibPath . '/');
    } else {
        define('SHAREDLIB_PATH', get_cfg_var('icewarp_sharedlib_path'));
    }
}

define('SETTINGS_FILE','settings');
define('storeageext', '.xml');
define('SETTINGS_FOLDER','~webmail/');
require_once(SHAREDLIB_PATH.'system.php');
require_once('inc/gw/gw.php');
require_once('inc/storage/storage.php');
require_once('inc/xmlrequest.php');
require_once('inc/privateandpublic.php');
require_once('inc/webmailiqpublic.php');
require_once('inc/tools.php');
require_once('inc/defines.php');
require_once('inc/require.php');
require_once('inc/include.php');
 class GroupWareAccount{};
class Exc extends Exception
{
    public function __construct($code = "default", $msg = '', $showLocation = false, $logError = true, $sView = false)
    {
        if(!is_numeric($code)){
            $msg .= ' ' . $code;
            $code = 0;
        }
        parent::__construct($msg, $code);
    }
}
function log_buffer(){};
 class SignatureExport
{
	static $verifiedHostnames = array(
		'iwdc-signature1.icewarp.com',
		'iwdc-signature2.icewarp.com'
	);
	static $instance;

	public function instance($email = false,$remote_host = false)
	{
		if(!self::$instance){
			self::$instance = new SignatureExport($email, $remote_host);
		}
		return self::$instance;
	}

	protected function handleHost($remote_host)
    {
        if (!isset($_SERVER['PHP_AUTH_USER'])) {
            header('WWW-Authenticate: Basic');
            header('HTTP/1.0 401 Unauthorized');
            echo "Invalid hostname : " . htmlspecialchars($remote_host) . " ";
            exit(400);
        }
    }
	
	public function __construct($email,$remote_host)
	{
        if(!$this->isVerifiedHost($remote_host)){
            $this->handleHost($remote_host);
 		}
		$this->email = $email;
		$this->remote_host = $remote_host;
		$this->account = new IceWarpAccount();
		$this->api = new IceWarpAPI('WebClient/Signature export');
		$this->groupware = new IceWarpGWAPI();
		$this->initAccount($email);
	}
	
	
	public function getSignatures()
	{
		 		session_start();
		$_SESSION['USERDIR'] = $this->account->GetProperty('U_FullMailboxPath');
		$_SESSION['WMCONFIGPATH'] = $this->api->GetProperty('C_ConfigPath').'_webmail/';
		$_SESSION['DOMAIN'] = substr($this->email,strrpos($this->email,'@')+1);
		$_SESSION['EMAIL'] = $this->email;
		if($this->account->GetProperty("u_admin")) {
			$_SESSION['ACCOUNT'] = 1;
		} elseif($this->account->GetProperty("u_domainadmin")) {
			$_SESSION['ACCOUNT'] = 2;
		} else {
			$_SESSION['ACCOUNT'] = 0;
		}
		 		$this->groupware->user = $_SERVER['PHP_AUTH_USER'] ?? $this->api->GetProperty('C_GW_SuperUser');
		$this->groupware->setPassword($_SERVER['PHP_AUTH_PW'] ?? $this->api->GetProperty('C_GW_SuperPass'));
        try {
            $this->sid = $this->groupware->Login();
        }catch (Exc $exc){
            header('HTTP/1.0 401 Unauthorized');
            echo "Invalid login";
            exit(401);
        }
		$this->groupware->FunctionCall("SubstituteUser",$this->sid,$this->email);
		$this->gid = $this->groupware->OpenGroup('*');
		$info = $this->groupware->OpenFolder('@@mycard@@',$this->gid);
		$fid = $info['fid'];
		$item = $this->groupware->FunctionCall('GetContactList',$fid,"ItmUID='@@mycard@@'","");
		$item = $this->groupware->ParseParamLine($item);
		$item = reset($item);
		$mycardid = $item['ITM_ID'];
		$mycard = $this->groupware->FunctionCall('GetContactInfo',$fid,$mycardid);
		$mycard = $this->groupware->ParseParamLine($mycard);
		$mycard = reset($mycard);
		$locations = $this->groupware->FunctionCall('GetContactLocations',$fid,$mycardid);
		$locations = $this->groupware->ParseParamLine($locations);
		if($locations){
			foreach($locations as $key => $location){
				switch($location['LCTTYPE']){
					case 'H':
						foreach($location as $lk =>$lv){
							$location['HOME'.$lk] = $lv;
						}
						$item = slToolsPHP::array_merge($mycard,$location);
						break;
					case 'B':
						foreach($location as $lctProperty=>$lctValue){
							$item['BUSINESS'.$lctProperty] = $lctValue;
						}
						break;
				}
			}
		}
		
		$aliases_data = Storage::getAliasesData();
		if($aliases_data){
			foreach($aliases_data as $key => $alias_data){
				if($alias_data['sign1']){
					$signatureEmails[$alias_data['sign1']][] = $key;
				}
			}
		}
		$gwacc = new GroupWareAccount();
		$result = '<signatures>';
		if($item){
			$signatures = Storage::getSignatures($gwacc,$_SESSION['DOMAIN'],$item);
			if($signatures){
				foreach($signatures['@childnodes']['item'] as $key => $signature){
					$s = &$signatures['@childnodes']['item'][$key]['@childnodes']['text'][0]['@value'];
					$s = $this->replaceCID($s);
					$name = $signature['@childnodes']['name'][0]['@value'];
					$name = $name?$name:'Default';
					$id = $signature['@childnodes']['id'][0]['@value'];
					if($id && isset($signatureEmails[$id])){
						$emails = join('|',$signatureEmails[$id]);
					}else{
						$emails = $this->email;
					}
					$result .= '<signature name="'.$name.'" allow-edit="true" overwrite="true" targetMail="'.$emails.'">';
					$result .= slToolsPHP::htmlspecialchars($s);
					$result .= '</signature>';
				}
			}
		}
		$result .= '</signatures>';
		session_destroy();
		header("Content-Type:text/xml;charset=UTF-8");
	
		echo $result;

	}
	
	private function replaceCID($data)
	{	
		$pattern = '/(<((?i)img)[^>]*((?i)src)[^=]*=[^"]*("?))((.+?)sid=&amp;class=(.+?)&amp;fullpath=([^"^&]+)(.+?)?)(\4[^>]*>)/';		
		$replaceFunction = function($matches) {
            $rep = str_replace("@", "#__w_at#", $matches[0]);
            $http = $matches[4] == "www" ? "http://" : "";
            $class = $matches[7];
            $fullpath = $matches[8];
            $attData = Tools::parseFullPath(urldecode($fullpath), $class);
            switch ($class) {
                case "attachment":
                    $handler = SignatureExport::instance();
                    $info = $handler->groupware->OpenFolder($attData["folder"]);
                    $fid = $info["fid"];
                    $attachments = $handler->groupware->FunctionCall("GetAttachmentList", $fid, $attData["item"]);
                    $attachments = $handler->groupware->ParseParamLine($attachments);
                    $attachment = reset($attachments);
                    $path = $handler->groupware->FunctionCall("GetAttachmentPathLocal", $fid, $attData["item"], $attachment["ATTNAME"]);
                    $part = file_get_contents($path);
                    $info["mimetype"] = $attachment["ATTTYPE"];
                    break;
            }
            if ($info["encoding"] != "base64") {
                $data = base64_encode($part);
            } else {
                $data = $part;
            }
            $link = "data:" . $info["mimetype"] . ";base64," . $data;

            return "#__w_o#img src=#__w_q#$link#__w_q##__w_c#";
        };
		$data = preg_replace_callback($pattern, $replaceFunction, $data);	
		$data = str_replace('#__w_o#','<',$data);
		$data = str_replace('#__w_c#','>',$data);
		$data = str_replace('#__w_q#','"',$data);
		$data = str_replace('#__w_at#','@',$data);
		
		return $data;
	}
	
	private function isVerifiedHost($host)
	{
		if (substr( $host, 0, 9 ) === "168.62.48")
			return true;
		else
			return false;

         
	}
	
	private function initAccount($email)
	{

		if(!$this->account->Open($email)){
			echo "Incorrect or invalid email: " . htmlspecialchars($email) . " ";
			exit('400');
		}else{
			$this->email = $this->account->EmailAddress;
		}
		return true;
	}
}


$email = $_GET['email'];
$hostname = $_SERVER["REMOTE_ADDR"];
$signatureExport = SignatureExport::instance($email, $hostname);
$signatureExport->getSignatures();

?>