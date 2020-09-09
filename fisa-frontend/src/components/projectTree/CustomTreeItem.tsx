import React, { ComponentType } from 'react';
import { MenuItem, makeStyles } from '@material-ui/core';
import TreeItem from '@material-ui/lab/TreeItem';
import { blue } from '@material-ui/core/colors';
import { Dispatch } from 'redux';

import { setObjectActive } from '../../redux/actions';
import { WHITE } from '../../variables/colors';
import {
  setHighlightedObject,
  enableScrollingAction,
} from '../../redux/actions/pageActions';
import { ActionI, TreeViewInterfaceI } from '../../redux/interfaces';

const style = makeStyles((theme) => ({
  menuItem: {
    height: '20px',
    paddingLeft: 5,
  },
}));

export interface CustomTreeItemProps {
  dispatch: Dispatch<ActionI>;
  node: TreeViewInterfaceI;
  highlightedObject: number;
}

const CustomTreeItem: ComponentType<CustomTreeItemProps> = (
  props: CustomTreeItemProps
) => {
  const classes = style();

  const handleClick = (event: React.MouseEvent<Element, MouseEvent>) => {
    event.preventDefault();

    props.dispatch(enableScrollingAction());
    props.dispatch(setObjectActive(props.node.parentId));
    props.dispatch(setHighlightedObject(props.node.id));
  };

  const basicTypographyStyle: { userSelect: 'none' } = { userSelect: 'none' };

  const activeStyle = props.highlightedObject === props.node.id && {
    backgroundColor: props.node.isLinked ? blue[400] : blue[900],
    color: WHITE,
    border: `0.1rem solid ${props.node.isLinked ? blue[400] : blue[900]}`,
    borderRadius: '1vh',
  };

  const typographyStyle = {
    ...basicTypographyStyle,
    ...activeStyle,
  };

  return (
    <TreeItem
      nodeId={props.node.nodeId}
      key={props.node.id}
      label={
        <MenuItem className={classes.menuItem} style={typographyStyle}>
          {props.node.name}
        </MenuItem>
      }
      onLabelClick={(event) => handleClick(event)}
    >
      {props.node.children?.map(
        (child) =>
          child && (
            <CustomTreeItem
              node={child}
              key={child.id}
              dispatch={props.dispatch}
              highlightedObject={props.highlightedObject}
            />
          )
      )}
    </TreeItem>
  );
};

export default CustomTreeItem;
