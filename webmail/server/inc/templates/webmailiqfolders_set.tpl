<query xmlns="{xmlNameSpace}"><account uid="{aid}"><folder uid="{fid}" rights="{rights}">{optional relative_path}<relative_path>{relative_path}</relative_path>{/optional}{optional owner}<owner>{owner}</owner>{/optional}{optional display}<name>{display}</name>{/optional}{optional teamchat_notify}<notify>{teamchat_notify}</notify>{/optional}{optional rss}<rss>true</rss>{/optional}{optional default}<default>{default_type}</default>{/optional}{optional public}<public>true</public>{/optional}{optional spam}<spam>true</spam>{/optional}{optional archive}<archive>true</archive>{/optional}{optional shared}<shared>true</shared>{/optional}{optional total}<total>{total}</total>{/optional}{optional recent}<recent>{recent}</recent>{/optional}{optional type}<type>{type}</type>{/optional}{optional subscription_type}<subscription_type>{subscription_type}</subscription_type>{/optional}{optional subscribed}<sync>1</sync>{/optional}{optional channel}<channel>{channel}</channel>{/optional}{optional folders}<virtual>{optional search}<search>{search}</search>{/optional}<folders>{dynamic folders}<folder{optional *::primary} primary="true"{/optional}{optional *::noexist} noexist="true"{/optional}>{*::name}</folder>{/dynamic}</folders></virtual>{/optional}</folder></account></query>