<?php

require_once('abstract.php');

class IceWarpAccount extends iAPIInterface
{
   var $base;

   var $EmailAddress;
   var $Domain;
   var $LastErr;
   function __construct ()
   {
   	$this->apiID = 'IceWarpServer.AccountObject';
   	$this->exc_id = 'api_account';
   	$this->function = 'icewarp_apiobjectcall_persistent';
   	$this->_createBase();
   }
   
	
   function _GetData ()
   {
     $this->EmailAddress = $this->FunctionCall(  'EmailAddress' );
     $this->Domain = $this->FunctionCall(  'Domain' );
   }

   function GetProperty ( $property )
   {
      return $this->FunctionCall(  'GetProperty', $property );
   }

   function SetProperty ( $property, $value )
   {
      return $this->FunctionCall(  'SetProperty', $property, $value );
   }

   function New_ ( $account )
   {
      $ret = $this->FunctionCall(  'New', $account );
      $this->_GetData();
      return $ret;
   }

   function Open ( $account )
   {
      $ret=$this->FunctionCall(  'Open', $account );
      $this->LastErr=$this->FunctionCall( 'LastErr');
      if ( $ret ) $this->_GetData();
      return $ret;
   }

   function Save ()
   {
      $result=$this->FunctionCall(  'Save' );
      $this->LastErr= $this->FunctionCall('LastErr');
      return $result;
   }

   function Delete ()
   {
      return $this->FunctionCall(  'Delete' );
   }

   function AuthenticateUser ( $username, $password, $ip )
   {
      $ret = $this->FunctionCall(  'AuthenticateUser', $username, $password, $ip );
      if ($ret) $this->_GetData();
      return $ret;
   }

   function AuthenticateUserHash ( $username, $hash, $ip, $method, $flags = 0)
   {
      $ret = $this->FunctionCall(  'AuthenticateUserHash', $username, $hash, $ip, $method, $flags );
      if ($ret) $this->_GetData();
      return $ret;
   }
   function AuthenticateUserSSO ( $token, $vhost, $protocol='HTTP')
   {
      $ret = $this->FunctionCall( 'AuthenticateUserSSO', $token, $vhost, $protocol );
      if ($ret!='') $this->_GetData();
      return $ret;
   }

   function ValidateUser ($accounttype = -1)
   {
      return $this->FunctionCall(  'ValidateUser', $accounttype);
   }
   
   function ValidateRemoteIP ($remote_ip)
   {
      return $this->FunctionCall(  'ValidateRemoteIP', $remote_ip);
   }

   function FindInitQuery ( $domain, $query = '')
   {
      return $this->FunctionCall(  'FindInitQuery', $domain, $query);
   }

   function FindNext()
   {
      $ret = $this->FunctionCall(  'FindNext' );
      $this->_GetData();
      return $ret;
   }

   function FindDone()
   {
      return $this->FunctionCall(  'FindDone' );
   }

   function CanCreateMailbox($alias, $mailbox, $password, $domain)
   {
      return $this->FunctionCall(  'CanCreateMailbox', $alias, $mailbox, $password, $domain);
   }

   function GetUserGroups($user)
   {
      return $this->FunctionCall(  'GetUserGroups', $user);
   }

   function ApplyTemplate($template='')
   {
      return $this->FunctionCall(  'ApplyTemplate', $template);
   }

}

 class MerakAccount extends IceWarpAccount {}
?>