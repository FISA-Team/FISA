import React from 'react';
import { connect } from 'react-redux';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  IconButton,
  List,
  ListItem,
  CardHeader,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { useTranslation } from 'react-i18next';

import AttributeBox from './AttributeBox';
import RemoveWarning from './ObjectRemoveWarning';
import {
  getDontAskOnObjectDelete,
  getHighlightedObject,
  getPositionAttributesOfObject,
} from '../../redux/selectors';
import { FrontendReduxStateI } from '../../redux/interfaces';
import {
  getBackgroundColor,
  getHighlightBackgroundColor,
} from '../../variables/colors';
import {
  setHighlightedObject,
  enableScrollingAction,
} from '../../redux/actions/pageActions';
import MapDialog from '../map/MapDialog';
import { setObjectActive } from '../../redux/actions';
import { ObjectBoxProps, ObjectBoxBaseProps } from './workingBoxInterfaces';

/**
 * The Boxes of Objects inside the WorkingBox
 */

function ObjectBox(props: ObjectBoxProps) {
  const classes = makeStyles((theme) => ({
    card: {
      backgroundColor:
        props.object.id === props.highlightedObject
          ? getHighlightBackgroundColor(theme)
          : getBackgroundColor(theme),
    },
  }))();

  const [warningOpen, setWarningOpen] = React.useState(false);
  const [mapDialogOpen, setMapDialogOpen] = React.useState(false);

  const closeWarning = () => setWarningOpen(false);
  const openWarning = () =>
    props.dontShowWarning && !props.object.frostId
      ? deleteObject()
      : setWarningOpen(true);

  const deleteObject = () => {
    setWarningOpen(false);
    props.removeObject(props.object.id);
  };

  const checkIfGoToObject = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (props.object.isLinked) {
      event.preventDefault();
      props.dispatch(enableScrollingAction());
      props.dispatch(setObjectActive(props.object.parent));
      setTimeout(
        () => props.dispatch(setHighlightedObject(props.object.id)),
        100
      );
    }
  };

  const { t } = useTranslation('projectPage');

  const objectBox = (
    <Card
      className={classes.card}
      onMouseEnter={() => props.dispatch(setHighlightedObject(props.object.id))}
      onClick={checkIfGoToObject}
      style={
        props.object.frostId
          ? { borderStyle: 'solid', borderColor: '#006622' }
          : {}
      }
    >
      <CardHeader
        title={
          <Typography
            variant="h6"
            display="block"
            color="textPrimary"
            style={{ maxWidth: 'calc(100% - 5px' }}
          >
            {props.object.nameToShow}
          </Typography>
        }
        action={
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              openWarning();
            }}
          >
            <DeleteOutlineIcon />
          </IconButton>
        }
      />

      <CardContent>
        <List>
          {props.object.attributes.map((attribute) => (
            <ListItem key={attribute.definitionName}>
              <AttributeBox
                disabled={props.object.isLinked}
                objectId={props.object.id}
                attributeDefinitionName={attribute.definitionName}
                changeObjectProperty={(key: string, value: string) =>
                  props.changeObjectProperty(props.object.id, key, value)
                }
              />
            </ListItem>
          ))}
        </List>
        <CardActions>
          {props.object.selectable && (
            <Button
              variant="outlined"
              disabled={props.object.isLinked}
              size="small"
              onClick={() => props.goToObject(props.object.id)}
            >
              {t('goToObject')}
            </Button>
          )}
          {props.object.positionAttributes && (
            <Button
              size="small"
              variant="outlined"
              disabled={props.object.isLinked}
              onClick={() => setMapDialogOpen(true)}
            >
              {t('getPositionFromCard')}
            </Button>
          )}
        </CardActions>
      </CardContent>
    </Card>
  );

  return (
    <>
      {props.object.isLinked ? (
        <Tooltip title="This Object is Linked">{objectBox}</Tooltip>
      ) : (
        objectBox
      )}
      <RemoveWarning
        warningOpen={warningOpen}
        closeWarning={closeWarning}
        deleteObject={deleteObject}
        object={props.object}
      />
      {props.object.positionAttributes && (
        <MapDialog
          positionData={props.positionData}
          isPolygone={false}
          positionKeys={props.object.positionAttributes}
          objectId={props.object.id}
          open={mapDialogOpen}
          close={() => setMapDialogOpen(false)}
        />
      )}
    </>
  );
}

const propsToState = (
  state: FrontendReduxStateI,
  baseProps: ObjectBoxBaseProps
) => ({
  dontShowWarning: getDontAskOnObjectDelete(state),
  highlightedObject: getHighlightedObject(state),
  positionData: getPositionAttributesOfObject(state, baseProps.object.id),
  ...baseProps,
});

export default connect(propsToState)(ObjectBox);
