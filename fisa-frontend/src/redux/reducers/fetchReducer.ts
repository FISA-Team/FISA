import { RESET_STATE, SET_CHOSEN_DOCUMENT_UUID } from '../actionTypes';
import { ActionI, FetchProjectI } from '../interfaces';

/**
 * The Initial FrontendReduxStateI of the Reducer.
 */
const initState = () => ({
  chosenDocumentUuid: undefined,
});

/**
 * A reducer witch handles the fetch process related stuff
 *
 * @param state - The state of the reducer
 * @param action - A action witch should be executed
 * @returns - The updated state if the action changed something
 */
export default function fetchReducer(
  state: FetchProjectI = initState(),
  action: ActionI
): FetchProjectI {
  switch (action.type) {
    case SET_CHOSEN_DOCUMENT_UUID:
      return {
        ...state,
        chosenDocumentUuid: action.payload.uuid,
      };
    /**
     * @returns the initial state
     */
    case RESET_STATE:
      return initState();
    default:
      return state;
  }
}
