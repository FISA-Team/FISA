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
} from '../../redux/actions/backendCommunicationActions';
import {
  getServerCommunicationPending,
  getServerCommunicationError,
  getServerCommunicationActive,
  getFisaProjectFromState,
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
  getFisaProject: (withExampleData: boolean) => FisaProjectI;
  communicationActive: boolean;
  communicationPending: boolean;
  communicationError: ErrorMessageI | undefined;
  clearErrorMessage: () => void;
  uploadProjectToFrostServer: (project: FisaProjectI, frostUrl: string) => void;
}

enum UploadStates {
  ENTER_PROPERTIES,
  PENDING,
}

function UploadToFrostDialog(props: UploadToFrostDialogProps) {
  const classes = uploadDialogStyle();
  const [currentUploadState, setCurrentUploadState] = React.useState(
    UploadStates.ENTER_PROPERTIES
  );

  const [url, setUrl] = React.useState(
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

  const upload = (generateExampleData: boolean) => {
    setCurrentUploadState(UploadStates.PENDING);

    // Upload to frost
    props.uploadProjectToFrostServer(
      props.getFisaProject(generateExampleData),
      url
    );
  };

  let content;
  switch (currentUploadState) {
    case UploadStates.ENTER_PROPERTIES:
      content = (
        <UploadDialog url={url} setUrl={setUrl} {...props} upload={upload} />
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
  upload: (generateExampleData: boolean) => void;
  url: string;
  setUrl: (url: string) => void;
}

function UploadDialog(props: UploadDialogProps) {
  const { t } = useTranslation('menus');

  const [withExampleData, setWithExampleData] = React.useState(false);
  const handleClose = () => {
    props.handleClose();
  };

  const handleUpload = () => {
    props.upload(withExampleData);
  };
  return (
    <>
      <DialogTitle id="form-dialog-title">{t('toFrostTooltip')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('enterFrostUrl')}</DialogContentText>
        <TextField
          autoFocus
          value={props.url}
          onChange={(e) => props.setUrl(e.target.value)}
          margin="dense"
          id="name"
          label="Frost-Server URL"
          type="url"
          fullWidth
        />
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
      </DialogContent>
      <DialogActions>
        <Button type="reset" onClick={handleClose} color="primary">
          {t('cancel')}
        </Button>
        <Button type="submit" onClick={handleUpload} color="primary">
          {t('upload')}
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
  getFisaProject: (withExampleData: boolean) =>
    getFisaProjectFromState(state, withExampleData),
  communicationActive: getServerCommunicationActive(state),
  communicationPending: getServerCommunicationPending(state),
  communicationError: getServerCommunicationError(state),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapDispatchToProps = (dispatch: any) => ({
  uploadProjectToFrostServer: (project: FisaProjectI, frostUrl: string) =>
    dispatch(uploadProjectToFrost(project, frostUrl)),
  clearErrorMessage: () => dispatch(clearErrorMessage()),
});

export default connect(stateToProps, mapDispatchToProps)(UploadToFrostDialog);
