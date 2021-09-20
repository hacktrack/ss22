<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="{iso_language}" lang="{iso_language}">
<head>
 <meta http-equiv="X-UA-Compatible" content="IE=edge" />
 <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
 <meta name="viewport" content="initial-scale=1,maximum-scale=1" />
 <meta name="format-detection" content = "telephone=no" />
 <meta name="google" content="notranslate" />
 <title></title>
 {optional meeting_supported}<link rel="stylesheet" type="text/css" href="{base ''}css/main.css" />{/optional}
 {!optional meeting_supported}<link rel="stylesheet" type="text/css" href="{base ''}css/pda.css" />{/optional}
 <link rel="stylesheet" type="text/css" href="{base ''}css/meeting.css" />
 <script type="text/javascript" src="{base ''}scripts/jquery.js"></script>
 <script type="text/javascript" src="{base ''}scripts/xmltools.js"></script>
 <script type="text/javascript" src="{base ''}scripts/functions.js"></script>
 <script type="text/javascript" src="{base ''}scripts/debug.js"></script>
 <link rel="apple-touch-icon" href="icon.png" />
 <link sizes="64x64" href="icon64.ico" rel="icon" />
 <link sizes="16x16" href="favicon.gif" rel="icon" />
 <link rel="icon" type="image/gif" href="favicon.gif"/>
 {optional base}<base href="{base}"/>{/optional}
</head>
<body id="bodyTag" class="blue" meetingID="{htmlspecialchars meetingID}">

{!optional meeting_supported}

{/optional}

{optional meeting_supported}
<form method="post" action="" id="loginForm" name="{hash}">
	
	<div id="shim"></div>
	<div id="wrapper">
		<div id="loginBox" class="preparing">
		<!-- -->
		
			<!-- NEW -->
			<div id="meetingBox" class="inactive">
				<div class="meetingMiddle meetingLeft" id="participantsList">
					<table id="topMeetingTable"><tr><td>
						<div class="topMeetingID">
							<table id="topMeetingInfoTable">
								<tr id="nameTR">
									<td>
										{lang::login_screen::name}:
									</td>
									<td>
										<strong><span id="meetingTitle">{lang::login_screen::online_meeting}</span></strong>
									</td>
								</tr>
								<tr id="durationTR">
									<td>
										{lang::login_screen::duration}:
									</td>
									<td>
										<strong><span id="meetingCounter">00:00:00</span></strong>
									</td>
								</tr>
								<tr>
									<td>
										{lang::login_screen::meeting_id}:
									</td>
									<td>
										<a href="#" id="infoButton">&nbsp;</a>
										<strong>{htmlspecialchars meeting_id}</strong>
									</td>
								</tr>
								<tr id="langTR">
									<td>{lang::login_screen::lang}:</td>
									<td><select name="languageOptions">
									{dynamic languages}
										<option value="{.*::lang}">{.*::name}</option>
									{/dynamic}
									</select></td>
								</tr>
							</table>
							
							<div id="topMeetingControls">
								<input type="button" value="{lang::login_screen::mute}" title="{lang::login_screen::mute}" class="button buttonLight" id="muteButton"/>
							</div>
							
						</div>
					</td></tr></table>
					<div id="meetingParticipantsContent"></div>
					<div id="meetingParticipantsHolder"><div>{lang::login_screen::meeting_no_participants}</div></div>
					
					<div class="meetingMiddle meetingHangup" id="hangupBox">
						<div id="meetingStatusControll">
							<input type="button" value="{lang::login_screen::meeting_hang_up}" class="button buttonRed" id="hangupButton"/>
						</div>
					</div>
					
				</div>
				
				<div class="meetingMiddle" id="contentSpace">
					<div id="topBar" class="error">
						<div id="errors"><div id="error_message"><table cellspacing="0" cellpadding="0"><tr><td class="vamiddle">
							<div>
								<span class="error"></span>
								<span class="message"></span>
							</div>
							<div class="statusTextBox">
								<div id="meetingStatusText"></div>
							</div>
						</td></tr></table></div></div>
					</div>
					<div id="videoBox" class="hidden"><div class="maximize"><div class="maximize_pos"><div class="maximize_inner">{htmlspecialchars lang::login_screen::open_in_separate_window}</div></div></div></div>
					<div id="chatWindow"><div class="notification">
						<div class="meeting_chatMessageBox system"><div class="meeting_chatMessageTop">{lang::login_screen::meeting_chat_ready}</div></div>
					</div></div>
					<div id="loginWindow">
						<input type="text" placeholder="{lang::login_screen::enter_your_name}" title="{lang::login_screen::enter_your_name_description}" class="text" id="inputUsername" value="" tabindex="1"/>
						<input type="hidden" id="inputEmail" value=""/>
						<table cellspacing="0" cellpadding="0" class="wsto">
							<tr>
								<td id="submitTd" class="-submitFull- acenter">
									<div class="acenter left">
										<input type="submit" disabled="disabled" class="disabled" id="submitLogin" value="{lang::login_screen::join_meeting}"/>
										<br />
										<a href="?meeting={htmlspecialchars meetingID}&member">{lang::login_screen::already_a_member}</a>
									</div>
								</td>
								<td class="aright other" id="helpTd">
									<a id="helpButton" class="button" href="//www.icewarp.com/support/troubleshoot_webrtc/?lang={language}" target="_blank">{lang::login_screen::help}</a>
								</td>
							</tr>
						</table>
					</div>
				</div>
				
				<div class="meetingBottom inactive">
					<table cellspacing="0" cellpadding="0" class="wsto">
						<tr>
							<td>
								<div id="chatTextBox">
									<div>
										<table cellspacing="0" cellpadding="0" class="wsto">
											<tr>
												<td id="whisperBox" class="inactive">
													<div>
														<div><span><!--To: --><span class="name"></span><span class="close">&times;</span></span></div>
													</div>
												</td>
												<td>
													<input type="text" value="" class="text wsto" id="chat_text"/>
												</td>
											</tr>
										</table>
									</div>
								</div>
							</td>
							<td id="chatSendBox">
								<input type="button" value="{lang::login_screen::send}" class="button wsto" id="chat_send"/>
							</td>
						</tr>
					</table>
				</div>
				
			</div>
			<!-- /NEW -->
		
			
			<!-- -->
			<div id="meetingErrorInfo">
				<div class="meeting_info meetingInfo_java">{lang::login_screen::java_warning_no_java}</div>
				<div class="meeting_info meetingInfo_info"></div>
				<table>
					<tr>
						<td>
							<span class="small"><strong>{lang::login_screen::conference_phone_number}:</strong></span>
						</td>
						<td>
							<span class="big meetingNumber">-</span>
						</td>
					</tr>
				</table>
			</div>
			<!-- -->
		</div>
	</div>
	<div id="footer">
		<div id="footerInner">
		</div>
		<div id="footerInfo">
			<center>
			<table cellspacing="0" cellpadding="0">
				<tr>
					<td id="footerActions" colspan="2">
						<table cellspacing="0" cellpadding="0" class="buttons_table">
							<tr>
								<td><div class="footerHeightHolder"></div></td>
								<td><div class="footerHeightHolder"></div></td>
							</tr>
						</table>
					</td>
				</tr>
				<tr id="copyright">
					<td colspan="2">
						{lang::login_screen::copy}
					</td>
				</tr>
			</table>
			</center>
		</div>
		<div id="footerBottom">
		</div>
	</div>
	
	{optional settings::restrictions::disable_interfaces}
		<input type="hidden" name="to" value="{optional recomended_interface::main::js}{recomended_interface::main::js}{/optional}{!optional recomended_interface::main::js}basic{/optional}"/>
	{/optional}
	{optional licenseType 'simple'}
		<input type="hidden" name="to" value="basic"/>
	{/optional}
	
</form>
{/optional}
	<input type="hidden" id="lang-login_screen-applet_unreachable" value="{htmlspecialchars lang::login_screen::applet_unreachable}"/>
	<input type="hidden" id="lang-login_screen-meeting_me" value="{htmlspecialchars lang::login_screen::meeting_me}"/>
	<input type="hidden" id="lang-login_screen-meeting_get_meeting_info_error" value="{htmlspecialchars lang::login_screen::meeting_get_meeting_info_error}"/>
	<input type="hidden" id="lang-login_screen-meeting_hang_up_confirmation" value="{htmlspecialchars lang::login_screen::meeting_hang_up_confirmation}"/>
	<input type="hidden" id="lang-login_screen-meeting_connected" value="{htmlspecialchars lang::login_screen::meeting_connected}"/>
	<input type="hidden" id="lang-login_screen-meeting_connecting" value="{htmlspecialchars lang::login_screen::meeting_connecting}"/>
	<input type="hidden" id="lang-login_screen-meeting_user_left_meeting" value="{htmlspecialchars lang::login_screen::meeting_user_left_meeting}"/>
	<input type="hidden" id="lang-login_screen-meeting_user_joined_meeting" value="{htmlspecialchars lang::login_screen::meeting_user_joined_meeting}"/>
	<input type="hidden" id="lang-login_screen-meeting_server_not_responding" value="{htmlspecialchars lang::login_screen::meeting_server_not_responding}"/>
	<input type="hidden" id="lang-login_screen-meeting_meeting_connected_successfully" value="{htmlspecialchars lang::login_screen::meeting_meeting_connected_successfully}"/>
	<input type="hidden" id="lang-login_screen-meeting_api_unexpected_response" value="{htmlspecialchars lang::login_screen::meeting_api_unexpected_response}"/>
	<input type="hidden" id="lang-login_screen-sip_applet_load_failed" value="{htmlspecialchars lang::login_screen::sip_applet_load_failed}"/>
	<input type="hidden" id="lang-login_screen-meeting_mikogo_ended" value="{htmlspecialchars lang::login_screen::meeting_mikogo_ended}"/>
	<input type="hidden" id="lang-login_screen-meeting_ended" value="{htmlspecialchars lang::login_screen::meeting_ended}"/>
	<input type="hidden" id="lang-login_screen-join_meeting" value="{htmlspecialchars lang::login_screen::join_meeting}"/>
	<input type="hidden" id="lang-login_screen-meeting_hang_up" value="{htmlspecialchars lang::login_screen::meeting_hang_up}"/>
	<input type="hidden" id="lang-login_screen-meeting_mikogo_ready" value="{htmlspecialchars lang::login_screen::meeting_mikogo_ready}"/>
	<input type="hidden" id="lang-login_screen-meeting_sip_ready" value="{htmlspecialchars lang::login_screen::meeting_sip_ready}"/>
	<input type="hidden" id="lang-login_screen-meeting_call_failed" value="{htmlspecialchars lang::login_screen::meeting_call_failed}"/>
	<input type="hidden" id="lang-login_screen-meeting_timeout_trying_again_in" value="{htmlspecialchars lang::login_screen::meeting_timeout_trying_again_in}"/>
	<input type="hidden" id="lang-login_screen-meeting_trying_again_in" value="{htmlspecialchars lang::login_screen::meeting_trying_again_in}"/>
	<input type="hidden" id="lang-login_screen-meeting_preparing_sip" value="{htmlspecialchars lang::login_screen::meeting_preparing_sip}"/>
	<input type="hidden" id="lang-login_screen-meeting_starting_sip" value="{htmlspecialchars lang::login_screen::meeting_starting_sip}"/>
	<input type="hidden" id="lang-login_screen-meeting_waiting_for_reply" value="{htmlspecialchars lang::login_screen::meeting_waiting_for_reply}"/>
	<input type="hidden" id="lang-login_screen-meeting_in_progress" value="{htmlspecialchars lang::login_screen::meeting_in_progress}"/>
	<input type="hidden" id="lang-login_screen-meeting_you_can_join" value="{htmlspecialchars lang::login_screen::meeting_you_can_join}"/>
	<input type="hidden" id="lang-login_screen-meeting_applet_is_not_ready" value="{htmlspecialchars lang::login_screen::meeting_applet_is_not_ready}"/>
	<input type="hidden" id="lang-login_screen-meeting_no_applet_code" value="{htmlspecialchars lang::login_screen::meeting_no_applet_code}"/>
	<input type="hidden" id="lang-login_screen-meeting_no_webrtc_support" value="{htmlspecialchars lang::login_screen::meeting_no_webrtc_support}"/>
	<input type="hidden" id="lang-login_screen-meeting_redirecting_to_help_page" value="{htmlspecialchars lang::login_screen::meeting_redirecting_to_help_page}"/>
	<input type="hidden" id="lang-login_screen-meeting_unexpected_response" value="{htmlspecialchars lang::login_screen::meeting_unexpected_response}"/>
	<input type="hidden" id="lang-login_screen-meeting_meeting_wasnt_started" value="{htmlspecialchars lang::login_screen::meeting_meeting_wasnt_started}"/>
	<input type="hidden" id="lang-login_screen-meeting_waiting" value="{htmlspecialchars lang::login_screen::meeting_waiting}"/>
	<input type="hidden" id="lang-login_screen-meeting_created_by_ready" value="{htmlspecialchars lang::login_screen::meeting_created_by_ready}"/>
	<input type="hidden" id="lang-login_screen-meeting_loading_meeting_info" value="{htmlspecialchars lang::login_screen::meeting_loading_meeting_info}"/>
	<input type="hidden" id="lang-login_screen-meeting_id_doesnt_exist" value="{htmlspecialchars lang::login_screen::meeting_id_doesnt_exist}"/>
	<input type="hidden" id="lang-login_screen-meeting_no_name" value="{htmlspecialchars lang::login_screen::meeting_no_name}"/>
	<input type="hidden" id="lang-login_screen-unknown_error" value="{htmlspecialchars lang::login_screen::unknown_error}"/>
	<input type="hidden" id="lang-login_screen-meeting_api_error_104" value="{htmlspecialchars lang::login_screen::meeting_api_error_104}"/>
	<input type="hidden" id="lang-login_screen-meeting_api_error_description_104" value="{htmlspecialchars lang::login_screen::meeting_api_error_description_104}"/>
	<input type="hidden" id="lang-login_screen-meeting_api_error_111" value="{htmlspecialchars lang::login_screen::meeting_api_error_111}"/>
	<input type="hidden" id="lang-login_screen-meeting_api_error_120" value="{htmlspecialchars lang::login_screen::meeting_api_error_120}"/>
	<input type="hidden" id="lang-login_screen-meeting_api_error_125" value="{htmlspecialchars lang::login_screen::meeting_api_error_125}"/>
	<input type="hidden" id="lang-login_screen-meeting_webrtc_not_allowed" value="{htmlspecialchars lang::login_screen::meeting_webrtc_not_allowed}"/>
	<input type="hidden" id="lang-login_screen-meeting__no_microphone_continue" value="{htmlspecialchars lang::login_screen::meeting__no_microphone_continue}"/>
	
	<input type="hidden" id="os" value="{OSCode}"/>
	<input type="hidden" id="sip_port" value="{SIP_Port}"/>
	
	<div id="debugConsole" style="width:500px; background-color:#fff; color:#333; font-family:monotype; font-size:13px; position:absolute; left:10px; top:10px;border-radius: 3px 3px 3px 3px;box-shadow:inset 0 1px 4px rgba(0, 0, 0,0.7); text-align:left;padding:10px;line-height:20px; height:75%;overflow:auto;display:none;"></div>
	
	
	<script type="text/javascript" src="{base ''}scripts/icewarp-jssip-1.0.js"></script>
	<script type="text/javascript" src="{base ''}scripts/sip_bridge.js"></script>
	<script type="text/javascript" src="{base ''}scripts/meeting/meeting.webrtc.js"></script>
	<script type="text/javascript" src="{base ''}scripts/meeting/meeting.main.webrtc.js"></script>
	<script type="text/javascript" src="{base ''}scripts/meeting/meeting.core.webrtc.js"></script>
	<script type="text/javascript" src="{base ''}scripts/meeting/meeting.console.webrtc.js"></script>
	<script type="text/javascript" src="{base ''}scripts/meeting/meeting.status.webrtc.js"></script>
	<script type="text/javascript" src="{base ''}scripts/meeting/meeting.chat.webrtc.js"></script>
	<script type="text/javascript" src="{base ''}scripts/meeting/meeting.sip.webrtc.js"></script>
	<script type="text/javascript" src="{base ''}scripts/meeting/meeting.screenSharing.webrtc.js"></script>
</body>
</html>