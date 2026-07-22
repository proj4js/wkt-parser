import PROJJSONBuilderBase from './PROJJSONBuilderBase.js';

class PROJJSONBuilder2015 extends PROJJSONBuilderBase {
  static convert(node, result = {}) {
    super.convert(node, result);

    // The base builder hard-codes an "ellipsoidal" coordinate system for GEODCRS/GEOGCRS
    // and never records the CS subtype. Read the actual `CS[...]` node and expose its
    // subtype (e.g. "Cartesian" for a geocentric GeodeticCRS) so that transformPROJJSON
    // classifies a USAGE-less WKT2 GEODCRS with CS[Cartesian] as geocentric rather than
    // geographic. Mirrors PROJJSONBuilder2019. See proj4js/proj4js#588.
    const csNode = node.find((child) => Array.isArray(child) && child[0] === 'CS');
    if (csNode && result.coordinate_system) {
      result.coordinate_system.subtype = csNode[1];
    }
    if (result.usage) {
      delete result.usage;
    }

    return result;
  }
}

export default PROJJSONBuilder2015;