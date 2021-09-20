<table class="frmtbl">

	<tr>
		<th class="th">{RICH::FONT}</th>
		<td class="td"><obj name="font" type="obj_select" css="small120"></obj></td>
	</tr>

	<tr>
		<th class="th">{RICH::SIZE}</th>
		<td class="td">
			<obj name="size" type="obj_select" css="small60">
			<value>0</value>
			<fill>
				<!--item key="0">0</item-->
				<item key="1">1</item>
				<item key="2">2</item>
				<item key="3">3</item>
				<item key="4">4</item>
				<item key="5">5</item>
				<item key="6">6</item>
			</fill>
			<title>RICH::SIZE</title>
			</obj>
		</td>
	</tr>

	<tr>
		<th class="th">{RICH::PARAGRAPH}</th>
		<td class="td">
			<obj name="p" type="obj_select" css="small120">
			<value>0</value>
			<fill>
				<item key="0">{RICH::PARAGRAPH}</item>
				<item key="1">{RICH::NORMAL}</item>
				<item key="2">{RICH::HEADING} 1</item>
				<item key="3">{RICH::HEADING} 2</item>
				<item key="4">{RICH::HEADING} 3</item>
				<item key="5">{RICH::HEADING} 4</item>
				<item key="6">{RICH::HEADING} 5</item>
				<item key="7">{RICH::HEADING} 6</item>
				<item key="removeFormat">{RICH::CLEARFORMATTING}</item>
			</fill>
			<title>RICH::SIZE</title>
			</obj>
		</td>
	</tr>
	<tr>
		<td class="space"></td>
	</tr>	
	<tr>
		<th class="th">{RICH::COLOR}</th>
		<td class="td">
			<a id="{anchor color}" class="ico icocolor" title="{RICH::COLOR}"><span></span></a>
			<a id="{anchor bgcolor}" class="ico icobgcolor" title="{RICH::BGCOLOR}"><span></span></a>
		</td>
	</tr>		
</table>