<div class="tbl_container">
	<table class="frmtbl frmtbl100 search_header">
		<tr>
		    <td class="td">
				<obj name="address" type="obj_input" css="obj_input_100" focus="true"></obj>
			</td>
			<td hidden id="{anchor callback}">
				<obj name="callback" type="obj_button" css="simple">
					<value>MAP::USE_ADDRESS</value>
				</obj>
			</td>
		</tr>
	</table>
</div>
<div class="map_container">
	<div id="{anchor map}" class="map_box maxbox"></div>
	<div id="{anchor infowindow-content}" class="infowindow-content">
		<img src="" width="16" height="16" class="place-icon">
		<span class="place-name"></span>
		<div class="place-address"></div>
	</div>
</div>