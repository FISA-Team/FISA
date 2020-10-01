// Interfaces witch describe Objects in the Store
import { FisaObjectI, FisaObjectDefinitionI } from './fisaInterfaces';
import { AvailableFisaDocumentI, AvailableProjectI } from './apiInterfaces';

export interface ActionI {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}

export interface FrontendReduxStateI {
  fisaProject: ProjectStateI;
  projectPage: ProjectPageStateI;
  availableFisaDocumentsProjects: DocumentProjectOverviewReducerI;
  serverCommunication: ServerCommunicationStateI;
}

export interface ProjectPageStateI {
  dontShowObjectRemoveWarning: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: any;
  themeName: string;
  notSaved: boolean;
  highlightedObject: number;
  scrollingActive: boolean;
  projectExistsOnBackend: boolean;
}

export interface NecessaryProjectStateI {
  activeObject: number;
  objects: FisaObjectI[];
}

export interface ProjectStateI {
  csvExtractionError: ErrorMessageI | undefined;
  activeObject: number;
  latestId: number;
  objects: FisaObjectI[];
  constantParts: ConstantPartsI;
  undoHistory: NecessaryProjectStateI[];
  redoHistory: NecessaryProjectStateI[];
}

export interface ConstantPartsI {
  objectDefinitions: FisaObjectDefinitionI[];
  fisaDocumentName: string;
  fisaProjectName: string;
}

export interface ServerCommunicationStateI {
  active: boolean;
  pending: boolean;
  error: ErrorMessageI | undefined;
}

export interface DocumentProjectOverviewReducerI {
  projectsFetched: boolean;
  projects: AvailableProjectI[];
  documentsFetched: boolean;
  documents: AvailableFisaDocumentI[];
  datastreamConnectData: DatastreamData[] | undefined;
  chosenDocumentUuid: string | undefined;
}

export interface DatastreamData {
  id: string | number;
  name: string;
}

export interface ErrorMessageI {
  name: string;
  message: string;
  code: number | undefined;
  longMessage: string | undefined;
  rawMessage: string | undefined;
}
