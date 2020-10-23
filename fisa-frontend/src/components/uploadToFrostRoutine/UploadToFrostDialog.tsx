import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  makeStyles,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Tooltip,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  FrontendReduxStateI,
  FisaProjectI,
  ErrorMessageI,
} from '../../redux/interfaces';
import {
  uploadProjectToFrost,
  clearErrorMessage,
  updateProjectOnFrost,
} from '../../redux/actions/backendCommunicationActions';
import {
  getServerCommunicationPending,
  getServerCommunicationError,
  getServerCommunicationActive,
  getFisaProjectFromState,
  getConnectedFrostServer,
} from '../../redux/selectors';
import ErrorDialogContent from '../errorMessages/ErrorDialogContent';
import Success from './UploadSuccessMessage';

const uploadDialogStyle = makeStyles((theme) => ({
  uploadDialRoot: {
    minWidth: 750,
    minHeight: 400,
  },
}));

export interface UploadToFrostDialogProps {
  open: boolean;
  handleClose: () => void;
  getFisaProject: (
    withExampleData: boolean,
    ignoreFrostIds: boolean
  ) => FisaProjectI;
  communicationActive: boolean;
  communicationPending: boolean;
  communicationError: ErrorMessageI | undefined;
  clearErrorMessage: () => void;
  uploadProjectToFrost: (project: FisaProjectI, frostUrl: string) => void;
  updateProjectOnFrost: (project: FisaProjectI) => void;
  connectedFrostServerURL: string | undefined;
}

enum UploadStates {
  ENTER_PROPERTIES,
  PENDING,
  UPLOAD_WARNING,
}

function UploadToFrostDialog(props: UploadToFrostDialogProps) {
  const classes = uploadDialogStyle();
  const [currentUploadState, setCurrentUploadState] = React.useState(
    UploadStates.ENTER_PROPERTIES
  );
  const [urlTextDisabled, setUrlTextDisabled] = React.useState<boolean>(true);
  const [generateExampleDataSave, setGenerateExampleDataSave] = React.useState(
    false
  );

  const [url, setUrl] = React.useState(
    props.connectedFrostServerURL ||
    'http://frost-server:8080/FROST-Server/v1.1'
  );

  const reset = () => {
    setCurrentUploadState(UploadStates.ENTER_PROPERTIES);
    props.clearErrorMessage();
  };

  const onClose = () => {
    props.handleClose();
    setTimeout(() => setCurrentUploadState(UploadStates.ENTER_PROPERTIES), 250);
  };

  const upload = (generateExampleData: boolean, ignoreFrostIds: boolean) => {
    if (
      ignoreFrostIds &&
      props.connectedFrostServerURL &&
      currentUploadState !== UploadStates.UPLOAD_WARNING
    ) {
      setCurrentUploadState(UploadStates.UPLOAD_WARNING);
      setGenerateExampleDataSave(generateExampleData);
      setUrlTextDisabled(true);
      return;
    }
    setCurrentUploadState(UploadStates.PENDING);

    // Update on FROST
    if (props.connectedFrostServerURL && !ignoreFrostIds && urlTextDisabled) {
      console.log("Update");
      props.updateProjectOnFrost(
        props.getFisaProject(generateExampleData, ignoreFrostIds)
      );
    } else {
      console.log("Upload");
      // Upload to frost
      props.uploadProjectToFrost(
        props.getFisaProject(generateExampleData, ignoreFrostIds),
        url
      );
    }
  };

  let content;
  switch (currentUploadState) {
    case UploadStates.ENTER_PROPERTIES:
      content = (
        <UploadDialog
          urlDisabled={urlTextDisabled}
          setUrlDisabled={setUrlTextDisabled}
          url={url}
          setUrl={setUrl}
          {...props}
          upload={upload}
        />
      );
      break;

    case UploadStates.UPLOAD_WARNING:
      content = (
        <UploadWarning
          cancel={() => {
            reset();
          }}
          upload={() => upload(generateExampleDataSave, true)}
        />
      );
      break;
    case UploadStates.PENDING:
      if (props.communicationPending) {
        content = <Pending />;
      } else if (props.communicationError) {
        content = (
          <Error
            error={props.communicationError}
            close={() => {
              reset();
              onClose();
            }}
            resetState={() => reset()}
          />
        );
      } else {
        content = <Success frostUrl={url} close={() => onClose()} />;
      }

      break;
    default:
      content = <div>No more states</div>;
  }
  return (
    <Dialog
      maxWidth="lg"
      open={props.open}
      aria-labelledby="form-dialog-title"
      className={classes.uploadDialRoot}
    >
      {content}
    </Dialog>
  );
}

interface UploadDialogProps extends UploadToFrostDialogProps {
  upload: (generateExampleData: boolean, ignoreFrostIds: boolean) => void;
  url: string;
  setUrl: (url: string) => void;
  urlDisabled: boolean;
  setUrlDisabled: (disabled: boolean) => void;
}

function UploadDialog(props: UploadDialogProps) {
  const { t } = useTranslation('menus');

  const [withExampleData, setWithExampleData] = React.useState(false);
  const handleClose = () => {
    props.handleClose();
  };

  const handleUpload = () => {
    props.upload(
      withExampleData,
      !(props.urlDisabled && !!props.connectedFrostServerURL)
    );
  };
  return (
    <>
      <DialogTitle id="form-dialog-title">{t('toFrostTooltip')}</DialogTitle>
      <DialogContent>
        {(!props.urlDisabled || !props.connectedFrostServerURL) && (
          <DialogContentText>{t('enterFrostUrl')}</DialogContentText>
        )}
        <TextField
          disabled={props.urlDisabled && !!props.connectedFrostServerURL}
          autoFocus
          value={props.url}
          onChange={(e) => props.setUrl(e.target.value)}
          margin="dense"
          id="name"
          label="Frost-Server URL"
          type="url"
          fullWidth
        />
        {(!props.urlDisabled || !props.connectedFrostServerURL) && (
          <Tooltip title={t('createExampleDataHelp') as string}>
            <FormControlLabel
              style={{ marginRight: 'auto' }}
              control={
                <Checkbox
                  checked={withExampleData}
                  onChange={() => setWithExampleData((oldData) => !oldData)}
                />
              }
              label={t('createExampleData')}
            />
          </Tooltip>
        )}
        {props.connectedFrostServerURL && (
          <>
            <br />
            <Tooltip title={t('uploadToDifferentURLTooltip') as string}>
              <FormControlLabel
                style={{ marginRight: 'auto' }}
                control={
                  <Checkbox
                    checked={!props.urlDisabled}
                    onChange={() => props.setUrlDisabled(!props.urlDisabled)}
                  />
                }
                label={t('uploadToDifferentURLLabel')}
              />
            </Tooltip>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button type="reset" onClick={handleClose} color="primary">
          {t('cancel')}
        </Button>
        <Button type="submit" onClick={handleUpload} color="primary">
          {props.urlDisabled && !!props.connectedFrostServerURL
            ? t('update')
            : t('upload')}
        </Button>
      </DialogActions>
    </>
  );
}

function Pending() {
  return (
    <>
      <DialogContent style={{ textAlign: 'center' }}>
        <CircularProgress />
      </DialogContent>
    </>
  );
}

interface UploadWarningProps {
  upload: () => void;
  cancel: () => void;
}

function UploadWarning(props: UploadWarningProps) {
  const { t } = useTranslation('menus');
  return (
    <>
      <DialogTitle id="form-dialog-title">
        {t('areYouShureToUploadTitle')}
      </DialogTitle>
      <DialogContent>{t('areYouShureToUploadContent')}</DialogContent>
      <DialogActions>
        <Button type="reset" onClick={() => props.cancel()} color="primary">
          {t('back')}
        </Button>
        <Button type="submit" onClick={() => props.upload()} color="primary">
          {t('upload')}
        </Button>
      </DialogActions>
    </>
  );
}

interface ErrorProps {
  error: ErrorMessageI;
  close: () => void;
  resetState: () => void;
}

function Error(props: ErrorProps) {
  const { t } = useTranslation('general');
  return (
    <>
      <ErrorDialogContent error={props.error} />
      <DialogActions>
        <Button onClick={props.close}>{t('close')}</Button>
        <Button onClick={props.resetState}>{t('tryAgain')}</Button>
      </DialogActions>
    </>
  );
}

const stateToProps = (state: FrontendReduxStateI) => ({
  getFisaProject: (withExampleData: boolean, ignoreFrostIds: boolean) =>
    getFisaProjectFromState(state, withExampleData, ignoreFrostIds),
  communicationActive: getServerCommunicationActive(state),
  communicationPending: getServerCommunicationPending(state),
  communicationError: getServerCommunicationError(state),
  connectedFrostServerURL: getConnectedFrostServer(state),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapDispatchToProps = {
  clearErrorMessage,
  uploadProjectToFrost,
  updateProjectOnFrost
};

export default connect(stateToProps, mapDispatchToProps)(UploadToFrostDialog);
