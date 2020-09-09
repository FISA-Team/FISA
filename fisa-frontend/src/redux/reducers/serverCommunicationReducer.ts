import {
  COMMUNICATION_PENDING,
  SET_ERROR_MESSAGE,
  COMMUNICATION_SUCCESS,
  CLEAR_ERROR_MESSAGE,
  STOP_COMMUNICATION_PENDING,
  RESET_STATE,
} from '../actionTypes';
import { ServerCommunicationStateI, ActionI } from '../interfaces';

/**
 * The Initial FrontendReduxStateI of the Reducer.
 */
const initState: () => ServerCommunicationStateI = () => ({
  active: false,
  pending: false,
  error: undefined,
});

export default function ServerCommunicationReducer(
  state: ServerCommunicationStateI = initState(),
  action: ActionI
): ServerCommunicationStateI {
  switch (action.type) {
    case COMMUNICATION_PENDING:
      return {
        error: undefined,
        active: true,
        pending: true,
      };
    case COMMUNICATION_SUCCESS:
      return {
        ...state,
        active: false,
      };

    case SET_ERROR_MESSAGE:
      return { ...state, error: action.payload?.error, active: true };

    case STOP_COMMUNICATION_PENDING:
      return {
        ...state,
        pending: false,
      };
    case RESET_STATE:
    case CLEAR_ERROR_MESSAGE:
      return initState();
    default:
      return state;
  }
}
