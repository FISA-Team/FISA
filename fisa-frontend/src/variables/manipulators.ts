/**
 * Creates an ogc-type out of an mapsTo (remove STA.)
 * @param mapsTo
 */
export function createOgcType(mapsTo: string) {
  return mapsTo.substring(4);
}
