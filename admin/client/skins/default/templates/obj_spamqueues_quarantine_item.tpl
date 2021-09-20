<ul class="table-row _item-row" hash="menu=accountdetail&amp;account={encodeURIComponent item::id}&amp;type={item::type}" tabindex="true">
	<li class="table__cell table-select-row">
		<obj name="checkbox" type="obj_checkbox" tabindex="true"></obj>
	</li>
	<li class="table__cell quarantine-sender">{htmlspecialchars item::sender}</li>
	<li class="table__cell quarantine-subject">{htmlspecialchars item::subject}</li>
	<li class="table__cell quarantine-date">{htmlspecialchars item::date}</li>
	<li class="table__cell quarantine-owner">{htmlspecialchars item::owner}</li>
	<li class="table__cell quarantine-domain">{htmlspecialchars item::domain}</li>
</ul>
