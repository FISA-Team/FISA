/* eslint-disable react/require-default-props */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';
import DownloadIcon from '@material-ui/icons/GetApp';
import { useTranslation } from 'react-i18next';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  makeStyles,
  TextField,
  Box,
} from '@material-ui/core';
import {
  FrontendReduxStateI,
  AvailableFisaDocumentI,
  ErrorMessageI,
} from '../../redux/interfaces';
import {
  getAvailableFisaDocuments,
  getServerCommunicationPending,
  getServerCommunicationError,
  getDocumentsFetched,
} from '../../redux/selectors';
import ErrorSnackbar from '../errorMessages/ErrorSnackbar';
import {
  fetchAvailableDocuments,
  clearErrorMessage,
  deleteDocument,
} from '../../redux/actions';
import RemoveWarning from '../errorMessages/RemoveWarning';
import { BackendUrl } from '../../environment';

const styles = makeStyles((theme) => ({
  root: {
    minWidth: 300,
    maxWidth: 450,
    backgroundColor: theme.palette.background.paper,
    padding: 0,
  },
  searchBox: {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'left',
    paddingBottom: 5,
  },
  listBox: {
    position: 'relative',
    overflow: 'auto',
    height: 250,
    width: 400,
  },
  projectsListItems: {
    textAlign: 'center',
  },
  topBox: {
    paddingBottom: 20,
  },
}));

interface UseCaseOverviewProps {
  selected?: string;
  setSelected?: (uuid: string) => void;
  availableFisaDocuments: AvailableFisaDocumentI[];
  serverCommunicationPending: boolean;
  serverCommunicationError: ErrorMessageI | undefined;
  fisaDocumentsFetched: boolean;
  fetchDocuments: () => void;
  clearCommunicationL: () => void;
  deleteDocumentL: (uuid: string) => void;
  removable: boolean;
}

function UseCaseOverview({
  selected = undefined,
  setSelected = undefined,
  availableFisaDocuments,
  serverCommunicationPending,
  serverCommunicationError,
  fisaDocumentsFetched,
  fetchDocuments,
  clearCommunicationL,
  deleteDocumentL,
  removable,
}: UseCaseOverviewProps) {
  const classes = styles();
  const { t } = useTranslation('mainPage');

  const [searchText, setSearchText] = React.useState('');
  const [tryToFetch, setTryToFetch] = React.useState(true);
  const [toRemove, setToRemove] = React.useState<
  AvailableFisaDocumentI | undefined
  >(undefined);

  const handleListItemClick = (uuid: string) => {
    setSelected && setSelected(uuid);
  };

  const downloadDocument = (uuid: string) => {
    window.open(`${BackendUrl}/documents/${uuid}/download`, '_blank');
  };

  useEffect(() => {
    if (tryToFetch && !serverCommunicationPending && !fisaDocumentsFetched) {
      fetchDocuments();
      setTryToFetch(false);
      setTimeout(() => setTryToFetch(true), 2000);
    }
  }, [
    tryToFetch,
    serverCommunicationPending,
    fisaDocumentsFetched,
    fetchDocuments,
  ]);

  return (
    <div className={classes.root}>
      <div className={classes.searchBox}>
        <TextField
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          id="objectSearchBar"
          label={t('searchUseCasesLabel')}
          variant="outlined"
        />
      </div>
      <Box border={1} className={classes.listBox}>
        <List component="nav" aria-label="main mailbox folders">
          {searchFilter(availableFisaDocuments, searchText).map(
            (fisaDocument) => (
              <div key={fisaDocument.uuid}>
                {setSelected !== undefined ? (
                  <ListItem
                    selected={
                      selected !== undefined && selected === fisaDocument.uuid
                    }
                    onClick={() => handleListItemClick(fisaDocument.uuid)}
                    button={true}
                  >
                    <ListItemText primary={fisaDocument.name} />
                    {removable && (
                      <IconButton
                        aria-label="delete"
                        onClick={() => {
                          setToRemove(fisaDocument);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </ListItem>
                ) : (
                  <ListItem
                    selected={
                      selected !== undefined && selected === fisaDocument.uuid
                    }
                    onClick={() => handleListItemClick(fisaDocument.uuid)}
                    button={false}
                  >
                    <ListItemText primary={fisaDocument.name} />
                    {removable && (
                      <>
                        <IconButton
                          aria-label="download"
                          onClick={() => {
                            downloadDocument(fisaDocument.uuid);
                          }}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() => {
                            setToRemove(fisaDocument);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </ListItem>
                )}
              </div>
            )
          )}
        </List>
      </Box>
      <ErrorSnackbar
        open={serverCommunicationError !== undefined}
        error={serverCommunicationError}
        onClose={() => clearCommunicationL()}
      />
      <RemoveWarning
        open={toRemove !== undefined}
        nameToRemove={toRemove?.name || ''}
        onNo={() => setToRemove(undefined)}
        onYes={() => {
          if (toRemove) {
            deleteDocumentL(toRemove.uuid);
          }
          setToRemove(undefined);
        }}
      />
    </div>
  );
}

function searchFilter(
  availableDocs: AvailableFisaDocumentI[],
  search: string
): AvailableFisaDocumentI[] {
  if (search === '') {
    return availableDocs.sort((a, b) => (a.name > b.name ? 1 : -1));
  }
  return availableDocs
    .filter((doc) =>
      doc.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    )
    .sort((a, b) => (a.name > b.name ? 1 : -1));
}

const mapStateToProps = (state: FrontendReduxStateI) => ({
  fisaDocumentsFetched: getDocumentsFetched(state),
  availableFisaDocuments: getAvailableFisaDocuments(state),
  serverCommunicationPending: getServerCommunicationPending(state),
  serverCommunicationError: getServerCommunicationError(state),
});

const mapDispatchToProps = {
  fetchDocuments: fetchAvailableDocuments,
  clearCommunicationL: clearErrorMessage,
  deleteDocumentL: deleteDocument,
};

export default connect(mapStateToProps, mapDispatchToProps)(UseCaseOverview);
