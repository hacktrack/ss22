<div class="popupmaindialog">
	<table class="frmtbl frmtbl100" height="100%">
		<tr height="100%">
			<td colspan="2" class="msiebox" id="{anchor msiebox}"><div class="msiebox"><obj name="grid" type="obj_datagrid" css="border"></obj></div></td>
		</tr>
		{optional sent}
		<tr>
			<td colspan="2" class="space">
				<obj name="x_btn_send" type="obj_button" css="color1"><value>COMPOSE::SEND_NOW</value><disabled>1</disabled></obj>
				<obj name="x_btn_edit" type="obj_button"><value>FORM_BUTTONS::EDIT</value><disabled>1</disabled></obj>
			</td>
		</tr>
		{/optional}
		<tr>
			<td colspan="2" class="space">&nbsp;</td>
		</tr>
		<tr>
			<th class="th sent">{DELIVERY_STATUS::SENT}</th>
			<td class="td">- {DELIVERY_STATUS::SENT_INFO}</td>
		</tr>
		<tr>
			<th class="th sent">{DELIVERY_STATUS::DELIVERED}</th>
			<td class="td">- {DELIVERY_STATUS::DELIVERED_INFO}</td>
		</tr>
		<tr>
			<th class="th queue">{DELIVERY_STATUS::QUEUE}</th>
			<td class="td">- {DELIVERY_STATUS::QUEUE_INFO}</td>
		</tr>
		<tr>
			<th class="th queue">{DELIVERY_STATUS::DEFERRED}</th>
			<td class="td">- {DELIVERY_STATUS::DEFERRED_INFO}</td>
		</tr>
		<tr>
			<th class="th canceled">{DELIVERY_STATUS::RECALLED}</th>
			<td class="td">- {DELIVERY_STATUS::RECALLED_INFO}</td>
		</tr>
		<tr>
			<th class="th error">{DELIVERY_STATUS::ERROR}</th>
			<td class="td">- {DELIVERY_STATUS::ERROR_INFO}</td>
		</tr>
	</table>
</div>