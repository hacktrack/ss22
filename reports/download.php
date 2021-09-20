<?php
header("X-Robots-Tag: noindex");
require_once( "inc/action.php" );
$hash = $_REQUEST['h'];
$report_id = $_REQUEST['r'];
$id = $_REQUEST['i'];
$owner = $_REQUEST['o']?$_REQUEST['o']:false;
$action = $_REQUEST['a'];
$type = $_REQUEST['t'];
$account = $_REQUEST['e'];
$qmode = $_REQUEST['q'];
$smode = $_REQUEST['s'];
$go = $_REQUEST['go']?true:false;
$word = $_REQUEST['word'];
$challengeAction = ChallengeAction::instance();
$challengeAction->setReportID( $report_id );

?>