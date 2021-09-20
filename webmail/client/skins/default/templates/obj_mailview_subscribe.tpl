<div class="wm_block_div">
	<h2>{summary}</h2>

	<table>
		{optional folders}
		<tr>
		    <th class="lbl">{COMMON::FOLDER}:</th><td>{folders}</td>
		</tr>
		{/optional}
		{optional items}
		<tr>
		    <th class="lbl">{COMMON::ITEMS}:</th><td>{items}</td>
		</tr>
		{/optional}
	</table>

	<form>
		{optional btn_folder}
		<input type="button" class="obj_button color1" name="subscribe" value="{MAIL_VIEW::SUBSCRIBE}" />
		{/optional}
		{optional btn_account}
		<input type="button" class="obj_button{noptional btn_folder} color1{/noptional}" name="account" value="{MAIL_VIEW::SUBSCRIBE_ACCOUNT}" />
		{/optional}
	</form>
</div>