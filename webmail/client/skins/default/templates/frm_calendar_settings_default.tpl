<table class="frmtbl">
	{optional admin domainadmin gw_e}
	<tr>
		<th class="th">{SETTINGS::EVENT_SHOW_AS}</th>
		<td>
			<obj name="event_show_as" type="obj_select" tabindex="true">
				<value>S</value>
				<fill>
					<item key="F">{EVENT::FREE}</item>
					<item key="T">{EVENT::TENTATIVE}</item>
					<item key="S">{EVENT::BUSY}</item>
					<item key="O">{EVENT::OUT_OF_OFFICE}</item>
				</fill>
			</obj>
		</td>
		{optional domainadmin}<td><obj name="x_event_show_as_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<td colspan="3">&nbsp;</td>
	</tr>
	<tr>
		<th class="th">{SETTINGS::EVENT_SHARING}</th>
		<td>
			<obj name="event_sharing" type="obj_select" tabindex="true">
				<value>U</value>
				<fill>
					<item key="P">{SHARING::PRIVATE}</item>
					<item key="U">{SHARING::PUBLIC}</item>
				</fill>
			</obj>
		</td>
		{optional domainadmin}<td><obj name="x_event_sharing_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	{/optional}
	{optional admin domainadmin gw_c}
	<tr>
		<th class="th">{SETTINGS::CONTACT_SHARING}</th>
		<td>
			<obj name="contact_sharing" type="obj_select" tabindex="true">
				<value>U</value>
				<fill>
					<item key="P">{SHARING::PRIVATE}</item>
					<item key="U">{SHARING::PUBLIC}</item>
				</fill>
			</obj>
		</td>
		{optional domainadmin}<td><obj name="x_contact_sharing_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	{/optional}
	{optional admin domainadmin gw_j}
	<tr>
		<th class="th">{SETTINGS::JOURNAL_SHARING}</th>
		<td>
			<obj name="journal_sharing" type="obj_select" tabindex="true">
				<value>U</value>
				<fill>
					<item key="P">{SHARING::PRIVATE}</item>
					<item key="U">{SHARING::PUBLIC}</item>
				</fill>
			</obj>
		</td>
		{optional domainadmin}<td><obj name="x_journal_sharing_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	{/optional}
	{optional admin domainadmin gw_n}
	<tr>
		<th class="th">{SETTINGS::NOTE_SHARING}</th>
		<td>
			<obj name="note_sharing" type="obj_select" tabindex="true">
				<value>U</value>
				<fill>
					<item key="P">{SHARING::PRIVATE}</item>
					<item key="U">{SHARING::PUBLIC}</item>
				</fill>
			</obj>
		</td>
		{optional domainadmin}<td><obj name="x_note_sharing_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	{/optional}
	{optional admin domainadmin gw_f}
	<tr>
		<th class="th">{SETTINGS::FILE_SHARING}</th>
		<td>
			<obj name="file_sharing" type="obj_select" tabindex="true">
				<value>U</value>
				<fill>
					<item key="P">{SHARING::PRIVATE}</item>
					<item key="U">{SHARING::PUBLIC}</item>
				</fill>
			</obj>
		</td>
		{optional domainadmin}<td><obj name="x_file_sharing_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	{/optional}
	{optional admin domainadmin gw_t}
	<tr>
		<th class="th">{SETTINGS::TASK_SHARING}</th>
		<td>
			<obj name="task_sharing" type="obj_select" tabindex="true">
				<value>U</value>
				<fill>
					<item key="P">{SHARING::PRIVATE}</item>
					<item key="U">{SHARING::PUBLIC}</item>
				</fill>
			</obj>
		</td>
		{optional domainadmin}<td><obj name="x_task_sharing_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	{/optional}
</table>