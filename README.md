# wkt-parser

The wkt parser pulled out of proj4 so it can be hacked on. Supports WKT1, WKT2 and PROJJSON.

It does not support geocentric currently (`GEOCCS`). Compound CRS (`COMPD_CS`, `COMPOUNDCRS` and PROJJSON `CompoundCRS`) are supported through their horizontal CRS.
