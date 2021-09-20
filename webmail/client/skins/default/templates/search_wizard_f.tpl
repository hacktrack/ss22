<h2>{DATAGRID_ITEMS_VIEW::EVNTITLE}</h2>
<div><obj name="title" type="obj_input" css="obj_input_100" tabindex="true"></obj></div>

<h2>{DATAGRID_ITEMS_VIEW::EVNNOTE}</h2>
<div><obj name="description" type="obj_input" css="obj_input_100" tabindex="true"></obj></div>

<h2>{SEARCH::CONTAINS}</h2>
<div><obj name="any" type="obj_input" css="obj_input_100" tabindex="true"></obj></div>

<table class="frmtbl nospace">
<tr>
	<th class="th"><obj name="X_AFTER" type="obj_checkbox" tabindex="true"><title>SEARCH::SINCE</title></obj></th>
	<td><obj name="after" type="obj_input_calendar"><init>empty</init><disabled>1</disabled></obj></td>
</tr>
<tr>
	<th class="th"><obj name="X_BEFORE" type="obj_checkbox" tabindex="true"><title>SEARCH::UNTIL</title></obj></th>
	<td><obj name="before" type="obj_input_calendar"><init>empty</init><disabled>1</disabled></obj></td>
</tr>
</table>

<div><obj name="private" type="obj_checkbox" tabindex="true"><title>SHARING::PRIVATE</title></obj></div>