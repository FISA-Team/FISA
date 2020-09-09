import React, { useEffect, SetStateAction } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import {
  IconButton,
  Menu,
  MenuItem,
  Accordion,
  AccordionSummary,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import {
  addObjectByObjectDefinition,
  extractFromCSV,
} from '../../redux/actions';
import { OverviewItemObject } from './overviewItemObject';
import {
  FrontendReduxStateI,
  ActionI,
  ObjectBundleI,
  ErrorMessageI,
} from '../../redux/interfaces';
import { getExtractCSVErrorMessage } from '../../redux/selectors';
import ErrorSnackbar from '../errorMessages/ErrorSnackbar';

/**
 * A toolBar component witch represents one tool that can be added to the ObjectBox.
 *
 */

const style = makeStyles((theme) => ({
  categoryText: {
    marginLeft: '5px',
    maxWidth: 'calc(100% - 10px)',
  },
  moreOptionsIcon: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
  },
}));

interface OverviewItemProps {
  dispatch: Dispatch<ActionI>;
  objectBundle: ObjectBundleI;
  expendedName: string;
  setExpendedName: React.Dispatch<SetStateAction<string>>;
  justOpened: boolean;
  csvError: ErrorMessageI | undefined;
}

function OverviewItem(props: OverviewItemProps) {
  const classes = style();

  const { getInputProps, open, acceptedFiles } = useDropzone({
    multiple: false,
  });

  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const [csvErrorMessageOpen, setCsvErrorMessageOpen] = React.useState(false);

  const handleClick = (
    event:
    | React.MouseEvent<HTMLAnchorElement>
    | React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
    event.stopPropagation();
  };

  const handleClose = (
    event: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLLIElement>
  ) => {
    setAnchorEl(null);
    event.stopPropagation();
  };

  const importCSV = () => {
    acceptedFiles.pop();
    open();
  };

  const { dispatch, objectBundle, csvError } = props;

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      acceptedFiles.pop();
      file.text().then((data: string) => {
        dispatch(extractFromCSV(data, objectBundle.definitionName));
      });
    }
  }, [acceptedFiles, dispatch, objectBundle, csvError]);

  useEffect(() => {
    setCsvErrorMessageOpen(csvError !== undefined);
  }, [csvError]);

  const toggleExpended = () => {
    if (props.objectBundle.definitionName !== props.expendedName) {
      props.setExpendedName(props.objectBundle.definitionName);
    } else {
      props.setExpendedName('');
    }
  };

  return (
    <>
      <Accordion
        expanded={
          props.justOpened ||
          props.objectBundle.definitionName === props.expendedName
        }
        onChange={() => toggleExpended()}
      >
        <AccordionSummary
          expandIcon={props.justOpened ? <div /> : <ExpandMoreIcon />}
          aria-label="Expand"
          aria-controls="additional-actions2-content"
          id="additional-actions2-header"
        >
          {props.objectBundle.definitionToAdd && (
            <div className={classes.iconButton}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  props.dispatch(
                    addObjectByObjectDefinition(
                      props.objectBundle.definitionName
                    )
                  );
                }}
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </div>
          )}
          <div className={classes.categoryText}>
            <Typography className={classes.categoryText}>
              {props.objectBundle.caption}
            </Typography>
          </div>
          {props.objectBundle.definitionToAdd && (
            <div className={classes.moreOptionsIcon}>
              <IconButton
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
                className={classes.moreOptionsIcon}
                size="small"
              >
                <SettingsIcon />
              </IconButton>
            </div>
          )}
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <input {...getInputProps()} />
            <MenuItem
              onClick={(e) => {
                handleClose(e);
                importCSV();
              }}
            >
              Import from CSV
            </MenuItem>
          </Menu>
        </AccordionSummary>
        <div style={{ paddingLeft: 15 }}>
          {props.objectBundle.objects.map((objectContent) => (
            <OverviewItemObject
              objectContent={objectContent}
              key={objectContent.id}
              dispatch={props.dispatch}
            />
          ))}
        </div>
      </Accordion>
      <ErrorSnackbar
        open={csvErrorMessageOpen}
        error={props.csvError}
        onClose={() => setCsvErrorMessageOpen(false)}
      />
    </>
  );
}

const stateToProps = (state: FrontendReduxStateI) => ({
  csvError: getExtractCSVErrorMessage(state),
});

export default connect(stateToProps)(OverviewItem);
