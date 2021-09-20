<div class="service-item">
	<div class="service-item-header">

		<div iw-flex-grid="fit center">
		<div iw-flex-cell id="{anchor status}" class="service-item-status">
			<h4 class="service-title delta">
				<span class="dot"></span>
				<span id="{anchor label}"></span>
			</h4>
		</div>
		<div iw-flex-cell="none flex-end">
			<obj name="actions" type="obj_actionselect" button_css="icon small secondary icon-menu service-selector"></obj>
		</div>
		</div>

	</div>
	<table class="service-table">
		<tbody>
			<tr><td>{DASHBOARD::UPTIME}</td><td id="{anchor uptime}">-</td></tr>
			<tr><td>{DASHBOARD::CONNECTIONS}</td><td id="{anchor connections}">-</td></tr>
			<tr><td>{DASHBOARD::DATA}</td><td id="{anchor data}">-</td></tr>
		</tbody>
	</table>
</div>
