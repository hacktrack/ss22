<tr><th><label for="{property::id}">{property::label}</label></th><td><select id="{property::id}" name="{property::name}"{optional property::css}class="{property::css}"{/optional}{optional property::events}{dynamic property::events} {*::name}="{*::value}"{/dynamic}{/optional} >{dynamic property::options}<option value="{*::value}"{optional *::selected} selected="selected"{/optional}>{*::label}</option>{/dynamic}</select></td></tr>