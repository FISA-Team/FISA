import * as actionTypes from '../actionTypes';
import {
  AttributesDefinitionI,
  FisaObjectDefinitionI,
  ActionI,
  AttributeI,
  FisaObjectI,
  ValueType,
  BackendFisaObjectI,
  ObjectReducerI,
} from '../interfaces';
import { NUMBER, BOOLEAN, POLY_POSITION } from '../../variables/valueTypes';
import { createOgcType } from '../../variables/manipulators';

const defaultState: () => ObjectReducerI = () => ({
  active: [],
  removed: []
});

export default function objectReducer(
  state: ObjectReducerI = defaultState(),
  action: ActionI
): ObjectReducerI {
  switch (action.type) {
    /**
     * create the FisaObjectI list from fetched sources
     */
    case actionTypes.LOAD_SAVED_PROJECT:
    case actionTypes.LOAD_PROJECT_FROM_FISA:
      return {
        removed: state.removed,
        active: createProject(
          action.payload.definitions,
          action.payload.objects,
          action.payload.baseDefinition
        )
      };
    /**
     * add new Object by given 'template' with id 'newId' and link to the parent
     */
    case actionTypes.NEW_OBJECT_FROM_OBJECT_DEFINITION:
      return {
        removed: state.removed,
        active: insertObject(
          state.active,
          {
            frostId: undefined,
            id: action.payload.newId,
            parent: action.payload.objectToAddTo,
            definitionName: action.payload.objectDefinition.name,
            attributes: createAttributeList(
              action.payload.objectDefinition.attributes
            ),
            children: [],
            isNotReusable: !!action.payload.objectDefinition.isNotReusable,
            positionAttributes:
              action.payload.objectDefinition.positionAttributes,
          },
          action.payload.objectToAddTo
        )
      };
    /**
     * Change the value under 'key' to 'value' from Object with 'objectId'
     */
    case actionTypes.CHANGE_OBJECT_VALUE:
      return {
        removed: state.removed,
        active: state.active.map((object) => {
          if (object.id === action.payload.objectId) {
            return {
              ...object,
              attributes: object.attributes.map((attribute) => {
                if (attribute.definitionName === action.payload.key) {
                  return {
                    ...attribute,
                    value: action.payload.value,
                  };
                }
                return attribute;
              }),
            };
          }
          return object;
        })
      };
    /**
     * Removes the given Object and its children.
     */
    case actionTypes.REMOVE_OBJECT:
      return removeObject(
        state,
        action.payload.objectId,
        action.payload.removeFrom
      );
    /**
     * Clone the object and all its children
     */
    case actionTypes.ADD_OBJECT_FROM_EXISTING:
      // eslint-disable-next-line no-case-declarations
      const oldObject = state.active.find(
        (object) => object.id === action.payload.toCloneFrom
      );
      if (!oldObject) {
        return state;
      }

      // eslint-disable-next-line no-case-declarations
      const newObject: FisaObjectI = {
        ...oldObject,
        frostId: undefined,
        id: action.payload.newId,
        parent: action.payload.parent,
        children: [],
      };
      return {
        removed: state.removed,
        active: insertObject(state.active, newObject, action.payload.parent)
      };
    /**
     * Link the given object 'objectId' to the object 'linkTo'
     */
    case actionTypes.LINK_OBJECT:
      return {
        removed: state.removed,
        active: state.active.map((object) => {
          if (object.id === action.payload.linkTo) {
            return {
              ...object,
              children: [
                ...object.children,
                { id: action.payload.objectId, isLinked: true },
              ],
            };
          }
          return object;
        })
      };

    case actionTypes.SET_FROST_IDS_OF_OBJECTS:
      return {
        removed: state.removed,
        active: setFrostIds(state.active, action.payload.fisaObjects)
      };

    case actionTypes.CHANGE_PROJECT_NAME:
      return {
        removed: state.removed,
        active: state.active.map((object) => {
          if (object.definitionName === action.payload.oldName) {
            return {
              ...object,
              definitionName: action.payload.newName,
            };
          }
          return object;
        })
      };

    case actionTypes.CLEAR_REMOVED_OBJECTS:
      return {
        active: state.active,
        removed: []
      };
    default:
      return state;
  }
}

/**
 * Inserts the given object to the objectList
 *
 * @param objectList - the list of fisaObject to add newObject to
 * @param newObject - the object to add
 * @param toAddToId - the parent of newObject
 */
function insertObject(
  objectList: FisaObjectI[],
  newObject: FisaObjectI,
  toAddToId: number
) {
  return [
    ...objectList.map((object) => {
      if (object.id === toAddToId) {
        return {
          ...object,
          children: [...object.children, { id: newObject.id, isLinked: false }],
        };
      }
      return object;
    }),
    newObject,
  ];
}

/**
 * Assign the Frost-Ids to the Obect-list
 * @param objectList - the list of Fisa-Objects
 * @param responseData - the response data after uploading
 */
function setFrostIds(
  objectList: FisaObjectI[],
  responseData: BackendFisaObjectI[]
): FisaObjectI[] {
  return objectList.map((object) => ({
    ...object,
    frostId: responseData.find((respObject) => respObject.id === object.id)
      ?.frostId,
  }));
}

/**
 * Deletes the given Object toDelete from removeFrom
 *
 * @param objectList the list of objects to remove toDelete
 * @param toDelete - the objectId of the object to delete
 * @param removeFrom - the parent object of toDelete
 */
function removeObject(
  state: ObjectReducerI,
  toDelete: number,
  removeFrom: number
): ObjectReducerI {
  const otherWithChild = state.active.find(
    (object) =>
      object.id !== removeFrom &&
      object.id !== toDelete &&
      object.children.find((child) => child.id === toDelete)
  );

  if (otherWithChild) {
    return {
      removed: state.removed,
      active: removeLinkedObject(state.active, toDelete, removeFrom, otherWithChild)
    };
  }

  const { removed } = state;
  const objectToRemove = state.active.find(object => object.id === toDelete);

  if (objectToRemove?.frostId) {
    removed.push(objectToRemove);
  }

  return {
    removed,
    active: state.active
      .filter((object) => object.id !== toDelete)
      .map((object) => {
        if (object.id === removeFrom) {
          return {
            ...object,
            children: object.children.filter((child) => child.id !== toDelete),
          };
        }
        return object;
      })
  };
}

/**
 * Removes the given object toDelete from removeFrom
 *
 * @param objectList - the list of objects to work on
 * @param toDelete - the id of the linked object to delete
 * @param removeFrom - the id of the object from where toDelete is deleted
 * @param otherWithChild - an fisaObject with other Objects witch hav toDelete as children
 */
function removeLinkedObject(
  objectList: FisaObjectI[],
  toDelete: number,
  removeFrom: number,
  otherWithChild: FisaObjectI
): FisaObjectI[] {
  const toRemoveFrom = objectList.find((object) => object.id === removeFrom);
  if (!toRemoveFrom) {
    return objectList;
  }

  const childFromToRemove = toRemoveFrom.children.find(
    (child) => child.id === toDelete
  );
  // Check whether the child is linked
  if (childFromToRemove && !childFromToRemove.isLinked) {
    return objectList.map((object) => {
      // if it find the other where toDelete ist linked, set to not linked
      if (object.id === otherWithChild.id) {
        return {
          ...object,
          children: object.children.map((child) =>
            child.id === toDelete ? { ...child, isLinked: false } : child
          ),
        };
      }
      // if it finds the object where toRemoved is removed from, remove it from children
      if (object.id === removeFrom) {
        return {
          ...object,
          children: object.children.filter((child) => child.id !== toDelete),
        };
      }
      // if it finds the object to delete, set the parent to otherWithChild.id
      if (object.id === toDelete) {
        return {
          ...object,
          parent: otherWithChild.id,
        };
      }
      return object;
    });
  }
  // if it is linked just remove the link
  return objectList.map((object) => {
    if (object.id === removeFrom) {
      return {
        ...object,
        children: object.children.filter((child) => child.id !== toDelete),
      };
    }
    return object;
  });
}

/**
 * creates the Project with the help of a fisa document
 *
 * @param fisaDoc - The fisa document to extract the project from
 * @param baseDefinition - a baseDefinition witch is used for the rootObject
 */
function createProject(
  fisaObjectDefinition: FisaObjectDefinitionI[],
  objects: BackendFisaObjectI[],
  baseDefinition: FisaObjectDefinitionI
): FisaObjectI[] {
  const baseObject: FisaObjectI = {
    frostId: undefined,
    id: 0,
    parent: undefined,
    definitionName: baseDefinition.name,
    attributes: [],
    children: [],
    isNotReusable: true,
    positionAttributes: undefined,
  };
  if (objects.length > 0) {
    return createBaseProjectList(fisaObjectDefinition, objects, baseObject);
  }
  return [baseObject];
}

/**
 * Extracts the objects from fisaDoc witch are at the top
 *
 * @param fisaObjectDefinition - The fisaObjectDefinitions of the document
 * @param objects - The Objects from thr Template in the FisaDoc
 * @param baseObject - The base Object
 */
function createBaseProjectList(
  fisaObjectDefinition: FisaObjectDefinitionI[],
  objects: BackendFisaObjectI[],
  baseObject: FisaObjectI
): FisaObjectI[] {
  const idsOfAddetChildren: number[] = [];

  const fisaObjects: FisaObjectI[] = objects.map((object) => {
    const definitionOfObject:
    | FisaObjectDefinitionI
    | undefined = fisaObjectDefinition.find(
      (definition) => definition.name === object.definitionName
    );

    // is not possible
    if (!definitionOfObject) {
      throw new Error(
        `There is no definition for the Object ${object.definitionName}`
      );
    }

    // if it is at the top-layer, add to baseObject
    if (definitionOfObject.isTopLayer) {
      baseObject.children.push({ id: object.id, isLinked: false });
      return {
        frostId: object.frostId,
        id: object.id,
        definitionName: object.definitionName,
        children: [
          ...object.children.map((child) => {
            if (idsOfAddetChildren.includes(child)) {
              return { id: child, isLinked: true };
            }
            idsOfAddetChildren.push(child);
            return { id: child, isLinked: false };
          }),
        ],
        attributes: createAttributeListFromDocumentObject(
          object,
          definitionOfObject
        ),
        parent: baseObject.id,
        isNotReusable: definitionOfObject.isNotReusable,
        positionAttributes: definitionOfObject.positionAttributes,
      };
    }

    return {
      frostId: object.frostId,
      id: object.id,
      definitionName: object.definitionName,
      children: [
        ...object.children.map((child) => {
          if (idsOfAddetChildren.includes(child)) {
            return { id: child, isLinked: true };
          }
          idsOfAddetChildren.push(child);
          return { id: child, isLinked: false };
        }),
      ],
      attributes: createAttributeListFromDocumentObject(
        object,
        definitionOfObject
      ),
      parent: findParentId(objects, object),
      isNotReusable: definitionOfObject.isNotReusable,
      positionAttributes: definitionOfObject.positionAttributes,
    };
  });

  return [baseObject, ...fisaObjects];
}

/**
 * returns the parent-id of child with the help of the FisaObjectI list project
 *
 * @param objectsFromFisaDoc
 * @param child
 */
function findParentId(
  objectsFromFisaDoc: BackendFisaObjectI[],
  child: BackendFisaObjectI
): number {
  const parent = findParent(objectsFromFisaDoc, child);
  if (parent) {
    return parent.id;
  }
  return 0;
}

/**
 * finds and returns the parent of the given child
 *
 * @param objectsFromFisaDoc - the list of FisaObjectI to find the parent
 * @param child - the fisaObject to find the parent
 */
function findParent(
  objectsFromFisaDoc: BackendFisaObjectI[],
  child: BackendFisaObjectI
): BackendFisaObjectI | undefined {
  return objectsFromFisaDoc.find((object) => {
    if (object.children) {
      const findChild = object.children.find(
        (children) => children === child.id
      );

      if (findChild !== undefined) {
        return true;
      }
    }
    return false;
  });
}

/**
 * Creates a list of attributes for the given fisaObject with the help of the objectDefinition of this object
 *
 * @param fisaObject - The object witch attributes needs to be created
 * @param fisaObjectDefinition - the objectDefinition of this attribute
 */
function createAttributeListFromDocumentObject(
  fisaObject: BackendFisaObjectI,
  fisaObjectDefinition: FisaObjectDefinitionI
): AttributeI[] {
  const attributes = fisaObjectDefinition.attributes
    .filter((attribute) => !attribute.isPredefined)
    .map((attribute) => {
      const foundAttribute = fisaObject.attributes.find(
        (tempAttribute) => tempAttribute.definitionName === attribute.name
      );
      if (!foundAttribute) {
        return createAttribute(
          attribute,
          getAttributeValue(attribute.value, attribute.valueType)
        );
      }
      let { value } = foundAttribute;
      if (attribute.valueType === POLY_POSITION) {
        value = JSON.parse(value as string);
      }
      return createAttribute(attribute, value);
    });
  return attributes;
}
/*


/**
 * Creates a list of attributes for the given fisaObject with the help of the objectDefinition of this object
 *
 * @param attributeDefinitions - The AttributeDefinitions to convert to a list
 */
function createAttributeList(
  attributeDefinitions: AttributesDefinitionI[]
): AttributeI[] {
  return attributeDefinitions
    .filter((attribute) => !attribute.isPredefined)
    .map((attribute) =>
      createAttribute(
        attribute,
        getAttributeValue(attribute.value, attribute.valueType)
      )
    );
}

function getAttributeValue(
  value: ValueType | undefined,
  valueType: string
): ValueType {
  if (value) {
    return value;
  }

  switch (valueType) {
    case NUMBER:
      return 0;
    case BOOLEAN:
      return false;
    case POLY_POSITION:
      return [];
    default:
      return '';
  }
}

/**
 * Creates one attribute out of a AttributeDefinition and set the value
 *
 * @param definition
 * @param value
 */
function createAttribute(
  definition: AttributesDefinitionI,
  value: ValueType
): AttributeI {
  return {
    dropDownValues: definition.dropDownValues,
    ogcType: createOgcType(definition.mapsTo),
    infoText: definition.infoText,
    isPredefined: definition.isPredefined,
    validationRule: definition.validationRule,
    valueType: definition.valueType,
    definitionName: definition.name,
    value,
    isName: definition.mapsTo.endsWith('name'),
  };
}
