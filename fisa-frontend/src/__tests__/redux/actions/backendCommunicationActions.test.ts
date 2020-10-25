import configureMockStore from 'redux-mock-store';
import mockAxios from 'axios';
import thunk from 'redux-thunk';
import * as actions from '../../../redux/actions/backendCommunicationActions';
import * as actionTypes from '../../../redux/actionTypes';
import { fakeFisaDoc } from '../mockups/fakeFisaDoc';
import { initState, testState } from '../mockups/testState';
import { BackendUrl } from '../../../environment';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
jest.mock('axios');

test('clearErrorMessage', () => {
  const expected = {
    type: actionTypes.CLEAR_ERROR_MESSAGE,
    payload: undefined,
  };
  expect(actions.clearErrorMessage()).toEqual(expected);
});

test('setChosenDocumentUuid', () => {
  const uuid = '1234';
  const expected = {
    type: actionTypes.SET_CHOSEN_DOCUMENT_UUID,
    payload: {
      uuid,
    },
  };
  expect(actions.setChosenDocumentUuid(uuid)).toEqual(expected);
});

test('setCommunicationPending', () => {
  const expected = {
    type: actionTypes.COMMUNICATION_PENDING,
    payload: undefined,
  };
  expect(actions.setCommunicationPending()).toEqual(expected);
});

test('setErrorToShow', () => {
  const error = {
    name: 'Mein Error',
    message: 'The error message',
    longMessage: undefined,
    rawMessage: undefined,
    code: undefined,
  };
  const expected = {
    type: actionTypes.SET_ERROR_MESSAGE,
    payload: {
      error,
    },
  };
  expect(actions.setErrorToShow(error)).toEqual(expected);
});

test('loadProjectFromFisa', () => {
  const expected = {
    type: actionTypes.LOAD_PROJECT_FROM_FISA,
    payload: {
      document: fakeFisaDoc(),
    },
  };
  expect(actions.loadProjectFromFisa(fakeFisaDoc())).toEqual(expected);
});

describe('axios tests success', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('loadProjectFromServer', async () => {
    const uuid = '1234';
    // @ts-ignore
    mockAxios.get.mockImplementation(() =>
      Promise.resolve({
        data: fakeFisaDoc(),
      })
    );

    const expectedActions = [
      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      {
        type: actionTypes.LOAD_SAVED_PROJECT,
        payload: { project: fakeFisaDoc() },
      },
      { type: actionTypes.COMMUNICATION_SUCCESS, payload: undefined },
      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },
    ];

    const store = mockStore(initState());

    // @ts-ignore
    await store.dispatch(actions.loadProjectFromServer(uuid));

    expect(store.getActions()).toEqual(expectedActions);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(
      `${BackendUrl}/projects/${uuid}`
    );
  });

  it('fetchAvailableProjects', async () => {
    const responseData = [{ name: 'My Project', uuid: '1234' }];
    // @ts-ignore
    mockAxios.get.mockImplementation(() =>
      Promise.resolve({
        data: responseData,
      })
    );

    const expectedActions = [
      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      {
        type: actionTypes.ADD_PROJECTS_FROM_SERVER,
        payload: { availableProjects: responseData },
      },
      { type: actionTypes.COMMUNICATION_SUCCESS, payload: undefined },
      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },
    ];

    const store = mockStore(initState());

    // @ts-ignore
    await store.dispatch(actions.fetchAvailableProjects());

    expect(store.getActions()).toEqual(expectedActions);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(`${BackendUrl}/projects/`);
  });

  it('fetchAvailableDocuments', async () => {
    const responseData = [{ name: 'My Document', uuid: '1234' }];
    // @ts-ignore
    mockAxios.get.mockImplementation(() =>
      Promise.resolve({
        data: responseData,
      })
    );

    const expectedActions = [
      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      {
        type: actionTypes.ADD_DOCUMENTS_FROM_SERVER,
        payload: { availableDocuments: responseData },
      },
      { type: actionTypes.COMMUNICATION_SUCCESS, payload: undefined },
      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },
    ];

    const store = mockStore(initState());

    // @ts-ignore
    await store.dispatch(actions.fetchAvailableDocuments());
    expect(store.getActions()).toEqual(expectedActions);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(`${BackendUrl}/documents/`);
  });

  it('deleteDocument', async () => {
    const responseData = [{ name: 'My Document', uuid: '1234' }];
    const uuid = '1234';

    // @ts-ignore
    mockAxios.get.mockImplementation(() =>
      Promise.resolve({
        data: responseData,
      })
    );

    const expectedActions = [
      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },

      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      { type: actionTypes.COMMUNICATION_SUCCESS, payload: undefined },
      {
        type: actionTypes.ADD_DOCUMENTS_FROM_SERVER,
        payload: { availableDocuments: responseData },
      },
      { type: actionTypes.COMMUNICATION_SUCCESS, payload: undefined },
      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },

      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },
    ];

    const store = mockStore(initState());

    // @ts-ignore
    await store.dispatch(actions.deleteDocument(uuid));
    expect(store.getActions()).toEqual(expectedActions);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.delete).toHaveBeenCalledWith(
      `${BackendUrl}/documents/${uuid}`
    );
  });

  it('addDocument', async () => {
    const responseData = [{ name: 'My Document', uuid: '1234' }];

    // @ts-ignore
    mockAxios.get.mockImplementation(() =>
      Promise.resolve({
        data: responseData,
      })
    );

    const expectedActions = [
      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },

      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      { type: actionTypes.COMMUNICATION_SUCCESS, payload: undefined },
      {
        type: actionTypes.ADD_DOCUMENTS_FROM_SERVER,
        payload: { availableDocuments: responseData },
      },
      { type: actionTypes.COMMUNICATION_SUCCESS, payload: undefined },
      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },

      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },
    ];

    const store = mockStore(initState());

    // @ts-ignore
    await store.dispatch(actions.addDocument(fakeFisaDoc()));

    expect(store.getActions()).toEqual(expectedActions);
    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(mockAxios.post).toHaveBeenCalledWith(
      `${BackendUrl}/documents/`,
      JSON.stringify(fakeFisaDoc()),
      { headers: { 'Content-Type': 'application/json' } }
    );
  });

  it('addProject', async () => {
    const expectedActions = [
      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      { type: actionTypes.COMMUNICATION_SUCCESS, payload: undefined },

      { type: actionTypes.PROJECT_SAVED, payload: undefined },
      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },
    ];

    const store = mockStore(initState());
    const project = {
      something: 'irrelevant',
    };

    // @ts-ignore
    await store.dispatch(actions.addProject(project));

    expect(store.getActions()).toEqual(expectedActions);
    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(mockAxios.post).toHaveBeenCalledWith(
      `${BackendUrl}/projects/`,
      JSON.stringify(project),
      { headers: { 'Content-Type': 'application/json' } }
    );
  });

  it('updateProject', async () => {
    const expectedActions = [
      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      { type: actionTypes.COMMUNICATION_SUCCESS, payload: undefined },

      { type: actionTypes.PROJECT_SAVED, payload: undefined },
      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },
    ];

    const store = mockStore(initState());
    const project = {
      something: 'irrelevant',
    };

    // @ts-ignore
    await store.dispatch(actions.updateProject(project));
    expect(store.getActions()).toEqual(expectedActions);
    expect(mockAxios.put).toHaveBeenCalledTimes(1);
    expect(mockAxios.put).toHaveBeenCalledWith(
      `${BackendUrl}/projects/`,
      JSON.stringify(project),
      { headers: { 'Content-Type': 'application/json' } }
    );
  });

  it('uploadProjectToFrost', async () => {
    const frostUrl = 'https://frost-server.de';
    const datastreamConnectionData = [{ id: 1, name: 'Room' }];
    const updatedObjects = [{ id: 1, frostId: 1 }];

    // @ts-ignore
    mockAxios.post.mockImplementation(() =>
      Promise.resolve({
        data: { updatedObjects, datastreamConnectionData },
      })
    );

    const expectedActions = [
      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      { type: actionTypes.COMMUNICATION_SUCCESS, payload: undefined },
      {
        type: actionTypes.SET_FROST_IDS_OF_OBJECTS,
        payload: { fisaObjects: updatedObjects },
      },
      {
        type: actionTypes.ADD_DATASTREAM_DATA,
        payload: { data: datastreamConnectionData },
      },
      { type: actionTypes.SET_FROST_URL, payload: { frostUrl } },
      { type: actionTypes.CLEAR_REMOVED_OBJECTS, payload: undefined },
      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },
    ];

    const store = mockStore(initState());
    const project = {
      something: 'irrelevant',
    };

    // @ts-ignore
    await store.dispatch(actions.uploadProjectToFrost(project, frostUrl));
    expect(store.getActions()).toEqual(expectedActions);
    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(
      mockAxios.post
    ).toHaveBeenCalledWith(
      `${BackendUrl}/frostServer/upload/?url=https%3A%2F%2Ffrost-server.de`,
      JSON.stringify(project),
      { headers: { 'Content-Type': 'application/json' } }
    );
  });

  it('deleteProjectFromBackend', async () => {
    const uuid = '1234';

    const responseData = [{ name: 'My Document', uuid: '1234' }];
    // @ts-ignore
    mockAxios.get.mockImplementation(() =>
      Promise.resolve({
        data: responseData,
      })
    );

    const expectedActions = [
      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      { type: actionTypes.COMMUNICATION_SUCCESS, payload: undefined },

      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      {
        type: actionTypes.ADD_PROJECTS_FROM_SERVER,
        payload: { availableProjects: responseData },
      },
      { type: actionTypes.COMMUNICATION_SUCCESS, payload: undefined },
      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },

      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },
    ];

    const store = mockStore(initState());

    // @ts-ignore
    await store.dispatch(actions.deleteProjectFromBackend(uuid));

    expect(store.getActions()).toEqual(expectedActions);
    expect(mockAxios.delete).toHaveBeenCalledTimes(1);
    expect(mockAxios.delete).toHaveBeenCalledWith(
      `${BackendUrl}/projects/${uuid}`
    );
  });

  it('deleteProjectFromBackendAndServer', async () => {
    const uuid = '1234';

    const responseData = [{ name: 'My Document', uuid: '1234' }];
    // @ts-ignore
    mockAxios.get.mockImplementation(() =>
      Promise.resolve({
        data: responseData,
      })
    );

    const expectedActions = [
      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      { type: actionTypes.COMMUNICATION_SUCCESS, payload: undefined },

      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      {
        type: actionTypes.ADD_PROJECTS_FROM_SERVER,
        payload: { availableProjects: responseData },
      },
      { type: actionTypes.COMMUNICATION_SUCCESS, payload: undefined },
      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },

      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },
    ];

    const store = mockStore(initState());

    // @ts-ignore
    await store.dispatch(actions.deleteProjectFromBackendAndServer(uuid));

    expect(store.getActions()).toEqual(expectedActions);
    expect(mockAxios.delete).toHaveBeenCalledTimes(1);
    expect(mockAxios.delete).toHaveBeenCalledWith(
      `${BackendUrl}/frostServer/${uuid}`
    );
  });

  it('fetchProject', async () => {
    const uuid = '1234';

    const responseData = fakeFisaDoc();
    // @ts-ignore
    mockAxios.get.mockImplementation(() =>
      Promise.resolve({
        data: responseData,
      })
    );

    const expectedActions = [
      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      {
        type: actionTypes.LOAD_PROJECT_FROM_FISA,
        payload: { document: fakeFisaDoc() },
      },
      {
        type: actionTypes.COMMUNICATION_SUCCESS,
        payload: undefined,
      },

      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },
    ];

    const store = mockStore(initState());

    // @ts-ignore
    await store.dispatch(actions.fetchProject(uuid));

    expect(store.getActions()).toEqual(expectedActions);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(
      `${BackendUrl}/documents/${uuid}`
    );
  });

  it('updateProjectOnFrost', async () => {
    const responseData = {
      datastreamConnectionData: [{ name: 'Datastream', id: '1234' }],
      updatedObjects: testState().fisaProject.objects.active
    };
    // @ts-ignore
    mockAxios.put.mockImplementation(() =>
      Promise.resolve({ data: responseData })
    );

    const expectedActions = [
      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      { type: actionTypes.COMMUNICATION_SUCCESS, payload: undefined },

      {
        type: actionTypes.SET_FROST_IDS_OF_OBJECTS, payload: {
          fisaObjects: responseData.updatedObjects
        }
      },
      {
        type: actionTypes.ADD_DATASTREAM_DATA, payload: {
          data: responseData.datastreamConnectionData
        }
      },
      { type: actionTypes.CLEAR_REMOVED_OBJECTS, payload: undefined },
      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },
    ];

    const store = mockStore(initState());
    const project = {
      something: 'irrelevant',
    };

    // @ts-ignore
    await store.dispatch(actions.updateProjectOnFrost(project));
    expect(store.getActions()).toEqual(expectedActions);
    expect(mockAxios.put).toHaveBeenCalledTimes(1);
    expect(mockAxios.put).toHaveBeenCalledWith(
      `${BackendUrl}/frostServer/update/`,
      JSON.stringify(project),
      { headers: { 'Content-Type': 'application/json' } }
    );
  });

});

describe('axios tests error', () => {
  const error = {
    message: 'there was an error',
    response: {
      data: 'there was an error',
    },
    name: 'error',
  };
  const errorMessage = {
    name: error.name,
    message: error.message,
    longMessage: error.message,
    rawMessage: JSON.stringify(error.response, null, 2),
    code: undefined,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-ignore
    mockAxios.get.mockImplementation(() => Promise.reject(error));
    // @ts-ignore
    mockAxios.put.mockImplementation(() => Promise.reject(error));
    // @ts-ignore
    mockAxios.post.mockImplementation(() => Promise.reject(error));
    // @ts-ignore
    mockAxios.delete.mockImplementation(() => Promise.reject(error));
  });

  it('loadProjectFromServer', async () => {
    const uuid = '1234';

    const expectedActions = [
      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      { type: actionTypes.SET_ERROR_MESSAGE, payload: { error: errorMessage } },
      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },
    ];

    const store = mockStore(initState());

    // @ts-ignore
    await store.dispatch(actions.loadProjectFromServer(uuid));

    expect(store.getActions()).toEqual(expectedActions);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(
      `${BackendUrl}/projects/${uuid}`
    );
  });

  it('fetchAvailableProjects', async () => {
    const expectedActions = [
      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      { type: actionTypes.SET_ERROR_MESSAGE, payload: { error: errorMessage } },
      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },
    ];

    const store = mockStore(initState());

    // @ts-ignore
    await store.dispatch(actions.fetchAvailableProjects());

    expect(store.getActions()).toEqual(expectedActions);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(`${BackendUrl}/projects/`);
  });

  it('fetchAvailableDocuments', async () => {
    const expectedActions = [
      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      { type: actionTypes.SET_ERROR_MESSAGE, payload: { error: errorMessage } },
      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },
    ];

    const store = mockStore(initState());

    // @ts-ignore
    await store.dispatch(actions.fetchAvailableDocuments());
    expect(store.getActions()).toEqual(expectedActions);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(`${BackendUrl}/documents/`);
  });

  it('deleteDocument', async () => {
    const uuid = '1234';

    const expectedActions = [
      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      { type: actionTypes.SET_ERROR_MESSAGE, payload: { error: errorMessage } },
      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },
    ];

    const store = mockStore(initState());

    // @ts-ignore
    await store.dispatch(actions.deleteDocument(uuid));
    expect(store.getActions()).toEqual(expectedActions);
    expect(mockAxios.delete).toHaveBeenCalledTimes(1);
    expect(mockAxios.delete).toHaveBeenCalledWith(
      `${BackendUrl}/documents/${uuid}`
    );
  });

  it('addDocument', async () => {
    const expectedActions = [
      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      { type: actionTypes.SET_ERROR_MESSAGE, payload: { error: errorMessage } },
      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },
    ];

    const store = mockStore(initState());

    // @ts-ignore
    await store.dispatch(actions.addDocument(fakeFisaDoc()));

    expect(store.getActions()).toEqual(expectedActions);
    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(mockAxios.post).toHaveBeenCalledWith(
      `${BackendUrl}/documents/`,
      JSON.stringify(fakeFisaDoc()),
      { headers: { 'Content-Type': 'application/json' } }
    );
  });

  it('addProject', async () => {
    const expectedActions = [
      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      { type: actionTypes.SET_ERROR_MESSAGE, payload: { error: errorMessage } },
      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },
    ];

    const store = mockStore(initState());
    const project = {
      something: 'irrelevant',
    };

    // @ts-ignore
    await store.dispatch(actions.addProject(project));

    expect(store.getActions()).toEqual(expectedActions);
    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(mockAxios.post).toHaveBeenCalledWith(
      `${BackendUrl}/projects/`,
      JSON.stringify(project),
      { headers: { 'Content-Type': 'application/json' } }
    );
  });

  it('updateProject', async () => {
    const expectedActions = [
      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      { type: actionTypes.SET_ERROR_MESSAGE, payload: { error: errorMessage } },
      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },
    ];

    const store = mockStore(initState());
    const project = {
      something: 'irrelevant',
    };

    // @ts-ignore
    await store.dispatch(actions.updateProject(project));
    expect(store.getActions()).toEqual(expectedActions);
    expect(mockAxios.put).toHaveBeenCalledTimes(1);
    expect(mockAxios.put).toHaveBeenCalledWith(
      `${BackendUrl}/projects/`,
      JSON.stringify(project),
      { headers: { 'Content-Type': 'application/json' } }
    );
  });

  it('uploadProjectToFrost', async () => {
    const frostUri = 'https://frost-server.de';

    const expectedActions = [
      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      { type: actionTypes.SET_ERROR_MESSAGE, payload: { error: errorMessage } },
      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },
    ];

    const store = mockStore(initState());
    const project = {
      something: 'irrelevant',
    };

    // @ts-ignore
    await store.dispatch(actions.uploadProjectToFrost(project, frostUri));
    expect(store.getActions()).toEqual(expectedActions);
    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(
      mockAxios.post
    ).toHaveBeenCalledWith(
      `${BackendUrl}/frostServer/upload/?url=https%3A%2F%2Ffrost-server.de`,
      JSON.stringify(project),
      { headers: { 'Content-Type': 'application/json' } }
    );
  });

  it('updateProjectOnFrost', async () => {

    const expectedActions = [
      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      { type: actionTypes.SET_ERROR_MESSAGE, payload: { error: errorMessage } },
      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },
    ];

    const store = mockStore(initState());
    const project = {
      something: 'irrelevant',
    };

    // @ts-ignore
    await store.dispatch(actions.updateProjectOnFrost(project));
    expect(store.getActions()).toEqual(expectedActions);
    expect(mockAxios.put).toHaveBeenCalledTimes(1);
    expect(
      mockAxios.put
    ).toHaveBeenCalledWith(
      `${BackendUrl}/frostServer/update/`,
      JSON.stringify(project),
      { headers: { 'Content-Type': 'application/json' } }
    );
  });

  it('deleteProjectFromBackend', async () => {
    const uuid = '1234';

    const expectedActions = [
      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      { type: actionTypes.SET_ERROR_MESSAGE, payload: { error: errorMessage } },
      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },
    ];

    const store = mockStore(initState());

    // @ts-ignore
    await store.dispatch(actions.deleteProjectFromBackend(uuid));

    expect(store.getActions()).toEqual(expectedActions);
    expect(mockAxios.delete).toHaveBeenCalledTimes(1);
    expect(mockAxios.delete).toHaveBeenCalledWith(
      `${BackendUrl}/projects/${uuid}`
    );
  });

  it('deleteProjectFromBackendAndFrost', async () => {
    const uuid = '1234';

    const expectedActions = [
      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      { type: actionTypes.SET_ERROR_MESSAGE, payload: { error: errorMessage } },
      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },
    ];

    const store = mockStore(initState());

    // @ts-ignore
    await store.dispatch(actions.deleteProjectFromBackendAndServer(uuid));

    expect(store.getActions()).toEqual(expectedActions);
    expect(mockAxios.delete).toHaveBeenCalledTimes(1);
    expect(mockAxios.delete).toHaveBeenCalledWith(
      `${BackendUrl}/frostServer/${uuid}`
    );
  });

  it('fetchProject', async () => {
    const uuid = '1234';

    const expectedActions = [
      { type: actionTypes.COMMUNICATION_PENDING, payload: undefined },
      { type: actionTypes.SET_ERROR_MESSAGE, payload: { error: errorMessage } },
      { type: actionTypes.STOP_COMMUNICATION_PENDING, payload: undefined },
    ];

    const store = mockStore(initState());

    // @ts-ignore
    await store.dispatch(actions.fetchProject(uuid));

    expect(store.getActions()).toEqual(expectedActions);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(
      `${BackendUrl}/documents/${uuid}`
    );
  });
});

describe('loadFromPc', () => {
  it('test to load from the PC', async () => {
    const expectedActions = [
      {
        type: actionTypes.LOAD_SAVED_PROJECT,
        payload: { project: fakeFisaDoc() },
      },
    ];

    const store = mockStore(initState());

    // @ts-ignore
    await store.dispatch(actions.loadFromPC(fakeFisaDoc()));

    expect(store.getActions()).toEqual(expectedActions);
  });
});
