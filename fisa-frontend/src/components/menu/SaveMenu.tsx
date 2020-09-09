import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, Tooltip } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import SaveAtFisa from './SaveAtFisa';

function SaveMenu() {
  const [saveAtFisaOpen, setSaveAtFisaOpen] = React.useState(false);
  const { t } = useTranslation('menus');

  return (
    <>
      <Tooltip title={`${t('saveProject')}`}>
        <IconButton
          key="UploadMenu"
          color="inherit"
          onClick={() => setSaveAtFisaOpen(true)}
          edge="start"
        >
          <SaveIcon fontSize="large" />
        </IconButton>
      </Tooltip>
      <SaveAtFisa
        open={saveAtFisaOpen}
        onClose={() => setSaveAtFisaOpen(false)}
      />
    </>
  );
}

export default SaveMenu;
