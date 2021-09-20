<?php
class Hipaa
{
	public static function setValue($var,$val,$email=false)
	{
		if(!$email){$email=$_SESSION['EMAIL'];}
		
		if($var=='name')
		{
			return self::setAccountProperty('U_Name',$val,$email);
		}
		elseif($var=='notifyto')
		{
			return self::setNotificationAccountProperty('N_NotifyTo',$val,$email);
		}
		elseif($var=='phone')
		{
			return self::setSMSPhoneNumber($val,$email);
		}
		elseif($var=="date")
		{
			return self::setDateOfBirth($val,$email);
		}
		elseif($var=="address")
		{
			return self::setAddress($val,$email);
		}
		return false;
	}
	
	public static function getValue($var,$email=false)
	{
		if(!$email){$email=$_SESSION['EMAIL'];}
		
		if($var=='name')
		{
			return self::getAccountProperty('U_Name',$email);
		}
		elseif($var=='notifyto')
		{
			return self::getNotificationAccountProperty('N_NotifyTo','notification',$email);
		}
		elseif($var=='phone')
		{
			return self::getNotificationAccountProperty('N_NotifyTo','sms',$email);  		}
		elseif($var=="address")
		{
			$ret=self::getAddress($email);
			$ret=slToolsPHP::htmlspecialchars($ret);
			return $ret;
		}
		return false;
	}
	
	static public function createItem($email,$parameters)
	{
		 		$category = $parameters['category'];
		$name = $parameters['name'];
		$zip = $parameters['zip'];
		$city = $parameters['city'];
		$state = $parameters['state'];
		
		$notify_email = $parameters['notify_email'];
		$notify_sms = $parameters['notify_sms'];
		$smsuser = '';  		$smspass = '';  		
		$result = true;
		$parts = self::splitEmailAddress($email);
		$username = $parts['username'];
		$domain = $parts['domain'];
		$notification_alias = $username.'.notification@'.$domain;
		$sms_notification_alias = $username.'.sms@'.$domain;
		
		$account = new IceWarpAccount();
		 		$account->New_($notification_alias);
		$account->SetProperty('u_type',3);
		$account->SetProperty('n_notifyto',$notify_email);
		$result = $result && $account->Save();
		 		$account->New_($sms_notification_alias);
		$account->SetProperty('u_type',3);
		$account->SetProperty('n_notifyto','sms:'.urlencode($notify_sms).'&smsuser='.urlencode($smsuser).'&smspass='.urlencode($smspass));
		$result = $result && $account->Save();
		 		$account->New_($email);
		$account->SetProperty('u_type',0);
		 		$account->SetProperty('U_MailIn',$notification_alias.';'.$sms_notification_alias);
		 		if($parameters['name']){
			$result = $result && $account->SetProperty('u_name',$name);
		}
		 		$result = $result && $account->SetProperty('u_authmodevalue',$category);
		
		 		$pin = rand(0,9).rand(0,9).rand(0,9).rand(0,9);
		$result = $result && $account->SetProperty('u_password',$pin);
		$result = $result && $account->Save();
		
		$result = $result && self::sendCredentials($notify_email,$username,$pin);
		
		$account->Open($email);
		 		 
		 		$mailbox = $account->GetProperty('u_fullmailboxpath');
		$xml = new SimpleXMLElement(
			'<otp>'.
				'<sms>'.slToolsPHP::htmlspecialchars($notify_sms).'</sms>'.
				'<email>'.slToolsPHP::htmlspecialchars($email).'</email>'.
				'<chess>'.slToolsPHP::htmlspecialchars($email).'</chess>'.
				'<category>'.slToolsPHP::htmlspecialchars($category).'</category>'.
			'</otp>'
		);
		if(!is_dir($mailbox)){
			slSystem::import('tools/filesystem');
			slToolsFilesystem::mkdir_r($mailbox);
		}
		$result = $result && $xml->saveXML($mailbox."otp.xml");
		 		$result = $result && self::assignToGroup($email,$category);
		 		$certificateFile = self::generateUserCertificate($email, $parameters);
		 		$result = $result && self::autoCreateMyCard($email,$parameters);
		 		$result = $result && self::setAccountCardProperties($email, $parameters, $certificateFile);
		 		$result = $result && self::linkPublicFolders($email,$category);
		return $result;
	}
	
	public static function editItem($email,$parameters)
	{
		 		$category = $parameters['category'];
		$name = $parameters['name'];
		$zip = $parameters['zip'];
		$city = $parameters['city'];
		$state = $parameters['state'];
		$notify_email = $parameters['notify_email'];
		$notify_sms = $parameters['notify_sms'];
		$smsuser = '';  		$smspass = '';  		
		$result = true;
		$parts = self::splitEmailAddress($email);
		$username = $parts['username'];
		$domain = $parts['domain'];
		$notification_alias = $username.'.notification@'.$domain;
		$sms_notification_alias = $username.'.sms@'.$domain;
		
		$account = new IceWarpAccount();
		 		$account->Open($notification_alias);
		$account->SetProperty('u_type',3);
		$account->SetProperty('n_notifyto',$notify_email);
		$result = $result && $account->Save();
		 		$account->Open($sms_notification_alias);
		$account->SetProperty('u_type',3);
		$account->SetProperty('n_notifyto','sms:'.urlencode($notify_sms).'&smsuser='.urlencode($smsuser).'&smspass='.urlencode($smspass));
		$result = $result && $account->Save();
		 		$account->Open($email);
		$account->SetProperty('u_type',0);
		 		$account->SetProperty('U_MailIn',$notification_alias.';'.$sms_notification_alias);
		 		if($parameters['name']){
			$result = $result && $account->SetProperty('u_name',$name);
		}
		$result = $result && $account->Save();		
		$result = $result && self::setAccountCardProperties($email, $parameters);
		return $result;
	}
	
	public static function deleteItem($email, $category = 'patients')
	{
		$result = true;
		$parts = self::splitEmailAddress($email);
		$username = $parts['username'];
		$domain = $parts['domain'];
		$notification_alias = $username.'.notification@'.$domain;
		$sms_notification_alias = $username.'.sms@'.$domain;
		
		$account = new IceWarpAccount();
		$result = $result && $account->Open($notification_alias);
		$result = $result && $account->Delete();
		$result = $result && $account->Open($sms_notification_alias);
		$result = $result && $account->Delete();
		$result = $result && $account->Open($email);
		$result = $result && $account->Delete();
		
		$result = $result && self::deleteChessCard($email,$category);
		$result = $result && self::detachFromGroup($email,$category);
		return $result;
	}
	
	private static function getNotificationAccountProperty($prop,$notifytype='notification',$email=false)
	{
		if(!$email){$email=$_SESSION['EMAIL'];}
		$parts = self::splitEmailAddress($email);
		$notification_account=$parts['username'].($notifytype?'.'.$notifytype:'').'@'.$parts['domain'];
		
		$account=new IceWarpAccount();
		if(!$account->open($notification_account))
		{
			 			return false;
		}
		return $account->GetProperty($prop);
	}
	
	private static function setNotificationAccountProperty($prop,$val,$notifytype='notification',$email=false)
	{
		if(!$email){$email=$_SESSION['EMAIL'];}
		$parts = self::splitEmailAddress($email);
		$notification_account=$parts['username'].($notifytype?'.'.$notifytype:'').'@'.$parts['domain'];
		
		$account=new IceWarpAccount();
		if(!$account->open($notification_account))
		{
			 			return false;
		}
		if(!$account->SetProperty($prop,$val))
		{
			return false;
		}
		return $account->save();
	}
	
	private static function getAccountProperty($prop,$email=false)
	{
		if(!$email){$email=$_SESSION['EMAIL'];}
		$account=new IceWarpAccount();
		if(!$account->open($email))
		{
			 			return false;
		}
		return $account->GetProperty($prop);
	}
	
	private static function setAccountProperty($prop,$val,$email=false)
	{
		if(!$email){$email=$_SESSION['EMAIL'];}
		$account=new IceWarpAccount();
		if(!$account->open($email))
		{
			 			return false;
		}
		if(!$account->SetProperty($prop,$val))
		{
			return false;
		}
		return $account->save();
	}
	private static function getSMSPhoneNumber($email=false)
	{
		if(!$email){
			$email=$_SESSION['EMAIL'];
		}
		$com=new IceWarpAccount();
		if(!$ret=$com->open($email))
		{
			return false;
		}
		$path=$com->GetProperty('u_fullmailboxpath')."otp.xml";
		 		if(file_exists($path))
		{
			if(@$xml=slToolsXML::loadFile($path))
			{
				if(isset($xml->sms))
				{
					return $xml->sms;
				}
				elseif(isset($xml->email))
				{
					return $xml->email;
				}
			}
		}
		return false;
	}
	private static function setSMSPhoneNumber($val,$email=false)
	{
		if(!$email){$email=$_SESSION['EMAIL'];}
		$com=new IceWarpAccount();
		if(!$ret=$com->open($email))
		{
			return false;
		}
		$path=$com->GetProperty('u_fullmailboxpath')."otp.xml";
		if(file_exists($path))
		{
			if(@$xml=slToolsXML::loadFile($path))
			{
				$ok=false;
				if(isset($xml->sms))
				{
					$xml->sms=$val;
					$ok=true;
				}
				elseif(isset($xml->email))
				{
					$xml->email=$val;
					$ok=true;
				}
				if($ok)
				{
					return $xml->saveXML($path);
				}
			}
		}
		return false;
	}
	
	private static function setDateOfBirth($val,$email=false)
	{
		if(!$email){$email=$_SESSION['EMAIL'];}
		$com=new IceWarpAccount();
		if(!$ret=$com->open($email))
		{
			return false;
		}
		$path=$com->GetProperty('u_fullmailboxpath')."otp.xml";
		if(file_exists($path))
		{
			if(@$xml=slToolsXML::loadFile($path))
			{
				if(!isset($xml->birth))
				{
					$xml->addChild('birth');
				}
				if(!isset($xml->birth->day))
				{
					$xml->birth->addChild('day',$val['day']);
				}
				else
				{
					$xml->birth->day=$val['day'];
				}
				if(!isset($xml->birth->month))
				{
					$xml->birth->addChild('month',$val['month']);
				}
				else
				{
					$xml->birth->month=$val['month'];
				}
				if(!isset($xml->birth->year))
				{
					$xml->birth->addChild('year',$val['year']);
				}
				else
				{
					$xml->birth->year=$val['year'];
				}
				return $xml->saveXML($path);
			}
		}
		return false;
	}
	
	private static function getDateOfBirth($email=false)
	{
		if(!$email){$email=$_SESSION['EMAIL'];}
		$com=new IceWarpAccount();
		if(!$ret=$com->open($email))
		{
			return false;
		}
		$path=$com->GetProperty('u_fullmailboxpath')."otp.xml";
		if(file_exists($path))
		{
			if(@$xml=slToolsXML::loadFile($path))
			{
				if(!isset($xml->birth))
				{
					return false;
				}
				if(!isset($xml->birth->day))
				{
					return false;
				}
				if(!isset($xml->birth->month))
				{
					return false;
				}
				if(!isset($xml->birth->year))
				{
					return false;
				}
				
				$ret['day']=$xml->birth->day;
				$ret['month']=$xml->birth->month;
				$ret['year']=$xml->birth->year;
				
				return $ret;
			}
		}
		return false;
	}
	
	private static function setAddress($val,$email=false)
	{
		if(!$email){$email=$_SESSION['EMAIL'];}
		$com=new IceWarpAccount();
		if(!$ret=$com->open($email))
		{
			return false;
		}
		$path=$com->GetProperty('u_fullmailboxpath')."otp.xml";
		if(file_exists($path))
		{
			if(@$xml=slToolsXML::loadFile($path))
			{
				if(!isset($xml->address))
				{
					$xml->addChild('address',$val);
					return $xml->saveXML($path);
				}
				else
				{
					$xml->address=$val;
					return $xml->saveXML($path);
				}
			}
		}
		return false;
	}
	
	private static function getAddress($email=false)
	{
		if(!$email){$email=$_SESSION['EMAIL'];}
		$com=new IceWarpAccount();
		if(!$ret=$com->open($email))
		{
			return false;
		}
		$path=$com->GetProperty('u_fullmailboxpath')."otp.xml";
		if(file_exists($path))
		{
			if(@$xml=slToolsXML::loadFile($path))
			{
				if(isset($xml->address))
				{
					return $xml->address;
				}
				return false;
			}
		}
		return false;
	}
	private static function splitEmailAddress($email)
	{
		$user = substr($email,0,strrpos($email,'@'));
		$domain = substr($email,strrpos($email,'@')+1);
		return array(
				'username'=>$user,
				'domain'=>$domain
		);
	}
	
	private static function autoCreateMyCard($email,$parameters = array(),$gw = false)
	{
		if($gw === false){
			$gw = self::superLogin();
			$gw->FunctionCall("SubstituteUser",$gw->sessid,$email);
			$gid = $gw->OpenGroup();
		}else{
			$gid = $gw->gid;
		}
		$fid = $gw->OpenFolder("@@mycard@@");
		$fid = $fid['fid'];
		 		$myvcard = $gw->FunctionCall(
			'GetMyvCard',
			$gid
		);
		$gw->FunctionCall(
			'SetMyvCard',
			$gid,
			$myvcard
		);
		$gw->Logout();
		return true;
	}
	
	public static function getAccountCardProperties($email,$gw = false)
	{
		if(!$gw){
			$gw = self::superLogin();
			$gw->FunctionCall("SubstituteUser",$gw->sessid,$email);
			$gid = $gw->OpenGroup();
		}else{
			$gid = $gw->gid;
		}
		$fid = $gw->OpenFolder("@@mycard@@");
		$fid = $fid['fid'];
			 		$aEvent = $gw->FunctionCall(
				'GetContactList',
				$fid,
				"ItmUID='@@mycard@@'",
				""
		);
		$aEvent = $gw->ParseParamLine($aEvent);
		$aMyCardID = $aEvent[0]['ITM_ID'];
		$aEvent = $gw->FunctionCall(
			'GetContactDetailList',
			$fid,
			"ITM_ID = '".$aMyCardID."'",
			"*"
		);
		$item = $gw->ParseParamLine($aEvent);
		foreach($item as $key=>$val){
			if($val['LCTTYPE']=='H'){
				$item = $val;
				break;
			}
		}
		$gw->Logout();
		$result['street'] = $item['LCTSTREET'];
		$result['city'] = $item['LCTCITY'];
		$result['state'] = $item['LCTSTATE'];
		$result['zip'] = $item['LCTZIP'];
		return $result;
	}
	
	private static function setAccountCardProperties($email,$properties,$certificate = false)
	{
		$gw = self::superLogin();
		$gw->FunctionCall("SubstituteUser",$gw->sessid,$email);
		$gid = $gw->OpenGroup();
		$fid = $gw->OpenFolder("@@mycard@@");
		$fid = $fid['fid'];
		 		$aEvent = $gw->FunctionCall(
				'GetContactList',
				$fid,
				"ItmUID='@@mycard@@'",
				""
		);
		$aEvent = $gw->ParseParamLine($aEvent);
		$aMyCardID = $aEvent[0]['ITM_ID'];
		$aEvent = $gw->FunctionCall(
			'GetContactDetailList',
			$fid,
			"ITM_ID = '".$aMyCardID."'",
			"*"
		);
		$item = $gw->ParseParamLine($aEvent);
		foreach($item as $key=>$val){
			if($val['LCTTYPE']=='H'){
				$item = $val;
				break;
			}
		}
		
		$id = $item['ITM_ID'];
		$lctid = $item['LCT_ID'];
		foreach($properties as $property =>$value){
			switch(strtoupper($property)){
				case 'NAME':
					$data['ITMCLASSIFYAS'] = $value;
					break;
				case 'STREET':
				case 'CITY':
				case 'STATE':
				case 'ZIP':
					$location['LCT'.strtoupper($property)] = $value;
					break;
				case 'NOTIFY_SMS':
					$location['LCTPHNMOBILE'] = $value;
					break;
			}
		}
		$data = $gw->CreateParamLine($data);
		$location = $gw->CreateParamLine($location);
		$result = $gw->FunctionCall("AddContactInfo",$fid,$data,$id);
		$result = $gw->FunctionCall("AddContactLocation",$fid,$id,$location,$lctid);
		if($certificate){
			$data = Storage::parseCertificates(file_get_contents($certificate));
			if(is_array($data)){
				$data = reset($data);
				$public = $data['cert'];
			}
			 			$result = $gw->FunctionCall("SetContactCertificate",$fid,$id,$public);
			 			$account = new IceWarpAccount();
			$account->Open($email);
			$path = $account->GetProperty('u_fullmailboxpath');
			copy($certificate,$path.'cert.pem');
		}
		$gw->Logout();
		return $result;
	}
	
	private static function generateUserCertificate($email,$parameters)
	{
		$parts = self::splitEmailAddress($email);
		$certificate = icewarp_create_certificate(2048,365,$parameters['country'],'',$parameters['street'],$parameters['zip'],'Sending and Receiving emails',$parameters['name'],$email);
		return $certificate;
	}
	
	private static function linkPublicFolders($email,$category = 'patients')
	{
		$account = new IceWarpAccount();
		$account->Open($email);
		$mailbox = $account->GetProperty('u_fullmailboxpath');
		$wmDir = $mailbox.'~webmail/';
		if(!is_dir($wmDir)){
			slToolsFilesystem::mkdir_r($wmDir);
		}
		if($category=='patients'){
			$xml = new SimpleXMLElement('
					<personal>
						<folders>
							<contacts>
								<folder label="Staff">Staff/Contacts</folder>
							</contacts>
						</folders>
					</personal>');
			
		}else{
			$xml = new SimpleXMLElement('
				<personal>
					<folders>
						<files>
							<folder label="Documents">Staff/Documents</folder>
						</files>
						<contacts>
							<folder label="Staff">Staff/Contacts</folder>
							<folder label="Patients">Patients/Contacts</folder>
						</contacts>
					</folders>
				</personal>');
		}
		return $xml->saveXML($wmDir.'folders.xml');
		
	}

	private static function assignToGroup($email,$type = 'patients')
	{
		$parts = self::splitEmailAddress($email);
		$username = $parts['username'];
		$domain = $parts['domain'];
		
		$group_name = $type.'group@'.$domain;
		$group = new IceWarpAccount();
		$group->Open($group_name);
		$membersText  = $group->GetProperty('G_ListFile_Contents');
		$members = explode(CRLF,$membersText);
		$crlfAtTheEnd = false;
		if(!$members[count($members)-1]){
			$crlfAtTheEnd = true;
			unset($members[count($members)-1]);
		}
		$found = false;
		foreach($members as $member){
			if(strtolower($member) == strtolower($email)){
				$found = true;
				break;
			}
		}
		if(!$found){
			$membersText.=($crlfAtTheEnd?'':CRLF).$email.CRLF;
			$group->SetProperty('G_ListFile_Contents',$membersText);
			return $group->Save();
		}
		return true;
	}
	
	private static function detachFromGroup($email, $type = 'patients')
	{
		$parts = self::splitEmailAddress($email);
		$username = $parts['username'];
		$domain = $parts['domain'];
		
		$group_name = $type.'group@'.$domain;
		$group = new IceWarpAccount();
		$group->Open($group_name);
		$membersText  = $group->GetProperty('G_ListFile_Contents');
		$members = explode(CRLF,$membersText);
		$crlfAtTheEnd = false;
		if(!$members[count($members)-1]){
			$crlfAtTheEnd = true;
			unset($members[count($members)-1]);
		}
		$found = false;
		foreach($members as $key => $member){
			if(strtolower($member) == strtolower($email)){
				$found = true;
				unset($members[$key]);
				break;
			}
		}
		if($found){
			$membersText = join(CRLF,$members).CRLF;
			$group->SetProperty('G_ListFile_Contents',$membersText);
			return $group->Save();
		}
		return true;
	}
	
	private static function superLogin()
	{
		$api = IceWarpAPI::instance();
		unset($_SESSION['GW']);
		$gw = new MerakGWAPI('com.icewarp.webclient');
		$gw->user = $api->GetProperty('c_gw_superuser');
		$gw->setPassword($api->GetProperty('c_gw_superpass'));
		
		if($gw->Login()){
			return $gw;
		}else{
			return false;
		}
	
	}
	
	private static function sendCredentials($to,$username,$pin)
	{
		$info = self::splitEmailAddress($to);
			
		$mailer = new Mail();
		$mailer->XMailer.='-HIPPA';
		$mailer->addTo($to);
		$mailer->setFrom('noreply@'.$info['domain']);
		$mailer->setSubject("Login Credentials for ".$username);
		$mailer->setBody("Hello , your login credentials are: \r\n\r\nUsername: ".$username."\r\nPin: ".$pin);
		return $mailer->send();
	}

}
?>