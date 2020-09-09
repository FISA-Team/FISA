import * as actions from '../../../redux/actions/projectActions';
import * as actionTypes from '../../../redux/actionTypes';
import { fisaProject } from '../mockups/fakeFisaProject';
import { csvData } from '../mockups/csvData';

test('addObjectByObjectDefinition', () => {
  const definitionName = 'room';
  const expectedAction = {
    type: actionTypes.NEW_OBJECT_FROM_OBJECT_DEFINITION,
    payload: { definitionName },
  };
  expect(actions.addObjectByObjectDefinition(definitionName)).toEqual(
    expectedAction
  );
});

test('changeObjectProperty', () => {
  const objectId = 2;
  const key = 'Name';
  const value = 'Küche';
  const expectedAction = {
    type: actionTypes.CHANGE_OBJECT_VALUE,
    payload: {
      objectId,
      key,
      value,
    },
  };
  expect(actions.changeObjectProperty(objectId, key, value)).toEqual(
    expectedAction
  );
});

test('removeObject', () => {
  const objectId = 2;
  const expectedAction = {
    type: actionTypes.REMOVE_OBJECT,
    payload: {
      objectId,
    },
  };
  expect(actions.removeObject(objectId)).toEqual(expectedAction);
});
test('addObjectByExisting', () => {
  const objectId = 2;
  const expectedAction = {
    type: actionTypes.ADD_OBJECT_FROM_EXISTING,
    payload: {
      objectId,
    },
  };
  expect(actions.addObjectByExisting(objectId)).toEqual(expectedAction);
});

test('linkObject', () => {
  const objectId = 2;
  const expectedAction = {
    type: actionTypes.LINK_OBJECT,
    payload: {
      objectId,
    },
  };
  expect(actions.linkObject(objectId)).toEqual(expectedAction);
});

test('setFetchProjectName', () => {
  const name = 'Hello world!';
  const expectedAction = {
    type: actionTypes.SET_FETCH_PROJECT_NAME,
    payload: {
      name,
    },
  };
  expect(actions.setFetchProjectName(name)).toEqual(expectedAction);
});

test('loadAutoSave', () => {
  const expectedAction = {
    type: actionTypes.LOAD_AUTO_SAVE,
    payload: undefined,
  };
  expect(actions.loadAutoSave()).toEqual(expectedAction);
});

test('loadAutoSave', () => {
  const expectedAction = {
    type: actionTypes.LOAD_SAVED_PROJECT,
    payload: {
      project: fisaProject(),
    },
  };
  expect(actions.loadSavedProject(fisaProject())).toEqual(expectedAction);
});

test('extractFromCSV', () => {
  const expectedAction = {
    type: actionTypes.EXTRACT_FROM_CSV,
    payload: {
      csv: csvData,
      definitionName: 'Raum',
    },
  };
  expect(actions.extractFromCSV(csvData, 'Raum')).toEqual(expectedAction);
});

test('setFromBackend', () => {
  const expectedAction = {
    type: actionTypes.SET_FROM_BACKEND_TRUE,
    payload: undefined,
  };
  expect(actions.setFromBackend()).toEqual(expectedAction);
});

test('changeProjectName', () => {
  const expectedAction = {
    type: actionTypes.CHANGE_PROJECT_NAME,
    payload: {
      newName: 'New name',
    },
  };
  expect(actions.changeProjectName('New name')).toEqual(expectedAction);
});
