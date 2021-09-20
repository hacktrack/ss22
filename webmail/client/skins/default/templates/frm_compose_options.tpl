<div class="pad15">
	<div class="xclose" id="{anchor close_options}"></div>

	<table class="frmtbl">
		<tr>
			<td class="td50"></td>
			<td valign="top">
				<table class="frmtbl">
					<tr>
						<th class="th"><obj name="read_confirmation" type="obj_checkbox" tabindex="true">{optional disable_confirmation}<disabled>1</disabled>{/optional}<title>SETTINGS::REQUEST_READ_CONFIRMATION</title></obj></th>
					</tr>
					{noptional disable_encryption_rule}
					<tr>
						<th class="th"><obj name="encrypt" type="obj_checkbox" tabindex="true">{optional disable_encryption}<disabled>1</disabled>{/optional}<title>COMPOSE::ENCRYPT</title></obj></th>
					</tr>
					{/noptional}
					{noptional disable_signing_rule}
					<tr>
						<th class="th"><obj name="sign" type="obj_checkbox" tabindex="true">{optional disable_signing}<disabled>1</disabled>{/optional}<title>COMPOSE::SIGN</title></obj></th>
					</tr>
					{/noptional}
				</table>
			</td>
			<td class="vline"></td>
			<td>
				<table class="frmtbl">
					<tr>
						<th class="th">{SETTINGS::SPELL_LANGUAGE}</th>
						<td><obj name="spellchecker" type="obj_select" tabindex="true"></obj></td>
					</tr>
					<tr>
						<th class="th">{SETTINGS::SAVE_FOLDER_MESSAGE}</th>
						<td><obj name="sent" type="obj_select" tabindex="true"></obj></td>
					</tr>
					{optional replyto}
					<tr>
						<th class="th">{COMPOSE::REPLY_TO}</th>
						<td><obj name="reply_to_address" type="obj_input" tabindex="true"></obj></td>
					</tr>
					{/optional}
					<tr>
						<th class="th">{COMPOSE::EDIT_MODE}</th>
						<td><obj name="mode_select" type="obj_select" tabindex="true"></obj></td>
					</tr>
					{noptional disable_smart_attach}
					<tr>
						<th class="th">{SETTINGS::SMART_ATTACH}</th>
						<td><obj name="smart" type="obj_select" tabindex="true"></obj></td>
					</tr>
					{/noptional}
				</table>
			</td>
			<td class="td50"></td>
		</tr>
	</table>

</div>