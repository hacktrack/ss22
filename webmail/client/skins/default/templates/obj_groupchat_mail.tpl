<div class="body">

	<div class="cell info">
		<table class="frmtbl frmtbl100">
			<tr id="{anchor top}">
			   <td width="100%"><h2>{htmlspecialchars subject}{optional draft}<span class="unselectable">{CHAT::DRAFT}</span>{/optional}</h2></td>
			   <td width="0%" class="th date">{htmlspecialchars date}</td>
			   <th width="0%" rowspan="2" id="{anchor avatar}" class="avatar"></th>
		   	</tr>
		   	<tr>
				<td class="td" colspan="2"><div id="{anchor from}" class="relative"><div class="toggle unselectable" id="{anchor toggle}"><span>{COMMON::SHOW_MORE}</span><span>{COMMON::SHOW_LESS}</span></div></div></td>
		   	</tr>
		</table>

		<div class="box">
		<table class="frmtbl frmtbl100">
			{optional rcp}
			<tr>
				<td class="th lpad">{CHAT::RECIPIENTS}:</td>
				<td class="td" id="{anchor rcp}"></td>
		   	</tr>
			{/optional}
			<tr>
				<td class="th lpad">{DATAGRID_ITEMS_VIEW::SIZE}:</td>
				<td class="td">{htmlspecialchars size}</td>
		   	</tr>
		</table>
		</div>

		<div class="body_container" id="{anchor frame}">
			<div class="buttons noclick"><obj name="full_switch" type="obj_label" css="full_switch"><value>{CHAT::READ_FULL}</value></obj></div>
		</div>

		{optional attach}
		<div class="box attach noclick" id="{anchor attach}"></div>
		{/optional}
	</div>

</div>