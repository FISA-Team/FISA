import React, { useState } from 'react';
import { connect } from 'react-redux';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Card,
  CardActionArea,
  Button,
  makeStyles,
  List,
  ListItem,
  Slide,
  Grow,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import ObjectBox from './ObjectBox';
import {
  setObjectActive,
  changeObjectProperty,
  removeObject,
  addObjectByObjectDefinition,
} from '../../redux/actions';
import {
  ObjectGridProps,
  ObjectBoxFrameProps,
  ObjectBoxCategoryProps,
} from './workingBoxInterfaces';
import { getBackgroundColor } from '../../variables/colors';

import { FrontendReduxStateI } from '../../redux/interfaces';
import {
  getHighlightedObject,
  getScrollingActionActive,
} from '../../redux/selectors';
import {
  disableScrollingAction,
  enableScrollingAction,
  setHighlightedObject,
} from '../../redux/actions/pageActions';

function ObjectBoxCategory(props: ObjectBoxCategoryProps) {
  const [collapsed, setCollapsed] = useState(false);
  const handleChange = () => {
    setCollapsed(!collapsed);
  };
  const handleClickOn = (objectId: number, parentId: number | undefined) => {
    setCollapsed(false);
    props.dispatch(enableScrollingAction());
    props.dispatch(setObjectActive(parentId));
    setTimeout(() => props.dispatch(setHighlightedObject(objectId)), 400);
  };

  const [ref] = React.useState(React.useRef<HTMLDivElement>(null));

  return (
    <Accordion ref={ref} defaultExpanded onChange={() => handleChange()}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <List>
          <ListItem>
            <div>
              <Typography variant="h5">
                {props.objectCategory.caption}
              </Typography>
              <Typography>({props.objectCategory.ogcType})</Typography>
            </div>
          </ListItem>
          {collapsed && (
            <ListItem>
              <Grid container spacing={1} justify="flex-start">
                {props.objectCategory.objects.map((object) => (
                  <Slide
                    direction="up"
                    in={collapsed}
                    key={object.id}
                    mountOnEnter
                    unmountOnExit
                  >
                    <Grid item key={object.id}>
                      <Button
                        key={object.id}
                        onClick={() => handleClickOn(object.id, object.parent)}
                        variant="outlined"
                        color="primary"
                      >
                        {object.nameToShow}
                      </Button>
                    </Grid>
                  </Slide>
                ))}
              </Grid>
            </ListItem>
          )}
        </List>
      </AccordionSummary>
      <AccordionDetails>
        <ObjectGrid
          objects={props.objectCategory.objects}
          ogcType={props.objectCategory.ogcType}
          withAddIcon={props.objectCategory.isAddable}
          dispatch={props.dispatch}
          definitionName={props.objectCategory.definitionName}
          scroll={props.scroll}
          parentRef={ref}
        />
      </AccordionDetails>
    </Accordion>
  );
}

const gridStyle = makeStyles((theme) => ({
  addIcon: {
    width: '2rem',
    height: '2rem',
    transform: 'scale(3)',
  },
  newObjectArea: {
    height: '100%',
    minHeight: '250px',
    textAlign: 'center',
  },
  emptyCard: {
    backgroundColor: getBackgroundColor(theme),
    height: '100%',
    minHeight: '250px',
  },
  emptyCardDisabled: {
    backgroundColor: theme.palette.type === 'dark' ? '#2f343b' : '#fff',
    height: '100%',
    minHeight: '250px',
  },
}));

function ObjectGrid(props: ObjectGridProps) {
  const classes = gridStyle();
  const { t } = useTranslation('projectPage');

  const createNewObject = () => {
    props.dispatch(addObjectByObjectDefinition(props.definitionName));
    props.dispatch(enableScrollingAction());
  };

  const emptyCardAction = (
    <Card
      className={
        !props.withAddIcon ? classes.emptyCardDisabled : classes.emptyCard
      }
    >
      <CardActionArea
        disabled={!props.withAddIcon}
        className={classes.newObjectArea}
        onClick={() => createNewObject()}
      >
        <AddCircleOutlineIcon className={classes.addIcon} color="disabled" />
      </CardActionArea>
    </Card>
  );

  return (
    <Grid container spacing={2} justify="flex-start">
      {props.objects.map((object) => (
        <ObjectBoxFrame
          key={object.id}
          object={object}
          ogcType={props.ogcType}
          scroll={props.scroll}
          parentRef={props.parentRef}
        />
      ))}
      <Grid item xs={12} md={6} lg={4} xl={3}>
        {props.withAddIcon ? (
          emptyCardAction
        ) : (
          <Tooltip title={t('notPossibleToAddMoreMessage') as string}>
            {emptyCardAction}
          </Tooltip>
        )}
      </Grid>
    </Grid>
  );
}

const stateToProps = (state: FrontendReduxStateI) => ({
  highlightedObject: getHighlightedObject(state),
  scrollingActive: getScrollingActionActive(state),
});

const ObjectBoxFrame = connect(stateToProps)(ObjectBoxFrameUpdated);

function ObjectBoxFrameUpdated(props: ObjectBoxFrameProps) {
  const [checked, setChecked] = useState(true);

  /* to prevent that scrollToThisPosition will be called in every
   *  rerender if objectId === highlightedObject */
  const [lastHighlighted, setLastHighlighted] = React.useState(-1);

  // The ref of this object
  const [ref] = React.useState(React.useRef<HTMLDivElement>(null));

  // Execute scroll to this position
  const scrollToThisPosition = () => {
    const posCurrent = ref.current;
    const parentCurrent = props.parentRef.current;

    if (posCurrent !== null && parentCurrent !== null) {
      props.scroll({
        y:
          posCurrent.offsetTop +
          parentCurrent.offsetTop -
          posCurrent.clientHeight +
          125,
        smooth: true,
      });
      setLastHighlighted(props.highlightedObject);
      props.dispatch(disableScrollingAction());
    }
  };

  // Check if it needs to scroll to the position
  if (
    props.scrollingActive &&
    props.object.id === props.highlightedObject &&
    lastHighlighted !== props.highlightedObject
  ) {
    if (ref.current === null || !props.parentRef.current) {
      setTimeout(scrollToThisPosition, 200);
    } else {
      scrollToThisPosition();
    }
  } else if (lastHighlighted !== props.highlightedObject) {
    setLastHighlighted(props.highlightedObject);
  }

  const handleRemove = (objectId: number, removeFromFrost: boolean) => {
    setChecked((prev) => !prev);
    setTimeout(() => props.dispatch(removeObject(objectId, removeFromFrost)), 200);
  };

  return (
    <Grid item xs={12} md={6} lg={4} xl={3}>
      <Grow in={checked} key={props.object.id}>
        <div ref={ref}>
          <ObjectBox
            ogcType={props.ogcType}
            object={props.object}
            goToObject={(objectId) => props.dispatch(setObjectActive(objectId))}
            changeObjectProperty={(id, key, value) =>
              props.dispatch(changeObjectProperty(id, key, value))}
            removeObject={
              (objectId, removeFromFrost) => handleRemove(objectId, removeFromFrost)
            }
          />
        </div>
      </Grow>
    </Grid>
  );
}

export default ObjectBoxCategory;
