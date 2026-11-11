var D2R = 0.01745329251994329577;

export function d2r(input) {
  return input * D2R;
}

export function isEquidistantCylindrical(projName) {
  return /^(equirectangular|equidistant[ _]cylindrical)/i.test(projName || '');
}

export function applyProjectionDefaults(wkt) {
  // Normalize projName for WKT2 compatibility
  const normalizedProjName = (wkt.projName || '').toLowerCase().replace(/_/g, ' ');

  if (wkt.long0 === undefined && wkt.longc !== undefined) {
    wkt.long0 = wkt.longc; // keep in the projection's native prime meridian frame
  }
  if (!wkt.lat_ts && wkt.lat1 && (normalizedProjName === 'stereographic south pole' || normalizedProjName === 'polar stereographic (variant b)')) {
    wkt.lat0 = d2r(wkt.lat1 > 0 ? 90 : -90);
    wkt.lat_ts = wkt.lat1;
    delete wkt.lat1;
  } else if (!wkt.lat_ts && wkt.lat0 && (normalizedProjName === 'polar stereographic' || normalizedProjName === 'polar stereographic (variant a)')) {
    wkt.lat_ts = wkt.lat0;
    wkt.lat0 = d2r(wkt.lat0 > 0 ? 90 : -90);
    delete wkt.lat1;
  } else if (isEquidistantCylindrical(wkt.projName)) {
    if (wkt.lat_ts === undefined && wkt.lat1 !== undefined) {
      wkt.lat_ts = wkt.lat1;
      delete wkt.lat1;
    }
    if (wkt.lat0 === undefined) {
      wkt.lat0 = 0;
    }
  }
}