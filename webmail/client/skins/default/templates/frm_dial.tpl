<div class="popupmaindialog">
	<div class="big maxbox relative">
		<div class="lbox">
			<obj name="list" type="obj_datagrid" css="border"></obj>
		</div>
		<div class="rbox">

			<div class="box1 relative">
				<obj name="number" type="obj_suggest_phone" css="obj_input_100" tabindex="true" focus="true"></obj>
				<obj name="add" type="obj_button" css="ico img add simple" tabindex="true"></obj>
			</div>

			<!-- keypad -->
			<table class="frmtbl frmtbl100 keyboard">
				<tr>
					<td><obj name="btn_1" type="obj_button" css="big max"><text>1</text></obj></td>
					<td><obj name="btn_2" type="obj_button" css="big max"><text>2 abc</text></obj></td>
					<td><obj name="btn_3" type="obj_button" css="big max"><text>3 def</text></obj></td>
				</tr>
				<tr>
					<td><obj name="btn_4" type="obj_button" css="big max"><text>4 ghi</text></obj></td>
					<td><obj name="btn_5" type="obj_button" css="big max"><text>5 jkl</text></obj></td>
					<td><obj name="btn_6" type="obj_button" css="big max"><text>6 mno</text></obj></td>
				</tr>
				<tr>
					<td><obj name="btn_7" type="obj_button" css="big max"><text>7 pqrs</text></obj></td>
					<td><obj name="btn_8" type="obj_button" css="big max"><text>8 tuv</text></obj></td>
					<td><obj name="btn_9" type="obj_button" css="big max"><text>9 wxyz</text></obj></td>
				</tr>
				<tr>
					<td><obj name="btn_star" type="obj_button" css="big max"><text>*</text></obj></td>
					<td><obj name="btn_0" type="obj_button" css="big max"><text>0</text></obj></td>
					<td><obj name="btn_sharp" type="obj_button" css="big max"><text>#</text></obj></td>
				</tr>
			</table>

			<div class="box2 relative">
				<obj name="call" type="obj_button" css="big call max simple color3 external relative" tabindex="true"><value>DIAL::DIAL</value></obj>
				<obj name="video" type="obj_button" css="big ico img video simple color1" tabindex="true"><title>DIAL::VIDEO</title><disabled>1</disabled></obj>
			</div>

		</div>
	</div>
</div>