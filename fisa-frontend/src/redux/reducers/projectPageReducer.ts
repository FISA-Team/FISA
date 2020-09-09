import * as actionTypes from '../actionTypes';
import * as themes from '../../themes';
import {
  DONT_SHOW_OBJECT_REMOVE_WARNING,
  THEME,
  UNSAVED_PROJECT_IN_AUTOSAVE,
} from '../../variables/localeStoreageKeys';
import { ActionI, ProjectPageStateI } from '../interfaces';

const storageTheme = localStorage.getItem(THEME);

const defaultState: ProjectPageStateI = {
  dontShowObjectRemoveWarning:
    !!localStorage.getItem(DONT_SHOW_OBJECT_REMOVE_WARNING) || false,
  theme: storageTheme
    ? // @ts-ignore
    themes[storageTheme] || themes.lightTheme
    : themes.lightTheme,
  themeName: localStorage.getItem(THEME) || 'lightTheme',
  notSaved: !!localStorage.getItem(UNSAVED_PROJECT_IN_AUTOSAVE),
  highlightedObject: -1,
  scrollingActive: false,
  projectExistsOnBackend: false,
};

export default function projectSiteReducer(
  state = defaultState,
  action: ActionI
) {
  switch (action.type) {
    case actionTypes.SET_THEME:
      localStorage.setItem(THEME, action.payload.theme);
      return {
        ...state,
        // @ts-ignore
        theme: themes[action.payload.theme],
        themeName: action.payload.theme,
      };

    case actionTypes.DO_NOT_ASC_BY_DELETE_OBJECT:
      localStorage.setItem(
        DONT_SHOW_OBJECT_REMOVE_WARNING,
        // @ts-ignore
        false
      );
      return {
        ...state,
        dontShowObjectRemoveWarning: true,
      };
    case actionTypes.SET_HIGHLIGHTED_OBJECT:
    case actionTypes.GO_TO_OBJECT:
      return {
        ...state,
        highlightedObject: action.payload?.objectId,
      };

    case actionTypes.ENABLE_SCROLLING_ACTION:
      return {
        ...state,
        scrollingActive: true,
      };

    case actionTypes.DISABLE_SCROLLING_ACTION:
      return {
        ...state,
        scrollingActive: false,
      };
    case actionTypes.LOAD_PROJECT_FROM_FISA:
    case actionTypes.LOAD_SAVED_PROJECT:
    case actionTypes.PROJECT_SAVED:
      localStorage.removeItem(UNSAVED_PROJECT_IN_AUTOSAVE);
      return {
        ...state,
        notSaved: false,
      };

    case actionTypes.SET_FROM_BACKEND_TRUE:
      return {
        ...state,
        projectExistsOnBackend: true,
      };

    case actionTypes.RESET_EXISTS_ON_BACKEND:
      return {
        ...state,
        projectExistsOnBackend: false,
      };

    default:
      if (actionTypes.OBJECT_CHANGING_TYPES.includes(action.type)) {
        localStorage.setItem(UNSAVED_PROJECT_IN_AUTOSAVE, 'true');
        return {
          ...state,
          notSaved: true,
        };
      }
      return state;
  }
}
