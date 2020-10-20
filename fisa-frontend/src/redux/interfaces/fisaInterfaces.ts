import { FisaAttributeValueType, ValueType } from './valueTypes';

/**
 * The interface for a fisa Project
 */

export interface FisaProjectI {
  name: string;
  fisaDocument: FisaDocumentI;
  generateExampleData: boolean;
  fisaObjects: BackendFisaObjectI[];
  removedFisaObjects: BackendFisaObjectI[];
  connectedFrostServer: string | undefined;
}

export interface FisaObjectI {
  frostId: number | undefined;
  id: number;
  parent: number | undefined;
  definitionName: string;
  positionAttributes: [string, string] | undefined;
  attributes: AttributeI[];
  children: ObjectChildI[];
  isNotReusable: boolean | undefined;
}

export interface BackendFisaObjectI {
  frostId: number | undefined;
  id: number;
  definitionName: string;
  children: number[];
  attributes: BackendAttributeI[];
}

export interface AttributeI {
  definitionName: string;
  ogcType: string;
  infoText: string | undefined;
  valueType: FisaAttributeValueType;
  value: ValueType;
  isPredefined: boolean | undefined;
  dropDownValues: string[] | undefined;
  validationRule: string | undefined;
  isName: boolean;
}

export interface BackendAttributeI {
  definitionName: string;
  value: ValueType;
}

export interface ObjectChildI {
  id: number;
  isLinked: boolean;
}

/**
 * The interface for a fisa document
 */

export interface FisaDocumentI {
  name: string;
  objectDefinitions: FisaObjectDefinitionI[];
  fisaTemplate: BackendFisaObjectI[];
}

export interface FisaObjectDefinitionI {
  name: string;
  caption: string | undefined;
  infoText: string | undefined;
  isTopLayer: boolean | undefined;
  mapsTo: string;
  positionAttributes: [string, string] | undefined;
  exampleData: ExampleDataI | undefined;
  attributes: AttributesDefinitionI[];
  children: ChildDefinitionI[];
  isNotReusable: boolean | undefined;
}

export interface AttributesDefinitionI {
  name: string;
  infoText: string | undefined;
  valueType: FisaAttributeValueType;
  value: ValueType | undefined;
  isPredefined: boolean | undefined;
  dropDownValues: string[] | undefined;
  mapsTo: string;
  validationRule: string | undefined;
}

export interface ChildDefinitionI {
  objectName: string;
  quantity: number;
}

export interface ExampleDataI {
  count: number;
  valueMax: number;
  valueMin: number;
  timeMin: string;
  timeMax: string;
}
