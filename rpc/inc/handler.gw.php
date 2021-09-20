<?php
                  
  function handle_gw_call(&$call) {

         $result[METHOD] = $call[METHOD];
    if (!count($call[PARAMS])) 
      $result[PARAMS][] = icewarp_calendarfunctioncall($call[METHOD]); 
    else
      $result[PARAMS][] = icewarp_calendarfunctioncall($call[METHOD], $call[PARAMS][0], $call[PARAMS][1], $call[PARAMS][2], $call[PARAMS][3]); 

         return $result;  
  }
?>