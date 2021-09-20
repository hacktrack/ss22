{optional item::grouplabel}
<ul class="table-row main" name="{item::grouplabel}" type="{item::type_code}">
	<li class="table__cell consoledialog-name">
		<h3 class="box-content-title gamma">{item::grouplabel}</h3>
	</li>
	<li class="table__cell consoledialog-type hide-for-small-down"></li>
	<li class="table__cell consoledialog-value"></li>
	<li class="table__cell consoledialog-description hide-for-medium-down"></li>
</ul>
{/optional}
<ul class="table-row sub" name="{item::name}" type="{item::type_code}" id="{anchor id_}{item::name}">
	<li class="table__cell consoledialog-name" id="{anchor variable_}{item::name}">
		<div class="consoledialog-name-name is-selectable" id="{anchor variable_container_}{item::name}">{item::showname}</div>
		<div id="{anchor variable_input_container_}{item::name}" is-hidden="1"></div>
		<div class="consoledialog-name-description hide-for-large-up">{item::description}</div>
	</li>
	<li class="table__cell consoledialog-type hide-for-small-down">{item::type}</li>
	<li class="table__cell consoledialog-value" id="{anchor value}_{item::name}">
		<div iw-flex-grid="fit">
			<div iw-flex-cell="item-center" id="{anchor edit}_{item::name}" class="consoledialog-form_element"></div>
			<div iw-flex-cell="none half-padding" id="{anchor save}_{item::name}" class="consoledialog-save_button"></div>
		</div>
	</li>
	<li class="table__cell consoledialog-description hide-for-medium-down">{item::description}</li>
</ul>
