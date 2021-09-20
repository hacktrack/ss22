<table class="frmtbl">
	<tr>
		<td colspan="2"><obj name="application" type="obj_checkbox" tabindex="true"><title>SETTINGS::APPLICATION_ENABLE</title></obj></td>
		{optional domainadmin}<td><obj name="x_application_set" type="obj_allow_settings"><init>1</init></obj></td>{/optional}
	</tr>
	<tr>
		<td colspan="2"><obj name="banner" type="obj_checkbox" tabindex="true"><title>SETTINGS::BANNER_ENABLE</title></obj></td>
		{optional domainadmin}<td><obj name="x_banner_set" type="obj_allow_settings"><init>1</init></obj></td>{/optional}
	</tr>
	<tr>
        <th class="th">{SETTINGS::BANNER_URL}</th>
		<td><obj name="banner_url" type="obj_input" tabindex="true"></obj></td>
		{optional domainadmin}<td><obj name="x_banner_url_set" type="obj_allow_settings"><init>1</init></obj></td>{/optional}
	</tr>
	<tr>
        <th class="th">{SETTINGS::BANNER_HEIGHT} (px)</th>
		<td><obj name="banner_height" type="obj_input_number" css="obj_input_small" tabindex="true"><restrictions>&gt;-1i</restrictions></obj></obj></td>
		{optional domainadmin}<td><obj name="x_banner_height_set" type="obj_allow_settings"><init>1</init></obj></td>{/optional}
	</tr>
</table>
