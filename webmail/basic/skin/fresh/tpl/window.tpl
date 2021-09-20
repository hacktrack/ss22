<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="content-type" content="text/html;charset=UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta http-equiv="x-dns-prefetch-control" content="off" />
	<title>{optional title}{htmlspecialchars title}{/optional}</title>
	<!-- iPad -->
	<meta name="viewport" content="initial-scale=1,maximum-scale=2" />
	<meta name="format-detection" content="telephone=no" />
	<link rel="apple-touch-icon" href="../icon.png" />
	<link sizes="64x64" href="../icon64.ico" rel="icon" />
	<link sizes="16x16" href="../favicon.gif" rel="icon" />
	<link rel="icon" type="image/gif" href="../favicon.gif"/>
	<!-- CSS -->
	{optional stylesheet}
	<link rel="stylesheet" type="text/css" href="minimizer/index.php?style={dynamic stylesheet}{!optional *::media}{.*::src}{/optional},{/dynamic}none" />
	{dynamic stylesheet}{optional *::media}
	<link rel="stylesheet" type="text/css" media="{.*::media}" href="minimizer/index.php?style={.*::src}" />
	{/optional}{/dynamic}
	{/optional}
</head>
<body{optional high_contrast} class="contrast"{/optional}{optional swipe} swipe="1"{/optional} onload="addTokenParam();">
<input type="hidden" value="{optional jscheck}1{/optional}{!optional jscheck}0{/optional}" id="jscheck_info"/>
<div id="mainBox">
<script type="text/javascript">
var WeekDays = new Array('{lang::event_main::sun}','{lang::event_main::mon}','{lang::event_main::tue}','{lang::event_main::wed}','{lang::event_main::thu}','{lang::event_main::fri}','{lang::event_main::sat}');
var MonthNames = new Array('{lang::event_main::jan}','{lang::event_main::feb}','{lang::event_main::mar}','{lang::event_main::apr}','{lang::event_main::may}','{lang::event_main::jun}','{lang::event_main::jul}','{lang::event_main::aug}','{lang::event_main::sep}','{lang::event_main::oct}','{lang::event_main::nov}','{lang::event_main::dec}');
</script>
{optional javascript}
<script type="text/javascript" src="minimizer/index.php?script={dynamic javascript}{.*::src},{/dynamic}none"></script>
{/optional}


<div id="gui" class="{optional folder_type 'Q'}mail{/optional}{optional folder_type 'QL'}mail{/optional}{optional folder_type 'M'}mail{/optional}{optional folder_type 'C'}contact{/optional}{optional folder_type 'E'}calendar{/optional}{optional folder_type 'T'}task{/optional}{optional folder_type 'N'}note{/optional}{optional folder_type 'F'}file{/optional}{optional folder_type 'S'}settings{/optional}">
<div id="innerBox">
	
{optional anchor::menu_top}
	{anchor::menu_top}

	<div id="container">

		{anchor::menu_left}

		{anchor::form}
		
		{anchor::switcher}
	</div>
{/optional}

{optional body}
	{body}
{/optional}
</div>
</div>
<input type="hidden" value="{lang::confirmation::delete_items}" id="ondeletewarning"/>
<input type="hidden" value="{disableshortcuts '0'}" id="disableshortcuts"/>
<table id="waitingOverlay" cellpadding="0" cellspacing="0"><tr><td><br /><br /><br /><br /><div id="waitingOverlayText"></div></td></tr></table>
</div>

</body>
</html>