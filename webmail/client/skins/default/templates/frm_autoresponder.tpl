<table class="frmtbl frmtbl100">
	<tr>
		<th class="th">{AUTORESPONDER::MODE}</th>
		<td class="td">
			<obj name="u_respond" type="obj_select" tabindex="true" css="max">
				<value>0</value>
				<fill>
					<item key="0">{AUTORESPONDER::DISABLED}</item>
					<item key="1">{AUTORESPONDER::RESPOND_ALWAYS}</item>
					<item key="2">{AUTORESPONDER::RESPOND_ONCE}</item>
					<item key="3">{AUTORESPONDER::RESPOND_AFTER_PERIOD}</item>
				</fill>
			</obj>
		</td>
	</tr>
	<tr>
		<th class="th">{AUTORESPONDER::RESPOND_PERIOD}</th>
		<td><obj name="u_respondperiod" type="obj_input" css="obj_input_small" tabindex="true"></obj></td>
	</tr>
	<tr>
		<th class="th">{AUTORESPONDER::SUBJECT}</th>
		<td><obj name="x_subject" type="obj_input" css="obj_input_100" tabindex="true"></obj></td>
	</tr>
	<tr>
		<td colspan="2">
			<table class="frmtbl frmtbl100">
				<tr>
					<th>{AUTORESPONDER::TEXT}</th>
				</tr>
				<tr>
					<td><obj name="x_respondercontent" type="obj_text" tabindex="true"></obj></td>
				</tr>
			</table>
			<table class="frmtbl">
				<tr>
					<th class="th"><obj name="u_respondonlyiftome" type="obj_checkbox" tabindex="true"></obj></th>
					<td>{AUTORESPONDER::RESPOND_ONLY_IF_TO_ME}</td>
				</tr>
			</table>
		</td>
	</tr>
	<tr>
		<th class="th">{AUTORESPONDER::RESPOND_BETWEEN}</th>
		<td><obj name="u_respondbetweenfrom" type="obj_input_calendar" tabindex="true"><init>empty</init></obj></td>
	</tr>
	<tr>
		<th>&nbsp;</th>
		<td><obj name="u_respondbetweento" type="obj_input_calendar" tabindex="true"><init>empty</init></obj></td>
	</tr>
	<tr>
		<td colspan="2"><hr size="1" /></td>
	</tr>
	<tr>
		<td colspan="2">

			<table class="frmtbl">
				<tr>
					<th class="th">{AUTORESPONDER::NORESPONDERFOR}</th>
					<th class="th"><obj name="x_personality" type="obj_input" tabindex="true"></obj></th>
					<td><obj name="x_add" type="obj_button" tabindex="true"><value>FORM_BUTTONS::ADD</value></obj></td>
				</tr>
			</table>

			<div><obj name="x_persons" type="obj_listbox_settings"><init>person</init></obj></div>

			<table class="frmtbl">
				<tr>
					<td><obj name="x_remove" type="obj_button" tabindex="true"><value>FORM_BUTTONS::REMOVE</value></obj></td>
				</tr>
			</table>

		</td>
	</tr>
</table>