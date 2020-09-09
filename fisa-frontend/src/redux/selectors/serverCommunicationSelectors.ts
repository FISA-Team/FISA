import { FrontendReduxStateI } from '../interfaces';

export const getServerCommunicationActive = (state: FrontendReduxStateI) =>
  state.serverCommunication.active;

export const getServerCommunicationPending = (state: FrontendReduxStateI) =>
  state.serverCommunication.pending;

export const getServerCommunicationError = (state: FrontendReduxStateI) =>
  state.serverCommunication.error;

export const getProjectsFetched = (state: FrontendReduxStateI) =>
  state.availableFisaDocumentsProjects.projectsFetched;

export const getDocumentsFetched = (state: FrontendReduxStateI) =>
  state.availableFisaDocumentsProjects.documentsFetched;
