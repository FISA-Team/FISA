/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from 'redux';
import axios, { AxiosError } from 'axios';
import * as actionTypes from '../actionTypes';
import { BackendUrl } from '../../environment';
import {
  FisaProjectI,
  AvailableProjectI,
  AvailableFisaDocumentI,
  FisaDocumentI,
  ActionI,
  ErrorMessageI,
} from '../interfaces';

import {
  clearRemovedObjects,
  loadSavedProject,
  setConnectedFrostUrl,
  setFromBackend,
  setFrostIdsOfObjects,
} from './projectActions';
import { OVERRIDE_ERROR_CODE } from '../../variables/variables';
import { setSaved, setDatastreamConnectionData } from './pageActions';

export const loadProjectFromServer = (uuid: string) => (
  dispatch: Dispatch<ActionI>
) => {
  dispatch(setCommunicationPending());
  return axios
    .get(`${BackendUrl}/projects/${uuid}`)
    .then((response) => {
      dispatch(loadSavedProject(response.data));
      dispatch(setCommunicationSuccess());
    })
    .catch((error) => dispatch(setErrorToShow(createErrorMessage(error))))
    .finally(() => {
      dispatch(stopCommunicationPending());
    });
};

export const fetchAvailableProjects = () => (dispatch: Dispatch<ActionI>) => {
  dispatch(setCommunicationPending());
  return axios
    .get(`${BackendUrl}/projects/`)
    .then((response) => {
      dispatch(setAvailableProjects(response.data));
      dispatch(setCommunicationSuccess());
    })
    .catch((e: AxiosError<Error>) => {
      dispatch(setErrorToShow(createErrorMessage(e)));
    })
    .finally(() => {
      dispatch(stopCommunicationPending());
    });
};

const setAvailableProjects = (availableProjects: AvailableProjectI[]) => ({
  type: actionTypes.ADD_PROJECTS_FROM_SERVER,
  payload: {
    availableProjects,
  },
});

export const fetchAvailableDocuments = () => (dispatch: Dispatch<ActionI>) => {
  dispatch(setCommunicationPending());
  return axios
    .get(`${BackendUrl}/documents/`)
    .then((response) => {
      dispatch(setAvailableDocuments(response.data));
      dispatch(setCommunicationSuccess());
    })
    .catch((e) => dispatch(setErrorToShow(createErrorMessage(e))))
    .finally(() => {
      dispatch(stopCommunicationPending());
    });
};

const setAvailableDocuments = (
  availableDocuments: AvailableFisaDocumentI[]
) => ({
  type: actionTypes.ADD_DOCUMENTS_FROM_SERVER,
  payload: { availableDocuments },
});

export function deleteDocument(documentUUID: string) {
  return (dispatch: any) => {
    dispatch(setCommunicationPending());
    return axios
      .delete(`${BackendUrl}/documents/${documentUUID}`)
      .then((response) => {
        dispatch(fetchAvailableDocuments());
        dispatch(setCommunicationSuccess());
      })
      .catch((e) => dispatch(setErrorToShow(createErrorMessage(e))))
      .finally(() => {
        dispatch(stopCommunicationPending());
      });
  };
}

export const addDocument = (document: FisaDocumentI) => (dispatch: any) => {
  dispatch(setCommunicationPending());
  return axios
    .post(`${BackendUrl}/documents/`, JSON.stringify(document), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      dispatch(fetchAvailableDocuments());
      dispatch(setCommunicationSuccess());
    })
    .catch((e) => dispatch(setErrorToShow(createErrorMessage(e))))
    .finally(() => {
      dispatch(stopCommunicationPending());
    });
};

export const addProject = (project: FisaProjectI) => (
  dispatch: Dispatch<ActionI>
) => {
  dispatch(setCommunicationPending());
  return axios
    .post(`${BackendUrl}/projects/`, JSON.stringify(project), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(() => {
      dispatch(setCommunicationSuccess());
      dispatch(setSaved());
    })
    .catch((error) => {
      if (createErrorMessage(error).code === OVERRIDE_ERROR_CODE) {
        dispatch(setFromBackend());
      } else {
        dispatch(setErrorToShow(createErrorMessage(error)));
      }
    })
    .finally(() => dispatch(stopCommunicationPending()));
};

export const updateProject = (project: FisaProjectI) => (
  dispatch: Dispatch<ActionI>
) => {
  dispatch(setCommunicationPending());
  return axios
    .put(`${BackendUrl}/projects/`, JSON.stringify(project), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(() => {
      dispatch(setCommunicationSuccess());
      dispatch(setSaved());
    })
    .catch((e) => dispatch(setErrorToShow(createErrorMessage(e))))
    .finally(() => {
      dispatch(stopCommunicationPending());
    });
};

export const setChosenDocumentUuid = (uuid: string) => ({
  type: actionTypes.SET_CHOSEN_DOCUMENT_UUID,
  payload: { uuid },
});

export const setCommunicationPending = () => ({
  type: actionTypes.COMMUNICATION_PENDING,
  payload: undefined,
});

const setCommunicationSuccess = () => ({
  type: actionTypes.COMMUNICATION_SUCCESS,
  payload: undefined,
});

export const setErrorToShow = (error: ErrorMessageI) => ({
  type: actionTypes.SET_ERROR_MESSAGE,
  payload: {
    error,
  },
});

export const clearErrorMessage = () => ({
  type: actionTypes.CLEAR_ERROR_MESSAGE,
  payload: undefined,
});

const stopCommunicationPending = () => ({
  type: actionTypes.STOP_COMMUNICATION_PENDING,
  payload: undefined,
});

export const uploadProjectToFrost = (
  project: FisaProjectI,
  frostUrl: string
) => (dispatch: Dispatch<ActionI>) => {
  console.log("Upload now");

  dispatch(setCommunicationPending());
  const encodetUrl = encodeURIComponent(frostUrl);
  return axios
    .post(
      `${BackendUrl}/frostServer/upload/?url=${encodetUrl}`,
      JSON.stringify(project),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    .then((response) => {
      dispatch(setCommunicationSuccess());
      dispatch(setFrostIdsOfObjects(response.data.updatedObjects));
      dispatch(
        setDatastreamConnectionData(response.data.datastreamConnectionData)
      );
      dispatch(setConnectedFrostUrl(frostUrl));
      dispatch(clearRemovedObjects());
    })
    .catch((error) => {
      dispatch(setErrorToShow(createErrorMessage(error)));
    })
    .finally(() => {
      dispatch(stopCommunicationPending());
    });
};

export const updateProjectOnFrost = (
  project: FisaProjectI
) => (dispatch: Dispatch<ActionI>) => {
  dispatch(setCommunicationPending());
  return axios
    .put(
      `${BackendUrl}/frostServer/update/`,
      JSON.stringify(project),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    .then((response) => {
      dispatch(setCommunicationSuccess());
      dispatch(setFrostIdsOfObjects(response.data.updatedObjects));
      dispatch(
        setDatastreamConnectionData(response.data.datastreamConnectionData)
      );
      dispatch(clearRemovedObjects());
    })
    .catch((error) => {
      dispatch(setErrorToShow(createErrorMessage(error)));
    })
    .finally(() => {
      dispatch(stopCommunicationPending());
    });
};

export const deleteProjectFromBackend = (uuid: string) => (dispatch: any) => {
  dispatch(setCommunicationPending());
  return axios
    .delete(`${BackendUrl}/projects/${uuid}`)
    .then(() => {
      dispatch(setCommunicationSuccess());
      dispatch(fetchAvailableProjects());
    })
    .catch((e) => dispatch(setErrorToShow(createErrorMessage(e))))
    .finally(() => dispatch(stopCommunicationPending()));
};

export const loadProjectFromFisa = (document: FisaDocumentI) => {
  return {
    type: actionTypes.LOAD_PROJECT_FROM_FISA,
    payload: {
      document,
    },
  };
};

/**
 * This function fetches the initial data from the server
 */
export const fetchProject = (documentUuid: string) => (
  dispatch: Dispatch<ActionI>
) => {
  dispatch(setCommunicationPending());
  return axios
    .get(`${BackendUrl}/documents/${documentUuid}`)
    .then((data) => {
      dispatch(loadProjectFromFisa(data.data));
      dispatch(setCommunicationSuccess());
    })
    .catch((e) => {
      dispatch(setErrorToShow(createErrorMessage(e)));
    })
    .finally(() => dispatch(stopCommunicationPending()));
};

function createErrorMessage(error: AxiosError<Error>): ErrorMessageI {
  const { message } = error;

  // @ts-ignore
  const name = error.response?.data.error || error.name;

  const rMessage =
    (error.response && error.response.data.message) ||
    (error.response && ((error.response.data as unknown) as string));

  return {
    name,
    message: rMessage || message,
    longMessage: rMessage !== undefined ? message : undefined,
    rawMessage: error.response
      ? JSON.stringify(error.response, null, 2)
      : undefined,
    code: error.request?.status,
  };
}

export const loadFromPC = (project: FisaProjectI) => (
  dispatch: Dispatch<ActionI>
) => {
  // Check Document in backend
  dispatch(loadSavedProject(project));
};
