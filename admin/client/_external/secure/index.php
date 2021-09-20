<?php
 


 
require_once('IceWarpWebAdminExternalLogin.class.php');

 
function currentPageURL() {
	$pageURL = 'http';
	if ($_SERVER["HTTPS"] == "on") {$pageURL .= "s";}
	$pageURL .= "://";
	if ($_SERVER["SERVER_PORT"] != "80") {
	$pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
	} else {
	$pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
	}
	return $pageURL;
}
 

 
$error_description=array(
	'no_rsa_header'		 => 'IW server returned no public certificate data. Check if the IW server version is supported and the login page URL valid.',
	'no_time_header'	 => 'IW server returned no time header. Check if the IW server version is supported and the login page URL valid.',
	'no_public_key'		 => 'IW server returned no public certificate data. Check if the IW server version is supported and the login page URL valid.',
	'login_invalid'		 => 'Login credentials are invalid',
	'no_login_sid'		 => 'SID can\'t be retrieved from IW server. Check if the IW server version is supported.'
);
 

 
if(isset($_POST['retrieve_sid']) ||isset($_POST['retrieve_url']) || isset($_POST['login_goto']))
{
	$login=$_POST['login'];
	
	$oRemote = new IceWarpWebAdminExternalLogin(array(
		'username'			 => $login['username'],
		'password'			 => $login['password'],
		'login_page_url'	 => $login['login_page_url'],
		'admin_login_page_url'	 => $login['admin_login_page_url'],
		'api_url'	 => $login['api_url'],
		'language'			 => $login['language'],
		'logout_page_url'	 => $login['logout_page_url'],
		'verbosity'			 => 'ERROR'
	));
	
	if(isset($_POST['retrieve_sid'])){
		$data = $oRemote->getLoginSID();
	}
	elseif(isset($_POST['retrieve_url'])){
		$data = $oRemote->getVerifiedOneTimeLoginURL($login['interface']);
	}
	elseif(isset($_POST['login_goto'])){
		$url=$oRemote->getVerifiedOneTimeLoginURL($login['interface']);
		if(!$oRemote->isError())
		{
			header("Location: ".$url);
			die();
		}
	}
}
 

?><!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
 <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
 <title>Onclicklogin</title>
</head>
<body>
<?php
	if(isset($oRemote) && $oRemote->isError()){
		echo "<pre style=\"background-color:#FFB2B2; border:#CE0505 1px dashed; padding:15px;\">";
		$errors=$oRemote->getErrors();
		foreach($errors as $key=>$val){
			echo "<strong>".htmlspecialchars($key)."</strong> <em>(".(isset($error_description[$key])?htmlspecialchars($error_description[$key]):'no detail information available').")</em><br />";
		}
		echo "</pre>";
	}
	elseif(isset($oRemote)){
		echo "<pre style=\"background-color:#eee; border:#777 1px dashed; padding:15px;\">".htmlspecialchars($data)."</pre>";
	}
?>
<form action="" method="post">
	<table>
		<tr>
			<td>Username: </td>
			<td>
				<input type="text" name="login[username]" value="<?php if(isset($_POST['login']['username'])){echo htmlspecialchars($_POST['login']['username']);} ?>"/>
			</td>
		</tr>
		<tr>
			<td>Password: </td>
			<td>
				<input type="password" name="login[password]" value="<?php if(isset($_POST['login']['password'])){echo htmlspecialchars($_POST['login']['password']);} ?>"/>
			</td>
		</tr>
		<tr>
			<td>WebAdmin login page URL: </td>
			<td>
				<input type="text" name="login[admin_login_page_url]" value="<?php if(isset($_POST['login']['admin_login_page_url'])){echo htmlspecialchars($_POST['login']['admin_login_page_url']);} ?>"/>
			</td>
		</tr>
		<tr>
			<td>WebMail login page URL: </td>
			<td>
				<input type="text" name="login[login_page_url]" value="<?php if(isset($_POST['login']['login_page_url'])){echo htmlspecialchars($_POST['login']['login_page_url']);} ?>"/>
			</td>
		</tr>
		<tr>
			<td>IceWarp API URL: </td>
			<td>
				<input type="text" name="login[api_url]" value="<?php if(isset($_POST['login']['api_url'])){echo htmlspecialchars($_POST['login']['api_url']);} ?>"/>
			</td>
		</tr>
		<tr>
			<td>Desired logout page URL: </td>
			<td>
				<input type="text" name="login[logout_page_url]" value="<?php if(isset($_POST['login']['logout_page_url'])){echo htmlspecialchars($_POST['login']['logout_page_url']);}else{echo htmlspecialchars(currentPageURL());} ?>"/>
			</td>
		</tr>
		<tr>
			<td>Language: </td>
			<td>
				<select size="1" name="login[language]">
					<option value="en">English</option>
				</select>
			</td>
		</tr>
	</table>
	
	<input type="hidden" name="login[ctz]" value="0" id="ctz"/>
	
	<input type="submit" name="retrieve_sid" value="Retrieve SID" />
	<input type="submit" name="retrieve_url" value="Retrieve verified one time login URL" />
	<input type="submit" name="login_goto" value="Login to IceWarp" />
</form>

<!-- Uncomment the line below if you want to set TIMEZONE automatically by javascript -->
<script>if(document.getElementById('ctz')){document.getElementById('ctz').value=(new Date().getTimezoneOffset())*(-1);}</script>

</body>
</html>