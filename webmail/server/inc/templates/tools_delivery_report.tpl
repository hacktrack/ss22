<delivery_report><message>{dynamic messages}<item{optional *::uidset} uid="{*::uid}"{/optional}><report><time>{*::time}</time><sender>{*::sender}</sender><recipient>{*::recipient}</recipient><recipients>{dynamic *::recipients}<recipient><email>{*::email}</email><status>{*::status}</status><time>{*::time}</time>{optional *::error}<error>{*::error}</error>{/optional}</recipient>{/dynamic}</recipients></report></item>{/dynamic}</message></delivery_report>