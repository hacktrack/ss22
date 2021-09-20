<table class="frmtbl">
	<tr>
		<th><obj name="X_BTN_NAME" type="obj_button" css="max"><value>CONTACT::FULL_NAME</value></obj></th>
		<th class="th"><obj name="X_NAME" type="obj_input" tabindex="true"></obj></th>
		<td rowspan="{optional sort_as}7{/optional}{noptional sort_as}6{/noptional}" class="avatar_image">
        	<div id="{anchor avatar_image}">
        		<obj name="X_AVATAR" type="obj_upload"><init><item></item><item>1</item></init></obj>
        	</div>        	
		</td>
	</tr>

	<tr>
		<th class="th">{CONTACT::CONTACT_NAME}</th>
		<th class="th"><obj name="ITMCLASSIFYAS" type="obj_select_input" tabindex="true"></obj></th>
	</tr>

	{optional sort_as}
	<tr>
		<th class="th">{CONTACT::SORT_AS}</th>
		<th class="th"><obj name="ITMSORTSTRING" type="obj_input" tabindex="true"></obj></th>
	</tr>
	{/optional}


	<tr>
		<th class="th">{CONTACT::NICK_NAME}</th>
		<th class="th"><obj name="ITMNICKNAME" type="obj_input" tabindex="true"></obj></th>
	</tr>

	<tr>
		<td colspan="2">&nbsp;</td>
	</tr>
	
	<tr>
		<th class="th">{CONTACT::COMPANY}</th>
		<th class="th"><obj name="ITMCOMPANY" type="obj_input" tabindex="true"></obj></th>
	</tr>

	<tr>
		<th class="th">{CONTACT::JOB}</th>
		<td><obj name="ITMJOBTITLE" type="obj_input" tabindex="true"></obj></td>
	</tr>
</table>

<table class="frmtbl frmtbl100">
	<tr>
		<td colspan="4">&nbsp;</td>
	</tr>
	<tr>
		<th>{CONTACT::PHONES}</th>
		<td rowspan="5">&nbsp;</td>
		<td colspan="2"></td>
	</tr>
	<tr>
        <td><obj name="X_PHONE1" type="obj_phone" css="phone_num" tabindex="7"></obj></td>
		<th class="th">{CONTACT::EMAIL1}</th>
		<td class="td"><obj name="X_EMAIL1" type="obj_input_email" tabindex="true"></obj></td>
	</tr>
	<tr>
        <td><obj name="X_PHONE2" type="obj_phone" css="phone_num" tabindex="8"></obj></td>
		<th class="th">{CONTACT::EMAIL2}</th>
		<td><obj name="X_EMAIL2" type="obj_input_email" tabindex="true"></obj></td>
	</tr>
	<tr>
        <td><obj name="X_PHONE3" type="obj_phone" css="phone_num" tabindex="10"></obj></td>
		<th class="th">{CONTACT::EMAIL3}</th>
		<td><obj name="X_EMAIL3" type="obj_input_email" tabindex="true"></obj></td>
	</tr>
	<tr>
        <td><obj name="X_PHONE4" type="obj_phone" css="phone_num" tabindex="12"></obj></td>
		<th class="th">{CONTACT::IM}</th>
		<td><obj name="X_IM1" type="obj_input" css="obj_input_100" tabindex="true"></obj></td>
	</tr>

	<tr>
		<td colspan="4">&nbsp;</td>
	</tr>
	<tr>
		<td colspan="4"><obj name="ITMCATEGORY" type="obj_categories" tabindex="true"></obj></td>
	</tr>
</table>