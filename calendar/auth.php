<?php
         
  function http_authenticate($gw) {

         if ($_SERVER['HTTP_AUTHORIZATION'])
    {
             list($scheme, $text) = explode(' ', $_SERVER['HTTP_AUTHORIZATION']);
  
             $text = base64_decode($text);
      list($username, $password) = explode(':', $text);

      $gw->user = $username;
      $gw->setPassword($password);

             if ($gw->login()) {

        $result = $username;   
      }
    }
  
         if (!$result)
    {
      header('Status: 401 Access Denied');
      header('Authorization: Basic');
      header('WWW-Authenticate: Basic realm="Internet Calendar"');
 
      die();    
    }    

    return $result;
  }
?>
