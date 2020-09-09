import * as actions from '../actionTypes';
import { DatastreamData } from '../interfaces';

export const setHighlightedObject = (objectId: number) => ({
  type: actions.SET_HIGHLIGHTED_OBJECT,
  payload: {
    objectId,
  },
});

export const setObjectActive = (objectId: number | undefined) => ({
  type: actions.GO_TO_OBJECT,
  payload: { objectId },
});

export const dontShowObjectRemoveWarning = () => ({
  type: actions.DO_NOT_ASC_BY_DELETE_OBJECT,
  payload: undefined,
});

export const setTheme = (theme: string) => ({
  type: actions.SET_THEME,
  payload: { theme },
});

export const undo = () => ({
  type: actions.UNDO,
  payload: undefined,
});

export const redo = () => ({
  type: actions.REDO,
  payload: undefined,
});

export const resetState = () => ({
  type: actions.RESET_STATE,
  payload: undefined,
});

export const disableScrollingAction = () => ({
  type: actions.DISABLE_SCROLLING_ACTION,
  payload: undefined,
});

export const enableScrollingAction = () => ({
  type: actions.ENABLE_SCROLLING_ACTION,
  payload: undefined,
});

export const setSaved = () => ({
  type: actions.PROJECT_SAVED,
  payload: undefined,
});

export const resetExistsOnBackend = () => ({
  type: actions.RESET_EXISTS_ON_BACKEND,
  payload: undefined,
});

export const setDatastreamConnectionData = (data: DatastreamData[]) => ({
  type: actions.ADD_DATASTREAM_DATA,
  payload: {
    data,
  },
});

export const clearDatastreamConnectionData = () => ({
  type: actions.CLEAR_DATASTREAM_DATA,
  payload: undefined,
});
