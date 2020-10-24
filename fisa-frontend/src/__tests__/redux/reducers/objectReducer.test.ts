import * as actionTypes from '../../../redux/actionTypes';
import objectReducer from '../../../redux/reducers/objectReducer';
import { fakeFisaDoc } from '../mockups/fakeFisaDoc';
import { testState, baseState } from '../mockups/testState';

const objectDefinitions = () =>
  baseState().fisaProject.constantParts.objectDefinitions;

const objectReducerTestState = () => testState().fisaProject.objects;

const objectReducerDefaultState = () => baseState().fisaProject.objects;

describe('fetchProject', () => {
  it('simulates fetching of a project', () => {
    const childDefinitions = fakeFisaDoc()
      .objectDefinitions.filter(
        (object) => object.isTopLayer && object.isTopLayer === true
      )
      .map((object) => ({ object: object.name, quantity: 0 }));

    const baseDefinition = {
      name: 'Mein Projekt',
      caption: 'Mein Projekt',
      attributes: [],
      children: childDefinitions,
      infoText: undefined,
      isTopLayer: undefined,
      isNotReusable: true,
      mapsTo: undefined,
      exampleData: undefined,
    };

    const action = {
      type: actionTypes.LOAD_PROJECT_FROM_FISA,
      payload: {
        definitions: fakeFisaDoc().objectDefinitions,
        objects: fakeFisaDoc().fisaTemplate,
        baseDefinition,
      },
    };
    const expected = objectReducerDefaultState();
    expect(objectReducer(baseState().fisaProject.objects, action)).toEqual(expected);
  });
});

describe('newObjectFromTemplate', () => {
  it('try to add a new Object from a template', () => {
    const objectDefinition = objectDefinitions().find(
      (oneTemplate) => oneTemplate.name === 'Raum'
    );

    const action = {
      type: actionTypes.NEW_OBJECT_FROM_OBJECT_DEFINITION,
      payload: {
        objectDefinition,
        objectToAddTo: 0,
        newId: 7,
      },
    };

    const expected = {
      ...objectReducerTestState(),
      active: [
        ...objectReducerTestState().active.map((object) => {
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
      ]
    }
    expect(objectReducer(objectReducerTestState(), action)).toEqual(expected);
  });

  it('add a new Object from an existing one', () => {
    const action = {
      type: actionTypes.ADD_OBJECT_FROM_EXISTING,
      payload: {
        toCloneFrom: 3,
        parent: 7,
        newId: 8,
      },
    };

    const expected = {
      ...objectReducerTestState(),
      active: [
        ...objectReducerTestState().active.map((object) => {
          if (object.id === 7) {
            return {
              ...object,
              children: [...object.children, { id: 8, isLinked: false }],
            };
          }
          return object;
        }),
        ...objectReducerTestState().active
          .filter((object) => object.id === 3)
          .map((object) => {
            return {
              ...object,
              id: 8,
              parent: 7,
              children: [],
            };
          }),
      ]
    }

    expect(objectReducer(objectReducerTestState(), action)).toEqual(expected);
  });
});

describe('addObjectFromExisting', () => {
  it('add a new Object from an existing one', () => {
    const action = {
      type: actionTypes.ADD_OBJECT_FROM_EXISTING,
      payload: {
        toCloneFrom: 3,
        parent: 7,
        newId: 8,
      },
    };

    const expected = {
      ...objectReducerTestState(),
      active: [
        ...objectReducerTestState().active.map((object) => {
          if (object.id === 7) {
            return {
              ...object,
              children: [...object.children, { id: 8, isLinked: false }],
            };
          }
          return object;
        }),
        ...objectReducerTestState().active
          .filter((object) => object.id === 3)
          .map((object) => {
            return {
              ...object,
              id: 8,
              parent: 7,
              children: [],
            };
          }),
      ]
    }

    expect(objectReducer(objectReducerTestState(), action)).toEqual(expected);
  });
});

describe('removeObject', () => {
  it('deletes the object with id 1 from the testState', () => {
    const action = {
      type: actionTypes.REMOVE_OBJECT,
      payload: {
        objectId: 1,
        removeFrom: 0,
      },
    };

    const expected = {
      ...objectReducerTestState(),
      active: [
        ...objectReducerTestState().active
          .filter((object) => object.id !== 1)
          .map((object) => {
            if (object.id === 0) {
              return {
                ...object,
                children: [{ id: 7, isLinked: false }],
              };
            }
            return object;
          }),
      ]
    }

    expect(objectReducer(objectReducerTestState(), action)).toEqual(expected);
  });
  it('remove a linked Object', () => {
    const action = {
      type: actionTypes.REMOVE_OBJECT,
      payload: {
        objectId: 3,
        removeFrom: 7,
      },
    };

    const expected = {
      ...objectReducerTestState(),
      active: [
        ...objectReducerTestState().active.map((object) => {
          if (object.id === 7) {
            return {
              ...object,
              children: [],
            };
          }
          return object;
        }),
      ]
    }
    expect(objectReducer(objectReducerTestState(), action)).toEqual(expected);
  });

  it('remove with linked children', () => {
    const toRemove = 7;
    const action = {
      type: actionTypes.REMOVE_OBJECT,
      payload: {
        objectId: toRemove,
        removeFrom: 0,
      },
    };
    const expected = {
      ...objectReducerTestState(),
      active: objectReducerTestState().active
        .filter((object) => object.id !== toRemove)
        .map((object) => {
          if (object.id === 0) {
            return {
              ...object,
              children: object.children.filter((child) => child.id !== toRemove),
            };
          }
          return object;
        })
    }
    expect(objectReducer(objectReducerTestState(), action)).toEqual(expected);
  });
});

describe('linkObject', () => {
  it('try to link the object witch already exists', () => {
    const action = {
      type: actionTypes.LINK_OBJECT,
      payload: {
        objectId: 1,
      },
    };
    const expected = objectReducerTestState();
    expect(objectReducer(objectReducerTestState(), action)).toEqual(expected);
  });
  it('try to link Datastream from room1 to room2', () => {
    const action = {
      type: actionTypes.LINK_OBJECT,
      payload: {
        objectId: 2,
        linkTo: 7,
      },
    };
    const expected = {
      ...objectReducerTestState(),
      active:
        objectReducerTestState().active.map((object) => {
          if (object.id === 7) {
            return {
              ...object,
              children: [...object.children, { id: 2, isLinked: true }],
            };
          }
          return object;
        })
    }
    expect(objectReducer(objectReducerTestState(), action)).toEqual(expected);
  });
});

describe('changeObjectValue', () => {
  it('Change name of room with id 7 in Ein Raum', () => {
    const action = {
      type: actionTypes.CHANGE_OBJECT_VALUE,
      payload: {
        objectId: 7,
        key: 'Name',
        value: 'Ein Raum',
      },
    };

    const expected = {
      ...objectReducerTestState(),
      active: objectReducerTestState().active.map((object) => {
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
      })
    }
    expect(objectReducer(objectReducerTestState(), action)).toEqual(expected);
  });
});

describe('changeProjectName', () => {
  it('tests changing of the Project name', () => {
    const newName = 'A new Name';
    const oldName = testState().fisaProject.constantParts.fisaProjectName;
    const action = {
      type: actionTypes.CHANGE_PROJECT_NAME,
      payload: {
        newName,
        oldName: 'Mein Projekt',
      },
    };
    const expectedOutput = {
      ...testState().fisaProject.objects,
      active:
        testState().fisaProject.objects.active.map((object) => {
          if (object.definitionName === oldName) {
            return {
              ...object,
              definitionName: newName,
            };
          }
          return object;
        })
    }
    expect(objectReducer(testState().fisaProject.objects, action)).toEqual(
      expectedOutput
    );
  });
});
