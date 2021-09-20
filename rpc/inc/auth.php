<?php
                  
  define('SHAREDLIB_PATH', get_cfg_var('icewarp_sharedlib_path'));
  require_once(SHAREDLIB_PATH . 'api/account.php');

  function http_authenticate($flags) {

    $result = false;

         session_start();

         $result = $_SESSION['authorized'];

         if (!$result)
    {
             if ($_SERVER['HTTP_AUTHORIZATION'])
      {
                 list($scheme, $text) = explode(' ', $_SERVER['HTTP_AUTHORIZATION']);
  
                 $text = base64_decode($text);
        list($username, $password) = explode(':', $text);

                 $account = new IceWarpAccount();

                 $result = $account->AuthenticateUser($username, $password, $_SERVER['SERVER_NAME']);

                 if ($result) {
             
                     if ($flags[ADMIN]) $result = $account->GetProperty('u_admin');
          
          $_SESSION['maintenanceidentity'] =$account->EmailAddress.'/XMLRPC';
          
        }
      }
    }
  
         $_SESSION['authorized'] = $result;

         if (!$result)
    {
      header('Status: 401 Access Denied');
      header('Authorization: Basic');
      header('WWW-Authenticate: Basic realm="API RPC"');
 
      exit();    
    }    

    return $result;
  }
?>
