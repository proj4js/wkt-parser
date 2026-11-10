import PROJJSONBuilder from './PROJJSONBuilder.js';

// WKT2 keywords are case insensitive (ISO 19162, 6.5)
function upperCaseKeywords(node) {
  node[0] = node[0].toUpperCase();
  for (var i = 1; i < node.length; i++) {
    if (Array.isArray(node[i])) {
      upperCaseKeywords(node[i]);
    }
  }
}

// The alternative WKT2 keywords and their preferred form (ISO 19162:2015 and 2019)
var preferredKeywords = {
  GEODETICCRS: 'GEODCRS',
  GEOGRAPHICCRS: 'GEOGCRS',
  PROJECTEDCRS: 'PROJCRS',
  GEODETICDATUM: 'DATUM',
  TRF: 'DATUM',
  SPHEROID: 'ELLIPSOID',
  PRIMEMERIDIAN: 'PRIMEM',
  PROJECTION: 'METHOD',
  VERTICALCRS: 'VERTCRS',
  VERTICALDATUM: 'VDATUM',
  VRF: 'VDATUM',
  ENGINEERINGCRS: 'ENGCRS',
  ENGINEERINGDATUM: 'EDATUM',
  PARAMETRICDATUM: 'PDATUM',
  TIMEDATUM: 'TDATUM',
  TEMPORALQUANTITY: 'TIMEUNIT'
};

function usePreferredKeywords(node) {
  node[0] = preferredKeywords[node[0]] || node[0];
  for (var i = 1; i < node.length; i++) {
    if (Array.isArray(node[i])) {
      usePreferredKeywords(node[i]);
    }
  }
}

/**
 * Builds a PROJJSON object from a WKT2 array structure.
 * Keywords are normalized to their upper case, preferred form first.
 * @param {Array} root The root WKT array node. Modified in place.
 * @returns {Object} The PROJJSON object.
 */
export function buildPROJJSON(root) {
  upperCaseKeywords(root);
  usePreferredKeywords(root);
  return PROJJSONBuilder.convert(root);
}
