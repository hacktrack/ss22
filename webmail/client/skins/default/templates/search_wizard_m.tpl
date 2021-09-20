<h2>{DATAGRID_ITEMS_VIEW::FROM}</h2>
<div><obj name="from" type="obj_input" css="obj_input_100" tabindex="true"></obj></div>
<h2>{DATAGRID_ITEMS_VIEW::TO}</h2>
<div><obj name="to" type="obj_input" css="obj_input_100" tabindex="true"></obj></div>
<h2>{DATAGRID_ITEMS_VIEW::SUBJECT}</h2>
<div><obj name="subject" type="obj_input" css="obj_input_100" tabindex="true"></obj></div>
{optional fulltext}
<h2>{SEARCH::FULLTEXT}</h2>
<div><obj name="fulltext" type="obj_input" css="obj_input_100" tabindex="true"></obj></div>
{/optional}
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

<div><obj name="attachment" type="obj_checkbox" tabindex="true"><title>DATAGRID_ITEMS_VIEW::ATTACHMENTS</title></obj></div>