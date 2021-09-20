<head>
	<base target="_blank"/>
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
		white-space: pre-wrap;
		word-wrap: break-word;
	}
	</style>
	<style media="print">
	.print
	{
		display:block;
	}
	</style>
	<script>
	function resize()
	{
		if (window.parent.document)
		{
			window.parent.resize && window.parent.resize();
		}
		else
		if (window.opener.resize)
		{
			window.opener.resize && window.opener.resize();
		}
	}
	</script>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
</head>
<body onload="javascript: resize()">
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
						{optional *::cdisplay}&quot;{.*::cdisplay}&quot;&lt;{.*::caddress}&gt;{/optional}{!optional *::cdisplay}{.*::caddress}{/optional}
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
		{optional item::type 'text'}
			{item::text}
		{/optional}
		{!optional item::type 'text'}
			{item::html}
		{/optional}

		{optional settings::basic::show_attached_images}
		{optional item::attachments}
			<div id="allImages">
				{dynamic item::attachments}
					{optional *::isimg '1'}
					<img src="{.*::link}" alt="{htmlspecialchars *::name}" title="{htmlspecialchars *::name}" onload="parent.resize()"/><br />
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
					<img src="" alt="{.*::link}" title="{htmlspecialchars *::name}" onload="parent.resize(true)"/><br />
					{/optional}
				{/dynamic}
			</div>
		{/optional}
		{/optional}
	</div>
</body>