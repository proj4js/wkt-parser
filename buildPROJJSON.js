import PROJJSONBuilder from './PROJJSONBuilder.js';

/**
 * Builds a PROJJSON object from a WKT array structure.
 * @param {Array} root The root WKT array node.
 * @returns {Object} The PROJJSON object.
 */
export function buildPROJJSON(root) {
  return PROJJSONBuilder.convert(root);
}
