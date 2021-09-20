<style>
.error_message{
	border:1px solid #F00 !important;
	background:#FFE1E1 !important;
}
.error_message table tr th{
	background:#EEE1E1 !important;
}
</style>
<div class="error_message">
<table>
<tr><th>Code:</th><td>{eid}</td></tr>
<tr><th>Message:</th><td>{message}</td></tr>
<tr><th>Location:</th><td>{location}</td></tr>{optional trace}
<tr><th>Trace:</th><td style="font-size:0.5em;">{trace}</td></tr>{/optional}
</table>
</div>
