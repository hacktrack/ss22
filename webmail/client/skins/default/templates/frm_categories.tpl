<div class="maxbox distance">
	<div class="tag_search">
		<table class="frmtbl frmtbl100">
			<tr>
			    <td class="td"><obj type="obj_input_search_auto" name="search" tabindex="true" focus="true" css="obj_input_100"></obj></td>
			    <td><obj type="obj_button" name="btn_add" css="simple color1"><value>FORM_BUTTONS::ADD</value></obj></td>
			</tr>
		</table>
	</div>

	<div class="popupmaindialog">

		<div class="maxbox">
			<obj type="obj_datagrid" name="grid" tabindex="true" css="border"></obj>
		</div>

		<div class="rp">
			<obj name="pd_color" type="obj_select" css="pd_color max"><disabled>true</disabled></obj>
			<obj name="btn_edit" type="obj_button" css="max"><value>FORM_BUTTONS::EDIT</value><disabled>true</disabled></obj>
			<obj name="btn_remove" type="obj_button" css="remove max color2"><value>FORM_BUTTONS::REMOVE</value><disabled>true</disabled></obj>
		</div>
	</div>
</div>

<div class="tag_used">
	<table class="frmtbl frmtbl100">
		<tr>
		    <th class="th caption">{TAGS::SELECTED}</th>
		</tr>
		<tr>
		    <td class="td"><obj type="obj_tag_color" name="tags" tabindex="true"><readonly>true</readonly></obj></td>
		</tr>
	</table>
</div>