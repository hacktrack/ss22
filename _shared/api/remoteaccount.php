<?php
require_once('abstract.php');

class IceWarpRemoteAccount extends iAPIInterface
{
   var $base;
   var $LastErr;
   function __construct ()
   {
   	$this->apiID = 'IceWarpServer.RemoteAccountObject';
   	$this->exc_id = 'api_remote';
   	$this->function = 'icewarp_apiobjectcall';
   	$this->_createBase();
   }

   function New_ ()
   {
      return $this->FunctionCall( 'New');
   }

   function Open ($account )
   {
       return $this->FunctionCall( 'Open', $account);
   }

   function Save ()
   {
      $result=$this->FunctionCall( 'Save' );
      $this->LastErr=$this->FunctionCall( 'LastErr');
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

   function DeleteIndex ( $idx )
   {
      return $this->FunctionCall( 'DeleteIndex', $idx );
   }

   function Count ()
   {
      return $this->FunctionCall( 'Count' );
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

   function ApplyTemplate($template='')
   {
      return $this->FunctionCall( 'ApplyTemplate', $template);
   }
}

 class MerakRemoteAccount extends IceWarpRemoteAccount {}
?>