import * as actions from '../../../redux/actions/backendCommunicationActions';
import * as actionTypes from '../../../redux/actionTypes';
import { fakeFisaDoc } from '../mockups/fakeFisaDoc';

test('clearErrorMessage', () => {
  const expected = {
    type: actionTypes.CLEAR_ERROR_MESSAGE,
    payload: undefined,
  };
  expect(actions.clearErrorMessage()).toEqual(expected);
});

test('setChosenDocumentUuid', () => {
  const uuid = '1234';
  const expected = {
    type: actionTypes.SET_CHOSEN_DOCUMENT_UUID,
    payload: {
      uuid,
    },
  };
  expect(actions.setChosenDocumentUuid(uuid)).toEqual(expected);
});

test('setCommunicationPending', () => {
  const expected = {
    type: actionTypes.COMMUNICATION_PENDING,
    payload: undefined,
  };
  expect(actions.setCommunicationPending()).toEqual(expected);
});

test('setErrorToShow', () => {
  const error = {
    name: 'Mein Error',
    message: 'The error message',
    longMessage: undefined,
    rawMessage: undefined,
    code: undefined,
  };
  const expected = {
    type: actionTypes.SET_ERROR_MESSAGE,
    payload: {
      error,
    },
  };
  expect(actions.setErrorToShow(error)).toEqual(expected);
});

test('loadProjectFromFisa', () => {
  const expected = {
    type: actionTypes.LOAD_PROJECT_FROM_FISA,
    payload: {
      document: fakeFisaDoc(),
    },
  };
  expect(actions.loadProjectFromFisa(fakeFisaDoc())).toEqual(expected);
});
