import React, { Dispatch } from 'react';
import { useTranslation } from 'react-i18next';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import InsertLinkIcon from '@material-ui/icons/InsertLink';

import {
  AccordionDetails,
  Button,
  IconButton,
  Tooltip,
  makeStyles,
} from '@material-ui/core';
import {
  addObjectByExisting,
  linkObject,
  setObjectActive,
  enableScrollingAction,
  setHighlightedObject,
} from '../../redux/actions';
import { ObjectContentI, ActionI } from '../../redux/interfaces';

interface ToolItemObjectProps {
  dispatch: Dispatch<ActionI>;
  objectContent: ObjectContentI;
}

const style = makeStyles(() => ({
  categoryText: {
    marginLeft: '5px',
    maxWidth: 'calc(100% - 10px)',
  },
  moreOptionsIcon: {
    marginLeft: 'auto',
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
  },
}));

/**
 * this Component represents on existing Object of the ObjectDefinitions from toolBarItem
 * @param props
 * @returns {*}
 */
export function OverviewItemObject(props: ToolItemObjectProps) {
  const { t } = useTranslation('projectPage');
  const classes = style();

  return (
    <AccordionDetails>
      {props.objectContent.isClonable && (
        <div className={classes.iconButton}>
          <Tooltip title={t('cloneButton') as string}>
            <IconButton
              size="small"
              onClick={() =>
                props.dispatch(addObjectByExisting(props.objectContent.id))}
            >
              <FileCopyIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
      {props.objectContent.isLinkable && (
        <div className={classes.iconButton}>
          <Tooltip title={t('linkButton') as string}>
            <IconButton
              size="small"
              onClick={() => props.dispatch(linkObject(props.objectContent.id))}
            >
              <InsertLinkIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
      <Button
        style={{ textTransform: 'none' }}
        onClick={() => {
          props.dispatch(enableScrollingAction());
          props.dispatch(setObjectActive(props.objectContent.parentId));
          props.dispatch(setHighlightedObject(props.objectContent.id));
        }}
      >
        {props.objectContent.name}
      </Button>
    </AccordionDetails>
  );
}
