import * as actionTypes from '../actionTypes';
import objectReducer from './objectReducer';
import {
  FisaDocumentI,
  FisaObjectDefinitionI,
  ActionI,
  ProjectStateI,
  FisaObjectI,
  ErrorMessageI,
  AttributesDefinitionI,
  FisaProjectI,
  ObjectReducerI,
} from '../interfaces';
import {
  CONSTANT_PARTS,
  FISA_OBJECTS,
  CONNECTED_FROST_URL,
  LATEST_ID,
  CSV_COL_SEPARATOR,
  CSV_ROW_SEPARATOR,
} from '../../variables/variables';
import { NUMBER, BOOLEAN } from '../../variables/valueTypes';
import { PROJECT_SAVED } from '../actionTypes';

const MAX_HISTORY_LENGTH = 20;

const defaultState: () => ProjectStateI = () => ({
  connectedFrostServer: undefined,
  csvExtractionError: undefined,
  activeObject: 0,
  latestId: 0,
  objects: {
    active: [],
    removed: []
  },
  constantParts: {
    objectDefinitions: [],
    fisaDocumentName: '',
    fisaProjectName: '',
  },
  undoHistory: [],
  redoHistory: [],
});

/**
 * a function witch calls realFisaProjectReducer and saves the project to the local storage if necessary
 *
 * @param state - the FrontendReduxStateI of the fisaProject
 * @param action - a action witch should be executed
 */
export default function fisaProjectReducer(
  state: ProjectStateI = defaultState(),
  action: ActionI
) {
  const newState = realFisaProjectReducer(state, action);
  if (
    action.type === actionTypes.LOAD_PROJECT_FROM_FISA ||
    action.type === actionTypes.LOAD_SAVED_PROJECT ||
    action.type === actionTypes.CHANGE_PROJECT_NAME
  ) {
    localStorage.setItem(
      CONSTANT_PARTS,
      JSON.stringify(newState.constantParts)
    );
    localStorage.removeItem(PROJECT_SAVED);
  }

  if (
    actionTypes.OBJECT_CHANGING_TYPES.includes(action.type) ||
    action.type === actionTypes.LOAD_PROJECT_FROM_FISA ||
    action.type === actionTypes.LOAD_SAVED_PROJECT
  ) {
    localStorage.setItem(FISA_OBJECTS, JSON.stringify(newState.objects));
    localStorage.setItem(LATEST_ID, JSON.stringify(newState.latestId));
    localStorage.setItem(
      CONNECTED_FROST_URL,
      JSON.stringify(newState.connectedFrostServer || '')
    );
  }
  return newState;
}

/**
 * the real fisaProjectReducer witch handles the actions
 * @param state - the FrontendReduxStateI of the fisaProject
 * @param action - a action witch should be executed
 */
function realFisaProjectReducer(
  state: ProjectStateI,
  action: ActionI
): ProjectStateI {
  /**
   * handles undo last change
   */
  if (action.type === actionTypes.UNDO) {
    const historyObject = state.undoHistory.pop();
    if (!historyObject) {
      return state;
    }
    state.redoHistory.push({
      activeObject: state.activeObject,
      objects: state.objects,
    });
    return {
      ...state,
      objects: historyObject.objects,
      activeObject: historyObject.activeObject,
    };
  }

  /**
   * handles redo last undo
   */
  if (action.type === actionTypes.REDO) {
    const historyObject = state.redoHistory.pop();
    if (!historyObject) {
      return state;
    }
    state.undoHistory.push({
      activeObject: state.activeObject,
      objects: state.objects,
    });
    return {
      ...state,
      objects: historyObject.objects,
      activeObject: historyObject.activeObject,
    };
  }

  /**
   * A state in witch the new current state is added to the undoHistory
   */
  const workingState = {
    ...state,
    undoHistory: [
      ...state.undoHistory,
      {
        activeObject: state.activeObject,
        objects: state.objects,
      },
    ],
    redoHistory: [],
  };

  /**
   * removes the oldest option inside the undoHistory if greater than MAX_HISTORY_LENGTH
   */
  if (workingState.undoHistory.length > MAX_HISTORY_LENGTH) {
    workingState.undoHistory.shift();
  }

  switch (action.type) {
    /**
     * sets the projectName to the name inside payload
     */
    case actionTypes.SET_FETCH_PROJECT_NAME:
      return {
        ...state,
        constantParts: {
          ...state.constantParts,
          fisaProjectName: action.payload.name,
        },
      };
    /**
     * loads the project from AutoSave
     */
    case actionTypes.LOAD_AUTO_SAVE:
      return extractProjectFromLocaleStorage();
    case actionTypes.LOAD_SAVED_PROJECT:
      return loadSavedProject(action.payload.project);
    /**
     * extracts the project from the fisaDoc onside the payload
     */
    case actionTypes.LOAD_PROJECT_FROM_FISA:
      return fetchSuccessAction(state, action.payload.document);
    /**
     * Adds a new Object with the help of a objectDefinition to the active object
     */
    case actionTypes.NEW_OBJECT_FROM_OBJECT_DEFINITION:
      return {
        ...workingState,
        latestId: workingState.latestId + 1,
        objects: objectReducer(workingState.objects, {
          ...action,
          payload: {
            objectDefinition: workingState.constantParts.objectDefinitions.find(
              (definition) => definition.name === action.payload.definitionName
            ),
            newId: workingState.latestId + 1,
            objectToAddTo: workingState.activeObject,
          },
        }),
      };
    /**
     * clones the object identified by objectId and adds it to the active object
     */
    case actionTypes.ADD_OBJECT_FROM_EXISTING:
      return deepClone(
        workingState,
        action.payload.objectId,
        workingState.activeObject
      );
    /**
     * sets the given Object as active
     */
    case actionTypes.GO_TO_OBJECT:
      if (action.payload.objectId === undefined) {
        return state;
      }
      if (cantHaveChildren(workingState, action.payload.objectId)) {
        if (
          state.activeObject ===
          getParentId(state.objects.active, action.payload.objectId)
        ) {
          return state;
        }
        return {
          ...workingState,
          activeObject: getParentId(
            workingState.objects.active,
            action.payload.objectId
          ),
        };
      }
      if (state.activeObject === action.payload.objectId) {
        return state;
      }
      return {
        ...workingState,
        activeObject: action.payload.objectId,
      };
    /**
     * Removes the given object
     */
    case actionTypes.REMOVE_OBJECT:
      return {
        ...workingState,
        objects: deleteObject(
          workingState.objects,
          action.payload.objectId,
          workingState.activeObject,
          workingState.objects.active
            .find((object) => object.id === workingState.activeObject)
            ?.children.find((child) => child.id === action.payload.objectId)
            ?.isLinked
        ),
      };

    case actionTypes.EXTRACT_FROM_CSV:
      return extractFromCSV(
        workingState,
        state,
        action.payload.csv,
        action.payload.definitionName
      );
    /**
     * links the given object to the active object
     */
    case actionTypes.LINK_OBJECT:
      if (
        isAlreadyLinked(
          workingState.objects.active.find(
            (object) => object.id === workingState.activeObject
          ),
          action.payload.objectId
        )
      ) {
        return state;
      }
      return {
        ...workingState,
        objects: objectReducer(workingState.objects, {
          ...action,
          payload: { ...action.payload, linkTo: workingState.activeObject },
        }),
      };

    /**
     * Change the Project Name
     */
    case actionTypes.CHANGE_PROJECT_NAME:
      return {
        ...workingState,
        constantParts: {
          ...workingState.constantParts,
          fisaProjectName: action.payload.newName,
          objectDefinitions: state.constantParts.objectDefinitions.map(
            (def) => {
              if (def.name === state.constantParts.fisaProjectName) {
                return {
                  ...def,
                  name: action.payload.newName,
                };
              }
              return def;
            }
          ),
        },
        objects: objectReducer(workingState.objects, {
          ...action,
          payload: {
            ...action.payload,
            oldName: state.constantParts.fisaProjectName,
          },
        }),
      };

    case actionTypes.SET_FROST_URL:
      return {
        ...state,
        connectedFrostServer: action.payload.frostUrl,
      };

    /**
    * Stuff just for the objectReducer
    */
    case actionTypes.CHANGE_OBJECT_VALUE:
    case actionTypes.SET_FROST_IDS_OF_OBJECTS:
      return {
        ...workingState,
        objects: objectReducer(workingState.objects, action),
      };

    case actionTypes.CLEAR_REMOVED_OBJECTS:
      return {
        ...workingState,
        undoHistory: [],
        redoHistory: [],
        objects: objectReducer(workingState.objects, action),
      };

    /**
    * returns the default state
    */
    case actionTypes.RESET_STATE:
      return defaultState();

    /**
     * if nothing matches return the old state (without updated history)
     */
    default:
      return state;
  }
}

/**
 * converts a BackendFisaDoc in a ProjectStateI
 *
 * @param fisaProject A fisaProject as BackendFisaDoc
 */
function loadSavedProject(fisaProject: FisaProjectI): ProjectStateI {
  const baseDefinition = getBaseObjectDefinition(
    fisaProject.name,
    fisaProject.fisaDocument.objectDefinitions
  );
  const objects = objectReducer(defaultState().objects, {
    type: actionTypes.LOAD_SAVED_PROJECT,
    payload: {
      definitions: fisaProject.fisaDocument.objectDefinitions,
      objects: fisaProject.fisaObjects,
      baseDefinition,
    },
  });

  return {
    ...defaultState(),
    connectedFrostServer: fisaProject.connectedFrostServer,
    latestId: getHighestId(objects.active),
    constantParts: {
      objectDefinitions: [
        baseDefinition,
        ...fisaProject.fisaDocument.objectDefinitions,
      ],
      fisaDocumentName: fisaProject.fisaDocument.name,
      fisaProjectName: fisaProject.name,
    },
    objects: { ...objects },
  };
}

/**
 * This function will create the basic FrontendReduxStateI after fetchSuccess
 *
 * @param state - the current fisaProject FrontendReduxStateI in the Store
 * @param fisaDocument - the fisa document witch get fetched
 */
function fetchSuccessAction(
  state: ProjectStateI,
  fisaDocument: FisaDocumentI
): ProjectStateI {
  const baseDefinition = getBaseObjectDefinition(
    state.constantParts.fisaProjectName,
    fisaDocument.objectDefinitions
  );

  const objects = objectReducer(defaultState().objects, {
    type: actionTypes.LOAD_PROJECT_FROM_FISA,
    payload: {
      definitions: fisaDocument.objectDefinitions,
      objects: fisaDocument.fisaTemplate,
      baseDefinition,
    },
  });
  return {
    ...state,
    latestId: getHighestId(objects.active),
    constantParts: {
      objectDefinitions: [baseDefinition, ...fisaDocument.objectDefinitions],
      fisaDocumentName: fisaDocument.name,
      fisaProjectName: state.constantParts.fisaProjectName,
    },
    objects,
  };
}

/**
 * Creates the base fisaObjectDefinition
 *
 * @param name - the name of the objectDefinition
 * @param objects -
 */
function getBaseObjectDefinition(
  name: string,
  objects: FisaObjectDefinitionI[]
) {
  const children = objects
    .filter((object) => object.isTopLayer)
    .map((object) => ({ objectName: object.name, quantity: 0 }));

  return {
    name,
    caption: undefined,
    attributes: [],
    children,
    infoText: undefined,
    isTopLayer: undefined,
    mapsTo: 'ErrorMapsTo',
    exampleData: undefined,
    isNotReusable: true,
    positionAttributes: undefined,
  };
}

/**
 * A function witch returns true if the object with the given objectId can has children
 *
 * @param state - the current state of the project
 * @param objectId - the id to check on
 */
function cantHaveChildren(state: ProjectStateI, objectId: number): boolean {
  const objectOfId = state.objects.active.find((object) => object.id === objectId);
  if (!objectOfId) {
    return true;
  }
  const definitionOfObject = state.constantParts.objectDefinitions.find(
    (definition) => definition.name === objectOfId.definitionName
  );

  return (
    !definitionOfObject ||
    !definitionOfObject.children ||
    definitionOfObject.children.length === 0
  );
}

/**
 * Returns the parent id of the object with the given objectId
 *
 * @param objects - a list of fisa objects
 * @param objectId - the id of the fisaObject to return the parent id
 */
function getParentId(objects: FisaObjectI[], objectId: number): number {
  const objectOfId: FisaObjectI | undefined = objects.find(
    (object) => object.id === objectId
  );
  if (!objectOfId || !objectOfId.parent) {
    return 0;
  }

  return objectOfId.parent;
}

/**
 * Returns the highest id in the objects list
 *
 * @param objects - a list oh FisaObjectI
 */
function getHighestId(objects: FisaObjectI[]): number {
  let findId = -1;
  objects.forEach((object) => {
    if (object.id >= findId) {
      findId = object.id;
    }
  });
  return findId;
}

/**
 * will deeply clone the object identified by idToClone and return a new state
 *
 * @param state - the current state of the project
 * @param idToClone - the id of the object to clone
 * @param newParentId - the id of the parentObject from the cloned object
 */
function deepClone(
  state: ProjectStateI,
  idToClone: number,
  newParentId: number
): ProjectStateI {
  const childsToClone = state.objects.active.find((object) => object.id === idToClone);
  if (!childsToClone) {
    return state;
  }

  const newId = state.latestId + 1;

  const objects = objectReducer(state.objects, {
    type: actionTypes.ADD_OBJECT_FROM_EXISTING,
    payload: {
      toCloneFrom: idToClone,
      parent: newParentId,
      newId,
    },
  });

  let newState = {
    ...state,
    latestId: state.latestId + 1,
    objects,
  };
  childsToClone.children.forEach((children) => {
    newState = deepClone(newState, children.id, newId);
  });

  return newState;
}

/**
 *
 * @param objects - the objectList to delete from
 * @param toDelete - the objectId of the object to delete
 * @param removeFrom - the objectId to delete the object from
 * @param isLinked - if the object is linked
 */
function deleteObject(
  objects: ObjectReducerI,
  toDelete: number,
  removeFrom: number,
  isLinked: boolean | undefined
): ObjectReducerI {
  const objectToDelete = objects.active.find((object) => object.id === toDelete);
  if (!objectToDelete) {
    return objects;
  }
  let newState: ObjectReducerI = { ...objects };

  // Remove children if it is not linked
  if (!isLinked) {
    objectToDelete.children.forEach((children) => {
      newState = deleteObject(
        newState,
        children.id,
        toDelete,
        children.isLinked
      );
    });
  }
  return objectReducer(newState, {
    type: actionTypes.REMOVE_OBJECT,
    payload: {
      objectId: toDelete,
      removeFrom,
    },
  });
}

/**
 * checks if the idToLink is already in the children of the object objectToCheck
 * @param objectToCheck - object to check if it contains idToLink
 * @param idToLink - the id of the object to check if it is inside children of objectToCheck
 */
function isAlreadyLinked(
  objectToCheck: FisaObjectI | undefined,
  idToLink: number
): boolean {
  return Boolean(
    !objectToCheck ||
    !objectToCheck.children ||
    objectToCheck.children.find((child) => child.id === idToLink)
  );
}

/**
 * Extracts the project from the localStorage
 */
function extractProjectFromLocaleStorage(): ProjectStateI {
  const constantParts = localStorage.getItem(CONSTANT_PARTS);
  const objects = localStorage.getItem(FISA_OBJECTS);
  const latestId = localStorage.getItem(LATEST_ID);
  const connectedFrostServer = localStorage.getItem(CONNECTED_FROST_URL);


  if (!constantParts || !objects || !latestId || !connectedFrostServer) {
    return defaultState();
  }
  return {
    ...defaultState(),
    connectedFrostServer: connectedFrostServer && JSON.parse(connectedFrostServer) ?
      JSON.parse(connectedFrostServer) : undefined,
    objects: JSON.parse(objects),
    constantParts: JSON.parse(constantParts),
    latestId: JSON.parse(latestId),
  };
}

/**
 * Extracts objects from csv-data
 * @param state - the redux state of fisaProject
 * @param csvData - the csv data
 * @param definitionName - the definition name of the Object the csv-Data should be mapped
 */
function extractFromCSV(
  stateWithUndo: ProjectStateI,
  stateWithoutUndo: ProjectStateI,
  csvData: string,
  definitionName: string
): ProjectStateI {
  const definition = stateWithUndo.constantParts.objectDefinitions.find(
    (def) => def.name === definitionName
  );
  if (!definition) {
    return stateWithoutUndo;
  }
  const lines = csvData.split(CSV_ROW_SEPARATOR);
  const definitionNames = lines[0].split(CSV_COL_SEPARATOR);
  let { objects } = stateWithUndo;
  let idCounter = stateWithUndo.latestId;

  // Check if valide definitionNames:
  const checkDefinitions = checkCsvDefinitions(definition, lines);
  if (checkDefinitions) {
    return {
      ...stateWithoutUndo,
      csvExtractionError: checkDefinitions,
    };
  }

  for (let i = 1; i < lines.length; i++) {
    const thisLine = lines[i].split(CSV_COL_SEPARATOR);
    if (!thisLine || thisLine.length !== definitionNames.length) {
      return {
        ...stateWithUndo,
        latestId: idCounter,
        objects,
      };
    }
    idCounter += 1;
    objects = objectReducer(objects, {
      type: actionTypes.NEW_OBJECT_FROM_OBJECT_DEFINITION,
      payload: {
        objectDefinition: definition,
        newId: idCounter,
        objectToAddTo: stateWithUndo.activeObject,
      },
    });

    for (let j = 0; j < thisLine.length && j < definitionNames.length; j++) {
      objects = objectReducer(objects, {
        type: actionTypes.CHANGE_OBJECT_VALUE,
        payload: {
          key: definitionNames[j],
          value: createValueOfCSV(
            thisLine[j],
            definition.attributes.find(
              (attr) => attr.name === definitionNames[j]
            )
          ),
          objectId: idCounter,
        },
      });
    }
  }

  return {
    ...stateWithUndo,
    latestId: idCounter,
    objects,
    csvExtractionError: undefined,
  };
}

/**
 *
 * @param definition - the definition the csv should match
 * @param definitionNames - the lines of the CSV-Data
 */
function checkCsvDefinitions(
  definition: FisaObjectDefinitionI,
  csvLines: string[]
): ErrorMessageI | undefined {
  let attributeNames = definition.attributes.map((attribute) => attribute.name);

  const definitionLine = csvLines[0].split(CSV_COL_SEPARATOR);

  for (let i = 0; i < definitionLine.length; i++) {
    const inAttribute = attributeNames.find(
      (aName) => aName === definitionLine[i]
    );
    if (!inAttribute) {
      return {
        name: 'CSV Extraction Error',
        message: `The attribute "${definitionLine[i]}" does not exist in "${definition.name}"`,
        longMessage: `Attributes of "${definition.name}": "${attributeNames}",\nAttributes in CSV: "${definitionLine}"`,
        rawMessage: undefined,
        code: undefined,
      };
    }
    attributeNames = attributeNames.filter(
      (aName) => aName !== definitionLine[i]
    );
  }
  return undefined;
}

/**
 * Checks the valueType and returns csvValue in the right format
 * @param csvValue the value from the csvData
 * @param attribte  the attribute for the value
 */
function createValueOfCSV(
  csvValue: string,
  attribute: AttributesDefinitionI | undefined
): string | boolean | number {
  if (!attribute) {
    return csvValue;
  }

  switch (attribute.valueType) {
    case NUMBER:
      return Number(csvValue);
    case BOOLEAN:
      return csvValue.toLowerCase() === 'true';
    default:
      return csvValue;
  }
}
