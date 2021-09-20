<?php

if(!file_exists('proxy.log')){file_put_contents('proxy.log','');}

function logIt($request,$response){
	file_put_contents('proxy.log',date('d.m.Y h:i:s').';'.base64_encode($request).";".base64_encode($response)."\r\n",FILE_APPEND);
}

if(isset($_GET['clear'])){
	file_put_contents('proxy.log','');
	header('Location:./proxy.php');
	die();
}

if(isset($_GET['com'])){
	$input=file_get_contents('php://input');
	$xData=icewarp_apitunnel($input, $_SERVER['REMOTE_ADDR']);
	logIt(urlencode($input),$xData);
	
	header('Content-Type: application/xml');
	echo $xData;
	
	die();
}else{
	
	$data=file_get_contents('proxy.log');
	$data=explode("\r\n",trim($data));
	
	$res=array();
	
	foreach($data as $val){
		$line=explode(';',$val);
		$res[]=array(
			'time'=>$line[0],
			'request'=>base64_decode($line[1]),
			'response'=>base64_decode($line[2])
		);
		$res=array_reverse($res);
	}
	
	$template=explode('/*end*/?>',file_get_contents(__file__));$template=trim($template[count($template)-1]);
	echo template($template,array('data'=>$res),true);
	die();
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body id="body" onload="window.reloadTimeout=setTimeout(function(){location.reload();},5000);">
<a href="?clear">EMPTY LOG</a> <a href="#STOPPED" onclick="clearTimeout(window.reloadTimeout); document.getElementById('start').style.display='inline'; this.style.display='none';">STOP</a> <a href="#" onclick="location.hash=''; location.reload();" style="display: none;" id="start">START</a>
{optional data}
{dynamic data}
	<div>
		<h2>{.*::time}</h2>
		<textarea style="width: 100%; height:200px">{htmlspecialchars .*::request}</textarea>
		<textarea style="width: 100%; height:200px">{htmlspecialchars *::response}</textarea>
	</div>
	<hr />
{/dynamic}
{/optional}
</body>
</html>