<?php
 
class slServices
	{
		static private $servicesData = array(
			"smtp"=>array(
				'id'=>'SMTP',
				'daemon'=>'SMTP',
				'storage'=>'api',
				'variable'=>'C_Mail_SMTP_Active',
				'logging_storage'=>'api',
				'logging_variable'=>'C_System_Log_Services_SMTP'
			),
			"pop3"=>array(
				'id'=>'POP3',
				'label'=>'POP3',
				'daemon'=>'POP3',
				'storage'=>'api',
				'variable'=>'C_Mail_POP_Active',
				'logging_storage'=>'api',
				'logging_variable'=>'C_System_Log_Services_POP3'
			),
			"imap"=>array(
				'id'=>'IMAP',
				'daemon'=>'POP3',
				'storage'=>'api',
				'variable'=>'C_Mail_IMAP_Active',
				'logging_storage'=>'api',
				'logging_variable'=>'C_System_Log_Services_IMAP'
			),
			"webclient"=>array(
				'id'=>'WebClient',
				'daemon'=>'Control',
				'storage'=>'api',
				'variable'=>'C_Webmail_Active',
				'logging_storage'=>'api',
				'logging_variable'=>'C_WebMail_Logs'
			),
			"anti-spam"=>array(
				'id'=>'Anti-Spam',
				'daemon'=>'SMTP',
				'daemons'=>array(
					'SMTP',
					'POP3'
				),
				'storage'=>'api',
				'variable'=>'C_AS_General_Enable',
				'logging_storage'=>'api',
				'logging_variable'=>'C_System_Log_Services_AS'
			),
			"anti-virus"=>array(
				'id'=>'Anti-Virus',
				'daemon'=>'SMTP',
				'daemons'=>array(
					'SMTP',
					'POP3'
				),
				'storage'=>'api',
				'variable'=>'C_AV_General_IntegratedAV',
				'logging_storage'=>'api',
				'logging_variable'=>'C_System_Log_Services_AV'
			),
			"control"=>array(
				'id'=>'Control',
				'daemon'=>'Control',
				'label'=>'Web',
				'storage'=>'api',
				'variable'=>'C_Mail_Control_Active',
				'logging_storage'=>'api',
				'logging_variable'=>'C_System_Log_Services_Control'
			),
			 
			'meeting'=>array(
					'id'=>'Meeting',
					'label'=>'WebMeetings',
					'daemon'=>'IM',
					'storage'=>'api',
					'variable'=>'c_meeting_active',
					'logging_storage'=>'api',
					'logging_variable'=>'c_system_log_services_meeting'
			),
			"ftp"=>array(
				'id'=>'FTP',
				'daemon'=>'Control',
				'storage'=>'api',
				'variable'=>'C_FTPService_Active',
				'logging_storage'=>'api',
				'logging_variable'=>'C_System_Log_Services_FTP'
			),
			"gw"=>array(
				'id'=>'GW',
				'daemon'=>'GW',
				'label'=>'GroupWare',
				'storage'=>'api',
				'variable'=>'C_GW_General_Disable',
				'inverse'=>1,
				'logging_storage'=>'api',
				'logging_variable'=>'C_System_Log_Services_GW'
			),
			"groupware_notification"=>array(
				'id'=>'Groupware_notification',
				'label'=>'GroupWare Notification',
				'daemon'=>'Control',
				'storage'=>'api',
				'variable'=>'C_PushServer_Active',
				'logging_storage'=>'api',
				'logging_variable'=>'C_System_Log_Services_SyncPush'
			),
			"activesync"=>array(
				'id'=>'ActiveSync',
				'daemon'=>'Control',
				'storage'=>'api',
				'variable'=>'C_ActiveSync_Active',
				'logging_storage'=>'api',
				'logging_variable'=>'C_System_Log_Services_ActiveSync',
			),
			"syncml"=>array(
				'id'=>'SyncML',
				'daemon'=>'Control',
				'storage'=>'api',
				'variable'=>'C_SyncML_Active',
				'logging_storage'=>'api',
				'logging_variable'=>'C_System_Log_Services_SyncML'
			),
			"webdav"=>array(
				'id'=>'WebDAV',
				'daemon'=>'Control',
				'storage'=>'api',
				'variable'=>'C_WebDAV_Active',
				'logging_storage'=>'api',
				'logging_variable'=>'C_System_Log_Services_WebDAV'
			),
			"im"=>array(
				'id'=>'IM',
				'daemon'=>'IM',
				'label'=>'Instant Messaging',
				'storage'=>'api',
				'variable'=>'C_IM_General_Disable',
				'inverse'=>1,
				'logging_storage'=>'api',
				'logging_variable'=>'C_System_Log_Services_IM'
			),
			"sms"=>array(
				'id'=>'SMS',
				'daemon'=>'Control',
				'storage'=>'api',
				'variable'=>'C_SMSService_Active',
				'logging_storage'=>'api',
				'logging_variable'=>'C_System_Log_Services_SMS'
			),
			"sip"=>array(
				'id'=>'sip',
				'label'=>'VoIP',
				'daemon'=>'IM',
				'storage'=>'api',
				'variable'=>'C_System_Services_SIP_Enable',
				'logging_storage'=>'api',
				'logging_variable'=>'C_System_Log_Services_SIP'
			),
			"ldap"=>array(
				'id'=>'LDAP',
				'daemon'=>'Control',
				'storage'=>'api',
				'variable'=>'C_System_Services_LDAP_Enable',
				'logging_storage'=>'api',
				'logging_variable'=>'C_System_Log_Services_LDAP'
			),
			"socks"=>array(
				'id'=>'SOCKS',
				'daemon'=>'Control',
				'storage'=>'api',
				'variable'=>'C_System_Services_Socks_Enabled',
				'logging_storage'=>'api',
				'logging_variable'=>'C_System_Log_Services_Socks'
			),
			"minger"=>array(
				'id'=>'Minger',
				'daemon'=>'Control',
				'storage'=>'api',
				'variable'=>'C_System_Services_Minger_Enabled',
				'logging_storage'=>'api',
				'logging_variable'=>'C_System_Services_Minger_Logging'
			),
			"snmp"=>array(
				'id'=>'SNMP',
				'daemon'=>'Control',
				'storage'=>'api',
				'variable'=>'C_System_Adv_Ext_SNMPServer',
				'logging_storage'=>'api',
				'logging_variable'=>'C_System_Log_Services_SNMP'
			),
			"teamchat"=>array(
				'id'=>'TEAMCHAT',
				'label'=>'TeamChat',
				'daemon'=>'GW',
				'storage'=>'api',
				'variable'=>'c_teamchat_active',
				'logging_storage'=>'api',
			 	'logging_variable'=>'C_System_Log_Services_TeamChat'	
			)
		);
		static private $base;
		
		private $api;
		private $stat;
		private $error;
		private $needReload;
		
		 
		private function __construct($id = 'Shared::slStatistics')
		{
			$this->api = IceWarpAPI::instance($id);
			$this->stat = new IceWarpStatistics();
			$this->needReload = false;
		}
		
		 
		function slService()
		{
			$this->api = new IceWarpAPI();
			$this->stat = new IceWarpStatistics();
			$this->needReload = false;
		}
		
		 
		static public function instance($id = 'Shared::slStatistics')
		{
			if(!isset(self::$base)){
				self::$base = new slServices($id);
			}
			return self::$base;
		}
		
		 
		public function Start( $serv )
		{
			$service = self::$servicesData[strtolower($serv)];
			if(!$service){
				$this->Error('start_unknown_service',$serv);
				return false;
			}
			switch($service['storage']){
				case 'datfile':
					$this->startInFile($service['id']);
				break;
				case 'api':
					$this->api->SetProperty( $service['variable'], $service['inverse']?0:1 );
					$this->api->Save();
				break;
			}
			if( !$this->IsDaemonRunning( $service['daemon'] ) ){
				$this->startDaemon( $service['daemon'] );
			}
		}
		
		 
		public function Stop( $serv )
		{
			$service = self::$servicesData[strtolower($serv)];
			if(!$service){
				$this->Error('stop_unknown_service',$serv);
				return false;
			}
			switch($service['storage']){
				case 'datfile':
					$this->stopInFile($service['id']);
				break;
				case 'api':
					$this->api->SetProperty( $service['variable'], $service['inverse']?1:0 );
					$this->api->Save();
				break;
			}
		}
		
		 
		public function Restart($serv)
		{
			$service = self::$servicesData[strtolower($serv)];
			if(!$service){
				$this->Error('restart_unknown_service',$serv);
				return false;
			}
			$this->stopDaemon($service['daemon']);
			$this->startDaemon($service['daemon']);
			
			return true;
		}
		
		 
		public function RestartAll()
		{
            $daemonsToRestart = [];
			foreach(self::$servicesData as $service){
				$daemonsToRestart[$service['daemon']] = $service['daemon'];
			}
			foreach($daemonsToRestart as $daemon){
				$this->stopDaemon($daemon);
				$this->startDaemon($daemon);
			}
		}
		
		public function RestartActive()
		{
            $daemonsToStart = [];
			foreach(self::$servicesData as $id => $service){
				if($this->IsRunning($id)){
					$daemonsToStart[strtolower($service['daemon'])] = $service['daemon'];
				}
			}
			foreach($daemonsToStart as $id => $daemon){
				$this->stopDaemon( $daemon );
				$this->startDaemon( $daemon );
			}
		}
		
		 
		public function StopAll()
		{
            $daemonsToStop = [];
			foreach(self::$servicesData as $service){
				$daemonsToStop[strtolower($service['daemon'])] = $service['daemon'];
			}
			foreach($daemonsToStop as $daemon){
				$this->stopDaemon( $daemon );
			}
		}
		
		 

		public function StartAll()
		{
            $daemonsToStart = [];
			foreach(self::$servicesData as $service){
				$daemonsToStart[strtolower($service['daemon'])] = $service['daemon'];
			}
			foreach($daemonsToStart as $daemon){
				$this->startDaemon($daemon);
			}
		}
		
		public function StartActive()
		{
            $daemonsToStart = [];
			foreach(self::$servicesData as $id => $service){
				if($this->IsRunning($id)){
					$daemonsToStart[strtolower($service['daemon'])] = $service['daemon'];
				}
			}
			foreach($daemonsToStart as $id => $daemon){
				$this->startDaemon( $daemon );
			}
		}

		public function StartModule( $serv )
		{
			$service = self::$servicesData[strtolower($serv)];
			if(!$service){
				$this->Error('restart_unknown_service',$serv);
				return false;
			}
			$this->startDaemon( $service['daemon'] );
		}

		public function StopModule( $serv )
		{
			$service = self::$servicesData[strtolower($serv)];
			if(!$service){
				$this->Error('restart_unknown_service',$serv);
				return false;
			}
			$this->stopDaemon( $service['daemon'] );
		}
		 
		public function Info($serv)
		{
			$service = self::$servicesData[strtolower($serv)];
			if(!$service){
				$this->Error('info_unknown_service',$serv);
				return false;
			}
			$info['id'] = $service['id'];
			$info['logging'] = $this->GetLogging($serv);
			$daemonrunning = $this->IsDaemonRunning( $service['daemon'] );
			if($service['daemons'] && !$daemonrunning){
				foreach($service['daemons'] as $daemon){
					if($this->IsDaemonRunning($daemon)){
						$daemonrunning = true;
					}
				}
			}
			$info['running'] = $this->IsRunning($serv) && $daemonrunning;
			$info['daemon'] = $service['daemon'];
			if($service['label']){
				$info['label'] = $service['label'];
			}
			$this->stat->Poll($service['daemon']);
			if($this->stat->GetProperty('ST_RunningTime')!=-1){
				$info['rtime'] = strval($this->TimeToStr(
					$this->stat->GetProperty("ST_RunningTime"))
				);
				$info['connections'] = strval(
					$this->stat->GetProperty("ST_Server")
					+ $this->stat->GetProperty("ST_Client")
				);
				if($service['id']!=$service['daemon'] && strtolower($service['id'])!='imap'){
					$info['connections'] = 0;
				}
				$info['data'] = strval(round((
					$this->stat->GetProperty("ST_ServerIn")
					+ $this->stat->GetProperty("ST_ServerOut"))/1024,
					2
				));
				$info['memory'] = strval(
					round(
						$this->stat->GetProperty("ST_PageFileUsage")/(1024*1024),
						2
					)
				);
				if ($info['id']=='Control'){ 
					$info['connections']--;
					$info['total']--;
				}
			}
			$info['memory']=$info['memory']?$info['memory']:'0';
			$info['connections']=$info['connections']?$info['connections']:'0';
			$info['peak']=$info['peak']?$info['peak']:'0';
			$info['total']=$info['total']?$info['total']:'0';
			$info['data']=$info['data']?$info['data']:'0';
			return $info;
		}
		
		public function SetLogging($serv,$state)
		{
			$service = self::$servicesData[strtolower($serv)];
			if(!$service){
				$this->Error('logging_unknown_service',$serv);
				return false;
			}
			switch($service['logging_storage']){
				case 'datfile':
					$this->setFileLogging($service['id'],$state);
				break;
				case 'api':
					$this->api->SetProperty( $service['logging_variable'], $state );
					$this->api->Save();
				break;
			}
		}
		
		public function GetLogging($serv)
		{
			$service = self::$servicesData[strtolower($serv)];
			if(!$service){
				$this->Error('logging_unknown_service',$serv);
				return false;
			}
            $state = null;
			switch($service['logging_storage']){
				case 'datfile':
					$state = $this->getFileLogging($service['id']);
				break;
				case 'api':
					$state = $this->api->GetProperty( $service['logging_variable'] );
				break;
			}
			return $state;
		}
		
		public function IsRunning($serv)
		{
			$service = self::$servicesData[strtolower($serv)];
			if(!$service){
				$this->Error('logging_unknown_service',$serv);
				return false;
			}
			switch($service['storage']){
				case 'datfile':
					return $this->IsFileRunning($service['id']);
				break;
				case 'api':
					$val = $this->api->GetProperty( $service['variable']);
					$val = $service['inverse']?!$val:$val;
					return $val;
				break;
			}
		}
		
		public function Services()
		{
			return self::$servicesData;
		}

		private function IsDaemonRunning( $daemon )
		{
			$this->stat->Poll( $daemon );
			return $this->stat->IsRunning( $daemon );
		}

		private function startDaemon($daemon)
		{
			if(strtolower($daemon)!='control'){
				$this->stat->start($daemon);
			}
		}
		
		private function stopDaemon($daemon)
		{
			if(strtolower($daemon)!='control'){
				$this->stat->stop($daemon);
			}
		}

		
		 
		private function startInFile($serv)
		{
			$this->setFileVar($serv,1);
		}
		 
		private function stopInFile($serv)
		{
			$this->setFileVar($serv,0);
		}
		
		
		private function IsFileRunning($serv)
		{
			return $this->getFileVar($serv);
		}
		 
		private function setFileLogging($serv,$level)
		{
			$this->setFileVar($serv,$level,'logging_');
		}
		
		private function getFileLogging($serv)
		{
			return $this->getFileVar($serv,'logging_');
		}
		

		

		 
		private function setFileVar($serv,$state,$prefix = '')
		{
			$service = self::$servicesData[strtolower($serv)];
			if(!$service){
				$this->Error('set_unknown_service_state',$serv);
				return false;
			}
            $ret = null;
			switch($service['dattype']){
				case 'activesync':
				case 'syncml':
				case 'caldav':
					$settingsFile = $this->api->GetProperty($service[$prefix.'datpath']);
					$settingsFile .=$service[$prefix.'datname'];
					if (file_exists($settingsFile)){
						@$xml = slToolsXML::loadFile($settingsFile);
					}else{
						@$xml = simplexml_load_string('<Config></Config>');
					}
					$var = $service[$prefix.'variable'];
					$xml->$var = $service[$prefix.'inverse']?intval(!$state):intval($state);
					if ($xml){
						$ret = $xml->asXML();
					}
					if(!is_dir(dirname($settingsFile))){
						mkdir(dirname($settingsFile),0777,true);
					}
					file_put_contents($settingsFile,$ret);
				break;
				case 'webmail':
					$settingsFile = $this->api->GetProperty($service[$prefix.'datpath']);
					$settingsFile .=$service[$prefix.'datname'];
					if (file_exists($settingsFile)){
						@$xml = slToolsXML::loadFile($settingsFile);
					}else{
						@$xml = simplexml_load_string('<global_settings><item></item></global_settings>');
					}
					$var = $service[$prefix.'variable'];
					$xml->item->$var = $service[$prefix.'inverse']?intval(!$state):intval($state);
					if ($xml){
						$ret = $xml->asXML();
					}
					if(!is_dir(dirname($settingsFile))){
						mkdir(dirname($settingsFile),0777,true);
					}
					file_put_contents($settingsFile,$ret);
				break;
				case 'default':
					$settingsFile = $this->api->GetProperty($service[$prefix.'datpath']);
					$settingsFile .=$service[$prefix.'datname'];
					if (file_exists($settingsFile)){
						$data = file($settingsFile);
						if(is_array($data)){
							foreach($data as $line){
								$info = explode('=',$line);
								if($info[0]){
									$result[$info[0]] = trim($info[1]);
								}
							}
						}
						$result[$service[$prefix.'variable']] = $service[$prefix.'inverse']?intval(!$state):intval($state);
					}else{
						$result[$service[$prefix.'variable']] = $service[$prefix.'inverse']?intval(!$state):intval($state);
					}
					if($result){
                        $out = '';
						foreach($result as $key =>$val){
							$out .= $key . '=' . $val . "\r\n";
						}
						if(!is_dir(dirname($settingsFile))){
							mkdir(dirname($settingsFile),0777,true);
						}
						file_put_contents($settingsFile,$out);
					}
				break;
			}
		}
		
		private function getFileVar($serv,$prefix = '')
		{
			$service = self::$servicesData[strtolower($serv)];
			if(!$service){
				$this->Error('set_unknown_service_state',$serv);
				return false;
			}
            $result = [];
            $value = null;
			switch($service['dattype']){
				case 'activesync':
				case 'syncml':
				case 'caldav':
					$settingsFile = $this->api->GetProperty($service[$prefix.'datpath']);
					$settingsFile .=$service[$prefix.'datname'];
					if (file_exists($settingsFile)){
						$xml = slToolsXML::loadFile($settingsFile);
						$var = $service[$prefix.'variable'];
						$value = $service[$prefix.'inverse']?!intval($xml->$var):intval($xml->$var);
						return $value;
					}else{
						switch($prefix){
							case 'logging_':
								return 0;
							break;
							default:
								return 1;
							break;
						}
					}
				break;
				case 'webmail':
					$settingsFile = $this->api->GetProperty($service[$prefix.'datpath']);
					$settingsFile .=$service[$prefix.'datname'];
					if (file_exists($settingsFile)){
						$xml = slToolsXML::loadFile($settingsFile);
						$var = $service[$prefix.'variable'];
						$value = $service[$prefix.'inverse']?!intval($xml->item->$var):intval($xml->item->$var);
						return $value;
					}else{
						switch($prefix){
							case 'logging_':
								return 0;
							break;
							default:
								return 1;
							break;
						}
					}
				break;
				case 'default':
					$settingsFile = $this->api->GetProperty($service[$prefix.'datpath']);
					$settingsFile .=$service[$prefix.'datname'];
					if (file_exists($settingsFile)){
						$data = file($settingsFile);
						if(is_array($data)){
							foreach($data as $line){
								$info = explode('=',$line);
								$result[$info[0]] = $info[1];
							}
						}
						$var = $service[$prefix.'variable'];
						$value = $service[$prefix.'inverse']?!intval($result[$var]):intval($result[$var]);
					}
					return $value;
				break;
			}
		}
		
		private function TimeToStr($sec)
		{
			$day = 60*60*24;
			$s = $sec%60;
			$m = (($sec-$s)/60)<60?($sec-$s)/60:(($sec-$s)/60)%60;
			$h = (($sec-$s-$m*60)/3600)<24?($sec-$s-$m*60)/3600:(($sec-$s-$m*60)/3600)%24;
			$d = (($sec-$s-$m*60-$h*3600)/$day)<30?($sec-$s-$m*60-$h*3600)/$day:(($sec-$s-$m*60-$h*3600)/$day)%$day;
			$ret = str_pad($d,2,0,STR_PAD_LEFT).':'.
			str_pad($h,2,0,STR_PAD_LEFT).':'.
			str_pad($m,2,0,STR_PAD_LEFT).':'.
			str_pad($s,2,0,STR_PAD_LEFT);
			return $ret;
		}
		
		 
		private function Error($id,$value)
		{
			$this->error[] = array(
				'id'=>$id,
				'value'=>$value
			);
		}
	}
?>