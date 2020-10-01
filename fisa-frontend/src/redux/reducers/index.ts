import { combineReducers } from 'redux';
import fisaProjectReducer from './fisaProjectReducer';
import ProjectPageReducer from './projectPageReducer';
import DocumentProjectOverviewReducerI from './overviewReducer';
import ServerCommunicationReducer from './serverCommunicationReducer';

const projectReducer = combineReducers({
  fisaProject: fisaProjectReducer,
  projectPage: ProjectPageReducer,
  availableFisaDocumentsProjects: DocumentProjectOverviewReducerI,
  serverCommunication: ServerCommunicationReducer,
});

export default projectReducer;
