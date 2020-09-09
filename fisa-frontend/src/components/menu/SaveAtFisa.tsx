import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import MuiAlert from '@material-ui/lab/Alert';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Snackbar,
  CircularProgress,
} from '@material-ui/core';

import {
  updateProject,
  addProject,
  clearErrorMessage,
  resetExistsOnBackend,
  changeProjectName,
} from '../../redux/actions';
import {
  FisaProjectI,
  ErrorMessageI,
  FrontendReduxStateI,
} from '../../redux/interfaces';
import {
  getFisaProjectFromState,
  getServerCommunicationError,
  getServerCommunicationPending,
  getProjectExistsOnBackend,
} from '../../redux/selectors';

import ErrorSnackbar from '../errorMessages/ErrorSnackbar';

interface SaveDialogProps {
  open: boolean;
  onClose: () => void;
  updateProject: (project: FisaProjectI) => void;
  addProject: (project: FisaProjectI) => void;
  fisaProject: FisaProjectI;
  saveError: ErrorMessageI | undefined;
  fetchPending: boolean;
  resetErrorMsg: () => void;
  resetOnBackend: () => void;
  existsOnBackend: boolean;
  changeName: (newName: string) => void;
}

enum MenuStates {
  SHOW_NAME_MENU,
  PENDING,
  OVERRIDE_WARNING,
}

function SaveAtFisa(props: SaveDialogProps) {
  const { t } = useTranslation(['menus', 'general']);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [storeProjectName, setStoreProjectName] = React.useState(
    props.fisaProject.name
  );
  const [menuState, setMenuState] = React.useState(MenuStates.SHOW_NAME_MENU);

  const [tryToSave, setTryToSave] = React.useState(false);

  const tryToPutProject = () => {
    props.resetOnBackend();
    setMenuState(MenuStates.PENDING);
    props.addProject(props.fisaProject);
    setTimeout(() => setTryToSave(true), 100);
  };

  const changeName = (name: string) => {
    props.changeName(name);
  };

  const forceUpdateProject = () => {
    props.updateProject(props.fisaProject);
    setMenuState(MenuStates.PENDING);
    setAlertOpen(true);
    closeMenu();
  };

  const closeMenu = () => {
    props.onClose();
    props.resetOnBackend();
    setTryToSave(false);
    setTimeout(() => setMenuState(MenuStates.SHOW_NAME_MENU), 3000);
  };

  const { existsOnBackend, resetErrorMsg, onClose, fetchPending } = props;
  const projectName = props.fisaProject.name;

  useEffect(() => {
    if (tryToSave && !fetchPending) {
      if (existsOnBackend) {
        setMenuState(MenuStates.OVERRIDE_WARNING);
        setTryToSave(false);
        resetErrorMsg();
      } else {
        setStoreProjectName(projectName);
        onClose();
        setTryToSave(false);
        setTimeout(() => setMenuState(MenuStates.SHOW_NAME_MENU), 3000);
        setAlertOpen(true);
      }
    }
  }, [
    fetchPending,
    tryToSave,
    existsOnBackend,
    resetErrorMsg,
    onClose,
    projectName,
  ]);

  let dialogContent;

  switch (menuState) {
    case MenuStates.SHOW_NAME_MENU:
      dialogContent = (
        <>
          <DialogTitle>{t('saveAtFisa')}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              value={props.fisaProject.name}
              onChange={(e) => changeName(e.target.value)}
              margin="dense"
              id="name"
              label="Name"
              type="url"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                props.onClose();
                props.changeName(storeProjectName);
              }}
            >
              {t('cancel')}
            </Button>
            <Button
              disabled={props.fisaProject.name === ''}
              onClick={tryToPutProject}
            >
              {t('save')}
            </Button>
          </DialogActions>
        </>
      );
      break;
    case MenuStates.OVERRIDE_WARNING:
      dialogContent = (
        <>
          <DialogTitle>{t('overrideWarning')}</DialogTitle>
          <DialogContent>
            {t('alreadyExistsWithName')} "{props.fisaProject.name}"{' '}
            {t('onFisa')}
          </DialogContent>
          <DialogContent>{t('doYouWantToOverrideQuestion')}</DialogContent>
          <DialogActions>
            <Button onClick={() => setMenuState(MenuStates.SHOW_NAME_MENU)}>
              {t('no')}
            </Button>
            <Button onClick={forceUpdateProject}>{t('yes')}</Button>
          </DialogActions>
        </>
      );
      break;
    case MenuStates.PENDING:
      dialogContent = (
        <DialogContent style={{ textAlign: 'center' }}>
          <CircularProgress />
        </DialogContent>
      );
  }

  return (
    <>
      <Dialog open={props.open}>{dialogContent}</Dialog>
      <Snackbar
        open={alertOpen && props.saveError === undefined && !props.fetchPending}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setAlertOpen(false)}
          severity="success"
        >
          "{props.fisaProject.name}" {t('successfullySaved')}
        </MuiAlert>
      </Snackbar>
      <ErrorSnackbar
        open={alertOpen && props.saveError !== undefined}
        onClose={() => {
          setAlertOpen(false);
          props.resetErrorMsg();
        }}
        error={props.saveError}
      />
    </>
  );
}

const stateToSaveDialogProps = (state: FrontendReduxStateI) => ({
  fisaProject: getFisaProjectFromState(state, false),
  saveError: getServerCommunicationError(state),
  fetchPending: getServerCommunicationPending(state),
  existsOnBackend: getProjectExistsOnBackend(state),
});

const dispatchToSaveDialogProps = {
  updateProject,
  addProject,
  resetErrorMsg: clearErrorMessage,
  resetOnBackend: resetExistsOnBackend,
  changeName: changeProjectName,
};

export default connect(
  stateToSaveDialogProps,
  dispatchToSaveDialogProps
)(SaveAtFisa);
