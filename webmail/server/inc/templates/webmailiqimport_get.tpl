<query xmlns="{xmlNameSpace}"><import>{optional status}<status><completed>{completed}</completed><processed>{processed}</processed><total>{total}</total></status>{/optional}{optional lines}{dynamic lines}<row uid="{*::id}">{dynamic *::col}<col uid="{*::id}">{*::value}</col>{/dynamic}</row>{/dynamic}{/optional}</import></query>