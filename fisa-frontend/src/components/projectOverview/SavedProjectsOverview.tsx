import React, { useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  makeStyles,
  Box,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import { connect } from 'react-redux';
import AddIcon from '@material-ui/icons/Add';
import { useHistory } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import { useTranslation } from 'react-i18next';
import DownloadIcon from '@material-ui/icons/GetApp';
import {
  FrontendReduxStateI,
  AvailableProjectI,
  ErrorMessageI,
} from '../../redux/interfaces';
import CreateProjectRoutine from '../createProjectRoutine/CreateProjectRoutine';
import {
  loadProjectFromServer,
  deleteProjectFromBackend,
  clearErrorMessage,
} from '../../redux/actions';

import { BackendUrl, Routes } from '../../environment';
import {
  getServerCommunicationPending,
  getAvailableProjects,
  getExistsProjectInState,
  getServerCommunicationError,
} from '../../redux/selectors';

import ErrorSnackbar from '../errorMessages/ErrorSnackbar';

const style = makeStyles((theme) => ({
  projectsList: {
    width: '60%',
    maxWidth: 500,
    margin: '0 auto',
    padding: 10,
  },
  heading: {
    marginBottom: '2rem',
    marginTop: '1rem',
    fontWeight: 'bolder',
  },
  projectsListItems: {},
  addProjectButton: {
    width: '2rem',
    height: '2rem',
    transform: 'scale(1.5)',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

interface SavedProjectsOverviewProps {
  availableProjects: AvailableProjectI[];
  projectLoadet: boolean;
  communicationPending: boolean;
  communicationError: ErrorMessageI | undefined;
  deleteProjectFromBackend: (uuid: string) => void;
  loadProjectFromServer: (uuid: string) => void;
  clearErrorMessage: () => void;
}

function SavedProjectsOverview(props: SavedProjectsOverviewProps) {
  const history = useHistory();

  const classes = style();
  const [createRoutineOpen, setCreateRoutineOpen] = React.useState(false);
  const [loadObjectActive, setLoadObjectActive] = React.useState(false);
  const [loadError, setLoadError] = React.useState<ErrorMessageI | undefined>(
    undefined
  );

  const [projectToRemove, setProjectToRemove] = React.useState<
  AvailableProjectI | undefined
  >(undefined);

  const loadProject = (uuid: string) => {
    props.loadProjectFromServer(uuid);
    setLoadObjectActive(true);
  };

  const downloadProject = (uuid: string) => {
    window.open(`${BackendUrl}/projects/${uuid}/download`, '_blank');
  };

  useEffect(() => {
    if (loadObjectActive) {
      if (!props.communicationPending && props.projectLoadet) {
        history.push(Routes.PROJECT);
      } else if (!props.communicationPending) {
        setLoadObjectActive(false);
        setLoadError(props.communicationError);
      }
    }
  }, [
    loadObjectActive,
    history,
    props.communicationPending,
    props.projectLoadet,
    props.communicationError,
  ]);

  const { t } = useTranslation(['projectPage', 'general']);

  return (
    <>
      <Box border={1} className={classes.projectsList}>
        <List component="nav" aria-label="main mailbox folders">
          {props.availableProjects.map((project) => (
            <div key={project.uuid}>
              <ListItem button>
                <ListItemText
                  className={classes.projectsListItems}
                  primary={project.name}
                  onClick={() => loadProject(project.uuid)}
                />

                <IconButton
                  aria-label="download"
                  onClick={() => {
                    downloadProject(project.uuid);
                  }}
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>

                <IconButton onClick={() => setProjectToRemove(project)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            </div>
          ))}
        </List>
      </Box>

      <IconButton onClick={() => setCreateRoutineOpen(true)}>
        <AddIcon className={classes.addProjectButton} />
      </IconButton>
      <CreateProjectRoutine
        open={createRoutineOpen}
        close={() => setCreateRoutineOpen(false)}
      />

      <Dialog
        open={projectToRemove !== undefined}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t('doYouWantToRemove1')} "{projectToRemove?.name}"{' '}
          {t('doYouWantToRemove2')}
        </DialogTitle>

        <DialogActions>
          <Button onClick={() => setProjectToRemove(undefined)} color="primary">
            {t('no')}
          </Button>
          <Button
            onClick={() => {
              if (projectToRemove) {
                props.deleteProjectFromBackend(projectToRemove.uuid);
              }
              setProjectToRemove(undefined);
            }}
            color="primary"
            autoFocus
          >
            {t('yes')}
          </Button>
        </DialogActions>
      </Dialog>

      <ErrorSnackbar
        open={loadError !== undefined}
        error={loadError}
        onClose={() => {
          setLoadError(undefined);
          props.clearErrorMessage();
        }}
      />

      <Backdrop className={classes.backdrop} open={loadObjectActive}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

const mapDispatchToProps = {
  deleteProjectFromBackend,
  loadProjectFromServer,
  clearErrorMessage,
};

const mapStateToProps = (state: FrontendReduxStateI) => ({
  availableProjects: getAvailableProjects(state),
  projectLoadet: getExistsProjectInState(state),
  communicationPending: getServerCommunicationPending(state),
  communicationError: getServerCommunicationError(state),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SavedProjectsOverview);
