import overviewReducer from '../../../redux/reducers/overviewReducer';
import * as actionTypes from '../../../redux/actionTypes';
import { initState } from '../mockups/testState';
import { DocumentProjectOverviewReducerI } from '../../../redux/interfaces';

const state: () => DocumentProjectOverviewReducerI = () =>
  initState().availableFisaDocumentsProjects;

test('add documents from server', () => {
  const availableDocuments = [{ name: 'My Document', uuid: '1234' }];
  const action = {
    type: actionTypes.ADD_DOCUMENTS_FROM_SERVER,
    payload: {
      availableDocuments,
    },
  };
  const expected = {
    ...state(),
    documentsFetched: true,
    documents: availableDocuments,
  };
  expect(overviewReducer(state(), action)).toEqual(expected);
});

test('add project from server', () => {
  const availableProjects = [{ name: 'My Project', uuid: '1234' }];
  const action = {
    type: actionTypes.ADD_PROJECTS_FROM_SERVER,
    payload: {
      availableProjects,
    },
  };
  const expected = {
    ...state(),
    projectsFetched: true,
    projects: availableProjects,
  };
  expect(overviewReducer(state(), action)).toEqual(expected);
});

test('add Datastream data', () => {
  const data = [{ name: 'Kitchen', id: '1234' }];
  const action = {
    type: actionTypes.ADD_DATASTREAM_DATA,
    payload: {
      data,
    },
  };
  const expected = {
    ...state(),
    datastreamConnectData: data,
  };
  expect(overviewReducer(state(), action)).toEqual(expected);
});

test('set choosen document uuid', () => {
  const uuid = '1234';
  const action = {
    type: actionTypes.SET_CHOSEN_DOCUMENT_UUID,
    payload: {
      uuid,
    },
  };
  const expected = {
    ...state(),
    chosenDocumentUuid: uuid,
  };
  expect(overviewReducer(state(), action)).toEqual(expected);
});

test('reset state', () => {
  const action = {
    type: actionTypes.RESET_STATE,
    payload: undefined,
  };
  expect(overviewReducer(state(), action)).toEqual(state());
});

test('action not in overviewReducer', () => {
  const action = {
    type: actionTypes.REMOVE_OBJECT,
    payload: undefined,
  };
  expect(overviewReducer(state(), action)).toEqual(state());
});
