<?php

function challengecall($funcname, $param1 = "", $param2 = "")
{
	try{
		$result = icewarp_challengeresponsefunctioncall($funcname, $param1, $param2);
	}catch (CIWPipeException $pipeException){
		 	}
	catch (CIWPipeTimeoutException $timeoutException){
		 		throw new Exc('api_challenge_timeout', $timeoutException->getMessage());
	}catch (Exception $e){

	}
	return $result;
}

function challengeresponseimage($folder)
{
	$result = challengecall("GetImage", $folder);
	header("Content-Type: image/jpeg");
	$image = base64_decode($result);
	echo $image;
}

function challengeresponsefolder($folder)
{
	$result = challengecall("Folder", $folder);
	return $result;
}

function challengeresponseauthorize($folder, $word)
{
	return challengecall("Authorize", $folder, $word);
}

?>