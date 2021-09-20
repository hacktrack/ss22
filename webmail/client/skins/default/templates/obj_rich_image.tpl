<div class="popupmaindialog">
	<table class="frmtbl frmtbl100">
	{noptional image}
	{noptional upload}
	<tr>
		<th class="th"{optional insert_image} rowspan="2"{/optional}><obj name="radio" type="obj_radio"></obj></th>
		<th class="td" colspan="2"><obj name="url" type="obj_input" css="obj_input_100" tabindex="true" focus="true"><value>http://</value></obj></th>
	</tr>
	{/noptional}
	{optional upload}
	<tr>
		<th class="th valign" rowspan="{optional insert_image}4{/optional}{noptional insert_image}3{/noptional}"><obj name="radio" type="obj_radio"></obj></th>
		<th class="td" colspan="2"><obj name="url" type="obj_input" css="obj_input_100" tabindex="true"><value>http://</value></obj></th>
	</tr>	
	{/optional}
	
	{optional insert_image}
	<tr>
		<td class="td"><obj name="internal" type="obj_select" css="max" tabindex="true"></obj></td>
		<td><obj name="add_item" type="obj_button" css="simple ico img doc"></obj></td>
	</tr>
	{/optional}
	
	{optional upload}
	<tr>
		<td class="td"><obj name="uploaded" type="obj_select" css="max" tabindex="true"></obj></td>
		<td><obj name="upload" type="obj_upload"></obj></td>
	</tr>
	{optional screenshot}
	<tr>
		<td colspan="2" class="td"><canvas id="{anchor canvas}" className="screenshot" width="136px" height="102px"></canvas><div class="btninfo">{RICH::SCREENSHOT}</div><div class="btninfo"><span>PrtScn</span></div><div class="btninfo">{RICH::PASTE_IMG}</div><div class="btninfo"><span>Ctrl</span>+<span>V</span></div></td>
	</tr>
	{/optional}
	{/optional}

	<tr>
		<td colspan="3" class="space">&nbsp;</td>
	</tr>
	{/noptional}
	<tr>
		<th class="th">{RICH::ALT}</th>
		<th class="td" colspan="2"><obj name="alt" type="obj_input" css="obj_input_100" tabindex="true"></obj></th>
	</tr>
	<tr>
		<th class="th">{RICH::WIDTH}</th>
		<td class="td" colspan="2">
			<obj name="width" type="obj_input" css="width" tabindex="true"></obj>
			<obj name="width_unit" type="obj_select" css="small60" tabindex="true">
				<value>0</value>
				<fill>
					<item>px</item>
					<item>%</item>
				</fill>
			</obj>
		</td>
	</tr>
	<tr>
		<th class="th">{RICH::HEIGHT}</th>
		<td class="td" colspan="2">
			<obj name="height" type="obj_input" css="height" tabindex="true"></obj>
			<obj name="height_unit" type="obj_select" css="small60" tabindex="true">
				<value>0</value>
				<fill>
					<item>px</item>
					<item>%</item>
				</fill>
			</obj>
		</td>
	</tr>
	<tr>
		<th class="th">{RICH::BORDER}</th>
		<td class="td" colspan="2">
			<table class="tbltbl">
			    <tr>
					<td class="th">
						<obj name="border" type="obj_select" css="small" tabindex="true">
						<value>0</value>
						<fill>
							<item>0</item>
							<item>1</item>
							<item>2</item>
							<item>3</item>
						</fill>
						</obj>
					</td>
					<th class="th">{RICH::IMG_SPACING}</th>
					<td>
						<obj name="spacing" type="obj_input" css="obj_input_small" tabindex="true"></obj>
					</td>
				</tr>
			</table>
		</td>
	</tr>
	</table>
</div>
