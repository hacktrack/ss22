<div class="body">
	<div class="cell preview unselectable"></div>
	<div class="cell">
		<h4 class="title private_msg">{htmlspecialchars title}</h4>

		<table class="frmtbl nospace">
			<tr>
				{optional user_email}
				<th class="th">{CONTACT::EMAIL_ADDRESS}</th><td><span class="mailto" rel="{htmlspecialchars user_email}">{htmlspecialchars full_email}</span></td>
				{/optional}
				{noptional user_email}
				<td>{CHAT::UNKNOWN_USER}</td>
				{/noptional}
			</tr>
		</table>
	</div>
</div>
