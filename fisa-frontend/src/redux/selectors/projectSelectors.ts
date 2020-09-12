// a collection of functions to get specific information out of the Project Store

import {
  TreeViewInterfaceI,
  ProjectPositionI,
  ProjectTreeViewI,
  ObjectBundleI,
  ObjectsCategoryI,
  ObjectWithNameI,
  CardPositionI,
  FisaObjectDefinitionI,
  ChildDefinitionI,
  FrontendReduxStateI,
  AttributeI,
  FisaObjectI,
  PointI,
  PolygonI,
} from '../interfaces';
import { createOgcType } from '../../variables/manipulators';
import { POLY_POSITION } from '../../variables/valueTypes';

/**
 * Gets the objects that is current the main object
 *
 * @param state
 *
 * @returns The active FisaObjectI
 */
function getActiveObjectFromState(
  state: FrontendReduxStateI
): FisaObjectI | undefined {
  return state.fisaProject.objects.find(
    (object) => object.id === state.fisaProject.activeObject
  );
}

/**
 * Creates a name of a object
 *
 * @param object the object to create a name from
 *
 * @returns the nameAttribute (if the object has one), if not the definitionName or <<undefined>>
 */
function getNameOfObject(object: FisaObjectI | undefined): string {
  if (!object) {
    throw Error('Object is not defined');
  }

  const name = object.attributes.find((attribute) => attribute.isName);
  if (name && name.value !== '') {
    return name.value.toString();
  }
  return object.definitionName;
}

/**
 * @param object the fisaObject to check if it has children
 * @param objectDefinitions - the list of fisaObjectDefinition to check
 */
function hasChildren(
  object: FisaObjectI,
  objectDefinitions: FisaObjectDefinitionI[]
): boolean {
  const tempOfObject = objectDefinitions.find(
    (definition) => definition.name === object.definitionName
  );

  if (!tempOfObject) {
    return false;
  }

  return tempOfObject.children.length > 0;
}

/**
 * Creates a tree from a object and parts of the state
 *
 * @param objects
 * @param object
 * @param isLinked
 * @param allNodes
 * @param activeObjectId
 * @param parentId
 */
function getAsTree(
  objects: FisaObjectI[],
  object: FisaObjectI | undefined,
  isLinked: boolean,
  allNodes: string[],
  activeObjectId: number | undefined,
  parentId: number | undefined
): TreeViewInterfaceI | undefined {
  if (!object) {
    return undefined;
  }

  const nodeId = `NodeId${object.id}`;

  const newObject = {
    id: object.id,
    parentId,
    nodeId,
    name: getNameOfObject(object),
    children: undefined,
    isLinked,
  };

  if (!isLinked) {
    allNodes.push(nodeId);
  }

  if (!isLinked && object.children?.length > 0) {
    return {
      ...newObject,
      children: object.children
        .map((childIdentifier) => ({
          object: objects.find(
            (nextObject) => nextObject.id === childIdentifier.id
          ),
          isLinked: childIdentifier.isLinked,
        }))
        .map((childObject) =>
          getAsTree(
            objects,
            childObject.object,
            childObject.isLinked,
            allNodes,
            activeObjectId,
            object.id
          )
        )
        .filter((child) => child !== undefined)
        .sort((a, b) =>
          a !== undefined && b !== undefined && a?.name < b?.name ? -1 : 1
        ),
    };
  }

  return newObject;
}

/**
 * @param state The redux FrontendReduxStateI of the program
 * @returns a list of ObjectBundleI witch represents the categoricalOverview
 */
export const getAllActiveObjectBundles = (
  state: FrontendReduxStateI
): ObjectBundleI[] => {
  const activeObject = getActiveObjectFromState(state);
  const childsOfActiveObjectDefinition = state.fisaProject.constantParts.objectDefinitions.find(
    (definition) => {
      if (!activeObject) {
        return false;
      }
      return definition.name === activeObject.definitionName;
    }
  )?.children;

  const objectsInCategories: ObjectBundleI[] = state.fisaProject.constantParts.objectDefinitions
    .filter(
      (definition) =>
        definition.name !== state.fisaProject.constantParts.fisaProjectName
    )
    .map((definition) =>
      createBundle(
        state,
        childsOfActiveObjectDefinition,
        definition,
        activeObject
      )
    )
    .filter(
      (objectBundle) =>
        objectBundle.definitionName !==
        state.fisaProject.constantParts.fisaDocumentName
    )
    .sort((a, b) => {
      if (a.definitionToAdd && b.definitionToAdd) {
        return a.definitionName > b.definitionName ? 1 : -1;
      }
      if (a.definitionToAdd && !b.definitionToAdd) {
        return -1;
      }
      if (!a.definitionToAdd && b.definitionToAdd) {
        return 1;
      }
      return a.definitionName > b.definitionName ? 1 : -1;
    });

  return objectsInCategories;
};

/**
 * Creates a Definition / Objects Bundle
 * @param state - The redux FrontendReduxStateI of the Project
 * @param childsOfActiveObjectDefinition - the children of the definition from activeObject
 * @param definition - the active Definition used to create the bundle
 * @param activeObject - the active Object
 */
function createBundle(
  state: FrontendReduxStateI,
  childsOfActiveObjectDefinition: ChildDefinitionI[] | undefined,
  definition: FisaObjectDefinitionI,
  activeObject: FisaObjectI | undefined
): ObjectBundleI {
  const childDefinition = childsOfActiveObjectDefinition?.find(
    (child) => child.objectName === definition.name
  );

  // The object witch are build with the given definition
  const objectsInObjectDefinition = state.fisaProject.objects
    .filter((object) => object.definitionName === definition.name)
    .map((object) => {
      const isNotInactiveChildren =
        getActiveObjectFromState(state)?.children.find(
          (child) => child.id === object.id
        ) === undefined;
      return {
        id: object.id,
        parentId: object.parent,
        name: getNameOfObject(object),
        isLinkable: isNotInactiveChildren && !object.isNotReusable,
      };
    });

  // the children of the object witch use the definition
  const objectChildsOfActiveObject = activeObject?.children.filter((child) => {
    const objectOfChild = state.fisaProject.objects.find(
      (cObject) => cObject.id === child.id
    );
    if (!objectOfChild) {
      return false;
    }
    return objectOfChild.definitionName === definition.name;
  });

  // whether or not the definition can be added
  const definitionToAdd =
    childDefinition !== undefined &&
    (childDefinition.quantity <= 0 ||
      (objectChildsOfActiveObject !== undefined &&
        objectChildsOfActiveObject.length < childDefinition.quantity));

  /* create the final object list witch contains the final isClonable and isLinkable
     and is sorted. */
  const finalObjectsList = objectsInObjectDefinition
    .map((object) => ({
      ...object,
      isLinkable: object.isLinkable && definitionToAdd,
      isClonable: definitionToAdd,
    }))
    .sort((a, b) => {
      if (a.isClonable && b.isClonable) {
        return a.name > b.name ? 1 : -1;
      }
      if (a.isClonable && !b.isClonable) {
        return 1;
      }
      if (!a.isClonable && b.isClonable) {
        return -1;
      }
      if (a.isLinkable && b.isLinkable) {
        return a.name > b.name ? 1 : -1;
      }
      if (a.isLinkable && !b.isLinkable) {
        return 1;
      }
      if (!a.isLinkable && b.isLinkable) {
        return -1;
      }
      return a.name > b.name ? 1 : -1;
    });

  return {
    definitionName: definition.name,
    caption: definition.caption || definition.name,
    definitionInfoText: definition.infoText,
    definitionToAdd,
    objects: finalObjectsList,
  };
}

/**
 * Creates a treeView of the Project and returns it.
 *
 * @param state The redux FrontendReduxStateI of the program.
 * @returns the projectTreeOverview.
 */
export const getProjectTree = (
  state: FrontendReduxStateI
): ProjectTreeViewI => {
  const nodeIdList: string[] = [];
  const activeObject = getActiveObjectFromState(state);

  const tree = getAsTree(
    state.fisaProject.objects,
    getObjectById(state, 0),
    false,
    nodeIdList,
    activeObject?.id,
    activeObject?.parent
  );

  if (tree) {
    return { tree, nodeIdList };
  }

  throw new Error('Cannot create tree :/');
};

/**
 * Creates a list of {name: string, id: number} witch represents the project position
 *
 * @param state The redux FrontendReduxStateI of the program.
 * @returns the Project position
 */
export const getProjectPosition = (
  state: FrontendReduxStateI
): ProjectPositionI[] => {
  let objectInHistory = getActiveObjectFromState(state);

  if (!objectInHistory) {
    return [
      {
        name: state.fisaProject.constantParts.fisaDocumentName,
        id: 0,
      },
    ];
  }

  let objectList = [];
  objectList.push({
    name: getNameOfObject(objectInHistory),
    id: objectInHistory.id,
  });

  while (objectInHistory.parent || objectInHistory.parent === 0) {
    const objectParent: number = objectInHistory.parent;

    objectInHistory = getObjectById(state, objectParent);

    if (!objectInHistory) {
      break;
    }

    objectList = [
      {
        name: getNameOfObject(objectInHistory),
        id: objectInHistory.id,
      },
    ].concat(objectList);
  }

  return objectList;
};

/**
 * @param state The redux FrontendReduxStateI of the program
 * @returns the name of the project
 */
export const getProjectName = (state: FrontendReduxStateI): string =>
  state.fisaProject.constantParts.fisaProjectName;

/**
 * @param state The redux FrontendReduxStateI of the program
 * @returns the UUId of the chosen FosaDocument
 */
export const getChosenDocumentUuid = (
  state: FrontendReduxStateI
): string | undefined =>
  state.availableFisaDocumentsProjects.chosenDocumentUuid;

/**
 * @param state The redux FrontendReduxStateI of the program
 * @returns a List of ObjectCategories, witch consists of the categoryName and a list of fisaObjects
 */
export const getObjectsInActiveWithCategories = (
  state: FrontendReduxStateI
): ObjectsCategoryI[] => {
  const activeObject = getActiveObjectFromState(state);

  // The definitions of the objects from the childs of activeObject
  const objectDefinitions = state.fisaProject.constantParts.objectDefinitions
    .find((definition) => definition.name === activeObject?.definitionName)
    ?.children.map((definitionChild) => {
      const findObjectDefinition = state.fisaProject.constantParts.objectDefinitions.find(
        (definition) => definition.name === definitionChild.objectName
      );
      if (!findObjectDefinition) {
        return undefined;
      }
      return {
        ...findObjectDefinition,
        quantity: definitionChild.quantity,
      };
    });

  if (!objectDefinitions || !activeObject) {
    return [
      {
        definitionName: '',
        ogcType: '',
        caption: 'cantFindActiveObjectDefinition',
        objects: [],
        isAddable: false,
      },
    ];
  }

  // Sorts the children in category's
  const objectsInCategories: ObjectsCategoryI[] = objectDefinitions
    .map((definition) => {
      const objectsOfCategory = activeObject.children
        .map((child) => {
          const objectOfChild = state.fisaProject.objects.find(
            (object) => object.id === child.id
          );
          if (
            !objectOfChild ||
            objectOfChild.definitionName !== definition?.name
          ) {
            return undefined;
          }
          return {
            ...objectOfChild,
            nameToShow: getNameOfObject(objectOfChild),
            selectable: hasChildren(
              objectOfChild,
              state.fisaProject.constantParts.objectDefinitions
            ),
            isLinked: child.isLinked,
          };
        })
        .filter((x): x is ObjectWithNameI => x !== undefined);

      return {
        definitionName: definition ? definition.name : '<undefined>',
        ogcType: definition ? createOgcType(definition.mapsTo) : '',
        caption: definition
          ? definition.caption || definition.name
          : '<undefined>',
        isAddable: definition
          ? definition.quantity <= 0 ||
            objectsOfCategory.length < definition.quantity
          : false,
        objects: objectsOfCategory,
      };
    })
    .sort((a, b) => (a.definitionName < b.definitionName ? -1 : 1));

  return objectsInCategories;
};

/**
 * @param state The redux FrontendReduxStateI of the program
 * @param objectId the id of the object to get the position
 * @returns the coordinates of the positionAttributes ore [0, 0]
 */
export const getPositionAttributesOfObject = (
  state: FrontendReduxStateI,
  objectId: number
): PointI => {
  const objectOfId = state.fisaProject.objects.find(
    (object) => object.id === objectId
  );

  return getPosition(objectOfId);
};

/**
 *
 * @param state The redux FrontendReduxStateI of the program
 * @param objectId the id of the object witch contains the attribute
 * @param attributeDefinitionName the definitionName og the attribute
 */
export const getAttribute = (
  state: FrontendReduxStateI,
  objectId: number,
  attributeDefinitionName: string
): AttributeI => {
  const objectOfAttribute = getObjectById(state, objectId);

  const attribute = objectOfAttribute?.attributes.find(
    (attr) => attr.definitionName === attributeDefinitionName
  );

  if (attribute) {
    return attribute;
  }

  throw new Error("Can't find attribute");
};

export const getAllCardPositions = (
  state: FrontendReduxStateI
): CardPositionI[] => {
  const objectsWithCard = state.fisaProject.objects.filter(
    (object) => object.positionAttributes
  );
  const cardPositions: CardPositionI[] = objectsWithCard.map((object) => ({
    objectId: object.id,
    name: getNameOfObject(object),
    position: getPosition(object),
    isPolygon: false,
  }));

  state.fisaProject.objects.forEach((object) =>
    object.attributes.forEach((attribute) => {
      if (attribute.valueType === POLY_POSITION) {
        const value = attribute.value as PolygonI;

        if (value && value.length > 0) {
          cardPositions.push({
            objectId: object.id,
            name: getNameOfObject(object),
            position: value,
            isPolygon: true,
          });
        }
      }
    })
  );
  return cardPositions;
};

function getPosition(object: FisaObjectI | undefined): PointI {
  const position = object?.positionAttributes;

  if (object && position) {
    const lat = object.attributes.find(
      (attribute) => attribute.definitionName === position[0]
    );
    const lng = object.attributes.find(
      (attribute) => attribute.definitionName === position[1]
    );

    if (lat !== undefined && lat.value && lng !== undefined && lng.value) {
      return [lat.value as number, lng.value as number];
    }
  }
  return [0, 0];
}

export const getExistsProjectInState = (state: FrontendReduxStateI) =>
  state.fisaProject.constantParts.objectDefinitions.length > 0;

/**
 * Gets a Object from the state by it's id
 *
 * @param state
 * @param objectId
 */
function getObjectById(
  state: FrontendReduxStateI,
  objectId: number
): FisaObjectI | undefined {
  return state.fisaProject.objects.find((object) => object.id === objectId);
}

/**
 * Gets a list of available projects on the backend
 * @param state
 */
export const getAvailableProjects = (state: FrontendReduxStateI) =>
  state.availableFisaDocumentsProjects.projects;

/**
 * gets a list of available fisaDocuments on the Backend
 * @param state
 */
export const getAvailableFisaDocuments = (state: FrontendReduxStateI) =>
  state.availableFisaDocumentsProjects.documents;

export const getExtractCSVErrorMessage = (state: FrontendReduxStateI) =>
  state.fisaProject.csvExtractionError;
