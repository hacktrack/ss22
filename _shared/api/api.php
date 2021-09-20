<?php

require_once('abstract.php');

class IceWarpAPI extends iAPIInterface
{
   var $base;

   function __construct ()
   {
   	$this->apiID = 'IceWarpServer.APIObject';
   	$this->exc_id = 'api';
   	$this->function = 'icewarp_apiobjectcall_persistent';
   	$this->_createBase();
   }
   
	static function instance($identity = '')
	{
		if (!isset(self::$instance)){
			self::$instance = new IceWarpAPI();
			self::$instance->SetProperty('C_System_Logging_Maintenance_Identity', $identity);
		}	
		return self::$instance;
	}

   function Save ()
   {
      return $this->FunctionCall( 'Save' );
   }

   function GetDomain ( $domain )
   {
      return $this->FunctionCall( 'getdomain', $domain );
   }

   function GetProperty( $property )
   {
   	  return $this->FunctionCall( 'GetProperty', $property );
   }

   function SetProperty( $property, $value )
   {
      return $this->FunctionCall(  'SetProperty', $property, $value );
   }

   function GetDomainCount()
   {
      return $this->FunctionCall( 'GetDomainCount' );
   }

   function GetDomainIndex($domain)
   {
      return $this->FunctionCall( 'GetDomainIndex',$domain );
   }

   function OpenDomain($domain)
   {
      require_once('domain.php');

      $domainobject = new MerakDomain();
      if ($domainobject->Open($domain)) return $domainobject;
  
      return false;    
   }

   function NewDomain($domain)
   {
      require_once('domain.php');

      $domainobject = new MerakDomain();
      if ($domainobject->New_($domain)) return $domainobject;
  
      return false;    
   }

   function GetUserStatistics($from, $to, $filter)
   {
      return $this->FunctionCall(  'GetUserStatistics', $from, $to, $filter);
   }

   function UpdateConfiguration()
   {
      return $this->FunctionCall(  'UpdateConfiguration');
   }
   

   function ReloadServices()
   {
      return $this->FunctionCall(  'ReloadServices');
   }

   function BackupConfig($path)
   {
      return $this->FunctionCall(  'BackupConfig', $path);
   }

   function RestoreConfig($path, $password='')
   {
      return $this->FunctionCall(  'RestoreConfig', $path, $password);
   }

   function DeleteDomain($domain)
   {
      return $this->FunctionCall(  'DeleteDomain', $domain);
   }

   function RenameDomain($olddomain, $newdomain)
   {
      return $this->FunctionCall(  'RenameDomain', $olddomain, $newdomain);
   }

   function GetDomainList()
   {
      return $this->FunctionCall(  'GetDomainList');
   }
 
   function CreateTables($service, $connection)
   {
      return $this->FunctionCall(  'CreateTables', $service, $connection);
   }

   function DropTables($service)
   {
      return $this->FunctionCall(  'DropTables', $service);
   }

   function GetSchedule($property)
   {
     require_once('schedule.php');

     $scheduleobject = new MerakSchedule();
     $base = $this->FunctionCall( 'GetSchedule', $property);
     $scheduleobject->Done();
     $scheduleobject->base = $base;
     $scheduleobject->UpdateCount();

     return $scheduleobject;
   }

   function SetSchedule($property, $scheduleobject)
   {
     return $this->FunctionCall( 'SetSchedule', $property, $scheduleobject->base);
   }

   function QuarantineAuthorize($folder)
   {
     return $this->FunctionCall( 'QuarantineAuthorize', $folder);
   }

   function QuarantineDelete($owner, $sender, $folder)
   {
     return $this->FunctionCall( 'QuarantineDelete', $owner, $sender, $folder);
   }

   function QuarantineAdd($owner, $sender, $state)
   {
     return $this->FunctionCall( 'QuarantineAdd', $owner, $sender, $state);
   }

   function QuarantineSet($owner, $sender, $state)
   {
     return $this->FunctionCall( 'QuarantineSet', $owner, $sender, $state);
   }

   function QuarantineList($owner, $flags, $top, $offset='0')
   {
   	 if($top===0 || $top==='0'){
   	 	$top = PHP_INT_MAX;
   	 }
     return $this->FunctionCall( 'QuarantineList', $owner, $flags, $top, $offset);
   }

   function GLList($email, $flags, $top, $offset='0')
   {
     return $this->FunctionCall( 'GLList', $email, $flags, $top, $offset);
   }

   function GLAdd($value, $email, $status)
   {
     return $this->FunctionCall( 'GLAdd', $value, $email, $status);
   }

   function GLSet($value, $email, $status)
   {
     return $this->FunctionCall( 'GLSet', $value, $email, $status);
   }

   function GLDelete($value, $email, $status)
   {
     return $this->FunctionCall( 'GLDelete', $value, $email, $status);
   }

   function ConnectNow()
   {
     return $this->FunctionCall( 'ConnectNow');
   }

   function SpamIndexNow($email = '')
   {
     return $this->FunctionCall( 'SpamIndexNow', $email);
   }

   function SpamCompactDB()
   {
     return $this->FunctionCall( 'SpamCompactDB');
   }

   function AntiSpamUpdate()
   {
     return $this->FunctionCall( 'AntiSpamUpdate');
   }

   function AntiVirusUpdate()
   {
     return $this->FunctionCall( 'AntiVirusUpdate');
   }

   function ETRNNow($index)
   {
     return $this->FunctionCall( 'ETRNNow', $index);
   }

   function FTPSyncNow($item)
   {
     return $this->FunctionCall( 'FTPSyncNow', $item);
   }

   function RemoteAccountNow($index)
   {
     return $this->FunctionCall( 'RemoteAccountNow', $index);
   }

   function RemoteServerWatchdogNow()
   {
     return $this->FunctionCall( 'RemoteServerWatchdogNow');
   }

   function TaskEventNow($index)
   {
     return $this->FunctionCall( 'TaskEventNow', $index);
   }

   function CheckDBConnection($conn)
   {
     return $this->FunctionCall( 'CheckDBConnection', $conn);
   }

   function CheckDNSServer($dns)
   {
     return $this->FunctionCall( 'CheckDNSServer', $dns);
   }

   function Migration_Finish()
   {
     return $this->FunctionCall( 'Migration_Finish');
   }

   function Migration_MigrateMessages($single, $user, $pass, $domain, $bulkbuffer)
   {
     return $this->FunctionCall( 'Migration_MigrateMessages', $single, $user, $pass, $domain, $bulkbuffer);
   }

   function Migration_MigrateMessagesAccounts($single, $user, $pass, $bulkbuffer)
   {
     return $this->FunctionCall( 'Migration_MigrateMessagesAccounts', $single, $user, $pass, $bulkbuffer);
   }
  
   function IDNToUTF8($idn)
   {
     return $this->FunctionCall( 'IDNToUTF8', $idn);
   }

   function UTF8ToIDN($utf8)
   {
     return $this->FunctionCall( 'UTF8ToIDN', $utf8);
   }

   function GetLocalIPs()
   {
     return $this->FunctionCall( 'GetLocalIPs');
   }

   function DeleteFiles($folder, $ext, $rec, $older)
   {
     return $this->FunctionCall( 'DeleteFiles', $folder, $ext, $rec, $older);
   }

   function GetFolderList($folder, $rec)
   {
     return $this->FunctionCall( 'GetFolderList', $folder, $rec);
   }

   function SIPReferCall($owner, $number, $address='')
   {
     return $this->FunctionCall( 'SIPReferCall', $owner, $number, $address);
   }

   function PostServiceMessage($service, $msg, $wparam, $lparam)
   {
     return $this->FunctionCall( 'PostServiceMessage', $service, $msg, $wparam, $lparam);
   }

   function MakePrimaryDomain($domain)
   {
     return $this->FunctionCall( 'MakePrimaryDomain', $domain);
   }

   function MigrateDatabase($sourcedsn, $destdsn, $logfile, $index)
   {
     return $this->FunctionCall( 'MigrateDatabase', $sourcedsn, $destdsn, $logfile, $index);
   }

   function ConvertStorage($todb)
   {
     return $this->FunctionCall( 'ConvertStorage', $todb);
   }

   function GetFileList($folder, $rec)
   {
     return $this->FunctionCall( 'GetFileList', $folder, $rec);
   }

   function GetMessageContent($file, $type = '', $maxsize = 0, $maxlines = 0)
   {
     return $this->FunctionCall( 'GetMessageContent', $file, $type, $maxsize, $maxlines);
   }

   function Base64FileEncode($source, $dest)
   {
     return $this->FunctionCall( 'Base64FileEncode', $source, $dest);
   }

   function SMSHTTP($http, $bypassauth=false)
   {
     return $this->FunctionCall( 'SMSHTTP', $http, $bypassauth);
   }
   function SMSIncoming($uri)
   {
     return $this->FunctionCall('SMSIncoming', $uri);
   }


   function SyncPush($param1, $param2, $param3, $param4)
   {
     return $this->FunctionCall( 'SyncPush', $param1, $param2, $param3, $param4);
   }

   function CryptData($alg, $key, $data, $encode)
   {
     return $this->FunctionCall( 'CryptData', $alg, $key, $data, $encode);
   }

   function SmartAttach($filename, $account, $expiration, $anonymous, $params)
   {
     return $this->FunctionCall( 'SmartAttach', $filename, $account, $expiration, $anonymous, $params);
   }

   function DoLog($ThreadId, $LogType, $Who, $Value, $FType = 1, $Flags = 0)
   {
     return $this->FunctionCall( 'DoLog', $ThreadId, $LogType, $Who, $Value, $FType."|".$Flags);
   }

   function MoveFileWithUpdate($FileName, $DestName)
   {
     return $this->FunctionCall( 'MoveFileWithUpdate', $FileName, $DestName);
   }

   function CopyFileWithUpdate($FileName, $DestName,$fFailIfExists = 0)
   {
     return $this->FunctionCall( 'COpyFileWithUpdate', $FileName, $DestName,$fFailIfExists);
   }

   function DeleteFileWithUpdate($FileName)
   {
     return $this->FunctionCall( 'DeleteFileWithUpdate', $FileName);
   }

   function CacheFileWithUpdate($FileName)
   {
     return $this->FunctionCall( 'CacheFileWithUpdate', $FileName);
   }

   function MoveDirWithUpdate($FileName, $DestName)
   {
     return $this->FunctionCall( 'MoveDirWithUpdate', $FileName, $DestName);
   }

   function CopyDirRecWithUpdate($FileName, $DestName)
   {
     return $this->FunctionCall( 'COpyDIrRecWithUpdate', $FileName, $DestName);
   }

   function DeleteDirRecWithUpdate($FileName)
   {
     return $this->FunctionCall( 'DeleteDirRecWithUpdate', $FileName);
   }

   function CacheDirWithUpdate($FileName)
   {
     return $this->FunctionCall( 'CacheDirWithUpdate', $FileName);
   }

   function SOCKSCall($command, $hash, $param1='', $param2='')
   {
     return $this->FunctionCall( 'SOCKSCall', $command, $hash, $param1, $param2);
   }

   function GetLogRecords($LogType, $UnixDate, $Filter = '', $DeleteLog = False)
   {
     return $this->FunctionCall( 'GetLogRecords', $LogType, $UnixDate, $Filter, $DeleteLog);
   }
   
   function GetDeliveryReport($Email, $MessageID, $UnixTime)
   {
     return $this->FunctionCall( 'GetDeliveryReport', $Email, $MessageID, $UnixTime);
   }

   function AVScanFile($filename)
   {
     return $this->FunctionCall( 'AVScanFile', $filename);
   }

   
   function ManageConfig($Selector, $Command, $Params = '')
   {
     return $this->FunctionCall( 'ManageConfig', $Selector, $Command, $Params);
   }
   
   
}

 class MerakAPI extends IceWarpAPI {}
?>