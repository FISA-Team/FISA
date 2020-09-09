import {
  ADD_DOCUMENTS_FROM_SERVER,
  ADD_PROJECTS_FROM_SERVER,
  RESET_STATE,
  ADD_DATASTREAM_DATA,
} from '../actionTypes';
import { ActionI, DocumentProjectOverviewReducerI } from '../interfaces';

const defaultState: () => DocumentProjectOverviewReducerI = () => ({
  documentsFetched: false,
  documents: [],
  projectsFetched: false,
  projects: [],
  datastreamConnectData: undefined,
});

export default function availableFisaDocumentsReducer(
  state: DocumentProjectOverviewReducerI = defaultState(),
  action: ActionI
): DocumentProjectOverviewReducerI {
  switch (action.type) {
    case ADD_DOCUMENTS_FROM_SERVER:
      return {
        ...state,
        documentsFetched: true,
        documents: [...action.payload.availableDocuments],
      };
    case ADD_PROJECTS_FROM_SERVER:
      return {
        ...state,
        projectsFetched: true,
        projects: [...action.payload.availableProjects],
      };
    case ADD_DATASTREAM_DATA:
      return {
        ...state,
        datastreamConnectData: action.payload.data,
      };
    case RESET_STATE:
      return defaultState();
    default:
      return state;
  }
}
