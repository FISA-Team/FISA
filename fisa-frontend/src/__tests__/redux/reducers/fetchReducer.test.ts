import fetchReducer from '../../../redux/reducers/fetchReducer';
import * as actionTypes from '../../../redux/actionTypes';
import { initState } from '../mockups/testState';

test('action not in fetchReducer', () => {
  const customState = {
    ...initState().fetch,
    pending: false,
  };
  const action = {
    type: actionTypes.REMOVE_OBJECT,
    payload: undefined,
  };
  expect(fetchReducer(customState, action)).toEqual(customState);
});
