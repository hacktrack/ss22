<table height="100%" class="frmtbl frmtblmax nospace">
	<tbody>
		<tr height="100%">
			<td class="msiebox" id="{anchor msiebox}">
				<div class="msiebox main" id="{anchor main}">
					<obj name="tabs" type="obj_tabs" css="nobuttons white noborder absolute noheader viewtabs">
						<obj name="room" type="obj_tab_core" css="nopadding room"><draw form="frm_main_chat_room"></draw></obj>
						<obj name="files" type="obj_tab_core" css="nopadding files" ondemand="true"><draw form="frm_main_chat_files"></draw></obj>
						<obj name="events" type="obj_tab_core" css="nopadding events" ondemand="true"><draw form="frm_main_chat_events"></draw></obj>
						<obj name="members" type="obj_tab_core" css="nopadding members" ondemand="true"><draw form="frm_main_chat_members"></draw></obj>
					</obj>
					<obj name="panel" type="obj_tabs" css="right ico transparent nobuttons noheader roomtabs">
						<value>0</value>
						<obj name="mentions" type="obj_tab_core" css="mentions"></obj>
						<obj name="pins" type="obj_tab_core" css="pins"></obj>
					</obj>
				</div>
			</td>
		</tr>
		<tr>
			<td>
				<div class="relative input_block"><div class="text_input" id="{anchor text}"></div></div>
			</td>
		</tr>
	</tbody>
</table>