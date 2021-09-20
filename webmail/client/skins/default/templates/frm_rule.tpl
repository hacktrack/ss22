<table class="frmtbl frmtblmax nospace">
	<tr>
		<td class="pad15">
			<table class="frmtbl frmtblmax">
				<tr>
					<th class="th">{FILTERS::TITLE}</th>
					<td class="td"><obj name="title" css="obj_input_100" type="obj_input" focus="true" ></obj></td>
				</tr>
			</table>
		</td>
	</tr>
	<tr height="100%">
		<td class="msiebox" colspan="2" id="{anchor msiebox}"><div class="msiebox">
				<obj name="maintab" type="obj_tabs" css="absolute noborder topborder">
					<obj name="filters" type="obj_tab" ondemand="true">
						<value>FILTERS::CONDITIONS</value>
						<draw form="obj_filters"></draw>
					</obj>
					<obj name="actions" type="obj_tab" ondemand="true">
						<value>FILTERS::ACTIONS</value>
						<obj name="actions" type="obj_actions" ></obj>
					</obj>
				</obj>
			</div></td>
	</tr>
</table>