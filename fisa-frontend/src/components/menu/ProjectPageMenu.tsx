import React from 'react';
import { connect } from 'react-redux';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { useTranslation } from 'react-i18next';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import { IconButton, Tooltip, makeStyles } from '@material-ui/core';

import { FrontendReduxStateI } from '../../redux/interfaces';
import { undo, redo } from '../../redux/actions';
import BaseMenu from './BaseMenu';
import { getCanUndo, getCanRedo } from '../../redux/selectors';
import UploadToFrostDialog from '../uploadToFrostRoutine/UploadToFrostDialog';
import SaveMenu from './SaveMenu';

const style = makeStyles(() => ({
  space: {
    marginRight: '40px',
    height: '100%',
  },
}));

export interface ProjectPageMenuProps {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  state: FrontendReduxStateI;
}

function ProjectPageMenu(props: ProjectPageMenuProps) {
  const classes = style();
  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);

  const uploadToFisa = () => {
    setUploadDialogOpen(true);
  };

  const { t } = useTranslation('menus');
  return (
    <BaseMenu>
      <div style={{ marginLeft: 'auto' }}>
        <Tooltip title={`${t('undo')}`}>
          <span>
            <IconButton
              disabled={!props.canUndo}
              onClick={() => props.undo()}
              color="inherit"
            >
              <UndoIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title={`${t('redo')}`}>
          <span className={classes.space}>
            <IconButton
              disabled={!props.canRedo}
              onClick={() => props.redo()}
              color="inherit"
            >
              <RedoIcon />
            </IconButton>
          </span>
        </Tooltip>

        <SaveMenu />

        <Tooltip title={`${t('toFrostTooltip')}`}>
          <IconButton
            className={classes.space}
            onClick={uploadToFisa}
            color="inherit"
          >
            <CloudUploadIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        <UploadToFrostDialog
          open={uploadDialogOpen}
          handleClose={() => setUploadDialogOpen(false)}
        />
      </div>
    </BaseMenu>
  );
}

const mapStateToProps = (state: FrontendReduxStateI) => ({
  canUndo: getCanUndo(state),
  canRedo: getCanRedo(state),
  state,
});

const mapDispatchToProps = {
  undo,
  redo,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPageMenu);
