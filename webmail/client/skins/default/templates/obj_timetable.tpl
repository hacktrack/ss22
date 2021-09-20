	<div class="quick"><obj name="inp_add" type="obj_suggest_mail" css="obj_input_100" tabindex="true"></obj></div>

	<div class="list_header" id="{anchor heading}">{ATTENDEES::ALL_ATTENDEES}</div>

	<div class="list">
		<div class="block" id="{anchor list}"></div>
	</div>

	<div class="timebox" id="{anchor time}"></div>

	<div class="body" id="{anchor body}"></div>

	<div class="tool">
        <obj name="add_button" type="obj_button" css="max"><value>ADDRESS_BOOK::ADDRESS_BOOK</value></obj>
		<obj name="addr_button" type="obj_button" css="max"><disabled>1</disabled><value>ATTENDEES::RESOURCE</value></obj>
	</div>

 	<table width="100%">
		<tr>
		    <td><obj name="rf" type="obj_button" css="ico img prev simple"></obj></td>
            <td width="50%"></td>
		    <td><obj name="now" type="obj_button" css="simple"><value>CALENDAR::TODAY</value></obj></td>
			<td width="50%"></td>
		    <td><obj name="ff" type="obj_button" css="ico img next simple"></obj></td>
		</tr>
	</table>