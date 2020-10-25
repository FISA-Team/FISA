import {
  AttributeI,
  BackendAttributeI,
  BackendFisaObjectI,
  FisaObjectI,
  FisaProjectI,
  FisaDocumentI,
  FisaObjectDefinitionI,
  AttributesDefinitionI,
  FrontendReduxStateI,
} from '../interfaces';
import { ERROR_MAPS_TO } from '../../variables/variables';
import { POLY_POSITION } from '../../variables/valueTypes';

/**
 * Gets a FisaProjectI in Backend-Format to be uploaded to the Backend
 *
 * @param state
 */
export const getFisaProjectFromState = (
  state: FrontendReduxStateI,
  withExampleData: boolean,
  ignoreFrostIds: boolean
): FisaProjectI => {
  const fisaObjects: BackendFisaObjectI[] = state.fisaProject.objects.active
    .filter((object) => object.id !== 0)
    .map((object) =>
      objectToBackendObject(
        object,
        getPredefinedAttributes(
          state.fisaProject.constantParts.objectDefinitions,
          object.definitionName
        ),
        ignoreFrostIds
      )
    );

  const removedFisaObjects: BackendFisaObjectI[] = state.fisaProject.objects.removed.map(
    object => objectToBackendObject(
      object,
      getPredefinedAttributes(
        state.fisaProject.constantParts.objectDefinitions,
        object.definitionName),
      ignoreFrostIds));

  const fisaObjectDefinition = state.fisaProject.constantParts.objectDefinitions
    .filter((definition) => definition.mapsTo !== ERROR_MAPS_TO)
    .map((definition) => ({
      ...definition,
      mapsTo: definition.mapsTo,
      attributes: definition.attributes,
    }));

  const fisaDocument: FisaDocumentI = {
    name: state.fisaProject.constantParts.fisaDocumentName,
    objectDefinitions: fisaObjectDefinition,
    fisaTemplate: [],
  };
  return {
    connectedFrostServer: state.fisaProject.connectedFrostServer,
    fisaDocument,
    name: state.fisaProject.constantParts.fisaProjectName,
    fisaObjects,
    removedFisaObjects: ignoreFrostIds ? [] : removedFisaObjects,
    generateExampleData: withExampleData,
  };
};

function getPredefinedAttributes(
  definitions: FisaObjectDefinitionI[],
  definitioName: string
): AttributesDefinitionI[] {
  const predefinedAttributes = definitions
    .find((def) => def.name === definitioName)
    ?.attributes.filter((attribute) => attribute.isPredefined);
  if (!predefinedAttributes) {
    return [];
  }
  return predefinedAttributes;
}

/**
 * Maps a frontend-object to backend-object
 *
 * @param object
 */
function objectToBackendObject(
  object: FisaObjectI,
  predefinedAttributes: AttributesDefinitionI[],
  ignoreFrostIds: boolean
): BackendFisaObjectI {
  return {
    frostId: ignoreFrostIds ? undefined : object.frostId,
    id: object.id,
    definitionName: object.definitionName,
    attributes: [
      ...object.attributes.map((attribute) =>
        attributeToBackendAttribute(attribute)
      ),
      ...predefinedAttributes.map((attribute) =>
        predefinedAttributeDefToBackendAttribute(attribute)
      ),
    ],
    children: object.children.map((child) => child.id),
  };
}

/**
 * Maps a frontend-attribute with additional properties to a simpler backend-attribute
 *
 * @param attribute
 */
function attributeToBackendAttribute(attribute: AttributeI): BackendAttributeI {
  if (attribute.valueType === POLY_POSITION) {
    return {
      definitionName: attribute.definitionName,
      value: JSON.stringify(attribute.value),
    };
  }
  return {
    definitionName: attribute.definitionName,
    value: attribute.value,
  };
}

/**
 * Maps a frontend-attribute with additional properties to a simpler backend-attribute
 *
 * @param attribute
 */
function predefinedAttributeDefToBackendAttribute(
  attribute: AttributesDefinitionI
): BackendAttributeI {
  return {
    definitionName: attribute.name,
    value: attribute.value || '',
  };
}
