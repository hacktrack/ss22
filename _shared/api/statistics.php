<?php
require_once('abstract.php');
class IceWarpStatistics extends iAPIInterface
{
   var $base;
   
   function __construct ()
   {
   	$this->apiID = 'IceWarpServer.ServiceObject';
   	$this->exc_id = '_api_account';
   	$this->function = 'icewarp_apiobjectcall_persistent';
   	$this->_createBase();
   }

   function GetProperty( $property )
   {
      return $this->FunctionCall( 'GetProperty', $property );
   }

   function IsRunning( $service )
   {
      return $this->FunctionCall( 'IsRunning', $service);
   }

   function Poll ( $service )
   {
      return $this->FunctionCall( 'Poll', $service);
   }

   function Reset ($service)
   {
      return $this->FunctionCall( 'Reset', $service );
   }

   function Start ($service)
   {
      return $this->FunctionCall( 'Start', $service );
   }

   function Stop ($service)
   {
      return $this->FunctionCall( 'Stop', $service );
   }

   function GetSessions ($service, $history)
   {
      return $this->FunctionCall( 'GetSessions', $service, $history );
   }
}

 class MerakStatistics extends IceWarpStatistics {}
?>