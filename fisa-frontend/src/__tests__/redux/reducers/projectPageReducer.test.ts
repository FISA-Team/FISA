import projectSiteReducer from '../../../redux/reducers/projectPageReducer';
import { lightTheme, darkTheme } from '../../../themes';
import * as actionTypes from '../../../redux/actionTypes';
import { ProjectPageStateI } from '../../../redux/interfaces';

const testState: () => ProjectPageStateI = () => ({
  dontShowObjectRemoveWarning: false,
  theme: lightTheme,
  themeName: 'lightTheme',
  notSaved: false,
  highlightedObject: -1,
  scrollingActive: false,
  projectExistsOnBackend: false,
});

describe('setTheme', () => {
  it('set theme to darkTheme', () => {
    const theme = 'darkTheme';
    const action = {
      type: actionTypes.SET_THEME,
      payload: {
        theme,
      },
    };
    const expected = {
      ...testState(),
      themeName: theme,
      theme: darkTheme,
    };
    expect(projectSiteReducer(testState(), action)).toEqual(expected);
  });
});

describe('dontAscByDeleteObject', () => {
  it("set don't asc by delete Object", () => {
    const action = {
      type: actionTypes.DO_NOT_ASC_BY_DELETE_OBJECT,
      payload: undefined,
    };
    const expected = {
      ...testState(),
      dontShowObjectRemoveWarning: true,
    };
    expect(projectSiteReducer(testState(), action)).toEqual(expected);
  });
});

describe('testDefault', () => {
  it('with action witch needs to be saved', () => {
    const action = {
      type: actionTypes.REMOVE_OBJECT,
      payload: undefined,
    };
    const expected = {
      ...testState(),
      notSaved: true,
    };
    expect(projectSiteReducer(testState(), action)).toEqual(expected);
  });
  it('without action witch needs to be saved', () => {
    const action = {
      type: actionTypes.COMMUNICATION_PENDING,
      payload: undefined,
    };
    const expected = {
      ...testState(),
      notSaved: false,
    };
    expect(projectSiteReducer(testState(), action)).toEqual(expected);
  });
});

describe('setHighlightedObject', () => {
  it('test with setHighlightedObject', () => {
    const action = {
      type: actionTypes.SET_HIGHLIGHTED_OBJECT,
      payload: {
        objectId: 7,
      },
    };
    const expected = {
      ...testState(),
      highlightedObject: 7,
    };
    expect(projectSiteReducer(testState(), action)).toEqual(expected);
  });
  it('test with gotToObject', () => {
    const action = {
      type: actionTypes.GO_TO_OBJECT,
      payload: {
        objectId: 7,
      },
    };
    const expected = {
      ...testState(),
      highlightedObject: 7,
    };
    expect(projectSiteReducer(testState(), action)).toEqual(expected);
  });
});

describe('scrollingActive', () => {
  it('enableScrollingAction', () => {
    const action = {
      type: actionTypes.ENABLE_SCROLLING_ACTION,
      payload: undefined,
    };
    const expected = {
      ...testState(),
      scrollingActive: true,
    };
    expect(projectSiteReducer(testState(), action)).toEqual(expected);
  });
  it('disableScrollingAction', () => {
    const action = {
      type: actionTypes.DISABLE_SCROLLING_ACTION,
      payload: undefined,
    };
    const expected = {
      ...testState(),
      scrollingActive: false,
    };
    expect(projectSiteReducer(testState(), action)).toEqual(expected);
  });
});
