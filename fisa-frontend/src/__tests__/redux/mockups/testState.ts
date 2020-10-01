import { darkTheme, lightTheme } from '../../../themes';

import { ProjectStateI, FrontendReduxStateI } from '../../../redux/interfaces';
import { objectDefinitions } from './objectDefinitions';

export const emptyProjectState: ProjectStateI = {
  csvExtractionError: undefined,
  activeObject: 0,
  latestId: 0,
  objects: [],
  constantParts: {
    objectDefinitions: [],
    fisaDocumentName: '',
    fisaProjectName: '',
  },
  undoHistory: [],
  redoHistory: [],
};

export const testState: () => FrontendReduxStateI = () => ({
  fisaProject: {
    csvExtractionError: undefined,
    activeObject: 0,
    latestId: 7,
    objects: [
      {
        id: 0,
        definitionName: 'Mein Projekt',
        isNotReusable: true,
        parent: undefined,
        attributes: [],
        positionAttributes: undefined,
        children: [
          {
            id: 1,
            isLinked: false,
          },
          {
            id: 7,
            isLinked: false,
          },
        ],
      },
      {
        id: 1,
        definitionName: 'Raum',
        isNotReusable: undefined,
        positionAttributes: undefined,
        children: [
          {
            id: 2,
            isLinked: false,
          },
          {
            id: 3,
            isLinked: false,
          },
        ],
        attributes: [
          {
            definitionName: 'Name',
            ogcType: 'Thing.name',
            infoText: 'Der Name des Raums',
            valueType: 'string',
            validationRule: '([A-Z][a-z])+',
            value: 'Küche',
            isName: true,
            isPredefined: undefined,
            dropDownValues: undefined,
          },
          {
            definitionName: 'Beschreibung',
            ogcType: 'Thing.description',
            infoText: 'Weitere Informationen',
            valueType: 'string',
            value: 'Die Küche, in der alles gekocht wird',
            isName: false,
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
        ],
        parent: 0,
      },
      {
        id: 2,
        definitionName: 'Datenstrom',
        isNotReusable: true,
        positionAttributes: undefined,
        children: [
          {
            id: 5,
            isLinked: false,
          },
        ],
        attributes: [
          {
            definitionName: 'Name',
            ogcType: 'Datastream.name',
            infoText: 'Der Name des Datenstroms',
            valueType: 'string',
            validationRule: '([A-Z][a-z])+',
            value: 'Temperatur in der Küche',
            isName: true,
            isPredefined: undefined,
            dropDownValues: undefined,
          },
          {
            definitionName: 'Beschreibung',
            ogcType: 'Datastream.description',
            valueType: 'string',
            value: 'Die Temperatur in der Küche',
            isName: false,
            infoText: undefined,
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
          {
            definitionName: 'Beobachtungstyp',
            ogcType: 'Datastream.observationType',
            valueType: 'string',
            value:
              'http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement',
            isName: false,
            infoText: undefined,
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
        ],
        parent: 1,
      },
      {
        id: 3,
        definitionName: 'Ort',
        isNotReusable: undefined,
        positionAttributes: ['Breitengrad', 'Längengrad'],
        children: [],
        attributes: [
          {
            definitionName: 'Name',
            ogcType: 'Location.name',
            infoText: 'Name der Position',
            valueType: 'string',
            value: 'Erdgeschoss',
            isName: true,
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
          {
            definitionName: 'Beschreibung',
            ogcType: 'Location.description',
            valueType: 'string',
            value: 'Neben dem Wohnzimmer',
            isName: false,
            infoText: undefined,
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
          {
            definitionName: 'Längengrad',
            ogcType: 'Location.location[coordinates][0]',
            valueType: 'number',
            value: '38.0038',
            isName: false,
            infoText: 'Der Längengrad des Positionspunktes',
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
          {
            definitionName: 'Breitengrad',
            ogcType: 'Location.location[coordinates][1]',
            valueType: 'number',
            value: '7.0034353',
            isName: false,
            infoText: 'Der Breitengrad des Positionpunktes',
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
        ],
        parent: 1,
      },
      {
        id: 5,
        definitionName: 'Sensor',
        isNotReusable: undefined,
        positionAttributes: undefined,
        children: [
          {
            id: 6,
            isLinked: false,
          },
        ],
        attributes: [
          {
            definitionName: 'Name',
            ogcType: 'Sensor.name',
            infoText: 'Der Name des Sensors',
            valueType: 'string',
            value: 'Temperatursensor',
            isName: true,
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
          {
            definitionName: 'Beschreibung',
            ogcType: 'Sensor.description',
            infoText: 'Weitere Informationen',
            valueType: 'string',
            value: 'Temperatur in der Küche Sensor',
            isName: false,
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
          {
            definitionName: 'Metadaten',
            ogcType: 'Sensor.metadata',
            valueType: 'string',
            value:
              'https://www.sparkfun.com/datasheets/Sensors/Temperature/DHT22.pdf',
            isName: false,
            infoText: undefined,
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
        ],
        parent: 2,
      },
      {
        id: 6,
        definitionName: 'Sensortyp',
        isNotReusable: undefined,
        children: [],
        positionAttributes: undefined,
        attributes: [
          {
            definitionName: 'Name',
            ogcType: 'ObservedProperty.name',
            infoText: 'Die Spezifizierung des Sensortyps',
            valueType: 'string',
            value: 'Temperatur',
            isName: true,
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
          {
            definitionName: 'Beschreibung',
            ogcType: 'ObservedProperty.description',
            valueType: 'string',
            value: 'Die Temperatur in der Küche',
            isName: false,
            infoText: undefined,
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
          {
            definitionName: 'Definition',
            ogcType: 'ObservedProperty.definition',
            valueType: 'string',
            value:
              'http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html#ThermodynamicTemperature',
            isName: false,
            infoText: undefined,
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
        ],
        parent: 5,
      },
      {
        id: 7,
        parent: 0,
        definitionName: 'Raum',
        isNotReusable: undefined,
        positionAttributes: undefined,
        attributes: [
          {
            definitionName: 'Name',
            ogcType: 'Thing.name',
            valueType: 'string',
            infoText: 'Der Name des Raums',
            validationRule: '([A-Z][a-z])+',
            value: 'Die Beschreibung des Raumes',
            isName: false,
            isPredefined: undefined,
            dropDownValues: undefined,
          },
          {
            definitionName: 'Beschreibung',
            ogcType: 'Thing.description',
            infoText: 'Weitere Informationen',
            valueType: 'string',
            value: 'Die Beschreibung des Raumes',
            isName: false,
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
        ],
        children: [
          {
            id: 3,
            isLinked: true,
          },
        ],
      },
    ],
    constantParts: {
      objectDefinitions: objectDefinitions(),
      fisaDocumentName: 'SmartHome',
      fisaProjectName: 'Mein Projekt',
    },
    undoHistory: [],
    redoHistory: [],
  },
  projectPage: {
    dontShowObjectRemoveWarning: false,
    theme: darkTheme,
    themeName: 'darkTheme',
    notSaved: false,
    highlightedObject: -1,
    scrollingActive: false,
    projectExistsOnBackend: false,
  },
  availableFisaDocumentsProjects: {
    projectsFetched: false,
    projects: [],
    documentsFetched: false,
    documents: [],
    datastreamConnectData: undefined,
    chosenDocumentUuid: undefined,
  },
  serverCommunication: {
    active: false,
    pending: false,
    error: {
      name: 'Error',
      message: 'Not found',
      longMessage: undefined,
      rawMessage: undefined,
      code: 404,
    },
  },
});

export const baseState: () => FrontendReduxStateI = () => ({
  fisaProject: {
    csvExtractionError: undefined,
    activeObject: 0,
    latestId: 6,
    objects: [
      {
        id: 0,
        definitionName: 'Mein Projekt',
        isNotReusable: true,
        parent: undefined,
        attributes: [],
        positionAttributes: undefined,
        children: [
          {
            id: 1,
            isLinked: false,
          },
        ],
      },
      {
        id: 1,
        definitionName: 'Raum',
        isNotReusable: undefined,
        positionAttributes: undefined,
        children: [
          {
            id: 2,
            isLinked: false,
          },
          {
            id: 3,
            isLinked: false,
          },
        ],
        attributes: [
          {
            definitionName: 'Name',
            ogcType: 'Thing.name',
            infoText: 'Der Name des Raums',
            valueType: 'string',
            validationRule: '([A-Z][a-z])+',
            value: 'Küche',
            isName: true,
            isPredefined: undefined,
            dropDownValues: undefined,
          },
          {
            definitionName: 'Beschreibung',
            ogcType: 'Thing.description',
            infoText: 'Weitere Informationen',
            valueType: 'string',
            value: 'Die Küche, in der alles gekocht wird',
            isName: false,
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
        ],
        parent: 0,
      },
      {
        id: 2,
        definitionName: 'Datenstrom',
        isNotReusable: true,
        positionAttributes: undefined,
        children: [
          {
            id: 5,
            isLinked: false,
          },
          {
            id: 6,
            isLinked: false,
          },
        ],
        attributes: [
          {
            definitionName: 'Name',
            ogcType: 'Datastream.name',
            infoText: 'Der Name des Datenstroms',
            valueType: 'string',
            validationRule: '([A-Z][a-z])+',
            value: 'Temperatur in der Küche',
            isName: true,
            isPredefined: undefined,
            dropDownValues: undefined,
          },
          {
            definitionName: 'Beschreibung',
            ogcType: 'Datastream.description',
            valueType: 'string',
            value: 'Die Temperatur in der Küche',
            isName: false,
            infoText: undefined,
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
          {
            definitionName: 'Beobachtungstyp',
            ogcType: 'Datastream.observationType',
            valueType: 'string',
            value:
              'http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement',
            isName: false,
            infoText: undefined,
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
        ],
        parent: 1,
      },
      {
        id: 3,
        definitionName: 'Ort',
        isNotReusable: undefined,
        positionAttributes: ['Breitengrad', 'Längengrad'],
        children: [],
        attributes: [
          {
            definitionName: 'Name',
            ogcType: 'Location.name',
            infoText: 'Name der Position',
            valueType: 'string',
            value: 'Erdgeschoss',
            isName: true,
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
          {
            definitionName: 'Beschreibung',
            ogcType: 'Location.description',
            valueType: 'string',
            value: 'Neben dem Wohnzimmer',
            isName: false,
            infoText: undefined,
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
          {
            definitionName: 'Längengrad',
            ogcType: 'Location.location[coordinates][0]',
            valueType: 'number',
            value: '38.0038',
            infoText: 'Der Längengrad des Positionspunktes',
            isName: false,
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
          {
            definitionName: 'Breitengrad',
            ogcType: 'Location.location[coordinates][1]',
            valueType: 'number',
            value: '7.0034353',
            infoText: 'Der Breitengrad des Positionpunktes',
            isName: false,
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
        ],
        parent: 1,
      },
      {
        id: 5,
        definitionName: 'Sensor',
        isNotReusable: undefined,
        parent: 2,
        positionAttributes: undefined,
        attributes: [
          {
            definitionName: 'Name',
            ogcType: 'Sensor.name',
            infoText: 'Der Name des Sensors',
            valueType: 'string',
            value: 'Temperatursensor',
            isName: true,
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
          {
            definitionName: 'Beschreibung',
            ogcType: 'Sensor.description',
            infoText: 'Weitere Informationen',
            valueType: 'string',
            value: 'Temperatur in der Küche Sensor',
            isName: false,
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
          {
            definitionName: 'Metadaten',
            ogcType: 'Sensor.metadata',
            valueType: 'string',
            value:
              'https://www.sparkfun.com/datasheets/Sensors/Temperature/DHT22.pdf',
            isName: false,
            infoText: undefined,
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
        ],
        children: [],
      },
      {
        id: 6,
        definitionName: 'Sensortyp',
        isNotReusable: undefined,
        positionAttributes: undefined,
        children: [],
        attributes: [
          {
            definitionName: 'Name',
            ogcType: 'ObservedProperty.name',
            infoText: 'Die Spezifizierung des Sensortyps',
            valueType: 'string',
            value: 'Temperatur',
            isName: true,
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
          {
            definitionName: 'Beschreibung',
            ogcType: 'ObservedProperty.description',
            valueType: 'string',
            value: 'Die Temperatur in der Küche',
            isName: false,
            infoText: undefined,
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
          {
            definitionName: 'Definition',
            ogcType: 'ObservedProperty.definition',
            valueType: 'string',
            value:
              'http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html#ThermodynamicTemperature',
            isName: false,
            infoText: undefined,
            isPredefined: undefined,
            dropDownValues: undefined,
            validationRule: undefined,
          },
        ],
        parent: 2,
      },
    ],
    constantParts: {
      objectDefinitions: objectDefinitions(),
      fisaDocumentName: 'SmartHome',
      fisaProjectName: 'Mein Projekt',
    },
    undoHistory: [],
    redoHistory: [],
  },
  projectPage: {
    dontShowObjectRemoveWarning: false,
    theme: {
      '@global': {
        'html, body, #root': {
          height: '100%',
        },
      },
      palette: {
        type: 'light',
        secondary: {
          main: '#3f51b5',
        },
        background: {
          paper: '#f2f2f2',
          default: '#e6e6e6',
        },
      },
    },
    themeName: 'lightTheme',
    notSaved: false,
    highlightedObject: -1,
    scrollingActive: false,
    projectExistsOnBackend: false,
  },
  availableFisaDocumentsProjects: {
    projectsFetched: false,
    projects: [],
    documentsFetched: false,
    documents: [],
    datastreamConnectData: undefined,
    chosenDocumentUuid: undefined,
  },
  serverCommunication: {
    active: false,
    pending: false,
    error: undefined,
  },
});

export const initState: () => FrontendReduxStateI = () => ({
  fisaProject: emptyProjectState,
  projectPage: {
    dontShowObjectRemoveWarning: false,
    theme: lightTheme,
    themeName: 'lightTheme',
    notSaved: false,
    highlightedObject: -1,
    scrollingActive: false,
    projectExistsOnBackend: false,
  },
  availableFisaDocumentsProjects: {
    projectsFetched: false,
    projects: [],
    documentsFetched: false,
    documents: [],
    datastreamConnectData: undefined,
    chosenDocumentUuid: undefined,
  },
  serverCommunication: {
    active: false,
    pending: false,
    error: undefined,
  },
});

test('Fake Test', () => {
  expect(true).toBeTruthy();
});
