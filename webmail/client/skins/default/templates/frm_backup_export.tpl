<table class="frmtbl frmtbl100">
	<tr>
		<th>{BACKUP::STEP1E}</th>
	</tr>
	<tr>
		<td><obj name="folders" type="obj_selectfolder"><init><item>1</item><item>C</item></init></obj></td>
	</tr>
	<tr>
		<th>{BACKUP::STEP2E}</th>
	</tr>
	<tr>
		<td>
		<obj name="separator" type="obj_select">
			<value>,</value>
			<fill>
                <item key="vcard">{BACKUP::VCARD}</item>
				<item key=",">{BACKUP::COMMA}</item>
				<item key=";">{BACKUP::SEMICOLON}</item>
				<item key=":">{BACKUP::COLON}</item>
			</fill>
		</obj>
		</td>
	</tr>
	<tr>
		<th>{BACKUP::STEP_DATE}</th>
	</tr>
	<tr>
		<td>
		<obj name="date_format" type="obj_select">
			<value>*</value>
			<fill>
				<item key="*">{BACKUP::DEFAULT_DATE}</item>
				<item key="mm/dd/yy">mm/dd/yy</item>
				<item key="mm/dd/yyyy">mm/dd/yyyy</item>
				<item key="dd-mm-yy">dd-mm-yy</item>
				<item key="dd-mm-yyyy">dd-mm-yyyy</item>
				<item key="dd/mm/yy">dd/mm/yy</item>
				<item key="dd/mm/yyyy">dd/mm/yyyy</item>
				<item key="yyyy-mm-dd">yyyy-mm-dd</item>
				<item key="dd.mm.yy">dd.mm.yy</item>
				<item key="dd.mm.yyyy">dd.mm.yyyy</item>
				<item key="dd mmm yy">dd mmm yy</item>
				<item key="dd mmm yyyy">dd mmm yyyy</item>
			</fill>
		</obj>
		</td>
	</tr>
	<tr>
		<td class="space"></td>
	</tr>
	<tr>
		<td><obj name="export" type="obj_button" css="color1"><value>BACKUP::EXPORT</value></obj></td>
	</tr>
</table>