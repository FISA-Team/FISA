import React from 'react';
import { DialogTitle, Dialog, DialogActions, Button } from '@material-ui/core';

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
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Do you really want to delete "{nameToRemove}" ?
      </DialogTitle>

      <DialogActions>
        {children}
        <Button onClick={onNo} color="primary">
          No
        </Button>
        <Button onClick={onYes} color="primary" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
