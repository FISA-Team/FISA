import * as actions from '../../../redux/actions/pageActions';
import * as actionTypes from '../../../redux/actionTypes';

test('resetState', () => {
  const expectedAction = {
    type: actionTypes.RESET_STATE,
    payload: undefined,
  };
  expect(actions.resetState()).toEqual(expectedAction);
});

test('dontShowObjectRemoveWarning', () => {
  const expectedAction = {
    type: actionTypes.DO_NOT_ASC_BY_DELETE_OBJECT,
    payload: undefined,
  };
  expect(actions.dontShowObjectRemoveWarning()).toEqual(expectedAction);
});

test('setTheme', () => {
  const theme = 'darkTheme';
  const expectedAction = {
    type: actionTypes.SET_THEME,
    payload: {
      theme,
    },
  };
  expect(actions.setTheme(theme)).toEqual(expectedAction);
});

test('undo', () => {
  const expectedAction = {
    type: actionTypes.UNDO,
    payload: undefined,
  };
  expect(actions.undo()).toEqual(expectedAction);
});

test('redo', () => {
  const expectedAction = {
    type: actionTypes.REDO,
    payload: undefined,
  };
  expect(actions.redo()).toEqual(expectedAction);
});

test('setObjectActive', () => {
  const objectId = 22;
  const expectedAction = {
    type: actionTypes.GO_TO_OBJECT,
    payload: { objectId },
  };
  expect(actions.setObjectActive(objectId)).toEqual(expectedAction);
});
