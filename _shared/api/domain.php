<?php
require_once('abstract.php');

class IceWarpDomain extends iAPIInterface
{
   var $base;

   var $IPAddress;
   var $Name;
   var $LastErr;

   function __construct ()
   {
   	$this->apiID = 'IceWarpServer.DomainObject';
   	$this->exc_id = 'api_domain';
   	$this->function = 'icewarp_apiobjectcall_persistent';
   	$this->_createBase();
   }
   
   	
   function _GetData ()
   {
     $this->IPAddress=$this->FunctionCall( 'IPAddress');
     $this->Name=$this->FunctionCall( 'Name');
   }

   function _FormatEmail($email)
   {
     $result = $email;

     if ($this->Name) 
       if (!strpos($result, '@')) 
         $result = $result . '@' . $this->Name;    

     return $result;
   }

   function New_ ( $domain )
   {  
     $ret = $this->FunctionCall( 'New', $domain );
     $this->_GetData();
     return $ret;
   }

   function Open( $domain )
   {
      $ret=$this->FunctionCall( 'Open', $domain );
      $this->LastErr=icewarp_apiobjectcall_persistent($this->base, 'LastErr');
      if ( $ret ) $this->_GetData();
      return $ret;
   }

   function Save ()
   {
      $this->FunctionCall( 'IPAddress', $this->IPAddress);
      $this->FunctionCall( 'Name', $this->Name);
      $result=$this->FunctionCall( 'Save' );
      $this->LastErr=icewarp_apiobjectcall_persistent($this->base, 'LastErr');
      return $result;
   }

   function Delete ()
   {
      return $this->FunctionCall( 'Delete' );
   }

   function GetProperty( $property )
   {
      return $this->FunctionCall( 'GetProperty', $property );
   }

   function SetProperty( $property, $value )
   {
      return $this->FunctionCall( 'SetProperty', $property, $value );
   }

   function GetAccountCount ()
   {
      return $this->FunctionCall( 'GetAccountCount' );
   }
   
   function GetDisplayAccountCount ( $type = 0 )
   {
      return icewarp_apiobjectcall_persistent ( $this->base, 'GetTotalAccounts', $type );
   }
   
   function GetAccountList ()
   {
      return $this->FunctionCall( 'GetAccountList' );
   }

   function GetAccount ($account)
   {
      return $this->FunctionCall( 'GetAccount', $account );
   }

   function DeleteAccount ($account)
   {
      return $this->FunctionCall( 'DeleteAccount', $account );
   }

   function OpenAccount($account)
   {
      require_once('account.php');

      $accountobject = new MerakAccount();
      if ($accountobject->Open($this->_FormatEmail($account))) return $accountobject;
  
      return false;    
   }

   function NewAccount($account)
   {
      require_once('account.php');

      $accountobject = new MerakAccount();
      if ($accountobject->New_($this->_FormatEmail($account))) return $accountobject;
  
      return false;    
   }

   function ApplyTemplate($template='')
   {
      return $this->FunctionCall( 'ApplyTemplate', $template);
   }
}

 class MerakDomain extends IceWarpDomain {}
?>