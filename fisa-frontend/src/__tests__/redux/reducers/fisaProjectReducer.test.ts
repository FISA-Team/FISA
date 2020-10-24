import * as actionTypes from '../../../redux/actionTypes';
import fisaProjectReducer from '../../../redux/reducers/fisaProjectReducer';
import { fakeFisaDoc } from '../mockups/fakeFisaDoc';
import {
  testState,
  baseState,
  initState,
  emptyProjectState,
} from '../mockups/testState';
import {
  CONNECTED_FROST_URL,
  CONSTANT_PARTS,
  FISA_OBJECTS,
  LATEST_ID,
} from '../../../variables/variables';
import { fisaProject } from '../mockups/fakeFisaProject';
import { ProjectStateI, FrontendReduxStateI } from '../../../redux/interfaces';
import { csvData } from '../mockups/csvData';

describe('fetchProject', () => {
  it('This test simulates fetching of a project', () => {
    const action = {
      type: actionTypes.LOAD_PROJECT_FROM_FISA,
      payload: {
        document: fakeFisaDoc(),
      },
    };
    const expected = {
      ...baseState().fisaProject,
      objects: {
        active: baseState().fisaProject.objects.active.map((object) => {
          if (object.id === 0) {
            return {
              ...object,
              definitionName: '',
            };
          }
          return object;
        }),
        removed: []
      },
      constantParts: {
        ...baseState().fisaProject.constantParts,
        objectDefinitions: baseState().fisaProject.constantParts.objectDefinitions.map(
          (template) => {
            if (template.name === 'Mein Projekt') {
              return {
                ...template,
                name: '',
              };
            }
            return template;
          }
        ),
        fisaProjectName: '',
      },
    };

    expect(fisaProjectReducer(undefined, action)).toEqual(expected);
  });
});

describe('newObjectFromTemplate', () => {
  it('tests to add a new Object from a template', () => {
    const definitionName = 'Raum';

    const action = {
      type: actionTypes.NEW_OBJECT_FROM_OBJECT_DEFINITION,
      payload: {
        definitionName,
      },
    };

    const expected = {
      ...baseState().fisaProject,
      latestId: 7,
      objects: {
        active: [
          ...baseState().fisaProject.objects.active.map((object) => {
            if (object.id === 0) {
              return {
                ...object,
                children: [...object.children, { id: 7, isLinked: false }],
              };
            }
            return object;
          }),
          {
            id: 7,
            parent: 0,
            definitionName: 'Raum',
            isNotReusable: false,
            attributes: [
              {
                definitionName: 'Name',
                ogcType: 'Thing.name',
                valueType: 'string',
                validationRule: '([A-Z][a-z])+',
                value: '',
                isName: true,
                infoText: 'Der Name des Raums',
              },
              {
                definitionName: 'Beschreibung',
                ogcType: 'Thing.description',
                infoText: 'Weitere Informationen',
                valueType: 'string',
                value: '',
                isName: false,
              },
            ],
            children: [],
          },
        ],
        removed: []
      },
      undoHistory: [
        {
          activeObject: baseState().fisaProject.activeObject,
          objects: baseState().fisaProject.objects,
        },
      ],
    };
    expect(fisaProjectReducer(baseState().fisaProject, action)).toEqual(
      expected
    );
  });
});

describe('addObjectFromExisting', () => {
  it('add a new Object from an existing one', () => {
    const action = {
      type: actionTypes.ADD_OBJECT_FROM_EXISTING,
      payload: {
        objectId: 3,
      },
    };

    const state = () => ({
      ...testState().fisaProject,
      activeObject: 7,
    });

    const expected = {
      ...state(),
      latestId: 8,
      objects: {
        active: [
          ...state().objects.active.map((object) => {
            if (object.id === 7) {
              return {
                ...object,
                children: [...object.children, { id: 8, isLinked: false }],
              };
            }
            return object;
          }),
          ...state()
            .objects.active.filter((object) => object.id === 3)
            .map((object) => {
              return {
                ...object,
                id: 8,
                parent: 7,
                children: [],
              };
            }),
        ],
        removed: [],
      },
      undoHistory: [
        {
          activeObject: state().activeObject,
          objects: state().objects,
        },
      ],
    };

    expect(fisaProjectReducer(state(), action)).toEqual(expected);
  });
});

describe('goToObject', () => {
  it('change active object to object 2', () => {
    const action = {
      type: actionTypes.GO_TO_OBJECT,
      payload: {
        objectId: 2,
      },
    };
    const expected = {
      ...testState().fisaProject,
      activeObject: 2,
      undoHistory: [
        {
          activeObject: testState().fisaProject.activeObject,
          objects: testState().fisaProject.objects,
        },
      ],
    };
    expect(fisaProjectReducer(testState().fisaProject, action)).toEqual(
      expected
    );
  });
  it('change active object to parent object of 3 because object 3 cant have children', () => {
    const action = {
      type: actionTypes.GO_TO_OBJECT,
      payload: {
        objectId: 3,
      },
    };
    const expected = {
      ...testState().fisaProject,
      activeObject: 1,
      undoHistory: [
        {
          activeObject: testState().fisaProject.activeObject,
          objects: testState().fisaProject.objects,
        },
      ],
    };
    expect(fisaProjectReducer(testState().fisaProject, action)).toEqual(
      expected
    );
  });
});

describe('removeObject', () => {
  it('deletes the object with id 1 from the testState', () => {
    const action = {
      type: actionTypes.REMOVE_OBJECT,
      payload: {
        objectId: 1,
      },
    };

    const expected = {
      ...baseState().fisaProject,
      objects:
      {
        active: [
          {
            ...baseState().fisaProject.objects.active.find((object) => object.id === 0),
            children: [],
          },
        ],
        removed: [],
      },
      undoHistory: [
        {
          activeObject: baseState().fisaProject.activeObject,
          objects: baseState().fisaProject.objects,
        },
      ],
    };

    expect(fisaProjectReducer(baseState().fisaProject, action)).toEqual(
      expected
    );
  });
  it('remove a linked Object', () => {
    const action = {
      type: actionTypes.REMOVE_OBJECT,
      payload: {
        objectId: 3,
      },
    };

    const modifiedTestSuit = { ...testState().fisaProject, activeObject: 7 };

    const expected = {
      ...modifiedTestSuit,
      objects: {

        active: modifiedTestSuit.objects.active.map((object) => {
          if (object.id === 7) {
            return {
              ...object,
              children: [],
            };
          }
          return object;
        }),
        removed: [],
      },
      undoHistory: [
        {
          activeObject: modifiedTestSuit.activeObject,
          objects: modifiedTestSuit.objects,
        },
      ],
    };
    expect(fisaProjectReducer(modifiedTestSuit, action)).toEqual(expected);
  });
});

describe('linkObject', () => {
  it('tests to link the object witch already exists', () => {
    const action = {
      type: actionTypes.LINK_OBJECT,
      payload: {
        objectId: 1,
      },
    };
    const expected = testState().fisaProject;
    expect(fisaProjectReducer(testState().fisaProject, action)).toEqual(
      expected
    );
  });
  it('tests to link Datastream from room1 to room2', () => {
    const action = {
      type: actionTypes.LINK_OBJECT,
      payload: {
        objectId: 2,
      },
    };

    const expected = {
      ...testState().fisaProject,
      activeObject: 7,
      objects: {
        active: testState().fisaProject.objects.active.map((object) => {
          if (object.id === 7) {
            return {
              ...object,
              children: [...object.children, { id: 2, isLinked: true }],
            };
          }
          return object;
        }),
        removed: [],
      },
      undoHistory: [
        {
          activeObject: 7,
          objects: testState().fisaProject.objects,
        },
      ],
    };
    const toAdd = { ...testState().fisaProject, activeObject: 7 };

    expect(fisaProjectReducer(toAdd, action)).toEqual(expected);
  });
});

describe('undo', () => {
  it('tests undo changed activeObject', () => {
    const customState = {
      ...testState().fisaProject,
      activeObject: 6,
      undoHistory: [
        {
          objects: testState().fisaProject.objects,
          activeObject: testState().fisaProject.activeObject,
        },
      ],
    };
    const expected = {
      ...testState().fisaProject,
      activeObject: 0,
      redoHistory: [
        {
          objects: testState().fisaProject.objects,
          activeObject: 6,
        },
      ],
    };
    const action = {
      type: actionTypes.UNDO,
      payload: undefined,
    };
    expect(fisaProjectReducer(customState, action)).toEqual(expected);
  });
  it('tests undo without undo history', () => {
    const action = {
      type: actionTypes.UNDO,
      payload: undefined,
    };
    expect(fisaProjectReducer(testState().fisaProject, action)).toEqual(
      testState().fisaProject
    );
  });
});

describe('redo', () => {
  it('tests redo changed activeObject', () => {
    const customState = {
      ...testState().fisaProject,
      activeObject: 6,
      redoHistory: [
        {
          objects: testState().fisaProject.objects,
          activeObject: testState().fisaProject.activeObject,
        },
      ],
    };
    const expected = {
      ...testState().fisaProject,
      activeObject: 0,
      undoHistory: [
        {
          objects: testState().fisaProject.objects,
          activeObject: 6,
        },
      ],
    };
    const action = {
      type: actionTypes.REDO,
      payload: undefined,
    };
    expect(fisaProjectReducer(customState, action)).toEqual(expected);
  });
  it('tests redo without redo history', () => {
    const action = {
      type: actionTypes.REDO,
      payload: undefined,
    };
    expect(fisaProjectReducer(testState().fisaProject, action)).toEqual(
      testState().fisaProject
    );
  });
});

describe('loadAutoSave', () => {
  const action = {
    type: actionTypes.LOAD_AUTO_SAVE,
    payload: undefined,
  };
  it('tests to load from autosave', () => {
    localStorage.setItem(
      CONSTANT_PARTS,
      JSON.stringify(testState().fisaProject.constantParts)
    );
    localStorage.setItem(
      FISA_OBJECTS,
      JSON.stringify(testState().fisaProject.objects)
    );
    localStorage.setItem(
      LATEST_ID,
      JSON.stringify(testState().fisaProject.latestId)
    );
    localStorage.setItem(CONNECTED_FROST_URL, JSON.stringify(''));
    expect(fisaProjectReducer(emptyProjectState, action)).toEqual(
      testState().fisaProject
    );
    localStorage.clear();
  });
  it('tests load from empty autosave', () => {
    localStorage.clear();

    expect(fisaProjectReducer(undefined, action)).toEqual(emptyProjectState);
  });
});

describe('setFetchProjectName', () => {
  it('tests setting fetchProjectName', () => {
    const action = {
      type: actionTypes.SET_FETCH_PROJECT_NAME,
      payload: {
        name: 'Hallo',
      },
    };

    const expected: ProjectStateI = {
      connectedFrostServer: undefined,
      csvExtractionError: undefined,
      activeObject: 0,
      latestId: 0,
      objects: {
        active: [],
        removed: []
      },
      constantParts: {
        objectDefinitions: [],
        fisaDocumentName: '',
        fisaProjectName: 'Hallo',
      },
      undoHistory: [],
      redoHistory: [],
    };
    expect(fisaProjectReducer(emptyProjectState, action)).toEqual(expected);
  });
});

describe('resetState', () => {
  it('tests resetting of the state', () => {
    const action = {
      type: actionTypes.RESET_STATE,
      payload: undefined,
    };

    expect(fisaProjectReducer(testState().fisaProject, action)).toEqual(
      emptyProjectState
    );
  });
});

describe('noChanges', () => {
  it('tests no changes by other actions', () => {
    const action = {
      type: actionTypes.COMMUNICATION_PENDING,
      payload: undefined,
    };
    expect(fisaProjectReducer(testState().fisaProject, action)).toEqual(
      testState().fisaProject
    );
  });
});

describe('loadSavedProject', () => {
  it('tests to load a saved Project', () => {
    const action = {
      type: actionTypes.LOAD_SAVED_PROJECT,
      payload: {
        project: fisaProject(),
      },
    };
    expect(fisaProjectReducer(initState().fisaProject, action)).toEqual(
      baseState().fisaProject
    );
  });
});

describe('changeObjectValue', () => {
  it('tests change name of room with id 7 in Ein Raum', () => {
    const action = {
      type: actionTypes.CHANGE_OBJECT_VALUE,
      payload: {
        objectId: 7,
        key: 'Name',
        value: 'Ein Raum',
      },
    };

    const expected = {
      ...testState().fisaProject,
      objects: {
        active: testState().fisaProject.objects.active.map((object) => {
          if (object.id === 7) {
            return {
              ...object,
              attributes: object.attributes.map((attribute) => {
                if (attribute.definitionName === 'Name') {
                  return {
                    ...attribute,
                    value: 'Ein Raum',
                  };
                }
                return attribute;
              }),
            };
          }
          return object;
        }),
        removed: [],
      },
      undoHistory: [
        {
          activeObject: testState().fisaProject.activeObject,
          objects: testState().fisaProject.objects,
        },
      ],
    };
    expect(fisaProjectReducer(testState().fisaProject, action)).toEqual(
      expected
    );
  });
});

describe('extractFromCSV', () => {
  it('tests to extract Rooms from a CSV', () => {
    const action = {
      type: actionTypes.EXTRACT_FROM_CSV,
      payload: {
        csv: csvData,
        definitionName: 'Raum',
      },
    };
    const baseObject = baseState().fisaProject.objects.active.find(
      (object) => object.definitionName === 'Raum'
    );
    const lastId = baseState().fisaProject.latestId;
    const expectedOutput = {
      ...baseState().fisaProject,
      latestId: 8,

      undoHistory: [
        {
          activeObject: baseState().fisaProject.activeObject,
          objects: baseState().fisaProject.objects,
        },
      ],
      objects: {
        active: [
          ...baseState().fisaProject.objects.active.map((object) => {
            if (object.id === 0) {
              return {
                ...object,
                children: [
                  ...object.children,
                  { id: lastId + 1, isLinked: false },
                  { id: lastId + 2, isLinked: false },
                ],
              };
            }
            return object;
          }),
          {
            ...baseObject,
            isNotReusable: false,
            attributes: baseObject?.attributes.map((attr) => {
              switch (attr.definitionName) {
                case 'Name':
                  return {
                    ...attr,
                    value: 'Wohnzimmer',
                  };
                case 'Beschreibung':
                  return {
                    ...attr,
                    value: 'Zimmer zum Wohnen',
                  };
                default:
                  return { ...attr };
              }
            }),
            id: lastId + 1,
            children: [],
          },
          {
            ...baseObject,
            isNotReusable: false,
            attributes: baseObject?.attributes.map((attr) => {
              switch (attr.definitionName) {
                case 'Name':
                  return {
                    ...attr,
                    value: 'Kinderzimmer',
                  };
                case 'Beschreibung':
                  return {
                    ...attr,
                    value: 'Zimmer fuer Kinder',
                  };
                default:
                  return { ...attr };
              }
            }),
            id: lastId + 2,
            children: [],
          },
        ],
        removed: []
      }
    };

    expect(fisaProjectReducer(baseState().fisaProject, action)).toEqual(
      expectedOutput
    );
  });
  it('tests to extract a wrong CSV', () => {
    const action = {
      type: actionTypes.EXTRACT_FROM_CSV,
      payload: {
        csv: 'Name;Hoehe\nMein Raum;7m',
        definitionName: 'Raum',
      },
    };

    const expected = {
      ...testState().fisaProject,
      csvExtractionError: {
        code: undefined,
        longMessage:
          'Attributes of "Raum": "Beschreibung",\nAttributes in CSV: "Name,Hoehe"',
        message: 'The attribute "Hoehe" does not exist in "Raum"',
        name: 'CSV Extraction Error',
      },
    };

    expect(fisaProjectReducer(testState().fisaProject, action)).toEqual(
      expected
    );
  });
});

describe('changeProjectName', () => {
  it('tests to change the Project name', () => {
    const newName = 'A new Name';
    const oldName = testState().fisaProject.constantParts.fisaProjectName;
    const action = {
      type: actionTypes.CHANGE_PROJECT_NAME,
      payload: {
        newName,
      },
    };
    const expectedOutput = {
      ...testState().fisaProject,
      objects: {
        active: testState().fisaProject.objects.active.map((object) => {
          if (object.definitionName === oldName) {
            return {
              ...object,
              definitionName: newName,
            };
          }
          return object;
        }),
        removed: [],
      },
      constantParts: {
        ...testState().fisaProject.constantParts,
        fisaProjectName: newName,
        objectDefinitions: testState().fisaProject.constantParts.objectDefinitions.map(
          (def) => {
            if (def.name === oldName) {
              return {
                ...def,
                name: newName,
              };
            }
            return def;
          }
        ),
      },
      undoHistory: createUndoHistory(testState()),
    };
    expect(fisaProjectReducer(testState().fisaProject, action)).toEqual(
      expectedOutput
    );
  });
});

function createUndoHistory(state: FrontendReduxStateI) {
  return [
    {
      activeObject: state.fisaProject.activeObject,
      objects: state.fisaProject.objects,
    },
  ];
}
