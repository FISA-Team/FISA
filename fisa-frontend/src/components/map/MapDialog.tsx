import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  DialogTitle,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { connect } from 'react-redux';
import React, { Dispatch } from 'react';
import { useTranslation } from 'react-i18next';

import {
  CardPositionI,
  FrontendReduxStateI,
  ActionI,
  PolygonI,
  PointI,
} from '../../redux/interfaces';
import { changeObjectProperty } from '../../redux/actions/projectActions';
import MapComponent from './OverviewMap';
import { getAllCardPositions } from '../../redux/selectors';

const style = makeStyles((theme) => ({
  backgroundComponent: {
    backgroundColor: theme.palette.background.default,
  },
}));

interface MapDialogOuterProps {
  open: boolean;
  close: () => void;
  // eslint-disable-next-line react/require-default-props
  positionKeys?: [string, string];
  // eslint-disable-next-line react/require-default-props
  polyPositionKey?: string;
  objectId: number;
  isPolygone: boolean;
}

interface MapDialogProps extends MapDialogOuterProps {
  dispatch: Dispatch<ActionI>;
  positionData: PointI | PolygonI;
  allOtherPositions: CardPositionI[];
}

function MapDialog(props: MapDialogProps) {
  const classes = style();
  const [position, setPosition] = React.useState(props.positionData);
  const { t } = useTranslation('map');

  const assignPosition = () => {
    props.close();
    if (!props.isPolygone && props.positionKeys) {
      const pos = position as PointI;
      props.dispatch(
        changeObjectProperty(props.objectId, props.positionKeys[0], pos[0])
      );
      props.dispatch(
        changeObjectProperty(props.objectId, props.positionKeys[1], pos[1])
      );
    } else if (props.isPolygone && props.polyPositionKey) {
      const pos = position as PolygonI;
      props.dispatch(
        changeObjectProperty(props.objectId, props.polyPositionKey, pos)
      );
    }
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth={false}
      open={props.open}
      onEntering={() => setPosition(props.positionData)}
    >
      <DialogTitle className={classes.backgroundComponent}>
        {props.isPolygone ? t('polyCta') : t('cta')}
      </DialogTitle>
      <DialogContent
        className={classes.backgroundComponent}
        style={{ height: '80vh' }}
      >
        <MapComponent
          latLng={!props.isPolygone ? (position as PointI) : undefined}
          polyLatLng={props.isPolygone ? (position as PolygonI) : undefined}
          setLatLng={(latLng: PointI) => setPosition(latLng)}
          setPolyLatLng={(polyLatLng: PolygonI) => setPosition(polyLatLng)}
          otherPositions={props.allOtherPositions}
        />
      </DialogContent>
      <DialogActions className={classes.backgroundComponent}>
        {!props.isPolygone && (
          <Typography style={{ marginRight: 'auto' }}>
            {t('currentLocation')}
            {`[${position[0]} lat, ${position[1]} lng]`}
          </Typography>
        )}
        {props.isPolygone && (
          <Button
            variant="outlined"
            onClick={() => setPosition([])}
            style={{ marginRight: 'auto' }}
          >
            {t('clearPolygons')}
          </Button>
        )}
        <Button
          variant="outlined"
          color="primary"
          onClick={() => props.close()}
        >
          {t('cancel')}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => assignPosition()}
          autoFocus
        >
          {t('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const stateToProps = (
  state: FrontendReduxStateI,
  props: MapDialogOuterProps
) => ({
  allOtherPositions: getAllCardPositions(state).filter(
    (pos) => pos.objectId !== props.objectId
  ),
});

export default connect(stateToProps)(MapDialog);
