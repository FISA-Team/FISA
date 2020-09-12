import { ServerCommunicationStateI } from '../../../redux/interfaces';
import * as actionTypes from '../../../redux/actionTypes';
import ServerCommunicationReducer from '../../../redux/reducers/serverCommunicationReducer';

const initState: () => ServerCommunicationStateI = () => ({
  active: false,
  pending: false,
  error: undefined,
});

test('communicationPending', () => {
  const expected = {
    ...initState(),
    active: true,
    pending: true,
  };
  const action = {
    type: actionTypes.COMMUNICATION_PENDING,
    payload: undefined,
  };
  expect(ServerCommunicationReducer(initState(), action)).toEqual(expected);
});

test('communicationSuccess', () => {
  const expected = {
    ...initState(),
  };
  const action = {
    type: actionTypes.COMMUNICATION_SUCCESS,
    payload: undefined,
  };
  expect(ServerCommunicationReducer(initState(), action)).toEqual(expected);
});

test('setErrorMessage', () => {
  const expected = {
    ...initState(),
    error: 'error',
    active: true,
  };
  const action = {
    type: actionTypes.SET_ERROR_MESSAGE,
    payload: {
      error: 'error',
    },
  };
  expect(ServerCommunicationReducer(initState(), action)).toEqual(expected);
});

test('stopCommunication', () => {
  const expected = {
    ...initState(),
  };
  const action = {
    type: actionTypes.STOP_COMMUNICATION_PENDING,
    payload: undefined,
  };
  expect(ServerCommunicationReducer(initState(), action)).toEqual(expected);
});

test('ResetState', () => {
  const expected = {
    ...initState(),
  };
  const action = {
    type: actionTypes.RESET_STATE,
    payload: undefined,
  };
  expect(ServerCommunicationReducer(initState(), action)).toEqual(expected);
});
