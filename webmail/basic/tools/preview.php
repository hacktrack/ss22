<?php
 

chdir('../../server/');
require_once('../basic/tools/imagemagick.class.php');

require_once('inc/require.php');
require_once('inc/get.php');
require_once('inc/include.php');
require_once('inc/exception.php');
require_once('inc/defines.php');


function main() {
	if (($fullpath = Get()->fullpath) === null) {
		exit('Invalid fullpath');
	}
	if (($class = Get()->class) === null) {
		exit('Invalid class');
	}
	 
	if (($sid = Get()->sid) === null) {
		 		if($class!='captcha' 
		&& $class!='ticket' 
		&& $class!='avatar') {
			exit('Invalid sid');
		}
	}

	try {
		if($sid) {
			$user = User::load($sid);
		}
		$pathData = Tools::parseFullPath($fullpath,$class);
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
							$item->getSubjectFileName('.eml')
						);
					}else{
						$item->sendData();
					}
				}else{
					$aFilter['tag'] = 'date,subject,header_from,header_to,cc,bcc,html,text,attachments';
					$aItem = WebmailIqItems::cnvMailItem($item,$aFilter,$part_id?$part_id:'1',false);
					 					$aLanguage = Tools::loadLanguage();
					if($class=='itemtext'){
						$aItem = Tools::prepareItemToBeSaved($aItem);
						if(!$aItem['text'] && $aItem['html']){
							$aItem['text'] = slToolsString::removeHTML($aItem['html']);
						}
						
						$aItem['language'] = $aLanguage;						$data = template('inc/templates/saveastext.tpl',$aItem);
						slToolsFilesystem::sendFileHeaders($item->getSubjectFileName('.txt'),strlen($data),'text/plain','UTF-8');
						echo $data;
					}
					if($class=='itemhtml'){
						$aItem = Tools::prepareItemToBeSaved($aItem,'html');
						if(!$aItem['html'] && $aItem['text']){
							$aItem['html'] = slToolsString::text2html($aItem['text']);
						}
						$aItem['language'] = $aLanguage;						$data = template('inc/templates/saveashtml.tpl',$aItem);
						slToolsFilesystem::sendFileHeaders($item->getSubjectFileName('.html'),strlen($data),'text/html','UTF-8');
						echo $data;
					}
				}
				break;
			 			case 'url':
			case 'attachment':
				$account_id = $pathData['account'];
				$folder_id = $pathData['folder'];
				$item_id = $pathData['item'];
				$part_id = $pathData['part'];
				if(($pos = strpos($pathData['item'],'|')) !== false) {
					$start_part_id = substr($pathData['item'],$pos+1);
					$item_id = substr($pathData['item'],0,$pos);
				}
				
				$account = $user->getAccount($account_id);
				$folder = $account->getFolder($folder_id);
				$item = $folder->getItem($item_id);
				 
				$info=array();
				$fileAtt=$item->getAttachmentDataFile($part_id,$info);
				 				$ext=explode('.',$info['name']);
				$ext=$ext[count($ext)-1];
				$tempName=explode('/',$fileAtt);
				$tempName=$tempName[count($tempName)-1];
				$newName='../basic/tools/temp/'.hash_file('MD5',$fileAtt).'.'.$ext;
				if (!file_exists($newName))
				{
					rename($fileAtt,$newName);
					if (imagemagick::resize($newName,$newName,120,90,70,true))
					{
						header('Location: '.str_replace('../basic/tools/','',$newName));
					}
				}
				else
				{
					header('Location: '.str_replace('../basic/tools/','',$newName));
				}
				
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
				if(($pos = strpos($pathData['item'],'|')) !== false) {
					$start_part_id = substr($pathData['item'],$pos+1);
					$item_id = substr($pathData['item'],0,$pos);
				}else{
					$start_part_id = 1;
				}
				
				$account = $user->getAccount($account_id);
				$folder = $account->getFolder($folder_id);
				$item = $folder->getItem($item_id);
				 				if ($item->wmclass=="M") {
					$fname = $item->getSubjectFileName();
				} else {
					$fname = date('YmdGis');
				}
				$fname.='.zip';
				$fileDir = User::getTempDir().uniqid('zip_').'\\';
				$filename = $fileDir.uniqid('zip_').'.zip';
				$tempDir = $fileDir.'files\\';
				 				try{
					require_once(SHAREDLIB_PATH.'tools/zip.php');
					$zip = new slToolsZIP();
					$zip->setTempDir($tempDir);
					$zip->open($filename, ZIPCREATE);
					
				}catch(Exception $e){
					exit("cannot open <$filename>");
				}
				 				 				 				if ($item->hasAttachments || $item->wmclass=="GW") {
					if($item->wmclass!="GW") {
						$aAttachments = $item->getAllAttachmentFiles($start_part_id);
						foreach($aAttachments as $attachment){
							$name = Tools::fixAttachmentName($attachment);
							$zip->addFile($attachment["file"],$name);
						}
					}else{
						$aAttachments = $item->getAllAttachments();
						foreach($aAttachments as $attachment){
							$name = Tools::fixAttachmentName($attachment);
							$zip->addFromString($name,$attachment["file_content"]);
						}
					}
				}
				 				$zip->close();
				
				 				 				$user->closeSession();
				slToolsFilesystem::sendFileHeaders($fname, filesize($filename), 'application/zip');
				@$fp = fopen($filename,'rb');
				while ($buffer = fread($fp,65536)) {
					echo $buffer;
				}
				@fclose($fp);
				@unlink($filename);
				slSystem::import('tools/filesystem');
				@slToolsFilesystem::rmdir($fileDir,false,true);
				break;
			 			case 'file':
				$folder_id = $pathData['folder'];
				$item_id = $pathData['item'];
				$userAttachments = $user->getAttachments();
				if (!isset($userAttachments[$folder_id][$item_id])) {
					exit('Attachment doesn\'t exist');
				}
				$attachment = $userAttachments[$folder_id][$item_id];
				$path = $attachment['file'];
				$size = filesize($path);
				$attachment['name'] = str_replace("+"," ",$attachment['name']);
				 				$user->closeSession();
				slToolsFilesystem::sendFileHeaders($attachment['name'], $size, $attachment['type']);
				$fp = fopen($path,'rb');
				while ($buffer = fread($fp,65536)) {
					echo $buffer;
				}
				fclose($fp);
				if($attachment['delete']){
					slSystem::import('tools/filesystem');
					slSystem::import('tools/icewarp');
					slToolsIcewarp::iw_delete($attachment['file']);
					slToolsFilesystem::rmdir(dirname($attachment['file']),false,true);
				}
				 				 				break;
			case 'exportvcard':
				$oAccount = $user->getAccount($pathData['account']);
				$oFolder = $oAccount->getFolder($pathData['folder']);
				$t = time();
				$m = microtime();
				$download = $oFolder->saveItems();
				slToolsFilesystem::sendFileHeaders($download['name'],filesize($download['file']),$download['type'],'utf-8');
				@$fp = fopen($download['file'],'rb+');
				while(@$buffer = fread($fp,65535)){
					echo $buffer;
				}
				@fclose($fp);
				
			break;
			case 'exportcsv':
				$account_id = $pathData['account'];
				$folder_id = $pathData['folder'];
				$separator = $pathData['item'];
				
				 				$oAccount = $user->getAccount($account_id);
				$oFolder = $oAccount->getFolder($folder_id);
				
				 				$aAddresses = $oFolder->getContactList();

				 				$fileName = Tools::randomFilename();
				 				 				@$file = fopen($fileName,'wb+');
				 				if($aAddresses) {
					$oFolder->saveAddressesToFile($file,$aAddresses,$separator);
					@fclose($file);
					$user->closeSession();
					slToolsFilesystem::sendFileHeaders("AddressBook_".date("Ymd-His").'.csv',filesize($fileName),'application/vnd.ms-excel','UTF-8');
					 					@$file = fopen($fileName,'rb+');
					while(@$buffer = fread($file,65536)) {
						echo $buffer;
					}
				}
				@fclose($file);
				@unlink($file);
				break;
			case 'captcha':
				 				session_id($pathData['uid']);
				session_start();
				slSystem::import('tools/captcha');
				$oCaptcha = new slToolsCaptcha;
				$sWord = $oCaptcha->getrandomword();
				$_SESSION['captcha']['word'] = $sWord;
				$_SESSION['captcha']['uid'] = $pathData['uid'];
				echo $oCaptcha->showrandomimage($sWord);
				break;
			case 'ticket':
				 				$sPrivateKey = WebmailIQAuth::getServerData('private');
				 				$sHash = $pathData['hash'];
				unset($pathData['hash']);
				 				$sNewHash = MerakGWAPI::createURLLine($pathData);
				$sNewHash = rawurlencode(base64_encode(gzcompress($sNewHash)));
				$sNewHash = $sNewHash.md5($sPrivateKey);
				 				if($sNewHash!==$sHash){
					exit('Server Private Key missmatch');
				}
				 				$account = new MerakAccount();
				$account->Open($pathData['email']);
				$mailUserDir = $account->getProperty('U_FullMailboxPath');
				$mailUserDir.='~webmail/~upload/';
				 				$requestedFolder = $pathData['folder'];
				$requestedFile = $pathData['file'];
				 				 				 				slSystem::import('tools/filesystem');
				slToolsFilesystem::securePath($requestedFolder);
				slToolsFilesystem::securePath($requestedFile);
				 				$sFile = $mailUserDir.$requestedFolder.'/'.$requestedFile;
				 				slToolsFilesystem::sendFileHeaders(
					$pathData['name'],
					filesize($sFile),
					$pathData['type']
				);
				if(is_object($user)){
					$user->closeSession();
				}
				echo file_get_contents($sFile);
			break;
			case 'avatar':
				$api = createobject('API');
				
				 				$configPath = $api->getProperty('C_ConfigPath');
				$photoPath = $configPath.'_webmail/photo/';
				 				$sJID = $pathData['jid'];
				$avatarFile = $photoPath.$sJID.avatarext;
				 				 				if(file_exists($avatarFile)){
					$xml = slToolsXML::loadFile($avatarFile);
					 					header("Expires: Mon, 1 Jan 2099 00:00:00 GMT");
					$data = base64_decode(strval($xml->data));
					 					slToolsFilesystem::sendFileHeaders(
						strval($xml->name),
						strlen($data),
						strval($xml->type)
					);
					echo $data;
				 				}else{
					slToolsFilesystem::sendFileHeaders(
						DEFAULT_AVATAR_NAME,
						filesize(DEFAULT_AVATAR),
						Tools::getMimeType(DEFAULT_AVATAR)
					);
					echo file_get_contents(DEFAULT_AVATAR);
				}
				
				
			break;
			 			case 'email_certificate':
				$account_id = $pathData['account'];
				$folder_id = $pathData['folder'];
				$item_id = $pathData['item'];
				$account = $user->getAccount($account_id);
				$folder = $account->getFolder($folder_id);
				$item = $folder->getItem($item_id);
				$cert = $item->getCertificate();
				$public = $cert['cert'];
				$der = Tools::pem2der($public);
				$address = Mailparse::parseAddresses($item->from);
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
				$cert = $item->getCertificate($part_id);
				$email = $cert['ainfo']['subject']['emailAddress'];
				$name = str_replace(' ','_',$name);
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
				$der = Tools::pem2der($publicKey);
				$user->closeSession();
				slToolsFilesystem::sendFileHeaders($_SESSION['EMAIL'].'.der',strlen($der),'application/octet-stream');
				echo $der;
			break;
			case 'uploaded_certificate':
				$folder_id = $pathData['folder'];
				$item_id = $pathData['item'];
				$cert = Storage::parseUploadedCertificate($folder_id,$item_id,'');
				$der = Tools::pem2der($cert['cert']);
				$user->closeSession();
				slToolsFilesystem::sendFileHeaders('cert.der',strlen($der),'application/octet-stream');
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
						$size = filesize($filename);
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
				}
				@$fp = fopen($filename,'r+');
				while(@$buffer = fread($fp,65535)){
					echo $buffer;
				}
				@fclose($fp);
				@unlink($filename);
			break;
			case 'cid':
				$account_id = $pathData['account'];
				$folder_id = $pathData['folder'];
				$item_id = $pathData['item'];
				$cid = $pathData['part'];
				if(($pos = strpos($pathData['item'],'|')) !== false) {
					$start_part_id = substr($pathData['item'],$pos+1);
					$item_id = substr($pathData['item'],0,$pos);
				}
				$cid = urldecode($cid);
				$account = $user->getAccount($account_id);
				$folder = $account->getFolder($folder_id);
				$item = $folder->getItem($item_id);
				$item->sendCID(
					$cid,
					$start_part_id,
					array(
						'account_id'=>$account_id,
						'folder_id'=>$folder_id,
						'item_id'=>$item_id,
						'sid'=>$sid
					)
				);
			break;
		}
	} catch (Exception $e) {
		exit($e->Message());
	}
}
main();
?>
