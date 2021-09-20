<?php

     define('isdebug', 0);
  define('debugfile', '/temp/rpc.log');

  define("ERR_INVALID_XML", "Invalid XML request");

  function do_log($filename, $body)
  {
         $file=@fopen($filename,'a');
    if ($file)
    {
      fputs($file,date('Y-m-d H:i:s '));
      fputs($file,$body."\r\n");
      fclose($file);
    }
  }

  function rpc_error_exit($message, $exit_code)
  {
    $message = trim($message);
    if (strlen($message) == 0)
      $message = "Unknown error occured";

    header('Content-Type: text/xml');
    header('Content-Length: ' . strlen($message));
    print($message);
    exit($exit_code);
  }


  function internal_getstring(&$xml)
  {
      if ($xml->children()) 
      {
        $str=$xml->string;
        if(!$str) rpc_error_exit(ERR_INVALID_XML, 0);
        
        return (string)$str;
      }
      else
      {
        return (string)$xml;
      }

  }
                          
    function rpc_multirequest(&$request)
    {
      
            libxml_disable_entity_loader(true);
      $xml = simplexml_load_string($request);

      if ((!$xml) || ($xml->getName() != 'methodCall')) rpc_error_exit(ERR_INVALID_XML, 0);
      
      
             $xml_methodName = $xml->methodName;
      if(!$xml_methodName) rpc_error_exit(ERR_INVALID_XML, 0);
      
      if($xml_methodName == "system.multicall")
      {
        $result[MULTI] = true;
        $result[METHODS] =  array();
        
        $xml_params = $xml->params;        
        if (!$xml_params)   rpc_error_exit(ERR_INVALID_XML, 0);
        
                
                 $xml_param=$xml_params->param;         
        $xml_data =$xml_param->value->array->data;
        if(!$xml_data) rpc_error_exit(ERR_INVALID_XML, 0);
                  
        
        foreach ($xml_data->value as $xml_value) 
        {
        
          
          $members=$xml_value->struct->member;
          if(!$members) rpc_error_exit(ERR_INVALID_XML, 0);
        
          $res=array();            
          $res[PARAMS] = array();
          
    
          for ($i=0;$i<count($members);$i++) 
          {
            if(strtolower($members[$i]->name)=="methodname")
            {         
              $res[METHOD] =  internal_getstring($members[$i]->value);      
            }
            
            if(strtolower($members[$i]->name)=="params")
            {
             $param_array=$members[$i]->value->array->data;
             if(!$xml_data) rpc_error_exit(ERR_INVALID_XML, 0);
             
             
             foreach ($param_array->value as $param_value)
             {               
               array_push($res[PARAMS], internal_getstring($param_value));               
             } 
             
            }
          }
          
          array_push($result[METHODS],$res);  
        }
                       
      
      }
      else
      {
        $result[MULTI] = false;
        $result[METHODS] = array(rpc_request($xml));
      
      }
      
             return $result;
          

    }


                     

  function rpc_request(&$xml) {

         $xml_methodName = $xml->methodName;
    if ($xml_methodName) {
      $result[METHOD] = (string)$xml_methodName;
      $result[PARAMS] = array();
    } else
      rpc_error_exit(ERR_INVALID_XML, 0);

              $xml_params = $xml->params;
    if (!$xml_params)
      rpc_error_exit(ERR_INVALID_XML, 0);

    $idx = 0;
    foreach ($xml_params->param as $xml_param) {
      $xml_value = $xml_param->value;
      if (!$xml_value)
        rpc_error_exit(ERR_INVALID_XML, 0);

             $xml_value_type = $xml_value->children();
      if ($xml_value_type) {
        switch ($xml_value_type->getName()) {
          case 'array':
          case 'struct':
            continue 2;
        }
        $xml_value = $xml_value_type;
      }

             $result[PARAMS][$idx] = (string)$xml_value;
      $idx++;
    }

         return $result;
  }

            
      
  function rpc_result(&$output) {

         $result = sprintf('<methodResponse><params><param><value>%s</value></param></params></methodResponse>', 
      htmlspecialchars($output[PARAMS][0])) . "\r\n";
    
         return $result;
  }


         
  function rpc_process($handler) {

         $request = file_get_contents("php://input");

         $gzip = $_SERVER['HTTP_CONTENT_ENCODING'] == "gzip";
    if ($gzip) $request = gzuncompress($request);

         $request = trim($request);

         if (isdebug) do_log(debugfile, "<<<\r\n" . $request);

         $call = rpc_multirequest($request);
    
    
    if(!$call[MULTI])
    {
             $param = array(&$call[METHODS][0]);
      $output = call_user_func_array($handler, $param );
             $result = rpc_result($output);  

    }
    else
    {
      $result="<methodResponse><params><param><value><array><data>";
      
      for($i=0;$i<count($call[METHODS]);$i++)
      {
                 $param = array(&$call[METHODS][$i]);
        $output = call_user_func($handler, $param);
        
        $result.=sprintf('<value><array><data><value>%s</value></data></array></value>', htmlspecialchars($output[PARAMS][0]));
      }


             $result.= '</data></array></value></param></params></methodResponse>'. "\r\n";
    
    }
            
        
   
         if (isdebug) do_log(debugfile, ">>>\r\n" . $result);

         if ($gzip) {
      header('Content-Encoding: gzip');
      $result = gzcompress($result);
    }

         header('Content-Type: text/xml');
    header('Content-Length: ' . strlen($result));

         print($result);  
  }
  

 
   
?>