import React from 'react';
import { connect } from 'react-redux';
import {
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  Table,
  TableRow,
  TableCell,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { useTranslation } from 'react-i18next';

import { AttributeI, PolygonI, PointI } from '../../redux/interfaces';
import { changeObjectProperty } from '../../redux/actions';
import MapDialog from '../map/MapDialog';

const style = makeStyles((theme) => ({
  noPaddingMargin: {
    padding: 0,
    margin: 0,
  },
  accordion: {
    padding: 0,
    margin: 0,
    backgroundColor: 'inherit',
    width: '100%',
  },
  addNewIcon: {
    transform: 'scale(1.5)',
  },
  mapButton: {
    padding: 0,
    textAlign: 'center',
  },
}));

interface PolyPositionAttributeProps {
  attribute: AttributeI;
  disabled: boolean;
  objectId: number;
  changeObjectProperty: (
    objectId: number,
    key: string,
    value: PolygonI
  ) => void;
}

function PolyPositionAttribute(props: PolyPositionAttributeProps) {
  const { t } = useTranslation('projectPage');
  const classes = style();

  const [mapOpen, setMapOpen] = React.useState(false);
  const changePosition = (newPos: PointI, index: number) => {
    const oldPos: PolygonI = props.attribute.value as PolygonI;

    oldPos[index] = newPos;
    props.changeObjectProperty(
      props.objectId,
      props.attribute.definitionName,
      oldPos
    );
  };

  const removePosition = (index: number) => {
    const oldPos: PolygonI = props.attribute.value as PolygonI;
    oldPos.splice(index, 1);

    props.changeObjectProperty(props.objectId, props.attribute.definitionName, [
      ...oldPos,
    ]);
  };

  const newPosition = () => {
    const oldPos: PolygonI = props.attribute.value as PolygonI;

    props.changeObjectProperty(props.objectId, props.attribute.definitionName, [
      ...oldPos,
      [0, 0],
    ]);
  };
  const positions = props.attribute.value as PolygonI;

  return (
    <>
      <Tooltip
        placement="left"
        title={
          <>
            {props.attribute.infoText && (
              <Typography variant="subtitle1" color="primary">
                {props.attribute.infoText}
              </Typography>
            )}
            <Typography variant="subtitle2">
              ({props.attribute.ogcType})
            </Typography>
          </>
        }
      >
        <List>
          <ListItem className={classes.noPaddingMargin}>
            <Accordion disabled={props.disabled} className={classes.accordion}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                className={classes.accordion}
              >
                {props.attribute.definitionName}
              </AccordionSummary>
              <AccordionDetails className={classes.accordion}>
                <Table padding="none" className={classes.noPaddingMargin}>
                  {positions.map((pos, index) => (
                    <TableRow // eslint-disable-next-line react/no-array-index-key
                      key={`${props.attribute.definitionName} Number${index}`}
                      className={classes.noPaddingMargin}
                    >
                      <TableCell padding="none" align="right">
                        {index})
                      </TableCell>

                      <PositionField
                        pos={pos}
                        disabled={props.disabled}
                        changeAttribute={(value: PointI) =>
                          changePosition(value, index)}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removePosition(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell rowSpan={3} />
                    <TableCell colSpan={2} align="center" variant="footer">
                      <IconButton onClick={newPosition} size="small">
                        <AddCircleOutlineIcon className={classes.addNewIcon} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </Table>
              </AccordionDetails>
            </Accordion>
          </ListItem>
          <ListItem alignItems="center" className={classes.mapButton}>
            <Button
              disabled={props.disabled}
              size="small"
              variant="outlined"
              onClick={() => setMapOpen(true)}
            >
              {t('getPositionsFromCard')}
            </Button>
          </ListItem>
        </List>
      </Tooltip>
      <MapDialog
        positionData={positions}
        open={mapOpen}
        objectId={props.objectId}
        close={() => setMapOpen(false)}
        isPolygone={true}
        polyPositionKey={props.attribute.definitionName}
      />
    </>
  );
}

interface PositionFieldProps {
  changeAttribute: (value: PointI) => void;
  pos: PointI;
  disabled: boolean;
}

function PositionField(props: PositionFieldProps) {
  const changeObjectEvent = (
    value: string,
    index: number,
    isBadInput: boolean
  ) => {
    if (!isBadInput) {
      const newval = props.pos;
      newval[index] = (value as unknown) as number;

      props.changeAttribute(newval);
    }
  };
  return (
    <>
      <TableCell padding="none" align="right">
        <TextField
          disabled={props.disabled}
          id="standard-basic"
          type="number"
          value={props.pos[0]}
          onChange={(e) =>
            changeObjectEvent(e.target.value, 0, e.target.validity.badInput)}
        />
      </TableCell>
      <TableCell padding="none" align="right">
        <TextField
          disabled={props.disabled}
          id="standard-basic"
          type="number"
          value={props.pos[1]}
          onChange={(e) =>
            changeObjectEvent(e.target.value, 1, e.target.validity.badInput)}
        />
      </TableCell>
    </>
  );
}

const actionsToProps = {
  changeObjectProperty,
};

export default connect(null, actionsToProps)(PolyPositionAttribute);
