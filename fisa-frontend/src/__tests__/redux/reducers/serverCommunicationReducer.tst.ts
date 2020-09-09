import { ServerCommunicationStateI } from '../../../redux/interfaces';
import * as actionTypes from '../../../redux/actionTypes';
import ServerCommunicationReducer from '../../../redux/reducers/serverCommunicationReducer';

const initState: () => ServerCommunicationStateI = () => ({
  active: false,
  pending: false,
  error: undefined,
});

test('CommunicationPending', () => {
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

test('CommunicationSuccess', () => {
  const expected = {
    ...initState(),
  };
  const action = {
    type: actionTypes.COMMUNICATION_SUCCESS,
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
