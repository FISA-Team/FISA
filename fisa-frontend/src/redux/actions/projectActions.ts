// A collections of actions to change the Project Store

import { ValueType, BackendFisaObjectI, FisaProjectI } from '../interfaces';
import * as actionTypes from '../actionTypes';

export const addObjectByObjectDefinition = (definitionName: string) => ({
  type: actionTypes.NEW_OBJECT_FROM_OBJECT_DEFINITION,
  payload: { definitionName },
});

export const changeObjectProperty = (
  objectId: number,
  key: string,
  value: ValueType
) => ({
  type: actionTypes.CHANGE_OBJECT_VALUE,
  payload: {
    objectId,
    key,
    value,
  },
});

export const removeObject = (objectId: number, removeFromFrost: boolean) => ({
  type: actionTypes.REMOVE_OBJECT,
  payload: { objectId, removeFromFrost },
});

export const addObjectByExisting = (objectId: number) => ({
  type: actionTypes.ADD_OBJECT_FROM_EXISTING,
  payload: { objectId },
});

export const linkObject = (objectId: number) => ({
  type: actionTypes.LINK_OBJECT,
  payload: { objectId },
});

export const setFetchProjectName = (name: string) => ({
  type: actionTypes.SET_FETCH_PROJECT_NAME,
  payload: {
    name,
  },
});

export const loadAutoSave = () => ({
  type: actionTypes.LOAD_AUTO_SAVE,
  payload: undefined,
});

export const loadSavedProject = (project: FisaProjectI) => ({
  type: actionTypes.LOAD_SAVED_PROJECT,
  payload: {
    project,
  },
});

export const extractFromCSV = (csv: string, definitionName: string) => ({
  type: actionTypes.EXTRACT_FROM_CSV,
  payload: {
    csv,
    definitionName,
  },
});

export const setFromBackend = () => ({
  type: actionTypes.SET_FROM_BACKEND_TRUE,
  payload: undefined,
});

export const changeProjectName = (newName: string) => ({
  type: actionTypes.CHANGE_PROJECT_NAME,
  payload: { newName },
});

export const setFrostIdsOfObjects = (fisaObjects: BackendFisaObjectI[]) => ({
  type: actionTypes.SET_FROST_IDS_OF_OBJECTS,
  payload: { fisaObjects },
});

export const setConnectedFrostUrl = (frostUrl: string) => ({
  type: actionTypes.SET_FROST_URL,
  payload: { frostUrl },
});

export const clearRemovedObjects = () => ({
  type: actionTypes.CLEAR_REMOVED_OBJECTS,
  payload: undefined
});