<table>
	<tr>
		<td class="col1">
			<table>
				<tr>
					<td colspan="2">{htmlspecialchars EVNTITLE}</td>
				</tr>
				{optional EVNLOCATION}
				<tr>
					<th>{EVENT::LOCATION}</th>
					<td>{htmlspecialchars EVNLOCATION}</td>
				</tr>
				{/optional}
				<tr>
					<th colspan="2">{FILE::DESCRIPTION}</th>
				</tr>
			</table>
			{optional EVNNOTE}<p>{EVNNOTE}</p>{/optional}
		</td>
		<td class="col2">
			<table>
				{optional evnstatus}
				<tr>
					<th>{TASK::STATUS}</th>
					<td>{evnstatus}</td>
				</tr>
				{/optional}
				{optional evncomplete}
				<tr>
					<th>{TASK::COMPLETE}</th>
					<td>{htmlspecialchars evncomplete}</td>
				</tr>
				{/optional}
				{optional evnenddate}
				<tr>
					<th>{TASK::START_DATE}</th>
					<td>{evnenddate}</td>
				</tr>
				{/optional}				
				{optional evnstartdate}
				<tr>
					<th>{TASK::DUE_DATE}</th>
					<td>{evnstartdate}</td>
				</tr>
				{/optional}				
				{optional EVNTYPE}
				<tr>
					<th>{TASK::CATEGORY}</th>
					<td>{htmlspecialchars EVNTYPE}</td>
				</tr>
				{/optional}				
			</table>
		</td>
	</tr>
</table>