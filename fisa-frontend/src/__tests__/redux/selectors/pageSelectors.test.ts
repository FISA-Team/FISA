import * as selectors from '../../../redux/selectors/pageSelectors';
import { testState } from '../mockups/testState';

test('getDontAskOnObjectDelete', () => {
  expect(selectors.getDontAskOnObjectDelete(testState())).toBeFalsy();
});

test('getNotSaved', () => {
  expect(selectors.getNotSaved(testState())).toBeFalsy();
});

test('getThemeName', () => {
  expect(selectors.getThemeName(testState())).toBe('darkTheme');
});

describe('getCanUndo', () => {
  it('test canUndo with empty redoHistory', () => {
    expect(selectors.getCanRedo(testState())).toBeFalsy();
  });
  it('test canUndo with not empty redoHistory', () => {
    const modifiedState = {
      ...testState(),
      fisaProject: {
        ...testState().fisaProject,
        undoHistory: [
          {
            activeObject: 3,
            objects: testState().fisaProject.objects,
          },
        ],
      },
    };
    expect(selectors.getCanUndo(modifiedState)).toBeTruthy();
  });
});

describe('getCanRedo', () => {
  it('test canUndo with empty redoHistory', () => {
    expect(selectors.getCanRedo(testState())).toBeFalsy();
  });
  it('test canUndo with not empty redoHistory', () => {
    const modifiedState = {
      ...testState(),
      fisaProject: {
        ...testState().fisaProject,
        redoHistory: [
          {
            activeObject: 3,
            objects: testState().fisaProject.objects,
          },
        ],
      },
    };
    expect(selectors.getCanRedo(modifiedState)).toBeTruthy();
  });
});
