<?php

 
$sTime = time();
$sMicroTime = microtime();

require_once('inc/require.php');
require_once('inc/include.php');
require_once('inc/exception.php');
require_once('inc/defines.php');

function main() {
	if(defined('SECURE_COOKIE') && SECURE_COOKIE){
		header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
	}	
	if (($fullpath = Get()->fullpath) === null) {
		exit('Invalid fullpath');
	}
	if (($class = Get()->class) === null) {
		exit('Invalid class');
	}
	$fallBackUrl = Get()->fallback ?? null;
	 
	if (!($sid = Get()->sid)) {
		 		if($class!='captcha' 
		&& $class!='ticket' 
		&& $class!='background' 
		&& $class!='jitsi_logo'
		&& $class!='icechat_background'
		&& $class!='logo') {
			log_buffer("Download session [Invalid sid]","EXTENDED");
			exit('Invalid sid');
		}
	}
	header('Accept-Ranges: bytes');

	$passphrase_rsa = Get()->passphrase;
	WebmailIqAuth::checkServerKeys();
	$privateData = file_get_contents(WM_CONFIGPATH.'private.key');
	$privateKey = openssl_pkey_get_private($privateData);
	openssl_private_decrypt(WebmailIqAuth::hexStringToBinary($passphrase_rsa), $passphrase, $privateKey);
	
	$resize = Get()->resize;
	$quality = Get()->quality;
	$crop = Get()->crop;
	$width = Get()->width;
	$height = Get()->height;
	$type = $start_part_id = $filename = null;

	try {
		try{
			if($sid) {
				
				$user = User::load($sid);
				if(!$_SESSION['user']){
					log_buffer("Download session [".($sid?$sid:'Unauthorized')."] : User object does not exists in current session","EXTENDED");
				}
			}
		}catch(Exception $e){
			if(!isset($_SESSION['user'])){
				log_buffer("Download Exception:".print_r($e,true),"EXTENDED");
				exit('Session no user');
			}
			session_start();
		}
		
		log_buffer("Download session [".($sid?$sid:'Unauthorized')."] STARTED","DEBUG");
		$pathData = Tools::parseFullPath($fullpath,$class);
		log_buffer("Download session [".($sid?$sid:'Unauthorized')."] PARAMETERS : [class=".$class.",fullpath=".$fullpath."]","DEBUG");
		if($class == 'item' && $pathData['account'][0] == '@') $class = 'special';
		switch($class) {
			 			case 'itemtext':
			case 'itemhtml':
			case 'item':
				if(($pos = strpos($pathData['item'],'|')) !== false) {
					$pathData['part_id'] = substr($pathData['item'],$pos+1);
					$pathData['item'] = substr($pathData['item'],0,$pos);
				}
				$account_id = $pathData['account'];
				$folder_id = $pathData['folder'];
				$item_id = $pathData['item'];
				$part_id = $pathData['part_id'];
				$account = $user->getAccount($account_id);
				$folder = $account->getFolder($folder_id);
				$item = $folder->getItem($item_id);
				
				if($class=='item'){
					if($item->wmclass=='GW'){
						$attachment = new GroupWareAddon($item,'attachment');
						$gwid = $part_id;
						if($part_id || strpos($part_id,'|')!==false){
							$info = explode('|',$part_id);
							$gwid = $info[0];
							$part_id = $info[1];
							$item = $item->getEML($attachment,$gwid,$gwid);
						}else{
							$part_id = false;
						}
					}
					if($part_id){
						$item->sendAttachment(
							$part_id,
							$part_id,
							array(
								'account_id'=>$account_id,
								'folder_id'=>$folder_id,
								'item_id'=>$item_id,
								'sid'=>$sid
							),
							$item->getSubjectFileName('.eml'),
							$resize,
							'',
							$_REQUEST['skin'],
							$passphrase
						);
					}else{
						$item->sendData();
					}
				}else{
					if($item->wmclass=='GW'){
						$attachment = new GroupWareAddon($item,'attachment');
						$gwid = $part_id;
						if($part_id || strpos($part_id,'|')!==false){
							$info = explode('|',$part_id);
							$gwid = $info[0];
							$part_id = $info[1];
						}else{
							$part_id = '1';
						}
						$item = $item->getEML($attachment,$gwid,$gwid);
					}
					$aFilter['tag'] = 'date,subject,header_from,header_to,cc,bcc,html,text,attachments';
					$aItem = WebmailIqItems::cnvMailItem($item,$aFilter,$part_id?$part_id:'1',false,false,$blocked,true,$passphrase);
					$aLanguage = Tools::loadLanguage();
					if($class=='itemtext'){
						$aItem = Tools::prepareItemToBeSaved($aItem);
						if(!$aItem['text'] && $aItem['html']){
							slSystem::import('tools/string');
							$aItem['text'] = slToolsString::removeHTML($aItem['html']);
						}
						$aItem['language'] = $aLanguage;
						$data = template('inc/templates/saveastext.tpl',$aItem);
						slToolsFilesystem::sendFileHeaders($item->getSubjectFileName('.txt'),strlen($data),'text/plain','UTF-8');
						
						echo $data;
					}
					if($class=='itemhtml'){
						$aItem = Tools::prepareItemToBeSaved($aItem,'html');
						if(!$aItem['html'] && $aItem['text']){
							$aItem['html'] = slToolsString::text2html($aItem['text']);
						}
						$aItem['language'] = $aLanguage;
						$data = template('inc/templates/saveashtml.tpl',$aItem);
						slToolsFilesystem::sendFileHeaders($item->getSubjectFileName('.html'),strlen($data),'text/html','UTF-8');
						echo $data;
					}
						
				}
			break;
			 			case 'document':
				$account_id = $pathData['account'];
				$folder_id = $pathData['folder'];
				$item_id = $pathData['item'];
				$type = $pathData['part'];
				$account = $user->getAccount($account_id);
				$folder = $account->getFolder($folder_id);
				$item = $folder->getItem($item_id);
				if($resize){
					$resize = array();
					$resize['width'] = $width;
					$resize['height'] = $height;
					$resize['crop'] = $crop;
					$resize['type'] = $type;
					$resize['quality'] = $quality;
				}
				$item->sendDocument($type,$resize,$passphrase);				
				break;
			case 'teamchat_attachment':
				 				$pathData['account'] = $_SESSION['EMAIL'];
			case 'url':
			case 'attachment':
			case 'special':
				$account_id = $pathData['account'];
				$folder_id = $pathData['folder'];
				$item_id = $pathData['item'];
				$part_id = $pathData['part'];
				if(($pos = strpos($pathData['item'],'|')) !== false) {
					$start_part_id = substr($pathData['item'],$pos+1);
					$item_id = substr($pathData['item'],0,$pos);
				}
				if($_SESSION['PUBLIC_CALENDAR']){
					$folder = $_SESSION['PUBLIC_CALENDAR'];
				}else{
					$account = $user->getAccount($account_id);
					$folder = $account->getFolder($folder_id);
				}

				$item = $folder->getItem($item_id);
				if($resize){
					$resize = array();
					$resize['width'] = $width;
					$resize['height'] = $height;
					$resize['crop'] = $crop;
					$resize['type'] = $type;
					$resize['quality'] = $quality;
				}		
				$item->sendAttachment(
					$part_id,
					$start_part_id,
					array(
						'account_id'=>$account_id,
						'folder_id'=>$folder_id,
						'item_id'=>$item_id,
						'sid'=>$sid
					),
					false,
					$resize,
					'',
					$_REQUEST['skin'],
					$passphrase
				);
				 				break;
			case 'message':
				$account_id = $pathData['account'];
				$folder_id = $pathData['folder'];
				$item_id = $pathData['item'];
				$account = $user->getAccount($account_id);
				$folder = $account->getFolder($folder_id);
				$item = $folder->getItem($item_id);
				$item->sendData();
				break;
			case 'file_attachment':
				$account_id = $pathData['account'];
				$folder_id = $pathData['folder'];
				$item_id = $pathData['item'];
				
				if($_SESSION['PUBLIC_CALENDAR']){
					$folder = $_SESSION['PUBLIC_CALENDAR'];
				}else{
					$account = $user->getAccount($account_id);
					$folder = $account->getFolder($folder_id);
				}
				$item = $folder->getItem($item_id);
				if($resize){
					$resize = array();
					$resize['width'] = $width;
					$resize['height'] = $height;
					$resize['crop'] = $crop;
					$resize['type'] = $type;
					$resize['quality'] = $quality;
				}
				$attachment_id = $item->getFileAttachmentID();

				$item->sendAttachment(
					$attachment_id,
					0,
					array(
						'account_id'=>$account_id,
						'folder_id'=>$folder_id,
						'item_id'=>$item_id,
						'sid'=>$sid
					),
					false,
					$resize,
					'',
					$_REQUEST['skin'],
					$passphrase
				);
				break;
			case 'revision':
				$account_id = $pathData['account'];
				$folder_id = $pathData['folder'];
				$item_id = $pathData['item'];
				$attachment_id = $pathData['part'];
				if(($pos = strpos($pathData['item'],'|')) !== false) {
					$revision_id = substr($pathData['item'],$pos+1);
					$item_id = substr($pathData['item'],0,$pos);
				}
				$account = $user->getAccount($account_id);
				$folder = $account->getFolder($folder_id);
				$item = $folder->getItem($item_id);
				$item->downloadRevision(
						$attachment_id,
						$revision_id
				);
			break;
			 			case 'groupware':
				 				$sAccountID = $pathData['account'];
				$oAccount = $user->getAccount($sAccountID);
				 				if(!$oGWAccount = $oAccount->gwAccount) {
					throw new Exc('export_invalid_account',$sAccountID);
				}
				$sGWSessionID = $oGWAccount->gwAPI->OpenGroup('*');
				$sGroupWareXML = $oGWAccount->gwAPI->FunctionCall(
					"ExportGroup",
					$sGWSessionID,
					$sAccountID
				);
				slToolsFilesystem::sendFileHeaders(
					$sAccountID.'.xml',
					strlen($sGroupWareXML),
					'text/xml'
				);
				 				$user->closeSession();
				echo $sGroupWareXML;
				break;
			case 'allattachments':
				$account_id = $pathData['account'];
				$folder_id = $pathData['folder'];
				$item_id = $pathData['item'];
				$account = $user->getAccount($account_id);
				$folder = $account->getFolder($folder_id);
				if(!$folder->gw){
					if(($pos = strpos($pathData['item'],'|')) !== false) {
						$start_part_id = substr($pathData['item'],$pos+1);
						$item_id = substr($pathData['item'],0,$pos);
					}else{
						$start_part_id = 1;
					}
				}else{
					if(substr_count($item_id,'|')>1){
						$i = explode('|',$item_id);
						$start_part_id = $i[2];
					}
				}
				$item = $folder->getItem($item_id);
				 				if ($item->wmclass=="M" || $item->wmclass=="Q") {
					$fname = $item->getSubjectFileName($start_part_id);
				}
				if(empty($fname)) $fname = date('YmdGis');

				$fname.='.zip';
				$fileDir = User::getTempDir().uniqid('zip_').'/';
				$filename = $fileDir.uniqid('zip_').'.zip';
				$tempDir = $fileDir.'files'.'/';

				 				try{
					require_once(SHAREDLIB_PATH.'tools/zip.php');
					$zip = new slToolsZIP();
					$zip->setTempDir($tempDir);
					$zip->open($filename, ZIPCREATE);
					
				}catch(Exception $e){
					exit("cannot open <$filename>");
				}
				
				 				 				 				 					if($item->wmclass=="GW") {
						if($start_part_id==1){
							$start_part_id = false;
						}
						$aAttachments = $item->getAllAttachmentFiles();
						foreach($aAttachments as $attachment){
							$attachment['name'] = urldecode($attachment['name']);
							$name = Tools::fixAttachmentName($attachment);
							$zip->addFile($attachment["file"],$name);
						}
					}else{
						$aAttachments = $item->getAllAttachments($start_part_id);
						
						foreach($aAttachments as $attachment){
							$name = Tools::fixAttachmentName($attachment);
							$zip->addFromString($name,$attachment["file_content"]);
						}
					}
				 				 				$zip->close();
				
				 				$user->closeSession();
				slToolsFilesystem::sendFileHeaders($fname, @filesize($filename), 'application/zip');
				 
				slToolsFilesystem::downloadFile($filename,true);
				break;
			 			case 'file':
				$folder_id = $pathData['folder'];
				$item_id = $pathData['item'];
				$userAttachments = $user->getAttachments();
				if (!isset($userAttachments[$folder_id][$item_id])) {
					exit('Attachment doesn\'t exist');
				}
				$attachment = $userAttachments[$folder_id][$item_id];
				$filename = $attachment['file'];
				if($resize){
					$dir = basename($filename);
					slSystem::import('tools/image');
					$image = new slToolsImage();
					$image->load($filename);
					$image->edit($resize['width'],$resize['height'],$resize['crop']);
					$filename = $dir.$image->save(false,false,$resize['quality'],$resize['type']);
				}
				@$size = filesize($filename);
				$attachment['name'] = str_replace("+"," ",$attachment['name']);
				$user->closeSession();
				slToolsFilesystem::sendFileHeaders($attachment['name'], $size, $attachment['type']);
				slToolsFilesystem::downloadFile($filename,$attachment['delete']);
				
				 

				break;
			case 'exportvcard':
				$oAccount = $user->getAccount($pathData['account']);
				$oFolder = $oAccount->getFolder($pathData['folder']);
				$download = $oFolder->saveItems();
				slToolsFilesystem::sendFileHeaders($download['name'],@filesize($download['file']),$download['type'],'utf-8');
				slToolsFilesystem::downloadFile($download['file'],false);			
				$filename = $download['file'];
			break;
			case 'exportcsv':
				$account_id = $pathData['account'];
				$folder_id = $pathData['folder'];
				$separator = $pathData['item'];
				$format = $_REQUEST['format'];
				
				 				$oAccount = $user->getAccount($account_id);
				$oFolder = $oAccount->getFolder($folder_id);
			
				 				$aAddresses = $oFolder->getContactList(false,$format);

				 				$filename = Tools::randomFilename();
				 				 				@$file = fopen($filename,'wb+');
				 				if($aAddresses) {
					$oFolder->saveAddressesToFile($file,$aAddresses,$separator);
					@fclose($file);
					$user->closeSession();
					 					slToolsFilesystem::sendFileHeaders("AddressBook_".date("Ymd-His").'.csv',@filesize($filename),'application/vnd.ms-excel','UTF-8');
					slToolsFilesystem::downloadFile($filename,true);
				}
				break;
			case 'captcha':
				 				session_id($pathData['uid']);
				session_start();
				slSystem::import('tools/captcha');
				
				$oCaptcha = new slToolsCaptcha();
				$sWord = $oCaptcha->getrandomword();
				$_SESSION['captcha']['word'] = $sWord;
				$_SESSION['captcha']['uid'] = $pathData['uid'];
				echo $oCaptcha->showrandomimage($sWord);
				break;
			case 'ticket':
				 				$sPrivateKey = WebmailIqAuth::getServerData('private');
				 				$sHash = $pathData['hash'];
				unset($pathData['hash']);
				 				$sNewHash = MerakGWAPI::createURLLine($pathData);
				 				$sNewHash = rawurlencode(base64_encode(slToolsPHP::gzcompress($sNewHash)));
				$sNewHash = $sNewHash.md5($sPrivateKey);
				 				if($sNewHash!==$sHash){
					exit('Server Private Key missmatch');
				}
				 				$account = new MerakAccount();
				$account->Open($pathData['email']);
				$mailUserDir = $account->getProperty('U_FullMailboxPath');
				$mailUserDir.='~webmail/~upload/';
				 				$requestedFolder = md5($pathData['folder']);
				$requestedFile = $pathData['file'];
				 				 				 				slToolsFilesystem::securePath($requestedFolder);
				slToolsFilesystem::securePath($requestedFile);
				 				$filename = $mailUserDir.$requestedFolder.'/'.$requestedFile;
				 				if(is_object($user)){
					$user->closeSession();
				}
				slToolsFilesystem::sendFileHeaders($pathData['name'],@filesize($filename),$pathData['type']);
				slToolsFilesystem::downloadFile($filename,false);

			break;
			 			case 'email_certificate':
				$account_id = $pathData['account'];
				$folder_id = $pathData['folder'];
				$item_id = $pathData['item'];
				$account = $user->getAccount($account_id);
				$folder = $account->getFolder($folder_id);
				$item = $folder->getItem($item_id);
				$cert = $item->getCertificate(false,$passphrase);				$public = $cert['cert'];
				$der = Tools::pem2der($public);
				$address = MailParse::parseAddresses($item->from);
				$address = reset($address);
				$address = $address['address'];
				$user->closeSession();
				slToolsFilesystem::sendFileHeaders($address.'.der',strlen($der),'application/octet-stream');
				echo $der;
				break;
			case 'contact_certificate':
				$account_id = $pathData['account'];
				$folder_id = $pathData['folder'];
				$item_id = $pathData['item'];
				$part_id = $pathData['part'];
				$account = $user->getAccount($account_id);
				$folder = $account->getFolder($folder_id);
				$item = $folder->getItem($item_id);
				$cert = $item->getCertificate($part_id,$passphrase);
				$email = $cert['ainfo']['subject']['emailAddress'];
				$public = $cert['cert'];
				$der = Tools::pem2der($public);
				$addons = $item->getAddons();
				$location = $addons['location']->getData();
				$address = $location[0]['LCTEMAIL1'];
				$user->closeSession();
				slToolsFilesystem::sendFileHeaders(($address?$address:$email).'.der',strlen($der),'application/octet-stream');
				echo $der;
			break;
			 			case 'personal_certificate':
				$certList = Storage::getCertificates();
				$cid = $pathData['cid'];
				if($cid == 'current'){
					$crt = Storage::getCurrentCertificate($certList);
				}else{
					$crt = Storage::getCertificate($cid);
				}
				$publicKey = trim($crt['cert']);
				Storage::getCertificateInfo($crt['cert'],$ainfo);
				$email = $ainfo['subject']['emailAddress'];
				$email = str_replace(' ','_',$email);
				$der = Tools::pem2der($publicKey);
				$user->closeSession();
				slToolsFilesystem::sendFileHeaders(($email?$email:'cert').'.der',strlen($der),'application/octet-stream');
				echo $der;
			break;
			case 'uploaded_certificate':
				$folder_id = $pathData['folder'];
				$item_id = $pathData['item'];
				$cert = Storage::parseUploadedCertificate($folder_id,$item_id);
				Storage::getCertificateInfo($cert['cert'],$ainfo);
				$email = $ainfo['subject']['emailAddress'];
				$email = str_replace(' ','_',$email);
				$der = Tools::pem2der($cert['cert']);
				$user->closeSession();
				slToolsFilesystem::sendFileHeaders(($email?$email:'cert').'.der',strlen($der),'application/octet-stream');
				echo $der;
			break;
			case 'socks':
				$user->closeSession();
				$api = createobject('API');
				$filename = Tools::randomFilename();
				$result = $api->SOCKSCall(
					'receivefile', 
					'', 
					'socket='.$pathData['socket'].'&filename=' . urlencode($filename) . '&filesize=' . $pathData['size']
				);
				if($result){
					while(!$end){
						@$size = filesize($filename);
						 						$end = $pathData['size'] == $size;
						 						if($lastsize == $size 
						&& (time() - $lastchange > 60) ){
							$end = true;
							$error = true;
						}
						 						if($lastsize!=$size){
							$lastchange = time();
						}
						 						$lastsize = $size;
						 						usleep(2000000);
					}
				}else{
					$error = true;
				}
				if($error){
					echo "Error downloading file";
					exit(0);
				}else{
					slToolsFilesystem::sendFileHeaders($pathData['name'],$pathData['size'],'application/octet-stream');
					slToolsFilesystem::downloadFile($filename,true);
				}
				
			break;
			case 'teamchat_cid':
			     				$pathData['account'] = $_SESSION['EMAIL'];
			case 'cid':
				$account_id = $pathData['account'];
				$folder_id = $pathData['folder'];
				$item_id = $pathData['item'];
				$cid = $pathData['part'];
				
				if(($pos = strpos($pathData['item'],'|')) !== false) {
					 					$start_part_id = '';
					$item_id = substr($pathData['item'],0,$pos);
				}
				$cid = urldecode($cid);
				$account = $user->getAccount($account_id);
				$folder = $account->getFolder($folder_id);
				$item = $folder->getItem($item_id);
				if($resize){
					$resize = array();
					$resize['width'] = $width;
					$resize['height'] = $height;
					$resize['crop'] = $crop;
					$resize['type'] = $type;
					$resize['quality'] = $quality;
				}
				$item->sendCID(
					$cid,
					$start_part_id,
					array(
						'account_id'=>$account_id,
						'folder_id'=>$folder_id,
						'item_id'=>$item_id,
						'sid'=>$sid
					),
					false,
					$resize
				);
			break;
			case 'itemticket':
			case 'attachmentticket':
				$account_id = $pathData['account'];
				$folder_id = $pathData['folder'];
				$item_id = $pathData['item'];
				$att_id = $pathData['part']?$pathData['part']:false;
				
				
				$account = $user->getAccount($account_id);
				$folder = $account->getFolder($folder_id);
				$item = $folder->getItem($item_id);
				
				$rights = Folder::RIGHT_READ;
				$rights |= Folder::RIGHT_WRITE;
				$rights |= Folder::RIGHT_MODIFY;
				
				
				$url = $item->getPublicUrl($att_id,$rights);
				header("Location: ".$url);
				break;
			case 'jitsi_logo':
				$resource_name = 'conferencing_options';
				$fileSettings = 'jitsi_logo_name';
			case 'icechat_background':
			case 'logo':
			case 'background':
				header("Expires: Mon, 1 Jan 2099 00:00:00 GMT");
				$dom = Tools::getHostDomain($pathData['host']);
				$suffix = ($class=='background' || $class=='icechat_background')?'background_name':'logo';
				$resource_name = $resource_name ?? (($class=='icechat_background')?'icechat_settings':'layout_settings');
				$global = Storage::getDefaults($resource_name);
				$domain = Storage::getDomainDefaults($resource_name,$dom);
				$settings = WebmailIqPublic::get($resource_name,$global,$domain,false);
				$fileSettings = $fileSettings ?? 'login_'.$suffix;

				$file = $settings['@childnodes']['item'][0]['@childnodes'][$fileSettings][0]['@value'];
				$forced = $settings['@childnodes']['item'][0]['@childnodes'][$fileSettings][0]['@attributes']['access'] ?? false;

				if($class=='background' || $class=='icechat_background'){
					$defaultfile = 'background--default.jpg';
				}else{
					$defaultfile = 'logo--w.svg';
				}
				 				if(!$file){
					$file = $defaultfile;
				}
				 				$subdir = $dom?($dom.'/'):'';

				if ( file_exists(WM_CONFIGPATH.'images/'.$class.'/custom/'.$subdir.$file) && !$forced){
					$filename = WM_CONFIGPATH.'images/'.$class.'/custom/'.$subdir.$file;	
				}else if ( file_exists(WM_CONFIGPATH.'images/'.$class.'/custom/'.$file)){
					$filename = WM_CONFIGPATH.'images/'.$class.'/custom/'.$file;	
				}else if(file_exists(WM_CONFIGPATH.'images/'.$class.'/'.$file)){
					$filename = WM_CONFIGPATH.'images/'.$class.'/'.$file;
				}else {
					$filename = WM_CONFIGPATH.'images/'.$class.'/'.$defaultfile;
				}
				if(!file_exists($filename)){
					if($fallBackUrl){
						header('Location: '. $fallBackUrl);
						exit();
					}
					http_response_code(404);
					die();
				}
				if($resize){
					$resize = array();
					$resize['width'] = $width;
					$resize['height'] = $height;
					$resize['crop'] = $crop;
					$resize['type'] = $type;
					$resize['quality'] = $quality;
					slSystem::import('tools/image');
					$image = new slToolsImage();
					$api = createobject('api');
					$tempdir = $api->getProperty('C_System_Storage_Dir_TempPath').'webmail/'.slSystem::uniqueID().'/';

					if(!is_dir($tempdir)){
						slToolsFilesystem::mkdir_r($tempdir);
					}
					$tempFile = $tempdir.basename($filename);
					copy($filename,$tempFile);
					$image->load($tempFile);
					$image->edit($resize['width'],$resize['height'],$resize['crop']);
					$resized_name = $tempdir.$image->save();	
				}
				
				slToolsFilesystem::sendFileHeaders(basename($filename),filesize($resized_name?$resized_name:$filename),Tools::getMimeType($filename),false,'inline',true);
				slToolsFilesystem::downloadFile($resized_name?$resized_name:$filename,$resized_name?true:false);

				break;
			case 'two_factor_qr':
			  $oAccount = $_SESSION['user']->getAccount($_SESSION['EMAIL']);
			  try{
				  $qrCode = $oAccount->twoFactorQRCode($pathData['code']);
			  }catch(Exc $e){
				header('HTTP/1.0 403 Forbidden');
				die(403);
			  }
			  $filename = 'qr_code.png';
			  slToolsFilesystem::sendFileHeaders($filename,0,Tools::getMimeType($filename),false,'inline',true);
			  echo base64_decode($qrCode);
			break;
		}
	} catch (Exc $e) {
		echo $e->wmcode;
		log_buffer("Download session [".($sid?$sid:'Unauthorized')."] ERROR : [".$e->wmcode."]","DEBUG");
		exit(0);
	}catch(Exception $e){
		log_buffer("Download session [".($sid?$sid:'Unauthorized')."] ERROR : [".$e->getMessage()."]","DEBUG");
		echo $e->getMessage();
	}
	if($filename){
		log_buffer("Download session [".($sid?$sid:'Unauthorized')."] Filepath [".$filename."]","DEBUG");
	}
	log_buffer("Download session [".($sid?$sid:'Unauthorized')."] ENDED","DEBUG");
}
main();
?>
