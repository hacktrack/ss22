<h2>{account} {label}</h2>
{account_action}:
<a href="{URL}?a=11&r={report_id}&h={report_hash}&e={id}{optional admin_id}&o={admin_id}{/optional}&q={qmode}&s={smode}" target="_blank">{authorizeall}</a>&nbsp;<a href="{URL}?a=12&r={report_id}&h={report_hash}&e={id}{optional admin_id}&o={admin_id}{/optional}&q={qmode}&s={smode}" target="_blank">{acceptall}</a>&nbsp;<a href="{URL}?a=13&r={report_id}&h={report_hash}&e={id}{optional admin_id}&o={admin_id}{/optional}&q={qmode}&s={smode}" target="_blank">{deleteall}</a>&nbsp;<a href="{URL}?a=14&r={report_id}&h={report_hash}&e={id}{optional admin_id}&o={admin_id}{/optional}&q={qmode}&s={smode}" target="_blank">{blacklistall}</a>&nbsp;
{optional items_quarantine}
<table border="0">
	<thead><tr><th>{sender}</th><th>{recipient}</th><th>{subject}</th><th>{date}</th><th>{time}</th><th>{location}</th><th>{actions}</th></tr></thead>
	<tbody>
		{dynamic items_quarantine}<tr>
			<td>{*::itm_sender_short}</td>
			<td>{*::itm_recipient_short}</td>
			<td>{*::itm_subject_short}</td>
			<td>{*::itm_display::date}</td>
			<td>{*::itm_display::time}</td>
			<td>{*::itm_type_display}</td>
			<td>
				<a href="{URL}?a=1&i={*::id}&h={*::itm_hash}&e={*::itm_recipient}&t={*::itm_type}" target="_blank">{authorize}</a>&nbsp;<a href="{URL}?a=2&i={*::id}&h={*::itm_hash}&e={*::itm_recipient}&t={*::itm_type}" target="_blank">{accept}</a>&nbsp;<a href="{URL}?a=3&i={*::id}&h={*::itm_hash}&e={*::itm_recipient}&t={*::itm_type}" target="_blank">{delete}</a>&nbsp;<a href="{URL}?a=4&i={*::id}&h={*::itm_hash}&e={*::itm_recipient}&t={*::itm_type}" target="_blank">{blacklist}</a>&nbsp;<a href="{URL}?a=5&i={*::id}&h={*::itm_hash}&e={*::itm_recipient}&t={*::itm_type}" target="_blank">{view}</a>
			</td>
		</tr>{/dynamic}
	</tbody>
</table>
<br/>{/optional}{optional items_spam}<table border="0">
	<thead><tr><th>{sender}</th><th>{recipient}</th><th>{subject}</th><th>{date}</th><th>{time}</th><th>{location}</th><th>{actions}</th></tr></thead>
	<tbody>
		{dynamic items_spam}<tr>
			<td>{*::itm_sender_short}</td>
			<td>{*::itm_recipient_short}</td>
			<td>{*::itm_subject_short}</td>
			<td>{*::itm_display::date}</td>
			<td>{*::itm_display::time}</td>
			<td>{*::itm_type_display}</td>
			<td>
				<a class="actionButton" href="{URL}?a=1&i={*::id}&h={*::itm_hash}&e={*::itm_recipient}&t={*::itm_type}" target="_blank">{authorize}</a>&nbsp;<a class="actionButton" href="{URL}?a=2&i={*::id}&h={*::itm_hash}&e={*::itm_recipient}&t={*::itm_type}" target="_blank">{accept}</a>&nbsp;<a class="actionButton" href="{URL}?a=3&i={*::id}&h={*::itm_hash}&e={*::itm_recipient}&t={*::itm_type}" target="_blank">{delete}</a>&nbsp;<a class="actionButton" href="{URL}?a=4&i={*::id}&h={*::itm_hash}&e={*::itm_recipient}&t={*::itm_type}" target="_blank">{blacklist}</a>&nbsp;<a class="actionButton" href="{URL}?a=5&i={*::id}&h={*::itm_hash}&e={*::itm_recipient}&t={*::itm_type}" target="_blank">{view}</a>
			</td>
		</tr>{/dynamic}
	</tbody>
</table>
{/optional}
{account_action}:
<a href="{URL}?a=11&r={report_id}&h={report_hash}&e={id}{optional admin_id}&o={admin_id}{/optional}&q={qmode}&s={smode}" target="_blank">{authorizeall}</a>&nbsp;<a href="{URL}?a=12&r={report_id}&h={report_hash}&e={id}{optional admin_id}&o={admin_id}{/optional}&q={qmode}&s={smode}" target="_blank">{acceptall}</a>&nbsp;<a href="{URL}?a=13&r={report_id}&h={report_hash}&e={id}{optional admin_id}&o={admin_id}{/optional}&q={qmode}&s={smode}" target="_blank">{deleteall}</a>&nbsp;<a href="{URL}?a=14&r={report_id}&h={report_hash}&e={id}{optional admin_id}&o={admin_id}{/optional}&q={qmode}&s={smode}" target="_blank">{blacklistall}</a>&nbsp;
<br/><br/>