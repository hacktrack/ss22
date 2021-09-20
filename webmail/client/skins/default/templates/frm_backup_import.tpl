<table class="frmtbl frmtbl100">
	<tr>
		<td colspan="3">
			<table class="frmtbl import_info">
				<tr>
					<th colspan="2">{BACKUP::IMPORT_INFO}</th>
				</tr>
				<tr>
					<th class="th">{FOLDERS::CONTACTS}</th><td>{BACKUP::IMPORT_INFO_ITM}</td>
				</tr>
				<tr>
					<th class="th event">{FOLDERS::EVENTS}</th><td>{BACKUP::IMPORT_INFO_EVN}</td>
				</tr>
			</table>
		</td>
	</tr>
	<tr>
		<td class="space" colspan="3"></td>
	</tr>
	<tr>
		<th width="40%">{BACKUP::STEP1}</th>
		<th width="30%">{BACKUP::STEP2}</th>
		<th></th>
	</tr>

	<tr>
		<td valign="top"><obj name="step3" type="obj_upload"><init>ATTACHMENT::UPLOAD</init></obj></td>
		<td valign="top"><obj name="folders" type="obj_selectfolder"><init>1</init><disabled>true</disabled></obj></td>
		<td valign="top"><obj name="import" type="obj_button" css="color1"><value>BACKUP::LOAD</value><disabled>true</disabled></obj></td>
	</tr>

</table>

<div id="{anchor csv}" class="hidden">

<table class="frmtbl frmtbl100">
	<tr>
		<td colspan="2"><hr size="1" /></td>
	</tr>
	<tr>
		<th colspan="2">{BACKUP::STEP3}</th>
	</tr>
</table>

<div><obj name="step4" type="obj_select_import"></obj></div>

<table class="frmtbl frmtbl100">
	<tr>
		<th class="th">{BACKUP::SHARING}</th>
		<td class="td">
		<obj name="step4y" type="obj_select">
			<value>*</value>
			<fill>
				<item key="*">{BACKUP::AUTO}</item>
				<item key="U">{SHARING::PUBLIC}</item>
				<item key="P">{SHARING::PRIVATE}</item>
			</fill>
		</obj>
		</td>
	</tr>
	<tr>
		<th class="th">{BACKUP::STEP_DATE}</th>
		<td class="td">
			<obj name="step4format" type="obj_select">
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
		<th class="th">{BACKUP::CHARSET}</th>
		<td class="td">
		<obj name="step4z" type="obj_select">
			<value>*</value>
			<fill>
				<item key="*">{BACKUP::AUTO}</item>
				<item key="iso-8859-1">ISO 8859-1</item>
				<item key="iso-8859-2">ISO 8859-2</item>
				<item key="iso-8859-3">ISO 8859-3</item>
				<item key="iso-8859-4">ISO 8859-4</item>
				<item key="iso-8859-5">ISO 8859-5</item>
				<item key="iso-8859-6">ISO 8859-6</item>
				<item key="iso-8859-7">ISO 8859-7</item>
				<item key="iso-8859-8">ISO 8859-8</item>
				<item key="iso-8859-9">ISO 8859-9</item>
				<item key="iso-8859-10">ISO 8859-10</item>
				<item key="iso-8859-15">ISO 8859-15</item>
				<item key="windows-1250">Windows CP 1250</item>
				<item key="windows-1251">Windows CP 1251</item>
				<item key="windows-1252">Windows CP 1252</item>
				<item key="windows-1253">Windows CP 1253</item>
				<item key="windows-1254">Windows CP 1254</item>
				<item key="windows-1255">Windows CP 1255</item>
				<item key="windows-1256">Windows CP 1256</item>
				<item key="MacRoman">MacRoman</item>
				<item key="KOI8-R">KOI8-R</item>
			</fill>
		</obj>
		</td>
	</tr>
	<tr>
		<td colspan="2"><obj name="step4x" type="obj_checkbox"><value>1</value><title>BACKUP::SKIPFIRST</title></obj></td>
	</tr>
	<tr>
		<td colspan="2"><obj name="step5" type="obj_button"><value>BACKUP::IMPORT</value></obj></td>
	</tr>
</table>
</div>
