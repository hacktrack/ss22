{optional comment}
<div class="comment" id="{anchor comment}"></div>
{/optional}

<div class="message{optional me} me{/optional}">
	<div class="avatar unselectable"><span style="background-image: url('{avatar::img}')"{noptional me} rel="{avatar::link}" class="private_msg"{/noptional}></span></div>
	<h3 class="name"><strong>{htmlspecialchars owner}</strong>{optional modify_text}<span class="modify unselectable">{modify_text}</span>{/optional}<span class="time unselectable" title="{fulltime}">{time}</span><span class="edit unselectable">({edited_text})</span></h3>

	<div class="border" id="{anchor border}">
		<div class="esc_msg" id="{anchor esc_msg}">{COMMON::ESC_MESSAGE}</div>
		<div class="body" id="{anchor body}">
			{optional body}<div class="cell"><article>{optional private_email}<span rel="{htmlspecialchars private_email}" class="private_msg">{htmlspecialchars private_name}</span>{/optional}{body}</article></div>{/optional}
		</div>
		<div class="addon" id="{anchor addon}"></div>
	</div>

	<div class="toolbar" id="{anchor toolbar}">
		<div id="{anchor reactions}" class="reactions"></div>
	</div>
</div>

{optional comment}
<div class="reply_block"><span class="reply" id="{anchor reply}">{CHAT::ADD_COMMENT}</span></div>
{/optional}