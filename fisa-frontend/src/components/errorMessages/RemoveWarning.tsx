import React from 'react';
import {
  DialogTitle,
  Dialog,
  DialogActions,
  Button,
  DialogContent,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

export default function RemoveWarning({
  open,
  nameToRemove,
  onNo,
  onYes,
  children = <div />,
}: {
  open: boolean;
  nameToRemove: string;
  onNo: () => void;
  onYes: () => void;
  // eslint-disable-next-line react/require-default-props
  children?: React.ReactNode;
}) {
  const { t } = useTranslation('general');
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {t('removeWarningStart')} "{nameToRemove}" {t('removeWarningEnd')}
      </DialogTitle>

      <DialogContent>{children}</DialogContent>

      <DialogActions>
        <Button onClick={onNo} color="primary">
          {t('no')}
        </Button>
        <Button onClick={onYes} color="primary" autoFocus>
          {t('yes')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
