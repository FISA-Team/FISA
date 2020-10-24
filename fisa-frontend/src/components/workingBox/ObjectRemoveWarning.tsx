import React from 'react';
import { Checkbox, DialogContent, FormControlLabel, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { dontShowObjectRemoveWarning } from '../../redux/actions/pageActions';
import RemoveWarning from '../errorMessages/RemoveWarning';
import { ObjectWithNameI } from '../../redux/interfaces';

interface RemoveWarningProps {
  warningOpen: boolean;
  closeWarning: () => void;
  deleteObject: (removeFromFrost: boolean) => void;
  dontShowObjectRemoveWarning: () => void;
  object: ObjectWithNameI;
}

function ObjectRemoveWarning(props: RemoveWarningProps) {
  const [dontWarn, setDontWarn] = React.useState(false);
  const [removeFromFrost, setRemoveFromFrost] = React.useState(true);
  const { t } = useTranslation('projectPage');

  const warningIsOpen = props.warningOpen;
  const downtShowRemoveWarning = props.dontShowObjectRemoveWarning;
  React.useEffect(() => {
    if (!warningIsOpen && dontWarn) {
      downtShowRemoveWarning();
    }
  }, [dontWarn, warningIsOpen, downtShowRemoveWarning]);

  return (
    <RemoveWarning
      open={props.warningOpen}
      onNo={() => props.closeWarning()}
      onYes={() => props.deleteObject(removeFromFrost)}
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
        <>
          <Typography>{t('removeFrostLinkedObjectMessage')}</Typography>
          <DialogContent>
            <FormControlLabel
              style={{ marginRight: 'auto' }}
              control={
                <Checkbox
                  checked={removeFromFrost}
                  onChange={() => setRemoveFromFrost((oldData) => !oldData)}
                />
              }
              label={t('removeFromFrost')}
            />
          </DialogContent>
        </>

      )}
    </RemoveWarning>
  );
}

export default connect(null, { dontShowObjectRemoveWarning })(
  ObjectRemoveWarning
);
