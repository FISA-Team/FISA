import * as selectors from '../../../redux/selectors/projectSelectors';
import { testState, baseState } from '../mockups/testState';
import { fakeFisaDoc } from '../mockups/fakeFisaDoc';
import { getFisaProjectFromState } from '../../../redux/selectors';

describe('getAllActiveTemplates', () => {
  it('get active templates from testState', () => {
    const expectedOutput = [
      {
        definitionName: 'Raum',
        caption: 'Räume',
        definitionInfoText: 'Ein Raum in dem sich Sensoren befinden.',
        definitionToAdd: true,
        objects: [
          {
            id: 1,
            parentId: 0,
            name: 'Küche',
            isClonable: true,
            isLinkable: false,
          },
        ],
      },
      {
        definitionName: 'Datenstrom',
        caption: 'Datenströme',
        definitionInfoText: undefined,
        definitionToAdd: false,
        objects: [
          {
            id: 2,
            parentId: 1,
            name: 'Temperatur in der Küche',
            isLinkable: false,
            isClonable: false,
          },
        ],
      },
      {
        definitionName: 'Ort',
        caption: 'Orte',
        definitionInfoText: undefined,
        definitionToAdd: false,
        objects: [
          {
            id: 3,
            parentId: 1,
            name: 'Erdgeschoss',
            isLinkable: false,
            isClonable: false,
          },
        ],
      },
      {
        definitionName: 'Sensor',
        caption: 'Sensoren',
        definitionInfoText: undefined,
        definitionToAdd: false,
        objects: [
          {
            id: 5,
            parentId: 2,
            name: 'Temperatursensor',
            isLinkable: false,
            isClonable: false,
          },
        ],
      },
      {
        definitionName: 'Sensortyp',
        caption: 'Sensortypen',
        definitionInfoText: undefined,
        definitionToAdd: false,
        objects: [
          {
            id: 6,
            parentId: 2,
            name: 'Temperatur',
            isLinkable: false,
            isClonable: false,
          },
        ],
      },
    ];

    expect(selectors.getAllActiveObjectBundles(baseState())).toEqual(
      expectedOutput
    );
  });
});

describe('getProjectTree', () => {
  it('get the project as tree', () => {
    const expected = {
      nodeIdList: [
        'NodeId0',
        'NodeId1',
        'NodeId2',
        'NodeId5',
        'NodeId6',
        'NodeId3',
      ],
      tree: {
        id: 0,
        name: 'Mein Projekt',
        isLinked: false,
        nodeId: 'NodeId0',
        children: [
          {
            id: 1,
            name: 'Küche',
            isLinked: false,
            nodeId: 'NodeId1',
            parentId: 0,
            children: [
              {
                id: 3,
                name: 'Erdgeschoss',
                isLinked: false,
                nodeId: 'NodeId3',
                parentId: 1,
              },
              {
                id: 2,
                isLinked: false,
                name: 'Temperatur in der Küche',
                nodeId: 'NodeId2',
                parentId: 1,
                children: [
                  {
                    children: undefined,
                    id: 6,
                    isLinked: false,
                    name: 'Temperatur',
                    nodeId: 'NodeId6',
                    parentId: 2,
                  },
                  {
                    id: 5,
                    isLinked: false,
                    name: 'Temperatursensor',
                    nodeId: 'NodeId5',
                    parentId: 2,
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    expect(selectors.getProjectTree(baseState())).toEqual(expected);
  });

  it('get the project as tree with linked', () => {
    const expected = {
      nodeIdList: [
        'NodeId0',
        'NodeId1',
        'NodeId2',
        'NodeId5',
        'NodeId6',
        'NodeId3',
        'NodeId7',
      ],
      tree: {
        id: 0,
        name: 'Mein Projekt',
        isLinked: false,
        nodeId: 'NodeId0',
        children: [
          {
            id: 1,
            name: 'Küche',
            isLinked: false,
            nodeId: 'NodeId1',
            parentId: 0,
            children: [
              {
                id: 3,
                name: 'Erdgeschoss',
                isLinked: false,
                nodeId: 'NodeId3',
                parentId: 1,
              },
              {
                id: 2,
                name: 'Temperatur in der Küche',
                isLinked: false,
                nodeId: 'NodeId2',
                parentId: 1,
                children: [
                  {
                    id: 5,
                    isLinked: false,
                    name: 'Temperatursensor',
                    nodeId: 'NodeId5',
                    parentId: 2,
                    children: [
                      {
                        id: 6,
                        isLinked: false,
                        name: 'Temperatur',
                        nodeId: 'NodeId6',
                        parentId: 5,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 7,
            name: 'Raum',
            isLinked: false,
            nodeId: 'NodeId7',
            parentId: 0,
            children: [
              {
                id: 3,
                isLinked: true,
                name: 'Erdgeschoss',
                nodeId: 'NodeId3',
                parentId: 7,
              },
            ],
          },
        ],
      },
    };

    expect(selectors.getProjectTree(testState())).toEqual(expected);
  });
});

describe('getProjectPosition', () => {
  it('getProjectPosition from testState', () => {
    const expectedOutput = [{ id: 0, name: 'Mein Projekt' }];
    expect(selectors.getProjectPosition(testState())).toEqual(expectedOutput);
  });
  it('get ProjectPositionI from Temperatur (id=6) in the testState', () => {
    const expectedOutput = [
      { id: 0, name: 'Mein Projekt' },
      { id: 1, name: 'Küche' },
      { id: 2, name: 'Temperatur in der Küche' },
      { id: 5, name: 'Temperatursensor' },
      { id: 6, name: 'Temperatur' },
    ];
    const customTestState = {
      ...testState(),
      fisaProject: {
        ...testState().fisaProject,
        activeObject: 6,
      },
    };
    expect(selectors.getProjectPosition(customTestState)).toEqual(
      expectedOutput
    );
  });
});

describe('getObjectsInActiveWithCategories', () => {
  it('get object in active from testState', () => {
    const expectedOutput = [
      {
        definitionName: 'Raum',
        ogcType: 'Thing',
        caption: 'Räume',
        isAddable: true,
        objects: [
          {
            id: 1,
            definitionName: 'Raum',
            nameToShow: 'Küche',
            selectable: true,
            isLinked: false,
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
              },
              {
                definitionName: 'Beschreibung',
                ogcType: 'Thing.description',
                infoText: 'Weitere Informationen',
                valueType: 'string',
                value: 'Die Küche, in der alles gekocht wird',
                isName: false,
              },
            ],
            parent: 0,
          },
        ],
      },
    ];

    expect(selectors.getObjectsInActiveWithCategories(baseState())).toEqual(
      expectedOutput
    );
  });
});

describe('getAttribute', () => {
  it('check to get an attribute from test state', () => {
    const objectId = 1;
    const attributeName = 'Name';
    const expected = testState()
      .fisaProject.objects.find((object) => object.id === objectId)
      ?.attributes.find(
        (attribute) => attribute.definitionName === attributeName
      );
    expect(
      selectors.getAttribute(testState(), objectId, attributeName)
    ).toEqual(expected);
  });
});

test('getProjectName', () => {
  expect(selectors.getProjectName(testState())).toBe('Mein Projekt');
});

describe('getAllCardPositions', () => {
  it('try to get CardPositionI from testState', () => {
    const expected = [
      {
        name: 'Erdgeschoss',
        objectId: 3,
        position: ['7.0034353', '38.0038'],
        isPolygon: false,
      },
    ];
    expect(selectors.getAllCardPositions(testState())).toEqual(expected);
  });
});

describe('getPositionAttributesOfObject', () => {
  it('try to get position Attributes from testState', () => {
    const expected = ['7.0034353', '38.0038'];
    expect(selectors.getPositionAttributesOfObject(testState(), 3)).toEqual(
      expected
    );
  });
  it('try to get position Attributes from testState with wrong id', () => {
    const expected = [0, 0];
    expect(selectors.getPositionAttributesOfObject(testState(), 4)).toEqual(
      expected
    );
  });
});

describe('getBackendDocument', () => {
  it('get the backend document from the default test state', () => {
    const expected = {
      fisaObjects: fakeFisaDoc().fisaTemplate.map((object) => {
        if (object.definitionName === 'Ort') {
          return {
            ...object,
            attributes: [
              ...object.attributes,
              {
                definitionName: 'Codierungstyp',
                value: 'point',
              },
              {
                definitionName: 'Typ',
                value: 'Point',
              },
            ],
          };
        }
        if (object.definitionName === 'Sensor') {
          return {
            ...object,
            attributes: [
              ...object.attributes,
              {
                definitionName: 'Codierungstyp',
                value: 'application/pdf',
              },
            ],
          };
        }
        return object;
      }),
      name: baseState().fisaProject.constantParts.fisaProjectName,
      generateExampleData: false,
      fisaDocument: {
        ...fakeFisaDoc(),
        fisaTemplate: [],
      },
    };
    expect(getFisaProjectFromState(baseState(), false)).toEqual(expected);
  });
});
