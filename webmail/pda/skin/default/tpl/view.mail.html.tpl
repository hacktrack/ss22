<base target="_blank"/>
<style>
.print
{
	display:none;
}
</style>
<style media="print">
.print
{
	display:block;
}
</style>
<div class="print">
	<table cellspacing="0" cellpadding="0" style="text-align:left; width:100%">
		<tr>
			<td class="mailHeader">
			<div><span style="float:right">{item::aditional::fulldate}</span><b>{htmlspecialchars item::subject}</b></div>
			<div>
				{htmlspecialchars item::from}
			</div><br />
			<div><b>{lang::grid_mail::to}:</b>
				{dynamic item::aditional::to}
					{optional *::cdisplay}&quot;{*::cdisplay}&quot;&lt;{*::caddress}&gt;{/optional}{!optional *::cdisplay}{*::caddress}{/optional}
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
{item::html}