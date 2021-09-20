
<input type="hidden" id="lang-mail_compose-block_type" value="{lang::mail_compose::block_type}"/>
<input type="hidden" id="lang-mail_compose-heading" value="{lang::mail_compose::heading}"/>
<input type="hidden" id="lang-mail_compose-paragraph" value="{lang::mail_compose::paragraph}"/>
<input type="hidden" id="lang-mail_compose-font" value="{lang::mail_compose::font}"/>
<input type="hidden" id="lang-mail_compose-size" value="{lang::mail_compose::size}"/>

<input type="hidden" id="lang-mail_compose-blockformat" value="{lang::mail_compose::blockformat}"/>
<input type="hidden" id="lang-mail_compose-left" value="{lang::mail_compose::left}"/>
<input type="hidden" id="lang-mail_compose-center" value="{lang::mail_compose::center}"/>
<input type="hidden" id="lang-mail_compose-right" value="{lang::mail_compose::right}"/>
<input type="hidden" id="lang-mail_compose-justify" value="{lang::mail_compose::justify}"/>
<input type="hidden" id="lang-mail_compose-unorderedlist" value="{lang::mail_compose::unorderedlist}"/>
<input type="hidden" id="lang-mail_compose-orderedlist" value="{lang::mail_compose::orderedlist}"/>
<input type="hidden" id="lang-mail_compose-indent" value="{lang::mail_compose::indent}"/>
<input type="hidden" id="lang-mail_compose-outdent" value="{lang::mail_compose::outdent}"/>
<input type="hidden" id="lang-mail_compose-fontformat" value="{lang::mail_compose::fontformat}"/>
<input type="hidden" id="lang-mail_compose-fontsize" value="{lang::mail_compose::fontsize}"/>
<input type="hidden" id="lang-mail_compose-bold" value="{lang::mail_compose::bold}"/>
<input type="hidden" id="lang-mail_compose-italic" value="{lang::mail_compose::italic}"/>
<input type="hidden" id="lang-mail_compose-underline" value="{lang::mail_compose::underline}"/>
<input type="hidden" id="lang-mail_compose-hyperlink" value="{lang::mail_compose::hyperlink}"/>
<input type="hidden" id="lang-mail_compose-image" value="{lang::mail_compose::image}"/>
<input type="hidden" id="lang-mail_compose-htmlsource" value="{lang::mail_compose::htmlsource}"/>
<input type="hidden" id="lang-mail_compose-image" value="{lang::mail_compose::image}"/>

<input type="hidden" id="lang-mail_compose-image_location" value="{lang::mail_compose::image_location}"/>
<input type="hidden" id="lang-mail_compose-image_alt" value="{lang::mail_compose::image_alt}"/>

<input type="hidden" id="lang-mail_compose-select_text" value="{lang::mail_compose::select_text}"/>
<input type="hidden" id="lang-mail_compose-enter_url" value="{lang::mail_compose::enter_url}"/>

<input type="hidden" id="settings-font_family" value="{optional font_family}{font_family}{/optional}"/>
<input type="hidden" id="settings-font_size" value="{optional font_size}{font_size}{/optional}"/>
<input type="hidden" id="settings-text_direction" value="{text_direction 'ltr'}"/>

{dynamic fonts}
<input type="hidden" class="fonts" value="{.*::name}|{.*::family}"/>
{/dynamic}

<textarea id="{id}_html" class="hidden">{html ''}</textarea>
<textarea class="wysiwygEditor" name="{name}" data-result-name="{name}" data-format="{format}"{optional tabindex} tabindex="{tabindex}"{/optional} id="{id}" dir="{text_direction 'ltr'}">{text ''}</textarea>