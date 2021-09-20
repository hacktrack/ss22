<head>
	<base target="_blank"/>
	<link href="skin/fresh/css/mail.view.css" type="text/css" rel="stylesheet" />
	<style>
	.print
	{
		display:none;
	}
	.hidden
	{
		display:none;
	}

	pre
	{
		font-family: Courier New,Monospace;
		font-size: 15px;
		white-space:normal;
		word-wrap: break-word;
	}

	#allImages img{
		max-width: 100%;
	}

	.icewarp_smartattach
	{
		display:none;
	}
	#mailBox div .icewarp_smartattach
	{
		display:block;
	}
	</style>
	<style media="print">
	.print
	{
		display:block;
	}
	</style>
	<script>

	function ol()
	{
		if (window.parent.document)
		{
			window.parent.resize && window.parent.resize();
			window.parent.onnpslide && window.parent.onnpslide(document.getElementsByTagName('html')[0],window.parent['np_next'],window.parent['np_prev'],'I');
		}
		else
		if (window.opener.resize)
		{
			window.opener.resize && window.opener.resize();
			window.opener.onnpslide && window.opener.onnpslide(document.getElementsByTagName('html')[0],window.opener['np_next'],window.opener['np_prev'],'I');
		}
	}
	</script>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<meta http-equiv="x-dns-prefetch-control" content="off" />
</head>
<body onload="javascript: ol()">
	<div class="print">
		<table cellspacing="0" cellpadding="0" style="text-align:left; width:100%">
			<tr>
				<td class="mailHeader">
				<div><span class="right">{item::aditional::fulldate}</span><b>{htmlspecialchars item::subject}</b></div>
				<div>
					{htmlspecialchars item::aditional::fromshow}
				</div><br />
				<div><b>{lang::mail_main::to}:</b>
					{dynamic item::aditional::to}
						{optional *::cdisplay}&quot;{htmlspecialchars .*::cdisplay}&quot;&lt;{.*::caddress}&gt;{/optional}{!optional *::cdisplay}{htmlspecialchars .*::caddress}{/optional}
					{/dynamic}
				</div><br />
				{optional item::attachments}
					<div>
						<b>{lang::mail_view::attachments}:</b>&nbsp;
						{dynamic item::attachments}
							{htmlspecialchars *::name}
						{/dynamic}
					</div>
				{/optional}
				</td>
			</tr>
		</table>
	<hr />
	</div>
	<div id="mailBox">
	{!optional item::x_icewarp_server_request}
		{optional item::type 'text'}
			{item::html}
		{/optional}
		{!optional item::type 'text'}
			{item::html}
		{/optional}

		{optional settings::basic::show_attached_images}
		{optional item::attachments}
			<div id="allImages">
				{dynamic item::attachments}
					{optional *::isimg '1'}
					<img src="{optional *::smart 1}{.*::url}{/optional}{!optional *::smart 1}{.*::link}{/optional}" alt="{htmlspecialchars *::name}" title="{htmlspecialchars *::name}" onload="parent.resize()"/><br />
					{/optional}
				{/dynamic}
			</div>
		{/optional}
		{/optional}
		{!optional settings::basic::show_attached_images}
		{optional item::attachments}
			<div id="allImages" class="hidden">
				{dynamic item::attachments}
					{optional *::isimg '1'}
					<img src="" alt="{optional *::smart 1}{.*::url}{/optional}{!optional *::smart 1}{.*::link}{/optional}" title="{htmlspecialchars *::name}" onload="parent.resize(true)"/><br />
					{/optional}
				{/dynamic}
			</div>
		{/optional}
		{/optional}
	{/optional}
	</div>
</body>