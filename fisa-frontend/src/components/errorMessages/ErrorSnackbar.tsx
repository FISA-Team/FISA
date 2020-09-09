import React, { useEffect } from 'react';
import { Snackbar, Dialog, Button, DialogActions } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { useTranslation } from 'react-i18next';
import ErrorDialogContent from './ErrorDialogContent';
import { ErrorMessageI } from '../../redux/interfaces';

interface ErrorSnackbarProps {
  open: boolean;
  error: ErrorMessageI | undefined;
  onClose: () => void;
}

export default function ErrorSnackbar(props: ErrorSnackbarProps) {
  const { t } = useTranslation('general');
  const [overviewOpen, setOvervieOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<
  ErrorMessageI | undefined
  >(undefined);

  useEffect(() => {
    if (props.error !== undefined) {
      setErrorMessage(props.error);
    }
  }, [props.error]);

  return (
    <>
      <Snackbar
        open={props.open}
        onClose={() => props.onClose && props.onClose()}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => props.onClose && props.onClose()}
          severity="error"
        >
          {props.error?.name}: {props.error?.message}
          <Button
            onClick={() => {
              setOvervieOpen(true);
              props.onClose();
            }}
            color="inherit"
            variant="outlined"
            style={{ marginLeft: 20 }}
          >
            show More
          </Button>
        </MuiAlert>
      </Snackbar>

      <Dialog open={overviewOpen}>
        <ErrorDialogContent error={errorMessage} />
        <DialogActions>
          <Button onClick={() => setOvervieOpen(false)}>{t('close')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
