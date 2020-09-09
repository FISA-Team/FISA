import { combineReducers } from 'redux';
import fetchReducer from './fetchReducer';
import fisaProjectReducer from './fisaProjectReducer';
import ProjectPageReducer from './projectPageReducer';
import DocumentProjectOverviewReducerI from './overviewReducer';
import ServerCommunicationReducer from './serverCommunicationReducer';

const projectReducer = combineReducers({
  fisaProject: fisaProjectReducer,
  fetch: fetchReducer,
  projectPage: ProjectPageReducer,
  availableFisaDocumentsProjects: DocumentProjectOverviewReducerI,
  serverCommunication: ServerCommunicationReducer,
});

export default projectReducer;
