<table>
	<tbody>
		<tr>
			<td>
				<obj name="x_text" type="obj_input" css="obj_input_small">
					<restrictions>^[0-9]*(\.[0-9]+)?$</restrictions>
				</obj>
			</td>
			<td>
				<obj name="x_type" type="obj_select">
					<value>mins</value>
					<fill>
						<item key="mins">{TIME::MINUTES}</item>
						<item key="hours">{TIME::HOURS}</item>
						<item key="days">{TIME::DAYS}</item>
					</fill>
				</obj>
			</td>
		</tr>
	</tbody>
</table>