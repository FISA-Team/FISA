import React, { ComponentType } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  AppBar,
  Toolbar,
  Breadcrumbs,
  Typography,
  Button,
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { getProjectPosition } from '../../redux/selectors';
import { setObjectActive } from '../../redux/actions';
import {
  FrontendReduxStateI,
  ProjectPositionI,
  ActionI,
} from '../../redux/interfaces';

export interface PositionBarProps {
  dispatch: Dispatch<ActionI>;
  position: ProjectPositionI[];
}

const PositionBar: ComponentType<PositionBarProps> = (
  props: PositionBarProps
) => {
  return (
    <AppBar position="static" color="inherit">
      <Toolbar>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          {props.position.map(
            (object, index) =>
              index < props.position.length - 1 && (
                <Button
                  onClick={() => props.dispatch(setObjectActive(object.id))}
                  key={object.id}
                >
                  {object.name}
                </Button>
              )
          )}
          <Typography color="textPrimary">
            {props.position[props.position.length - 1].name}
          </Typography>
        </Breadcrumbs>
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = (state: FrontendReduxStateI) => {
  return {
    position: getProjectPosition(state),
  };
};

export default connect(mapStateToProps)(PositionBar);
