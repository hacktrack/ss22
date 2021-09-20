<div class="signature_box">

	<div class="signature_box2">
		<table class="frmtbl frmtblmax">
			{optional disable_new_aliases}
			<tr>
				<td colspan="2"><obj name="x_ali_add" type="obj_button" css="simple max"><value>ALIAS::ADD</value><disabled>1</disabled></obj></td>
			</tr>
			<tr>
				<td colspan="2"><obj name="x_ali_delegated" type="obj_button" css="simple max"><value>ALIAS::ADD_DELEGATED</value><disabled>1</disabled></obj></td>
			</tr>
			{/optional}
			<tr height="100%">
				<td class="msiebox" colspan="2" id="{anchor msiebox}"><div class="msiebox"><obj name="list" type="obj_listbox" css="obj_listbox_max"></obj></div></td>
			</tr>
			<tr>
		        <td><obj name="x_enable" type="obj_button" css="max"><disabled>1</disabled><value>COMMON::ENABLE</value></obj></td>
		        <td><obj name="x_disable" type="obj_button" css="max"><disabled>1</disabled><value>COMMON::DISABLE</value></obj></td>
			</tr>
		</table>

        <div class="signature_box3">
			<table class="frmtbl frmtbl100">
			    <tr>
					<th></th>
					<th class="th">{CONTACT::FULL_NAME}</th>
			        <td class="td"><obj type="obj_input" name="fullname" css="obj_input_100"></obj></td>
			    </tr>
			    <tr>
			        <th></th>
			        <th class="th">{SIGNATURE::NEWMSG}</th>
			        <td><obj type="obj_select" name="sign1"></obj></td>
			    </tr>
			    <tr>
			        <th></th>
			        <th class="th">{SIGNATURE::OLDMSG}</th>
			        <td><obj type="obj_select" name="sign2"></obj></td>
			    </tr>
			    <tr>
			    	<td colspan="3" class="space"></td>
			    </tr>
			    <tr>
			        <th></th>
			        <th class="th">{SETTINGS::SENT_FOLDER}</th>
			        <td><obj type="obj_select" name="sent"></obj></td>
			    </tr>
			    <tr>
			    	<td colspan="3" class="space"></td>
			    </tr>
			    <tr>
			        <th colspan="2"></th>
			        <td><obj type="obj_button" name="remove" css="color2"><disabled>1</disabled><value>FORM_BUTTONS::REMOVE</value></obj></td>
			    </tr>
			</table>
		</div>
	</div>
</div>