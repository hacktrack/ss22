<?php

                  
  function handle_api_call(&$call) {

         if (preg_match('/(^.*)(\.|->)([[:alnum:]_]+)/', $call[METHOD], $regs)) {

             $instance = $regs[1];
      $method = $regs[3];
      if($method == "Destroy") $method="";

         } else {

             $method = $call[METHOD];

             $instance = 0;
    }   

         $result[METHOD] = $call[METHOD];
    if (!count($call[PARAMS])) 
      $result[PARAMS][] = icewarp_apiobjectcall_persistent_string((string)$instance, (string)$method); 
    else
    {
      if (($instance==0) && ($method=='Create') && (strlen(trim($call[PARAMS][1]))==0)) $call[PARAMS][1]=$_SESSION['maintenanceidentity'];
      $result[PARAMS][] = icewarp_apiobjectcall_persistent_string((string)$instance, (string)$method, (string)$call[PARAMS][0], (string)$call[PARAMS][1], (string)$call[PARAMS][2], (string)$call[PARAMS][3], (string)$call[PARAMS][4]);
    }

         return $result;  
  }
?>
