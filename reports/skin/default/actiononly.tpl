

{!optional message::new}
	<h1>{title} ({sender})</h1>
	{!optional view}
		{optional error_happened}<p>{failure}</p>{/optional}
		{!optional error_happened}<p>{success}</p>{/optional}
	{/optional}
	{optional message}
		<pre>{message}</pre>
	{/optional}
{/optional}
{optional message::new}
<div class="print">
		<table cellspacing="0" cellpadding="0" style="text-align:left; width:100%">
			<tr>
				<td class="mailHeader">
				<div><span class="right">{message::headers::date}</span><h2>{htmlspecialchars message::headers::subject}</h2></div>
				<div>
					<span class="right"><a href="{message::current_page_url}&amp;original=1">{message::lang::show_source}</a></span></a>
					<strong>{htmlspecialchars message::headers::from}</strong>
				</div><br />
				<div><b>{message::lang::to}:</b>
					{htmlspecialchars message::headers::to}
				</div><br />
				{optional message::attachments}
					<div>
						<b>{message::lang::attachments}:</b><br />
						{dynamic message::attachments}
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="{message::current_page_url}&amp;part={.*::part_id}" target="_blank">{htmlspecialchars *::name}</a> ({.*::size} {message::lang::bytes})
						{/dynamic}
					</div>
				{/optional}
				</td>
			</tr>
		</table>
	<hr />
	</div>
	<div id="mailBox">
	
	{optional message::isHTML}
		{message::html_body}
	{/optional}
	{!optional message::isHTML}
		<pre>{message::plain_body}</pre>
	{/optional}
	</div>
{/optional}