<h3 class="name">{htmlspecialchars item::name} <span class="time unselectable" title="{item::fulltime}">({item::time})</span> <span class="action unselectable">{item::action}</span></h3>
<div class="item {item::EVNCLASS}{optional item::subclass} {item::subclass}{/optional}">
	{optional item::menu}
	<div class="menu" id="{anchor menu}"></div>
	{/optional}

	<h3 class="name">{htmlspecialchars item::org_name} <span class="time unselectable" title="{item::org_fulltime}">{item::org_time}</span></h3>
	{optional item::body}
	<div class="note">{item::body}</div>
	{/optional}

	{optional item::addon}
	<div class="addon">

		{optional item::addon::link}
		<div class="preview{optional item::preview} {item::preview}{/optional}" id="{anchor preview}"></div>
		{optional item::EVNTITLE}<h3>{htmlspecialchars item::EVNTITLE}</h3>{/optional}
		{optional item::addon::link::url}<h4>{htmlspecialchars item::addon::link::url}</h4>{/optional}
		{optional item::EVNLOCATION}<div class="info">{htmlspecialchars item::EVNLOCATION}</div>{/optional}
		<div class="buttons noclick">
			<obj name="btn_open" type="obj_button"><value>ATTACHMENT::OPEN_WINDOW</value></obj>
		</div>
		{/optional}

		{optional item::addon::event}
		{optional item::addon::event::title}<h3>{htmlspecialchars item::addon::event::title}</h3>{/optional}
		{optional item::addon::event::date}<div class="date">{item::addon::event::date}</div>{/optional}
		<div class="buttons noclick">
			<obj name="btn_accept" type="obj_button" css="color1 select"><value>FORM_BUTTONS::ACCEPT</value><disabled>1</disabled></obj>
			<obj name="btn_info" type="obj_button"><value>IM::MORE_INFO</value></obj>
		</div>
		{/optional}

		{optional item::addon::file}
		<div class="preview{optional item::preview} {item::preview}{/optional}" id="{anchor preview}"></div>
		<h3>{htmlspecialchars item::addon::file::filename}</h3>
		<div>{item::addon::file::size}</div>
		{optional item::addon::play}
		<div class="play noclick"><obj name="play" type="obj_player" css="simple transparent"><src>{htmlspecialchars item::addon::file::url}</src><title>{htmlspecialchars item::addon::file::filename}</title></obj></div>
		{/optional}
		<div class="buttons noclick">
			<obj name="btn_download" type="obj_button" css="color1"><value>ATTACHMENT::DOWNLOAD</value></obj>
			<obj name="btn_share" type="obj_button"><value>MAIN_MENU::SHARE</value></obj>
		</div>
		{/optional}

		{optional item::addon::mail}
		<h3>{htmlspecialchars item::addon::mail::subject}</h3>
		<div>{htmlspecialchars item::addon::mail::from}</div>
		<div class="preview{optional item::preview} {item::preview}{/optional}" id="{anchor preview}"></div>
		{/optional}

	</div>

	{optional item::addon::file}
	<div class="share" id="{anchor share}"></div>
	{/optional}

	{/optional}
</div>