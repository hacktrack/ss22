<?php
require_once(SHAREDLIB_PATH.'system.php');
slSystem::import('storage/cache');

define('QS_SPAM',0);
define('QS_ACCEPT',1);
define('QS_AWAITING',2);
define('QS_REJECT',3);
define('QS_DELETE',4);
define('QS_DELIVER',5);
define('QS_ADD',6);


class ChallengeItem extends slCacheRecord
{
	const FLAG_PROCESSED = 0x0000001;
	const FLAG_BACKUP_DOMAIN_ITEM = 0x0000002;
	public function assignHandler( $handler )
	{
		$this->handler = &$handler;
	}
	
	private function currentPageURL() {
		$pageURL = 'http';
		if (strtolower($_SERVER["HTTPS"]) == "on") {$pageURL .= "s";}
		$pageURL .= "://";
		
		$api = IceWarpAPI::instance();
		$url = $api->GetProperty('c_as_spamchallengeurl');
		
		$url = preg_replace('/^http(s)?:\/\//si','',$url);
		$url .= 'a.html';
		$pageURL.=$url.($_SERVER['QUERY_STRING']?('?'.$_SERVER['QUERY_STRING']):'');
		return $pageURL;
	}
	
	public function getMessageCharset( $messageFile )
	{
		slSystem::import('mail/parserlite');
		$msgParser = slMailParseLite::openFile( $messageFile );
		$headers = $msgParser->getHeaders( array('content-type') );
		if( preg_match( '/charset="?([^;^\s^"]{0,})"?/', $headers['content-type'], $charset ) ){
			return $charset[1];
		}
		return 'utf-8';
	}
	
	public function show($part = '1')
	{
		$file = $this->getMessageFile();
		$charset = $this->getMessageCharset( $file );
		$message = file_get_contents( $file );
		if( strtoupper( $charset ) != 'UTF-8' ){
			slSystem::import('tools/charset');
			$message = slToolsCharset::my_iconv( $charset, 'UTF-8', $message );
		}
		 
		if(!isset($_GET['original']))
		{
			require_once(get_cfg_var('icewarp_sharedlib_path').'system.php');
			slSystem::import('mail/parse');
			$ids = array(
				'a'=>5,
				'i'=>$this->getProperty('id'),
				'h'=>$this->getProperty('itm_hash'),
				'e'=>$this->getProperty('itm_recipient'),
				't'=>$this->type
			);
			$parser = new slMailParse(
							false,
							$ids,
							false,
							'',
							'1',
							$message
			);
			if($part){
				$parser->sendPart($part);
				exit(200);
			}
			$message = $parser->parse();
			
			$message['current_page_url']=$this->currentPageURL();
			
			$message['lang']['to']=ChallengeApplication::instance()->getLanguage('to');
			$message['lang']['attachments']=ChallengeApplication::instance()->getLanguage('attachments');
			$message['lang']['bytes']=ChallengeApplication::instance()->getLanguage('bytes');
			$message['lang']['show_source']=ChallengeApplication::instance()->getLanguage('show_source');
			
			$message['new']=true;
		}
		else
		{
			echo "<a href=\"".str_replace('&original=1','',$this->currentPageURL())."\">".ChallengeApplication::instance()->getLanguage('view_mail')."</a><hr />";
			echo '<pre style="white-space:pre">';
			echo htmlspecialchars(print_R($message,true));
			echo '</pre>';
			die();
		}
		return $message;
	}
	
	protected function getUser()
	{
		$account = new IcewarpAccount();
		if(! $account->Open( $this->getProperty('itm_recipient') ) ){
			 			$domain = new IceWarpDomain();
			$domain->Open(ChallengeApplication::getDomainOnly($this->getProperty('itm_recipient')));
			require_once ('domain.php');
			$backupDomain = new ChallengeDomain($domain);
			return $backupDomain;
		}
		$user = new ChallengeUser( $account );
		return $user;
	}
}

class QuarantineItem extends ChallengeItem
{
	public $type = 2;
	public function getMessageFile()
	{
		$user = $this->getUser();
		$path = $user->getPath('quarantine').$this->getProperty('itm_folder').'/';
		$filename = glob( $path.'*.tmp' );
		return $filename[0];
	}
	
	public function authorize()
	{
		$api = IcewarpAPI::instance();
		$sender = $this->getProperty('itm_sender');
		$recipient = $this->getProperty('itm_recipient');
		return $api->QuarantineSet( $recipient, $sender, QS_ACCEPT );
	}
	
	public function deliver()
	{
		$api = IcewarpAPI::instance();
		$sender = $this->getProperty('itm_sender');
		$recipient = $this->getProperty('itm_recipient');
		return $api->QuarantineSet( $recipient, $sender, QS_DELIVER );
	}
	
	public function delete()
	{
		$api = IcewarpAPI::instance();
		$sender = $this->getProperty('itm_sender');
		$recipient = $this->getProperty('itm_recipient');
		return $api->QuarantineSet( $recipient, $sender, QS_DELETE );
	}
	
	public function blacklist()
	{
		$api = IcewarpAPI::instance();
		$id = $this->getID();
		$sender = $this->getProperty('itm_sender');
		$recipient = $this->getProperty('itm_recipient');
		return $api->QuarantineSet( $recipient, $sender, QS_SPAM );
	}
	
	public function done( $processed = false, $delete = false )
	{
		$recipient = $this->getProperty('itm_recipient');
		$sender = $this->getProperty('itm_sender');
		$folder = $this->getProperty('itm_folder');
		$flags = $this->getProperty('itm_flags');
		$flags |= ChallengeItem::FLAG_PROCESSED;
		$id = $this->getID();
		if($processed && !$delete){
			try{
				$this->handler->quarantine->update( 
					array('id'=>$id),
					array('itm_flags'=> $flags) 
				);
			}catch(Exception $e){
				echo $e->getMessage();
			}
		}
		if($delete){
			try{
				$this->handler->quarantine->delete( $id );
				$this->handler->adminQ->delete(false, true, array('quarantine_id'=>$id));
			}catch(Exception $e){
				
			}
		}
	}
}

class SpamItem extends ChallengeItem
{
	public $type = 1;
	public function getMessageFile()
	{
		$user = $this->getUser();
		$path = $user->getPath('spam').$this->getProperty('itm_folder');
		$type = $user->getAccountType();
		$imap = $type == 0 ? 0 : 1;
		$extension = $imap ? ".imap" : ".tmp";
		$path .= $extension;
		return $path;
	}
	
	public function authorize()
	{
		$recipient = $this->getProperty('itm_recipient');
		$sender = $this->getProperty('itm_sender');
		 		$this->deliver();
		 		$api = IcewarpAPI::instance();
		return $api->QuarantineSet( $recipient, $sender, QS_ACCEPT );
	}
	
	public function deliver()
	{
		$user = $this->getUser();
		$ext = $user->getAccountType()?'.imap':'.tmp';
		$inbox  = $user->getAccountType()?'inbox':'';
		$recipient = $this->getProperty('itm_recipient');
		$sender = $this->getProperty('itm_sender');
		$report_id = $this->getProperty('itm_report_id');
		$api = IcewarpAPI::instance();
		 		$spamPath = $user->getPath('spam');
		$inboxPath = realpath( $user->getPath('mailbox') . $inbox ).'/';		
		$list = $this->handler->spam->getSenderItems( $report_id, $recipient, $sender, true );
		foreach( $list as $itm ){
			 			$file = $itm->GetProperty('itm_folder');
			$file .= $ext;
			$api->MoveFileWithUpdate( $spamPath . $file, $inboxPath . $file );
		}
		return true;
	}
	
	public function delete()
	{
		$user = $this->getUser();
		$ext = $user->getAccountType()?'.imap':'.tmp';
		$inbox  = $user->getAccountType()?'inbox':'';
		$recipient = $this->getProperty('itm_recipient');
		$sender = $this->getProperty('itm_sender');
		$report_id = $this->getProperty('itm_report_id');
		$api = IcewarpAPI::instance();
		 		$spamPath = $user->getPath('spam');
		$inboxPath = realpath( $user->getPath('mailbox') . $inbox );
		$list = $this->handler->spam->getSenderItems( $report_id, $recipient, $sender, true );
		foreach( $list as $itm ){
			 			$file = $itm->GetProperty('itm_folder');
			$file .= $ext;
			$api->DeleteFileWithUpdate( $spamPath . $file );
		}
		return true;
	}
	
	public function blacklist()
	{
		$recipient = $this->getProperty('itm_recipient');
		$sender = $this->getProperty('itm_sender');
		 		try{
			$this->delete();
		}catch(Exception $e){
			 			echo $e->getMessage();
		}
		 		$api = IcewarpAPI::instance();
		return $api->QuarantineSet( $recipient, $sender, QS_SPAM );
	}
	
	public function done( $processed = false,$delete = false )
	{
		$recipient = $this->getProperty('itm_recipient');
		$sender = $this->getProperty('itm_sender');
		$report_id = $this->getProperty('itm_report_id');
		$flags = $this->getProperty('itm_flags');
		$flags |= ChallengeItem::FLAG_PROCESSED;
		$id = $this->getID();
		if($processed && !$delete){
			try{
				$this->handler->spam->update( 
					array('id'=>$id),
					array('itm_flags'=>$flags) 
				);
			}catch(Exception $e){
				echo $e->getMessage();
			}
		}
		if($delete){
			$list = $this->handler->spam->getSenderItems( $report_id, $recipient, $sender, true );
			$this->handler->cache->transaction();
			foreach($list as $senderItems){
				try{
					$id = $this->getID();
					$this->handler->spam->delete( $id );
					$this->handler->adminS->delete(false, true, array('spam_id'=>$id));
				}catch(Exception $e){
					
				}
			}
			$this->handler->cache->commit();
		}
		
	}
}

class ReportItem extends ChallengeItem
{
	public function check( $hash )
	{
		return ($this->getProperty('rep_hash') == $hash);
	}
}
?>