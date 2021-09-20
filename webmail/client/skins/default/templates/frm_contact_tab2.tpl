<table class="frmtbl frmtbl100">
<tr>
	<th class="th">{CONTACT::BIRTHDATE}</th>
	<th class="th"><obj name="ITMBDATE" type="obj_input_calendar" ><init>empty</init></obj></th>
	<th class="th">{CONTACT::ANNIVERSARY}</th>
	<td class="td"><obj name="ITMANNIVERSARY" type="obj_input_calendar" ><init>empty</init></obj></td>
</tr>
<tr>
	<th class="th">{CONTACT::GENDER}</th>
	<th class="th">
		<obj name="ITMGENDER" type="obj_select" tabindex="true">
		<fill>
			<item key="1">{CONTACT::MALE}</item>
			<item key="2">{CONTACT::FEMALE}</item>
		</fill>
		</obj>
	</th>
	<th class="th">{CONTACT::SPOUSE}</th>
	<td><obj name="ITMSPOUSE" type="obj_input" tabindex="true"></obj></td>
</tr>
<tr>
	<td colspan="4" class="space">&nbsp;</td>
</tr>
<tr>
	<td colspan="2">
		<obj name="X_HOME_ADDRESS" type="obj_address" tabindex="true"><title>{CONTACT::HOME_ADDRESS}</title></obj>
	</td>
	<td colspan="2">
		<obj name="X_OTHER_ADDRESS" type="obj_address" tabindex="true"><title>{CONTACT::OTHER_ADDRESS}</title></obj>
	</td>
</tr>
</table>

<table class="frmtbl frmtbl100">
<tr>
	<td colspan="2" class="space">&nbsp;</td>
</tr>
<tr>
	<th class="th">{CONTACT::HOMEPAGE}</th>
	<td class="td"><obj name="X_HOMEPAGE" type="obj_input_url" tabindex="true"></obj></td>
</tr>
<tr>
	<th class="th">{CONTACT::HOMEPAGE}</th>
	<td class="td"><obj name="X_HOMEPAGE2" type="obj_input_url" tabindex="true"></obj></td>
</tr>
<tr>
	<th class="th">{CONTACT::CALENDAR_URL}</th>
	<td class="td"><obj name="ITMINTERNETFREEBUSY" type="obj_input" css="obj_input_100" tabindex="true"></obj></td>
</tr>
</table>