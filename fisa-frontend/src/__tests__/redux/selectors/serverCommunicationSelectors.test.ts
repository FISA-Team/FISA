import * as selectors from '../../../redux/selectors';
import { testState } from '../mockups/testState';

test('getServerCommunicationActive', () => {
  const expected = testState().serverCommunication.active;
  expect(selectors.getServerCommunicationActive(testState())).toBe(expected);
});

test('getServerCommunicationActive', () => {
  const expected = testState().serverCommunication.pending;
  expect(selectors.getServerCommunicationPending(testState())).toBe(expected);
});

test('getServerCommunicationActive', () => {
  const expected = testState().serverCommunication.error;
  expect(selectors.getServerCommunicationError(testState())).toEqual(expected);
});

test('getProjectsFetched', () => {
  const expected = testState().availableFisaDocumentsProjects.projectsFetched;
  expect(selectors.getProjectsFetched(testState())).toBe(expected);
});

test('getDocumentsFetched', () => {
  const expected = testState().availableFisaDocumentsProjects.documentsFetched;
  expect(selectors.getDocumentsFetched(testState())).toBe(expected);
});
