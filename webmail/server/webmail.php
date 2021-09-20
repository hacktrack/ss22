<?php
 
 

 
 
 
 
 
 
 
$sTime = time();
$sMicroTime = microtime();

require_once('inc/require.php');
require_once('inc/include.php');
require_once('inc/exception.php');
require_once('inc/defines.php');

 
   
function answer($result,$contentType = 'text/xml')
{
  header('Content-Type: ' . $contentType);
  if(defined('SECURE_COOKIE') && SECURE_COOKIE){
  		header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
  }
     if ((strlen($result)>200)&&(!ini_get("output_handler"))&&(strpos($_SERVER['HTTP_ACCEPT_ENCODING'],'gzip')!==false))
  {       
         ob_start();
    ob_start("ob_gzhandler");

         echo $result;

         ob_end_flush();
    header('Content-Length: '.ob_get_length());
    ob_end_flush();
  } 

     else
  {
    header('Content-Length: '.strlen($result));
    echo $result;
  }
}

   
function main()
{
	global $cXMLRequest;
	
	try{
         
		$cXMLRequest = new XMLRequest();
		$answer = $cXMLRequest->answer();
		switch ($cXMLRequest->sFormatType) {
		case 'xml':
			$contentType = 'text/xml';
			$result = &$answer;
			break;
		
		case 'json':
			$contentType = 'text/json';
			$result = Tools::str2JSArrayNew($answer);
      break;
			
		default:
			throw new Exc('xmlrequest_unkown_format',$cXMLRequest->sFormatType);
		}
		log_buffer($answer, 'RESPONSE',$cXMLRequest->aAttrs);
		
	 	}catch(Exc $e){
		 		 		         $contentType = 'text/xml';
        if(!is_object($cXMLRequest)){
            $result = $e->XMLResponse(['id' => null, 'sid' => null]);
        }else{
            $result = $e->XMLResponse($cXMLRequest->aAttrs);
        }
        log_buffer($result, 'ERROR');
	}catch(XMLExc $e){
		$result = $e->XMLResponse($cXMLRequest->aAttrs);
		$contentType = 'text/xml';
		log_buffer($result, 'ERROR');
	}catch(Exception $e){
		
		$wmException = new Exc($e->getMessage(),$e->wmmessage);
		$result = $wmException->XMLResponse($cXMLRequest->aAttrs);
		$contentType = 'text/xml';
		log_buffer($result, 'ERROR');
		
	}
	  if(!isset($cXMLRequest->aAttrs['do_not_respond']) || !$cXMLRequest->aAttrs['do_not_respond']){
	  	answer($result,	$contentType);
	  }
}

 main();

 
?>