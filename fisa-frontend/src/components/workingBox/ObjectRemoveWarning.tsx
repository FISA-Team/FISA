import React from 'react';
import { Checkbox, FormControlLabel, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { dontShowObjectRemoveWarning } from '../../redux/actions/pageActions';
import RemoveWarning from '../errorMessages/RemoveWarning';
import { ObjectWithNameI } from '../../redux/interfaces';
import { Label } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

interface RemoveWarningProps {
  warningOpen: boolean;
  closeWarning: () => void;
  deleteObject: () => void;
  dontShowObjectRemoveWarning: () => void;
  object: ObjectWithNameI;
}

function ObjectRemoveWarning(props: RemoveWarningProps) {
  const [dontWarn, setDontWarn] = React.useState(false);
  const { t } = useTranslation('projectPage');

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
      nameToRemove={props.object.nameToShow}
    >
      {!props.object.frostId && (
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
      )}
      {props.object.frostId && (
        <Typography>{t('removeFrostLinkedObjectMessage')}</Typography>
      )}
    </RemoveWarning>
  );
}

export default connect(null, { dontShowObjectRemoveWarning })(
  ObjectRemoveWarning
);
