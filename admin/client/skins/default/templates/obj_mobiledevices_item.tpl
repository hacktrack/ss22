{optional item::isdevice}
<ul class="table-row sub _item-row" hash="menu=devicedetail{optional item::parsed_query::account}&amp;account=/ACCOUNT/{/optional}{optional item::parsed_query::domain}&amp;domain=/DOMAIN/{/optional}&amp;device={htmlspecialchars item::deviceid}" tabindex="true">
	<li class="table__cell table-select-row {item::hash}">
		<obj name="checkbox" type="obj_checkbox" tabindex="true"></obj>
	</li>
	<li class="table__cell mobiledevices-name no-wrap u-clearfix">
		<i class="icon-os class-{item::class} u-float-left hide-for-medium-down"></i>
		<div class="weight-600 ellipsis">{item::name}</div>
		<div class="ellipsis">{item::type}{optional item::model} / {item::model}{/optional}</div>
	</li>
	<li class="table__cell mobiledevices-last_sync hide-for-small">{item::lastsync}</li>
	<li class="table__cell mobiledevices-status">{item::status}</li>
</ul>
{/optional}
{noptional item::isdevice}
<ul class="table-row main" id="{anchor item}_{item::hash}" tabindex="true">
	<li class="table__cell table-select-row" group="{item::hash}">
		<obj name="checkbox" type="obj_checkbox" tabindex="true"></obj>
	</li>
	<li class="table__cell mobiledevices-name weight-600">{item::name} <span id="{anchor item}_{item::hash}_count"></span></li>
	<li class="table__cell mobiledevices-last_sync hide-for-small"></li>
	<li class="table__cell mobiledevices-status"></li>
</ul>
{/noptional}
