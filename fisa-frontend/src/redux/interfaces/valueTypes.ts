import {
  BOOLEAN,
  DROPDOWN,
  NUMBER,
  STRING,
  EXAMPLE_DROPDOWN,
  POLY_POSITION,
} from '../../variables/valueTypes';

/**
 * The value-type of a FisaAttribute
 */
export type ValueType = boolean | number | string | PolygonI;

export type PolygonI = PointI[];
export type PointI = [number, number];

/**
 * The description of the value-type of the FisaAttribute
 */
export type FisaAttributeValueType =
  | typeof STRING
  | typeof NUMBER
  | typeof BOOLEAN
  | typeof DROPDOWN
  | typeof EXAMPLE_DROPDOWN
  | typeof POLY_POSITION;
