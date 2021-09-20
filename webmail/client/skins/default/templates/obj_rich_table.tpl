<div class="popupmaindialog">
	<table class="frmtbl">
	<tr>
		<th class="th">{RICH::COLUMNS}</th>
		<th class="th"><obj name="columns" type="obj_input" css="obj_input_small" tabindex="true" focus="true"><value>4</value><restrictions>&gt;-1i</restrictions></obj></th>
		<th class="th">{RICH::ROWS}</th>
		<td class="td"><obj name="rows" type="obj_input" css="obj_input_small" tabindex="true"><value>4</value><restrictions>&gt;-1i</restrictions></obj></td>
	</tr>
	<tr>
		<td colspan="4" class="hr">&nbsp;</td>
	</tr>
	<tr>
		<th class="th">{RICH::BORDER}</th>
		<th class="th">
			<obj name="border" type="obj_select" css="small" tabindex="true">
			<value>1</value>
			<fill>
				<item>0</item>
				<item>1</item>
				<item>2</item>
				<item>3</item>
			</fill>
			</obj>
		</th>
		<th class="th">{RICH::BORDERCOLOR}</th>
		<td>
		<a id="{anchor color_picker}" class="ico icocolor color_picker" title="{RICH::COLOR}"><span></span></a>
		<!--obj name="color" type="obj_input" css="obj_input_50" tabindex="true">
			<value>000000</value>
			<restrictions>^([0-9a-f])+$</restrictions>
		</obj-->
		</td>
	</tr>
	<tr>
		<th class="th">{RICH::PADDING}</th>
		<td>
		<obj name="padding" type="obj_input" css="obj_input_small" tabindex="true">
			<value>2</value>
		    <restrictions>&gt;-1i</restrictions>
		</obj>
		</td>
		<th class="th">{RICH::SPACING}</th>
		<td>
		<obj name="spacing" type="obj_input" css="obj_input_small" tabindex="true">
			<value>2</value>
			<restrictions>&gt;-1i</restrictions>
		</obj>
		</td>
	</tr>
	</table>
</div>