<div class="event">
	<div class="day unselectable">{item::day}</div>
	<div class="name" id="{anchor name}"><div>{htmlspecialchars item::EVNTITLE}</div></div>
	<div class="icon date unselectable" title="{item::fulltime}">{item::date}{optional item::duration}<span>{item::duration}</span>{/optional}</div>
	<div class="icon place unselectable{noptional item::EVNLOCATION} blank{/noptional}">{htmlspecialchars item::EVNLOCATION}</div>
	<div class="icon attendee unselectable{noptional item::attendee} blank{/noptional}">{item::attendee}</div>
	<div class="control" id="{anchor control}"><obj name="btn_accept" type="obj_button" css="color3 simple select"><value>FORM_BUTTONS::ACCEPT</value></obj></div>
</div>