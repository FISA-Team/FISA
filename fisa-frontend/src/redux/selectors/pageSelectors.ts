import { Theme } from '@material-ui/core';
import { FrontendReduxStateI } from '../interfaces';

/**
 *
 * @param state The redux FrontendReduxStateI of the program
 * @returns true if dontAskAnObjectDelete is set
 */
export const getDontAskOnObjectDelete = (state: FrontendReduxStateI): boolean =>
  state.projectPage.dontShowObjectRemoveWarning;

/**
 *
 * @param state The redux FrontendReduxStateI of the program
 * @returns the current theme
 */
export const getTheme = (state: FrontendReduxStateI): Theme =>
  state.projectPage.theme;

/**
 *
 * @param state The redux FrontendReduxStateI of the program
 * @returns the name of the current theme
 */
export const getThemeName = (state: FrontendReduxStateI): string =>
  state.projectPage.themeName;

/**
 *
 * @param state The redux FrontendReduxStateI of the program
 * @returns true if the undo history is not empty
 */
export const getCanUndo = (state: FrontendReduxStateI): boolean =>
  state.fisaProject.undoHistory.length > 0;

/**
 *
 * @param state The redux FrontendReduxStateI of the program
 * @returns true if the redo history is not empty
 */
export const getCanRedo = (state: FrontendReduxStateI): boolean =>
  state.fisaProject.redoHistory.length > 0;

/**
 *
 * @param state The redux FrontendReduxStateI of the program
 * @returns true if there are unsaved changes
 */
export const getNotSaved = (state: FrontendReduxStateI): boolean =>
  state.projectPage.notSaved;

/**
 *
 * @param state The redux FrontendReduxStateI of the program
 * @returns the object-id of the currently highlighted object
 */
export const getHighlightedObject = (state: FrontendReduxStateI): number =>
  state.projectPage.highlightedObject;

export const getScrollingActionActive = (state: FrontendReduxStateI): boolean =>
  state.projectPage.scrollingActive;

export const getProjectExistsOnBackend = (state: FrontendReduxStateI) =>
  state.projectPage.projectExistsOnBackend;

export const getDatastremConnectionData = (state: FrontendReduxStateI) =>
  state.availableFisaDocumentsProjects.datastreamConnectData;
