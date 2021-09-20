<div class="popupmaindialog">
<table class="frmtbl frmtbl100">
	<tr>
		<th class="th" colspan="2">{CERTIFICATE::PURPOSES}</th>
	</tr>
	<tr>
		<td class="td" colspan="2">
			<ul>
			    {optional purposes::SSL}<li>{CERTIFICATE::SSL}</li>{/optional}
				{optional purposes::SMIME}<li>{CERTIFICATE::SMIME}</li>{/optional}
			</ul>
		</td>
	</tr>
	<tr>
		<td class="td" colspan="2"><hr size="1" /></td>
	</tr>
	{optional data::SUBJECT::0::CN::0::VALUE}
	<tr>
		<th class="th">{CERTIFICATE::ISSUEDTO}</th>
		<td class="td">{data::SUBJECT::0::CN::0::VALUE}</td>
	</tr>
	{/optional}
	{optional data::SUBJECT::0::EMAILADDRESS::0::VALUE}
	<tr>
		<th class="th">{CERTIFICATE::EMAIL}</th>
		<td class="td">{data::SUBJECT::0::EMAILADDRESS::0::VALUE}</td>
	</tr>
	{/optional}
	<tr>
		<th class="th">{CERTIFICATE::ISSUEDBY}</th>
		<td class="td">{data::ISSUER::0::CN::0::VALUE}</td>
	</tr>
	
	<tr>
		<td class="td" colspan="2"><hr size="1" /></td>
	</tr>
	
	<tr>
		<th class="th">{CERTIFICATE::VALIDITY}</th>
		<td class="td">{from} - {to}</td>
	</tr>
</table>
</div>