import React from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { connect } from 'react-redux';
import { dontShowObjectRemoveWarning } from '../../redux/actions/pageActions';
import RemoveWarning from '../errorMessages/RemoveWarning';

interface RemoveWarningProps {
  warningOpen: boolean;
  closeWarning: () => void;
  deleteObject: () => void;
  dontShowObjectRemoveWarning: () => void;
  nameToShow: string;
}

function ObjectRemoveWarning(props: RemoveWarningProps) {
  const [dontWarn, setDontWarn] = React.useState(false);

  const handleEvent = (toDo: () => void) => {
    if (dontWarn) {
      props.dontShowObjectRemoveWarning();
    }
    toDo();
  };
  return (
    <RemoveWarning
      open={props.warningOpen}
      onNo={() => handleEvent(props.closeWarning)}
      onYes={() => handleEvent(props.deleteObject)}
      nameToRemove={props.nameToShow}
    >
      <FormControlLabel
        style={{ marginRight: 'auto' }}
        control={
          <Checkbox
            checked={dontWarn}
            onChange={() => setDontWarn(!dontWarn)}
          />
        }
        label="Do not warn again"
      />
    </RemoveWarning>
  );
}

export default connect(null, { dontShowObjectRemoveWarning })(
  ObjectRemoveWarning
);
